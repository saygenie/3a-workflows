#!/bin/bash
# Start 3A Visual Companion server
# Usage: bash visual/start-server.sh [port] [project-root]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-3333}"
PROJECT_ROOT="${2:-$(pwd)}"
PID_FILE="${PROJECT_ROOT}/.3a/visual/.server.pid"

# Check if already running
if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE")
  if kill -0 "$OLD_PID" 2>/dev/null; then
    echo "[3a-visual] Server already running (PID: $OLD_PID)"
    echo "[3a-visual] http://127.0.0.1:$PORT"
    exit 0
  fi
  rm -f "$PID_FILE"
fi

# Ensure content directory exists
mkdir -p "${PROJECT_ROOT}/.3a/visual/content"
mkdir -p "${PROJECT_ROOT}/.3a/visual/state"

# Start server in background
node "${SCRIPT_DIR}/server.cjs" "$PORT" "$PROJECT_ROOT" &
SERVER_PID=$!

# Save PID
echo "$SERVER_PID" > "$PID_FILE"

echo "[3a-visual] Server started (PID: $SERVER_PID)"
echo "[3a-visual] http://127.0.0.1:$PORT"
echo "[3a-visual] Content: ${PROJECT_ROOT}/.3a/visual/content/"
