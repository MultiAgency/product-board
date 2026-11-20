#!/usr/bin/env bash
# Create or update the board's labels from .github/labels.json (needs gh, triage+ access).
set -euo pipefail
REPO="${1:-MultiAgency/product-board}"
jq -c '.[]' "$(dirname "$0")/../.github/labels.json" | while read -r l; do
  name=$(jq -r .name <<<"$l"); color=$(jq -r .color <<<"$l"); desc=$(jq -r .description <<<"$l")
  gh label create "$name" --color "$color" --description "$desc" --repo "$REPO" --force
done
