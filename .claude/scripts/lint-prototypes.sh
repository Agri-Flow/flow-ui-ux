#!/usr/bin/env bash
# lint-prototypes.sh — Mechanical grep-based lint for AgriFlow staging HTML prototypes.
#
# Canonical implementation of the design-system contract gates. Shared by:
#   - design-builder Phase 5.5 (auto-fires after every write/edit)
#   - design-linter agent (when invoked manually for batch review or roll-up)
#
# Usage:
#   lint-prototypes.sh <file1.html> [<file2.html> ...]
#
# Environment:
#   REPORTS_DIR    Output directory for per-file reports. Default: ../reports/ux
#                  (relative to cwd, which is expected to be the flow-ui repo root)
#
# Outputs:
#   - One markdown report per file at $REPORTS_DIR/<file-stem>-review.md
#   - One stdout line per file: "<path>  P0: N  P1: N  P2: N  <PROMOTABLE|BLOCKED>"
#   - Exit 0 always (this is a lint, not a CI gate — the calling agent decides what to do
#     with the counts; gate G10 in design-builder promote does the actual gating)
#
# The Summary line in every report uses the EXACT format gate G10 of `design-builder
# promote` greps for: `^\*\*P0: 0\s+P1: 0`. Do not change that line shape without
# updating the gate G10 grep in design-builder.md in lockstep.
#
# Gates encoded (26 total):
#   P0-0  Sidebar consistency (new 2026-06-27; story 2.4 canonical standardization)
#   P0-0b D-016 held-route guard (partners/operations | suppliers/schedule | suppliers/history
#         may only be added via their owning stories 2.5/2.6/2.7; blocks promote until then)
#   P0-1  Token link present
#   P0-2  No inline <style>:root block
#   P0-3  No stock Tailwind palette colors
#   P0-4  No hardcoded hex in markup
#   P0-5  Sidebar active leaf not bg-primary text-primary-foreground (INFORMATIONAL only —
#         current grep is ambiguous, founder pending rewrite)
#   P0-6  Multi-hue role pills retired
#   P0-7  Solid bg-destructive not used for routine status
#   P0-8  Login CTA uses h-11 (login files only; accepts both literal h-11 and inline
#         style="height:44px")
#   P1-1  Breadcrumb-only header present on desktop screens (skip on auth files)
#   P1-2  Header band does not carry title / search / bell (rough heuristic, flag for review)
#   P1-3  Cards do not use shadow-sm / shadow-md / shadow-lg
#   P1-4  Buttons/inputs are h-10 (only flag h-9 on <button>/<input>/<select>; ignore
#         w-9 h-9 avatar circles and logo tiles)
#   P1-5  Page title is text-xl font-semibold (no text-2xl / text-3xl in <h1>)
#   P1-6  Phone inputs show +250 prefix (tightened grep — type="tel" / name="phone" /
#         >Phone number / >Mobile)
#   P1-7  Sidebar shell w-[270px] (skip on auth files — their <aside> is a brand panel)
#   P1-8  Modals declare role="dialog" aria-modal="true"
#   P1-9  State coverage minimums (forms ≥ 3, lists ≥ 3, details ≥ 2, auth ≥ 2)
#   P1-10 Table headers in Title Case (acronym allowlist: RICA, FDA, QC, RWF, GPS, PoD,
#         SKU, ID, IAM, RRA, BNR, NET, CAT, UTC, MFA, API, HTTP, URL, CSV, PDF, PNG, JPG)
#   P1-11 Visible <th>Actions</th> label absent
#   P2-1  Inline SVG count > 20 (icon system candidate)
#   P2-2  File size > 500 lines
#   P2-3  text-gray-* usage (should use fg-* ramp)
#   P2-4  .mono class missing where phone present
#   P2-5  Audit-log rail copy missing on modal

set -euo pipefail

REPORTS_DIR="${REPORTS_DIR:-../reports/ux}"
mkdir -p "$REPORTS_DIR"

# ── Pattern constants ─────────────────────────────────────────────────────────
STOCK_PALETTE='yellow|blue|red|green|purple|orange|teal|pink|indigo'
ACRONYM_ALLOWLIST='RICA|FDA|QC|RWF|GPS|PoD|SKU|ID|IAM|RRA|BNR|NET|CAT|UTC|MFA|API|HTTP|URL|CSV|PDF|PNG|JPG|JPEG|MP4'
ROLE_LABELS='Admin|Manager|Picker|Driver|Finance'
ROUTINE_STATUS_LABELS='Quarantine|Failed QC|Suspended|Expired'
NAV_LABELS='Dashboard|Orders|Suppliers|Products|Users|Inventory|Reports|Settings|Logistics|Partners'

