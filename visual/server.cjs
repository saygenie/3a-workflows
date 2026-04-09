#!/usr/bin/env node
/**
 * 3A Visual Companion — WebSocket Server
 *
 * Zero external dependencies. Implements RFC 6455 WebSocket protocol.
 * Watches .3a/visual/content/ for HTML changes and pushes live updates to browsers.
 *
 * Protocol:
 *   Claude Code writes HTML → .3a/visual/content/
 *   fs.watch() detects change → WebSocket sends reload signal
 *   Browser auto-refreshes → User sees updated content
 *   User clicks (data-choice) → Event written to .3a/visual/state/events.jsonl
 *   Claude reads events on next turn
 *
 * Usage:
 *   node visual/server.cjs [port] [project-root]
 *   Default port: 3333
 *   Default project-root: current working directory
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = parseInt(process.argv[2] || '3333', 10);
const PROJECT_ROOT = process.argv[3] || process.cwd();
const CONTENT_DIR = path.join(PROJECT_ROOT, '.3a', 'visual', 'content');
const STATE_DIR = path.join(PROJECT_ROOT, '.3a', 'visual', 'state');
const EVENTS_FILE = path.join(STATE_DIR, 'events.jsonl');
const FRAME_TEMPLATE = path.join(__dirname, 'frame-template.html');

// Ensure directories exist
[CONTENT_DIR, STATE_DIR].forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

// Track connected WebSocket clients
const clients = new Set();

// --- HTTP Server ---

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Serve frame template at root
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return serveFile(res, FRAME_TEMPLATE, 'text/html');
  }

  // Serve content files
  if (url.pathname.startsWith('/content/')) {
    const filename = path.basename(url.pathname);
    const filepath = path.join(CONTENT_DIR, filename);
    return serveFile(res, filepath, 'text/html');
  }

  // Receive user events via POST
  if (req.method === 'POST' && url.pathname === '/event') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const event = JSON.parse(body);
        event.timestamp = new Date().toISOString();
        fs.appendFileSync(EVENTS_FILE, JSON.stringify(event) + '\n');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(`{"error":"${e.message}"}`);
      }
    });
    return;
  }

  // List available content files
  if (url.pathname === '/files') {
    try {
      const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.html'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ files }));
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"files":[]}');
    }
    return;
  }

  // Serve helper.js
  if (url.pathname === '/helper.js') {
    return serveFile(res, path.join(__dirname, 'helper.js'), 'application/javascript');
  }

  res.writeHead(404);
  res.end('Not found');
});

function serveFile(res, filepath, contentType) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    res.writeHead(200, {
      'Content-Type': contentType + '; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('File not found');
  }
}

// --- WebSocket (RFC 6455) ---

server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }

  const accept = crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-5AB5DC11650A')
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n` +
    '\r\n'
  );

  clients.add(socket);
  socket.on('close', () => clients.delete(socket));
  socket.on('error', () => clients.delete(socket));

  // Handle incoming messages (user events from browser)
  socket.on('data', buffer => {
    try {
      const msg = decodeFrame(buffer);
      if (msg && msg.opcode === 0x01) { // text frame
        const event = JSON.parse(msg.payload);
        event.timestamp = new Date().toISOString();
        event.source = 'websocket';
        fs.appendFileSync(EVENTS_FILE, JSON.stringify(event) + '\n');
      }
      if (msg && msg.opcode === 0x08) { // close frame
        clients.delete(socket);
        socket.end();
      }
      if (msg && msg.opcode === 0x09) { // ping
        sendFrame(socket, 0x0A, msg.payload); // pong
      }
    } catch {
      // Ignore malformed frames
    }
  });
});

function decodeFrame(buffer) {
  if (buffer.length < 2) return null;
  const opcode = buffer[0] & 0x0F;
  const masked = (buffer[1] & 0x80) !== 0;
  let len = buffer[1] & 0x7F;
  let offset = 2;

  if (len === 126) {
    len = buffer.readUInt16BE(2);
    offset = 4;
  } else if (len === 127) {
    len = Number(buffer.readBigUInt64BE(2));
    offset = 10;
  }

  let mask = null;
  if (masked) {
    mask = buffer.slice(offset, offset + 4);
    offset += 4;
  }

  const payload = Buffer.alloc(len);
  for (let i = 0; i < len; i++) {
    payload[i] = masked ? buffer[offset + i] ^ mask[i % 4] : buffer[offset + i];
  }

  return { opcode, payload: payload.toString('utf8') };
}

function sendFrame(socket, opcode, data) {
  const payload = Buffer.from(data || '', 'utf8');
  const len = payload.length;
  let header;

  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x80 | opcode;
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }

  try {
    socket.write(Buffer.concat([header, payload]));
  } catch {
    clients.delete(socket);
  }
}

function broadcast(message) {
  const data = JSON.stringify(message);
  for (const socket of clients) {
    sendFrame(socket, 0x01, data);
  }
}

// --- File Watcher ---

let watchDebounce = null;

try {
  fs.watch(CONTENT_DIR, { recursive: false }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.html')) return;
    clearTimeout(watchDebounce);
    watchDebounce = setTimeout(() => {
      broadcast({ type: 'reload', file: filename, timestamp: new Date().toISOString() });
    }, 200);
  });
} catch {
  // Directory might not exist yet — that's OK, files will be created later
  console.log(`[3a-visual] Watching ${CONTENT_DIR} (will start when files appear)`);
}

// --- Start ---

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[3a-visual] Server running at http://127.0.0.1:${PORT}`);
  console.log(`[3a-visual] Content dir: ${CONTENT_DIR}`);
  console.log(`[3a-visual] Events file: ${EVENTS_FILE}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  for (const socket of clients) socket.end();
  server.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  for (const socket of clients) socket.end();
  server.close();
  process.exit(0);
});
