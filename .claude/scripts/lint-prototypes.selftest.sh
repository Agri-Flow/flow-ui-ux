#!/usr/bin/env bash
# lint-prototypes.selftest.sh — mutation tests for the canvas-layers gates (P0-9, P1-12, P2-6).
#
# WHY THIS EXISTS
# A gate that stays green when you disable the thing it guards is vacuous — it reports
# "clean" without ever having looked. That is not hypothetical here: the first cut of
# P0-9's `strip_annotations` helper had a `$-[0]` vs `$-[1]` bug that made it remove only
# ~1.4KB of a 14KB annotation rail. It still "worked" — it just under-stripped, which would
# have made P0-9 fire on correctly-authored files and, after someone loosened the pattern
# to shut it up, silently pass on real violations.
#
# So each assertion below is paired: the gate must FIRE on known-bad input and STAY SILENT
# on known-good input. Neither half alone proves anything.
#
# Usage:  bash .claude/scripts/lint-prototypes.selftest.sh
# Exit:   0 + "LINT SELFTEST GREEN" on success; 1 with the failing assertion otherwise.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LINT="$SCRIPT_DIR/lint-prototypes.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

fails=0
ok()   { printf '  ok   %s\n' "$1"; }
bad()  { printf '  FAIL %s\n' "$1"; fails=$((fails+1)); }

# Minimal prototype scaffold. Only the parts the gates under test read.
# %s slots: 1 = extra <head>-ish content (unused), 2 = body content.
fixture() {
  cat > "$1" <<HTML
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" />
<title>Selftest — AgriFlow Rwanda</title>
<link rel="stylesheet" href="../../tokens/colors_and_type.css">
<style>[data-annotations="off"] [data-annotation="spec"] { display: none; }</style>
</head>
<body class="bg-page" data-annotations="off">
<!-- STATE: default -->
<!-- STATE: loading -->
<!-- STATE: empty -->
<div class="flex flex-wrap 2xl:flex-nowrap min-h-screen">
  <aside id="sidebar" class="w-[270px] bg-sidebar shadow-sidebar border-r border-border"></aside>
  <div class="flex-1 min-w-0">
    <nav class="text-[13px]">AgriFlow / Selftest</nav>
$2
  </div>
$3
</div>
</body></html>
HTML
}

# Run the linter and echo its one-line stdout summary for the file.
summary() {
  REPORTS_DIR="$TMP/reports" bash "$LINT" "$1" 2>/dev/null | tail -1
}
report_of() { cat "$TMP/reports/$(basename "${1%.html}")-review.md" 2>/dev/null; }

RAIL='  <aside data-annotation="spec" class="w-full 2xl:w-[320px] shrink-0 bg-accent border-l border-border">
    <p class="mono">SPEC</p>
    <p class="text-muted-foreground">re: Supplier — options come from the Epic 2 supplier registry; rows are written to audit_logs.</p>
  </aside>'

echo "lint-prototypes selftest — canvas-layers gates"

# ── P0-9 ─────────────────────────────────────────────────────────────────────
# GOOD: the identifiers exist, but only inside the spec rail. Must NOT fire.
fixture "$TMP/good.html" '    <p class="text-muted-foreground">Active, verified suppliers only.</p>' "$RAIL"
if report_of "$TMP/good.html" >/dev/null; then :; fi
summary "$TMP/good.html" >/dev/null
if report_of "$TMP/good.html" | grep -q 'P0-9'; then
  bad "P0-9 must NOT fire when identifiers live only in the rail (false positive)"
else
  ok "P0-9 silent when identifiers are rail-only"
fi

# ANTI-VACUITY: prove the rail content was actually present in the input. If the fixture
# never contained an identifier, the assertion above would pass for the wrong reason.
if grep -q 'Epic 2' "$TMP/good.html" && grep -q 'audit_logs' "$TMP/good.html"; then
  ok "good fixture really does contain identifiers (assertion is not vacuous)"
else
  bad "good fixture lacks identifiers — the P0-9 silent-case proves nothing"
fi

# BAD: the same identifier in PRODUCT copy. Must fire.
fixture "$TMP/bad-ident.html" '    <p class="text-muted-foreground">Active, verified suppliers only (Epic 2 registry).</p>' "$RAIL"
summary "$TMP/bad-ident.html" >/dev/null
if report_of "$TMP/bad-ident.html" | grep -q 'P0-9'; then
  ok "P0-9 fires on an identifier in product copy"
else
  bad "P0-9 did NOT fire on 'Epic 2' in product copy — gate is vacuous"
fi