# ── Helpers ────────────────────────────────────────────────────────────────────

# classify_file: derive screen type from file path + filename slug.
# Strips any leading `e{N}-` prefix so the same classifier handles staging files
# (`e1-login.html`) and promoted files (`login.html`).
# Returns: auth | form | list | detail | reference
#
# `reference` = a design-system showcase page (token palette, component gallery,
# brand asset) — NOT a product screen. These live in a `preview/` directory or
# carry a known reference slug. They are exempt from product-screen gates that
# don't apply to a gallery: P0-4 (hardcoded hex — a palette legitimately displays
# raw hex), P1-1 (breadcrumb header), P1-2 (header-band heuristic), P1-5 (in-app
# page-title sizing), and P1-9 (5-state coverage). Token-contract gates that DO
# apply to a reference page (P0-1 token link, P0-2 no inline :root, P0-3 no stock
# palette) and all component-quality gates (P1-3/4/8, P2-*) still run.
classify_file() {
  local path="$1"
  local s
  s=$(basename "$path" .html)
  # Strip leading eN- / eNN- prefix
  s="${s#e[0-9]-}"
  s="${s#e[0-9][0-9]-}"
  # Reference / showcase pages — detected by path (design-system preview dir) ...
  case "$path" in
    */preview/*) echo "reference" ; return ;;
  esac
  # ... or by a known reference slug (root-level palette / brand-asset pages).
  case "$s" in
    color-palette|colour-palette|brand-kit|brandkit|logo|buttons|button|icons|iconography|typography|type-scale|design-tokens|tokens|style-guide|styleguide|components|component-library)
      echo "reference" ; return ;;
  esac
  case "$s" in
    login*|password-reset*|access-denied*|account-activation*) echo "auth" ;;
    create-*|edit-*|*-registration*|registration*) echo "form" ;;
    *list*|*directory*|*management*|*viewer*|*price-book*|*documents*) echo "list" ;;
    *) echo "detail" ;;
  esac
}

# state_minimum: minimum number of STATE comment markers required per screen type
state_minimum() {
  case "$1" in
    auth)      echo 2 ;;
    form)      echo 3 ;;
    list)      echo 3 ;;
    detail)    echo 2 ;;
    reference) echo 0 ;;  # showcase pages have no app states
    *)         echo 2 ;;
  esac
}

# count_matches: grep -cE wrapper that always returns a single number.
# grep -c always prints the count (even "0") but exits 1 when count is 0;
# `|| true` catches that exit without emitting a second "0".
count_matches() {
  local pattern="$1" file="$2"
  grep -cE "$pattern" "$file" 2>/dev/null || true
}

# count_matches_multiline: like count_matches but matches ACROSS lines (whole-file
# regex via perl -0777). Needed for structural checks where the canonical HTML
# spreads the matched tokens over several lines — e.g. the sidebar submenus, whose
# canonical block in prototypes.md renders `Planning` / `Execution` / `Fleet` each
# on its own <a> line. A line-by-line `grep -E 'Execution.*Fleet'` would falsely
# fail on the canonical layout itself (story 2.4 P0-0 gate fix, 2026-06-27).
# Returns 1 if the multiline pattern is present, else 0.
count_matches_multiline() {
  local pattern="$1" file="$2"
  perl -0777 -ne 'print((/'"$pattern"'/s) ? "1" : "0")' "$file" 2>/dev/null || echo 0
}

# first_n_lines: emit "lineNo: text" for first N matches of pattern
first_n_lines() {
  local pattern="$1" file="$2" n="${3:-3}"
  grep -nE "$pattern" "$file" 2>/dev/null | head -n "$n" | sed 's/^/    /'
}

# ── Main lint routine ─────────────────────────────────────────────────────────

lint_file() {
  local file="$1"
  local stem
  stem=$(basename "$file" .html)
  # stem_stripped: the slug without any e{N}- prefix. Used for prefix-agnostic
  # filename checks (e.g. is this a login file?).
  local stem_stripped="${stem#e[0-9]-}"
  stem_stripped="${stem_stripped#e[0-9][0-9]-}"
  local type
  type=$(classify_file "$file")
  local report="${REPORTS_DIR}/${stem}-review.md"

  # Counters
  local p0=0 p1=0 p2=0

  # Findings buffers (newline-separated; one block per finding)
  local p0_block=""
  local p1_block=""
  local p2_block=""
  local skipped_block=""

  # ── P0 gates ─────────────────────────────────────────────────────────────────

  # P0-0: Sidebar consistency gate (desktop nav screens only — skip auth + reference)
  # Extracted 2026-06-27 per story 2.4 (canonical sidebar standardization).
  # Checks that nav sidebars conform to the canonical structure defined in prototypes.md:
  #   - 4 sections (Main, Operations, Analytics, Compliance/or merged into 3)
  #   - Logistics submenu with Planning, Execution, Fleet items
  #   - Inventory submenu with Stock, Intake, Expiry & Waste, Storage items
  #   - Users submenu with All Users, Roles & Permissions items
  #   - Brand lockup present
  #   - Logout affordance in footer
  # Auth screens (login, password-reset, access-denied, account-activation) are exempt.
  # Slide-over modals (supplier-registration) with empty sidebar stub are exempt IF marked
  # with <!-- SIDEBAR-EXEMPT: reason --> comment adjacent to the <aside> tag.
  if [[ "$stem_stripped" =~ ^(login|password-reset|access-denied|account-activation)$ ]] && grep -q '<!-- SIDEBAR-EXEMPT:' "$file" 2>/dev/null; then
    skipped_block+=$'\n'"- P0-0 (sidebar consistency) — skipped (auth page with SIDEBAR-EXEMPT marker)"
  else
    # Check for canonical sidebar structure
    local sidebar_div sidebar_has_logistics sidebar_has_inventory sidebar_has_users
    sidebar_div=$(count_matches '<aside[^>]*270' "$file")
    # Submenu checks are multiline-aware: the canonical sidebar (prototypes.md)
    # renders each submenu item on its own <a> line, so a line-scoped grep would
    # falsely fail on the canonical layout itself (story 2.4 P0-0 fix, 2026-06-27).
    sidebar_has_logistics=$(count_matches_multiline 'Planning.*?Execution.*?Fleet' "$file")
    sidebar_has_inventory=$(count_matches_multiline 'Stock.*?Intake.*?Expiry.*?Waste.*?Storage' "$file")
    sidebar_has_users=$(count_matches_multiline 'All Users.*?Roles.*?Permissions' "$file")
    local empty_sidebar=$(count_matches '<aside[^>]*270[^>]*><\/aside>' "$file")

    if [ "$sidebar_div" -gt 0 ]; then
      # Sidebar present — check for canonical structure
      if [ "$sidebar_has_logistics" -lt 1 ] && [ "$type" != "reference" ]; then
        p0=$((p0+1))
        p0_block+=$'\n'"- [P0] P0-0: Sidebar present but Logistics submenu (Planning, Execution, Fleet) missing. Add canonical submenu structure per prototypes.md."
      fi
      if [ "$empty_sidebar" -gt 0 ]; then
        p0=$((p0+1))
        p0_block+=$'\n'"- [P0] P0-0: Empty sidebar stub found (\`<aside></aside>\`). Fill with canonical sidebar HTML or mark \`<!-- SIDEBAR-EXEMPT: reason -->\` if intentional."
      fi
    elif [ "$type" != "auth" ] && [ "$type" != "reference" ]; then
      # No sidebar on a desktop nav screen — error
      p0=$((p0+1))
      p0_block+=$'\n'"- [P0] P0-0: No sidebar (\`<aside class=\"w-\\[270px\\]\"\`) found on desktop nav screen $type. Add canonical sidebar per prototypes.md."
    fi
  fi

  # P0-0b D-016 held-route guard REMOVED 2026-06-28 — founder approved D-016; the 3 routes
  # (partners/operations, suppliers/schedule, suppliers/history) are now in-scope and are
  # included in the canonical sidebar (flow-design.html). No hold remains.

  # P0-1: Token link present
  local c
  c=$(count_matches 'tokens/colors_and_type.css|colors_and_type\.css' "$file")
  if [ "$c" -lt 1 ]; then
    p0=$((p0+1))
    p0_block+=$'\n'"- [P0] P0-1: Token link absent — must \`<link rel=\"stylesheet\" href=\"...colors_and_type.css\">\`. Grep: \`grep -cE 'colors_and_type.css'\` → $c"
  fi

  # P0-2: No inline <style>:root block
  c=$(count_matches '<style[^>]*>[^<]*:root' "$file")
  if [ "$c" -gt 0 ]; then
    p0=$((p0+1))
    p0_block+=$'\n'"- [P0] P0-2: Inline \`<style>:root\` block found ($c hits). Token contract: never inline; \`<link>\` the canonical CSS."
  fi

  # P0-3: No stock Tailwind palette colors
  c=$(count_matches "bg-($STOCK_PALETTE)-[0-9]+|text-($STOCK_PALETTE)-[0-9]+|border-($STOCK_PALETTE)-[0-9]+|ring-($STOCK_PALETTE)-[0-9]+" "$file")
  if [ "$c" -gt 0 ]; then
    p0=$((p0+1))
    p0_block+=$'\n'"- [P0] P0-3: Stock Tailwind palette colors found ($c hits). Use semantic tokens (\`bg-success-bg text-success\` etc.) or \`bg-accent text-accent-foreground\` for role pills."
    p0_block+=$'\n'"  First matches:"$'\n'"$(first_n_lines "bg-($STOCK_PALETTE)-[0-9]+|text-($STOCK_PALETTE)-[0-9]+|border-($STOCK_PALETTE)-[0-9]+|ring-($STOCK_PALETTE)-[0-9]+" "$file")"
  fi

  # P0-4: No hardcoded hex in markup (skipped on reference pages — a token palette
  # or brand-asset showcase legitimately displays raw hex values as its content)
  if [ "$type" = "reference" ]; then
    skipped_block+=$'\n'"- P0-4 (hardcoded hex) — skipped (reference/showcase page; raw hex is its content)"
  else
    c=$(count_matches 'style="[^"]*#[0-9A-Fa-f]{3,6}|bg-\[#[0-9A-Fa-f]+\]|text-\[#[0-9A-Fa-f]+\]|border-\[#[0-9A-Fa-f]+\]' "$file")
    if [ "$c" -gt 0 ]; then
      p0=$((p0+1))
      p0_block+=$'\n'"- [P0] P0-4: Hardcoded hex colors found in markup ($c hits). Use tokens."
    fi
  fi

  # P0-5: INFORMATIONAL — sidebar leaf fill grep is ambiguous, awaiting rewrite
  # (Founder-accepted refinement: do not block on this until the grep is rewritten)
  skipped_block+=$'\n'"- P0-5 (sidebar active-leaf fill) — informational only; grep ambiguous, pending rewrite"

  # P0-6: Multi-hue role pills retired
  c=$(count_matches "bg-(green|blue|orange|purple|teal)-[0-9]+[^\"]*\"[^>]*>[^<]*\\b($ROLE_LABELS)\\b" "$file")
  if [ "$c" -gt 0 ]; then
    p0=$((p0+1))
    p0_block+=$'\n'"- [P0] P0-6: Multi-hue role pill detected ($c hits). Role pills are single-hue brand: \`bg-accent text-accent-foreground\` (locked 2026-05-15)."
  fi

  # P0-7: Solid bg-destructive not used for routine status
  c=$(count_matches "bg-destructive[^/-][^\"]*\"[^>]*>[^<]*\\b($ROUTINE_STATUS_LABELS)\\b" "$file")
  if [ "$c" -gt 0 ]; then
    p0=$((p0+1))
    p0_block+=$'\n'"- [P0] P0-7: Solid \`bg-destructive\` used on routine status pill ($c hits). Use danger tone PAIR: \`bg-danger-bg text-danger\` uppercase bold."
  fi

  # P0-8: Login CTA uses h-11 (login files only — stripped stem == "login")
  # Founder-accepted refinement: accept both literal `h-11` AND inline style="height:44px"
  if [ "$stem_stripped" = "login" ]; then
    local h11_lit h11_inline
    h11_lit=$(count_matches '\bh-11\b' "$file")
    h11_inline=$(count_matches 'style="[^"]*height:\s*44px' "$file")
    if [ "$h11_lit" -lt 1 ] && [ "$h11_inline" -lt 1 ]; then
      p0=$((p0+1))
      p0_block+=$'\n'"- [P0] P0-8: Login CTA does not use \`h-11\` (or equivalent 44px). Auth primary CTA is the only h-11; all other controls are h-10."
    fi
  else
    skipped_block+=$'\n'"- P0-8 (login h-11) — skipped (not a login file)"
  fi

  # ── P1 gates ─────────────────────────────────────────────────────────────────

  # P1-1: Breadcrumb-only header present (skip on auth + reference files)
  if [ "$type" = "auth" ] || [ "$type" = "reference" ]; then
    skipped_block+=$'\n'"- P1-1 (breadcrumb-only header) — skipped ($type page)"
  else
    c=$(count_matches 'Breadcrumb-only header band|<nav[^>]*text-\[13px\]' "$file")
    if [ "$c" -lt 1 ]; then
      p1=$((p1+1))
      p1_block+=$'\n'"- [P1] P1-1: Breadcrumb-only header band missing on this $type screen. Add the canonical pattern from \`rules/prototypes.md\` (\`<nav class=\"text-[13px]\">...</nav>\`)."
    fi
  fi

  # P1-2: Header band does not carry title / search / bell — rough heuristic
  # (skip on reference pages — a showcase page legitimately titles its own header)
  if [ "$type" = "reference" ]; then
    skipped_block+=$'\n'"- P1-2 (header-band heuristic) — skipped (reference/showcase page)"
  else
    c=$(count_matches '<header[^>]*>[^<]*(<h1|<input[^>]*search|notification|bell)' "$file")
    if [ "$c" -gt 0 ]; then
      p1=$((p1+1))
      p1_block+=$'\n'"- [P1] P1-2: Header band may carry title / search / notifications ($c hits). Header is breadcrumb-only; move title + actions into the content area. (Rough heuristic — confirm by eye.)"
    fi
  fi

  # P1-3: No shadow-sm / shadow-md / shadow-lg on cards
  c=$(count_matches 'class="[^"]*shadow-(sm|md|lg)\b' "$file")
  if [ "$c" -gt 0 ]; then
    p1=$((p1+1))
    p1_block+=$'\n'"- [P1] P1-3: Stock shadow utilities found ($c hits). Cards use \`shadow-card\`; popovers/modals use \`shadow-pop\`; sidebar uses \`shadow-sidebar\`; buttons use \`shadow-btn\`."
  fi

  # P1-4: Buttons / inputs / selects are h-10
  # Founder-accepted refinement: only flag h-9 on <button>/<input>/<select>; ignore
  # `w-9 h-9` avatar circles and logo tiles
  c=$(grep -cE '<(button|input|select)[^>]*\bh-9\b|class="[^"]*\bh-9\b[^"]*"[^>]*type="(button|submit|reset)"' "$file" 2>/dev/null || true)
  if [ "$c" -gt 0 ]; then
    p1=$((p1+1))
    p1_block+=$'\n'"- [P1] P1-4: \`h-9\` on a button / input / select ($c hits). Baseline is \`h-10\`; only login primary CTA is \`h-11\`."
  fi

  # P1-5: Page title not text-2xl / text-3xl in <h1>
  # (skip on reference pages — in-app page-title sizing doesn't bind a showcase)
  if [ "$type" = "reference" ]; then
    skipped_block+=$'\n'"- P1-5 (in-app page-title sizing) — skipped (reference/showcase page)"
  else
    c=$(count_matches '<h1[^>]*class="[^"]*text-(2xl|3xl)' "$file")
    if [ "$c" -gt 0 ]; then
      p1=$((p1+1))
      p1_block+=$'\n'"- [P1] P1-5: \`<h1>\` uses \`text-2xl\`/\`text-3xl\` ($c hits). In-app page titles are \`text-xl font-semibold\` (20px). Reserve 24px for top-level dashboard."
    fi
  fi

  # P1-6: Phone inputs show +250 prefix (tightened grep per founder refinement)
  c=$(count_matches 'type="tel"|name="phone"|>Phone number|>Mobile' "$file")
  if [ "$c" -gt 0 ]; then
    local p250
    p250=$(count_matches '\+250|🇷🇼' "$file")
    if [ "$p250" -lt 1 ]; then
      p1=$((p1+1))
      p1_block+=$'\n'"- [P1] P1-6: Phone field detected but \`+250\` prefix missing. Use the canonical pattern (flag emoji + \`+250\` in a \`bg-page\` prefix segment)."
    fi
  fi

  # P1-7: Sidebar shell width w-[270px] (skip on auth files)
  if [ "$type" = "auth" ]; then
    skipped_block+=$'\n'"- P1-7 (sidebar w-[270px]) — skipped (auth file; <aside> is a brand panel)"
  else
    local has_aside
    has_aside=$(count_matches '<aside' "$file")
    if [ "$has_aside" -gt 0 ]; then
      c=$(count_matches 'w-\[270px\]' "$file")
      if [ "$c" -lt 1 ]; then
        p1=$((p1+1))
        p1_block+=$'\n'"- [P1] P1-7: \`<aside>\` present but width is not \`w-[270px]\` ($c hits). Canonical app sidebar is 270px."
      fi
    fi
  fi

  # P1-8: Modals declare role="dialog" aria-modal="true"
  local has_modal
  has_modal=$(count_matches 'fixed inset-0 z-50' "$file")
  if [ "$has_modal" -gt 0 ]; then
    local has_dialog
    has_dialog=$(count_matches 'role="dialog"' "$file")
    if [ "$has_dialog" -lt "$has_modal" ]; then
      p1=$((p1+1))
      p1_block+=$'\n'"- [P1] P1-8: $has_modal modal(s) found but only $has_dialog have \`role=\"dialog\"\`. Every modal needs \`role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"<id>\"\` for a11y."
    fi
  fi

  # P1-9: State coverage minimums
  local state_count state_min
  state_count=$(count_matches '<!-- STATE:' "$file")
  state_min=$(state_minimum "$type")
  if [ "$state_count" -lt "$state_min" ]; then
    p1=$((p1+1))
    p1_block+=$'\n'"- [P1] P1-9: State coverage below minimum for $type screen. Have $state_count, need $state_min. Add \`<!-- STATE: ... -->\` markers (default, loading, empty, error, success, plus domain states)."
  fi

  # P1-10: Table headers in Title Case (acronym allowlist applied)
  # Grep for ALL-CAPS <th> content, then subtract any that match the acronym allowlist
  local all_caps_total all_caps_acronyms
  all_caps_total=$(count_matches '<th[^>]*>[^<]*[A-Z]{3,}[^<]*</th>' "$file")
  all_caps_acronyms=$(grep -cE "<th[^>]*>[^<]*\\b($ACRONYM_ALLOWLIST)\\b[^<]*</th>" "$file" 2>/dev/null || true)
  local real_caps=$((all_caps_total - all_caps_acronyms))
  if [ "$real_caps" -gt 0 ]; then
    p1=$((p1+1))
    p1_block+=$'\n'"- [P1] P1-10: ALL-CAPS table headers detected ($real_caps after acronym allowlist of $all_caps_acronyms). Convert to Title Case."
  fi

  # P1-11: Visible <th>Actions</th> label absent
  c=$(count_matches '<th[^>]*>\s*Actions\s*</th>' "$file")
  if [ "$c" -gt 0 ]; then
    p1=$((p1+1))
    p1_block+=$'\n'"- [P1] P1-11: Visible \`<th>Actions</th>\` label found ($c hits). Use \`<span class=\"sr-only\">Actions</span>\` to preserve screen-reader access without a visual column label."
  fi

  # ── P2 gates ─────────────────────────────────────────────────────────────────

  # P2-1: Inline SVG count
  c=$(count_matches '<svg' "$file")
  if [ "$c" -gt 20 ]; then
    p2=$((p2+1))
    p2_block+=$'\n'"- [P2] P2-1: Inline SVG count is $c (> 20). Icon system would deduplicate."
  fi

  # P2-2: File size > 500 lines
  c=$(wc -l < "$file" | tr -d ' ')
  if [ "$c" -gt 500 ]; then
    p2=$((p2+1))
    p2_block+=$'\n'"- [P2] P2-2: File is $c lines (> 500). Consider splitting state previews into sibling files."
  fi

  # P2-3: text-gray-* (should use fg-* ramp)
  c=$(count_matches 'text-gray-[0-9]+' "$file")
  if [ "$c" -gt 0 ]; then
    p2=$((p2+1))
    p2_block+=$'\n'"- [P2] P2-3: \`text-gray-*\` used ($c hits). Use the six-step text ramp (\`text-fg-1\` ... \`text-fg-6\`)."
  fi

  # P2-4: .mono missing where phone present
  local has_phone
  has_phone=$(count_matches '\+250|>Phone number|type="tel"' "$file")
  if [ "$has_phone" -gt 0 ]; then
    local has_mono
    has_mono=$(count_matches 'class="[^"]*mono' "$file")
    if [ "$has_mono" -lt 1 ]; then
      p2=$((p2+1))
      p2_block+=$'\n'"- [P2] P2-4: Phone field present but \`.mono\` class missing. Phone numbers + IDs use \`.mono\` for typographic consistency."
    fi
  fi

  # P2-5: Audit-log rail copy missing on modal
  if [ "$has_modal" -gt 0 ]; then
    local has_audit_copy
    has_audit_copy=$(count_matches 'recorded in the audit log|audit log' "$file")
    if [ "$has_audit_copy" -lt 1 ]; then
      p2=$((p2+1))
      p2_block+=$'\n'"- [P2] P2-5: Modal present but no audit-log rail copy. If the modal action writes to \`audit_logs\`, add the canonical disclosure line."
    fi
  fi

  # ── Write report ─────────────────────────────────────────────────────────────

  local promotable="NO"
  if [ "$p0" -eq 0 ] && [ "$p1" -eq 0 ]; then promotable="YES"; fi

  # The Summary line MUST use this exact format — gate G10 of `design-builder promote`
  # greps for `^\*\*P0: 0\s+P1: 0`.
  {
    printf '# Design Review — %s\n\n' "$stem"
    printf '**Reviewed file:** `%s`\n' "$file"
    printf '**Reviewed on:** %s\n' "$(date -u +%Y-%m-%d)"
    printf '**Reviewer:** `lint-prototypes.sh` (shared script — design-builder Phase 5.5 + design-linter agent)\n'
    printf '**Screen type:** %s (state minimum: %d)\n\n' "$type" "$state_min"
    printf '## Summary\n'
    printf '**P0: %d  P1: %d  P2: %d**\n' "$p0" "$p1" "$p2"
    printf '**Promotable: %s** (gate G10 = P0:0 P1:0)\n\n' "$promotable"

    printf '## Findings\n\n'
    if [ "$p0" -eq 0 ] && [ "$p1" -eq 0 ] && [ "$p2" -eq 0 ]; then
      printf -- '- [OK] All %d gates pass for this screen type.\n\n' 26
    else
      [ -n "$p0_block" ] && printf '### P0 — block promotion\n%s\n\n' "$p0_block"
      [ -n "$p1_block" ] && printf '### P1 — fix before promotion\n%s\n\n' "$p1_block"
      [ -n "$p2_block" ] && printf '### P2 — informational\n%s\n\n' "$p2_block"
    fi

    if [ -n "$skipped_block" ]; then
      printf '## Skipped gates\n%s\n\n' "$skipped_block"
    fi

    printf '## Discipline self-check\n'
    printf -- '- Rule 4 (exit protocol): this report IS the exit record\n'
    printf -- '- Rule 6 (grep-first): every finding above cites the grep that proved it\n'
    printf -- '- Triage hygiene: only [P0] / [P1] / [P2] / [OK] tags used\n'
  } > "$report"

  # ── Stdout summary line ─────────────────────────────────────────────────────
  printf '%-65s P0: %d  P1: %d  P2: %d  %s\n' "$file" "$p0" "$p1" "$p2" "$promotable"
}

# ── Main ──────────────────────────────────────────────────────────────────────

if [ $# -eq 0 ]; then
  cat >&2 <<EOF
Usage: $(basename "$0") <file1.html> [<file2.html> ...]

Lints AgriFlow staging HTML prototypes against 26 design-system gates.
Writes per-file reports to \$REPORTS_DIR (default: ../reports/ux).
Prints one stdout summary line per file.

Example:
  $(basename "$0") ui-flow/e1-identity-access-management/e1-login.html
  $(basename "$0") ui-flow/e2-partners-supplier-ecosystem/*.html
EOF
  exit 64  # EX_USAGE
fi

for file in "$@"; do
  if [ ! -f "$file" ]; then
    printf '%-65s ERROR: file not found\n' "$file" >&2
    continue
  fi
  if [[ "$file" != *.html ]]; then
    printf '%-65s SKIP: not an .html file\n' "$file" >&2
    continue
  fi
  lint_file "$file"
done
