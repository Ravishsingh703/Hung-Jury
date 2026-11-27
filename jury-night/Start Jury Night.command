#!/bin/bash
# Double-click to start Jury Night. Close this window to stop it.
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Node.js isn't installed on this Mac."
  echo "  Install the LTS version from https://nodejs.org, then double-click this file again."
  echo ""
  read -n 1 -s -r -p "  Press any key to close."
  exit 1
fi

[ -d node_modules ] || npm install --silent

# Use the one case in cases/private if there is exactly one, otherwise the dummy case.
PRIVATE=( cases/private/*.js )
if [ ${#PRIVATE[@]} -eq 1 ] && [ -f "${PRIVATE[0]}" ]; then
  export CASE="private/$(basename "${PRIVATE[0]}")"
fi

(sleep 2; open "http://localhost:3000/#tv") &

# caffeinate keeps the Mac awake while the server runs.
caffeinate -dis node server.js
