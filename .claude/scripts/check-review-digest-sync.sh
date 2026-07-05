#!/usr/bin/env bash
#
# Drift guard: fails if the CI review digest (.claude/pr-review-checklist.md) has drifted from the
# canonical rule sources on key load-bearing tokens.
#
# WHY: the standards are enforced by two reviewers that read different files — the design pipeline
# (reads the canonical rules) and the CI `agriflow-design-review` reviewer (reads the digest). If a
# contract changes but the digest isn't updated (or vice versa), they silently diverge. This check
# keeps them honest: each KEY_TOKEN below must appear in BOTH the canonical SOURCES and the digest.
#
# WHEN A CONTRACT CHANGES: if you add/rename a load-bearing token in a canonical source, mirror it in
# .claude/pr-review-checklist.md (and, if it's a new invariant, add it to KEY_TOKENS here).
#
# Exit 0 = in sync. Exit 1 = drift (or a stale KEY_TOKEN). Deterministic, no network, sub-second.

set -uo pipefail

DIGEST="${DIGEST:-.claude/pr-review-checklist.md}"

# Canonical rule sources for this repo. flow-ui: the design contracts in .claude/rules/
# (prototypes.md + tokens.md) plus CLAUDE.md.
SOURCES=(
  ".claude/rules"
  "CLAUDE.md"
)

# Load-bearing design-contract tokens the two reviewers must agree on. Fixed strings (grep -F).
KEY_TOKENS=(
  'colors_and_type.css'
  'bg-accent text-accent-foreground'
  'bg-success-bg text-success'
  'bg-warning-bg text-warning'
  'bg-danger-bg text-danger'
  'bg-info-bg text-info'
  'bg-primary text-primary-foreground'
  'shadow-card'
  'shadow-pop'
  'shadow-sidebar'
  'bg-destructive'
  'SCREENS-INDEX'
)

fail=0
if [ ! -f "$DIGEST" ]; then echo "MISSING: $DIGEST"; exit 1; fi
present_sources=()
for s in "${SOURCES[@]}"; do [ -e "$s" ] && present_sources+=("$s"); done
if [ "${#present_sources[@]}" -eq 0 ]; then echo "MISSING: none of the canonical sources exist: ${SOURCES[*]}"; exit 1; fi

for tok in "${KEY_TOKENS[@]}"; do
  in_rules="$(grep -rlF -- "$tok" "${present_sources[@]}" 2>/dev/null | head -1 || true)"
  if grep -qF -- "$tok" "$DIGEST"; then in_digest=yes; else in_digest=no; fi

  if [ -n "$in_rules" ] && [ "$in_digest" = "no" ]; then
    echo "DRIFT: '$tok' is in the rules ($in_rules) but MISSING from the digest — update $DIGEST."
    fail=1
  elif [ -z "$in_rules" ] && [ "$in_digest" = "yes" ]; then
    echo "DRIFT: '$tok' is in the digest but NOT in any canonical source — a contract was removed/renamed; reconcile the digest."
    fail=1
  elif [ -z "$in_rules" ] && [ "$in_digest" = "no" ]; then
    echo "STALE-TOKEN: '$tok' is in neither the rules nor the digest — prune it from KEY_TOKENS in $0."
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "Review digest is out of sync with the canonical rules. Reconcile so the design pipeline"
  echo "and the CI reviewer enforce the same standards."
  exit 1
fi
echo "OK: review digest in sync with the canonical rules on ${#KEY_TOKENS[@]} key tokens."
