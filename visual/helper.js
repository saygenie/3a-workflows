/**
 * 3A Visual Companion — Client Helper
 *
 * Loaded by frame-template.html. Handles:
 * - WebSocket connection for live reload
 * - User interaction capture (data-choice clicks)
 * - Theme detection (light/dark)
 * - Content file navigation
 */

(function () {
  'use strict';

  const WS_URL = `ws://${location.host}`;
  const EVENT_URL = `${location.origin}/event`;
  const FILES_URL = `${location.origin}/files`;

  let ws = null;
  let reconnectTimer = null;

  // --- WebSocket Connection ---

  function connect() {
    if (ws && ws.readyState === WebSocket.OPEN) return;

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('[3a-visual] Connected');
      clearTimeout(reconnectTimer);
      updateStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'reload') {
          console.log(`[3a-visual] Reloading: ${msg.file}`);
          loadContent(msg.file);
        }
      } catch (e) {
        console.warn('[3a-visual] Invalid message:', e);
      }
    };

    ws.onclose = () => {
      updateStatus('disconnected');
      reconnectTimer = setTimeout(connect, 2000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }

  // --- Content Loading ---

  function loadContent(filename) {
    const contentFrame = document.getElementById('3a-content');
    if (!contentFrame) return;

    fetch(`/content/${filename}`)
      .then(r => r.ok ? r.text() : Promise.reject('Not found'))
      .then(html => {
        contentFrame.innerHTML = html;
        bindChoiceHandlers(contentFrame);
        updateCurrentFile(filename);
      })
      .catch(err => {
        console.warn(`[3a-visual] Failed to load ${filename}:`, err);
      });
  }

  function loadFileList() {
    const nav = document.getElementById('3a-nav');
    if (!nav) return;

    fetch(FILES_URL)
      .then(r => r.json())
      .then(data => {
        nav.innerHTML = data.files.map(f =>
          `<button class="nav-btn" data-file="${f}">${formatName(f)}</button>`
        ).join('');

        nav.querySelectorAll('.nav-btn').forEach(btn => {
          btn.addEventListener('click', () => loadContent(btn.dataset.file));
        });

        // Auto-load first file
        if (data.files.length > 0) {
          loadContent(data.files[0]);
        }
      })
      .catch(() => {});
  }

  function formatName(filename) {
    return filename
      .replace('.html', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // --- User Interaction Capture ---

  function bindChoiceHandlers(container) {
    container.querySelectorAll('[data-choice]').forEach(el => {
      el.addEventListener('click', (e) => {
        const choice = el.dataset.choice;
        const context = el.dataset.context || '';
        sendEvent({ type: 'choice', choice, context });

        // Visual feedback
        container.querySelectorAll('[data-choice]').forEach(b => b.classList.remove('selected'));
        el.classList.add('selected');
      });
    });
  }

  function sendEvent(event) {
    // Send via both HTTP and WebSocket for reliability
    fetch(EVENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(() => {});

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
    }
  }

  // --- Theme Detection ---

  function detectTheme() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
  }

  // --- Status Display ---

  function updateStatus(status) {
    const el = document.getElementById('3a-status');
    if (el) {
      el.textContent = status === 'connected' ? 'Live' : 'Reconnecting...';
      el.className = `status-${status}`;
    }
  }

  function updateCurrentFile(filename) {
    const el = document.getElementById('3a-current-file');
    if (el) el.textContent = formatName(filename);
  }

  // --- Initialize ---

  function init() {
    detectTheme();
    connect();
    loadFileList();

    // Refresh file list periodically
    setInterval(loadFileList, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
