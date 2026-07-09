#!/usr/bin/env bash
# check-token-consistency.sh — flow-ui design-token self-consistency gate (audit F-9).
#
# flow-ui is the design source of truth. tokens/colors_and_type.css carries the same
# canonical color in several places: a shadcn HSL triple with an inline /* #HEX */
# annotation, AND hex aliases (--green-500, --success, --bg, --danger, ...). The file
# itself states the invariant: "When a value changes here, update the matching hex
# token below in the same edit — they MUST stay in sync." Nothing enforced it, so an
# edit to one alias could silently diverge from its twins (and, downstream, from the
# flow-fe mirror the F-9 flow-fe gate checks against its committed snapshot).
#
# This asserts that every alias documenting the same canonical color agrees, by EXACT
# hex (no color-space conversion — the shadcn HSL triples round-trip too lossily to
# gate on; the inline hex comment IS the canonical value, so we read that). Each
# assert_group line lists token names that MUST resolve to one hex.
#
# Exit: 0 = every group internally consistent; 1 = at least one alias drifted.

# No `set -u`: bash 3.2 (macOS) mis-handles some array expansions under nounset.
set -eo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TOKENS="${1:-$DIR/tokens/colors_and_type.css}"

if [[ ! -f "$TOKENS" ]]; then
  echo "check-token-consistency: token file not found: $TOKENS" >&2
  exit 2
fi

# Canonical hex for a token: first #rrggbb / #rgb on its declaration line (a hex value
# OR an inline comment). Empty if the token has neither (e.g. --ring: a bare HSL triple).
hex_of() {
  grep -iE "^[[:space:]]*--$1[[:space:]]*:" "$TOKENS" | head -1 \
    | grep -oiE '#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})' | head -1 | tr 'A-F' 'a-f'
}

fail=0
groups=0

# Assert every listed token that carries a canonical hex resolves to the SAME hex.
# Tokens with no hex (bare HSL triples like --ring) are skipped, not failed.
assert_group() {
  local label="$1"; shift
  local expected="" detail="" name h
  for name in "$@"; do
    h="$(hex_of "$name" || true)"
    [[ -z "$h" ]] && continue
    detail="$detail --$name=$h"
    if [[ -z "$expected" ]]; then
      expected="$h"
    elif [[ "$h" != "$expected" ]]; then
      fail=1
      echo "✗ DRIFT in group '$label':$detail  (expected all == $expected)"
    fi
  done
  groups=$((groups + 1))
}

assert_group brand-green primary success green-500 link ring
assert_group page-plate  background bg gray-100
assert_group surface     card surface popover
assert_group brand-tint  accent secondary bg-tint
assert_group ink         foreground fg-2 gray-800
assert_group muted       muted-foreground fg-4 gray-600
assert_group hairline    border gray-200
assert_group danger      destructive danger

if [[ "$fail" -ne 0 ]]; then
  echo ""
  echo "Design-token self-consistency FAILED — an alias diverged from its twin(s)."
  echo "tokens/colors_and_type.css requires every alias of a color to share one hex."
  exit 1
fi

echo "Design-token self-consistency OK — all $groups alias groups agree."
