#!/bin/bash
# Stop 3A Visual Companion server
# Usage: bash visual/stop-server.sh [project-root]

PROJECT_ROOT="${1:-$(pwd)}"
PID_FILE="${PROJECT_ROOT}/.3a/visual/.server.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "[3a-visual] No running server found"
  exit 0
fi

PID=$(cat "$PID_FILE")

if kill -0 "$PID" 2>/dev/null; then
  kill "$PID"
  rm -f "$PID_FILE"
  echo "[3a-visual] Server stopped (PID: $PID)"
else
  rm -f "$PID_FILE"
  echo "[3a-visual] Server was not running (stale PID file cleaned)"
fi
