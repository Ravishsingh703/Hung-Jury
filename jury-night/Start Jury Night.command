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

# Pick a case. Private cases live in cases/private (never uploaded to GitHub).
shopt -s nullglob
PRIVATE=( cases/private/*.js )
if [ ${#PRIVATE[@]} -eq 1 ]; then
  export CASE="private/$(basename "${PRIVATE[0]}")"
elif [ ${#PRIVATE[@]} -gt 1 ]; then
  echo ""
  echo "  Which case tonight?"
  echo "    0) Dummy test case"
  i=1
  for f in "${PRIVATE[@]}"; do
    title=$(grep -m1 -o 'title: "[^"]*"' "$f" | sed 's/title: "//; s/"$//')
    echo "    $i) ${title:-$(basename "$f")}"
    i=$((i+1))
  done
  echo ""
  read -r -p "  Type a number and press Enter: " pick
  if [[ "$pick" =~ ^[0-9]+$ ]] && [ "$pick" -ge 1 ] && [ "$pick" -le ${#PRIVATE[@]} ]; then
    export CASE="private/$(basename "${PRIVATE[$((pick-1))]}")"
  fi
fi

(sleep 2; open "http://localhost:3000/#tv") &

# caffeinate keeps the Mac awake while the server runs.
caffeinate -dis node server.js