# BAD: the literal defect this convention was written for — a story ref inside a tile.
fixture "$TMP/bad-tile.html" '    <div class="bg-card"><p class="text-3xl">—</p><p>Available with Story 4.5</p></div>' "$RAIL"
summary "$TMP/bad-tile.html" >/dev/null
if report_of "$TMP/bad-tile.html" | grep -q 'P0-9'; then
  ok "P0-9 fires on 'Story 4.5' inside a KPI tile (the original defect)"
else
  bad "P0-9 did NOT catch the defect it was written for"
fi

# GOOD: an identifier inside an HTML COMMENT never renders, so it must not fire. This was a
# real false-positive class — it hit 10 of 28 promoted screens, all provenance comments like
# <!-- Required suspension reason (Story 2.1 Scenario 3) -->.
fixture "$TMP/good-comment.html" '    <!-- Required suspension reason (Story 2.1 Scenario 3) -->
    <p class="text-muted-foreground">Give a reason for the suspension.</p>' "$RAIL"
summary "$TMP/good-comment.html" >/dev/null
if report_of "$TMP/good-comment.html" | grep -q 'P0-9'; then
  bad "P0-9 fired on an identifier inside an HTML comment (comments never render)"
else
  ok "P0-9 silent on an identifier in an HTML comment"
fi
if grep -q 'Story 2.1' "$TMP/good-comment.html"; then
  ok "comment fixture really contains the identifier (assertion is not vacuous)"
else
  bad "comment fixture lacks the identifier — that silent-case proves nothing"
fi

# BAD: a MULTI-LINE comment must also be stripped — several promoted screens carry these,
# and a per-line filter would miss them.
fixture "$TMP/good-multiline.html" '    <!-- provenance:
         discharged here + FL-4 audit-trail comment. -->
    <p class="text-muted-foreground">Sign in to continue.</p>' "$RAIL"
summary "$TMP/good-multiline.html" >/dev/null
if report_of "$TMP/good-multiline.html" | grep -q 'P0-9'; then
  bad "P0-9 fired on an identifier inside a MULTI-LINE comment"
else
  ok "P0-9 silent on a multi-line comment"
fi

# ── P1-12 ────────────────────────────────────────────────────────────────────
fixture "$TMP/bad-band.html" '    <p class="text-[10px]">State — loading</p>' "$RAIL"
summary "$TMP/bad-band.html" >/dev/null
if report_of "$TMP/bad-band.html" | grep -q 'P1-12'; then
  ok "P1-12 fires on a 'State — ' band label"
else
  bad "P1-12 did NOT fire on 'State — '"
fi

fixture "$TMP/good-band.html" '    <p class="text-[10px]">Alternate state · loading</p>' "$RAIL"
summary "$TMP/good-band.html" >/dev/null
if report_of "$TMP/good-band.html" | grep -q 'P1-12'; then
  bad "P1-12 fired on the CORRECT 'Alternate state ·' label (false positive)"
else
  ok "P1-12 silent on the correct label"
fi

# ── strip_annotations ────────────────────────────────────────────────────────
# The regression that motivated this file: an under-stripping walk still "works", it just
# leaves rail content in the product layer. Assert the rail genuinely disappears.
# shellcheck disable=SC1090
eval "$(sed -n '/^strip_annotations() {/,/^}/p' "$LINT")"
stripped="$(strip_annotations "$TMP/good.html")"
full_bytes=$(wc -c < "$TMP/good.html" | tr -d ' ')
strip_bytes=$(printf '%s' "$stripped" | wc -c | tr -d ' ')
if printf '%s' "$stripped" | grep -q 'Epic 2'; then
  bad "strip_annotations left rail content in the product layer (under-stripping)"
elif [ "$((full_bytes - strip_bytes))" -lt 100 ]; then
  # Guard against passing for the wrong reason: if the fixture had no rail, "Epic 2" would
  # be absent from the output too and the check above would go green having stripped nothing.
  # The RAIL block is ~250 bytes, so a removal under 100 means it was never there.
  bad "strip_annotations removed only $((full_bytes - strip_bytes)) bytes — fixture had no rail, assertion is vacuous"
else
  ok "strip_annotations removes the rail subtree ($full_bytes → $strip_bytes bytes)"
fi
if printf '%s' "$stripped" | grep -q 'Active, verified suppliers only'; then
  ok "strip_annotations preserves product copy (not over-stripping)"
else
  bad "strip_annotations removed product copy — over-stripping"
fi

echo
if [ "$fails" -eq 0 ]; then
  echo "LINT SELFTEST GREEN"
  exit 0
fi
echo "LINT SELFTEST FAILED — $fails assertion(s)"
exit 1
