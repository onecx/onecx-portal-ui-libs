#!/usr/bin/env bash

set -euo pipefail

MCP_LOG_FILE="/tmp/chrome-devtools-mcp.log"

CHROME_BIN=""
LATEST_PUPPETEER_CHROME="$(ls -1d ~/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome 2>/dev/null | tail -n 1 || true)"

if [[ -n "$LATEST_PUPPETEER_CHROME" ]]; then
  CHROME_BIN="$LATEST_PUPPETEER_CHROME"

elif command -v google-chrome >/dev/null 2>&1; then
  CHROME_BIN="$(command -v google-chrome)"

else
  echo "No Chrome binary found for chrome-devtools-mcp." >&2
  exit 1
fi

echo "Using Chrome binary: $CHROME_BIN" >&2

exec npx -y chrome-devtools-mcp@latest \
  --headless \
  --isolated \
  --executablePath "$CHROME_BIN" \
  --chrome-arg=--no-sandbox \
  --chrome-arg=--disable-dev-shm-usage \
  --chrome-arg=--disable-gpu \
  --experimental-include-all-pages \
  --logFile "$MCP_LOG_FILE"
  
