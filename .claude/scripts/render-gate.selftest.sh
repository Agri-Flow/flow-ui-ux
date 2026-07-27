#!/usr/bin/env bash
# render-gate.selftest.sh — mutation test for the G13 inspector (Phase 1: C0–C4).
# Spec: flow-orchestrator/.claude/rules/design-quality-gate.md §3 (green-after-disable = vacuous).
#
# Serves the fixtures + inspector, runs render-gate-run.py over fixtures.json, and asserts:
#   1. _good/list-baseline.html            → RENDER-CLEAN (no findings)   [false-positive guard]
#   2. every fixture whose check is C0..C4 → its expect_code FIRES         [check is not vacuous]
#   C5/C6 fixtures are SKIPPED (Phase 2, not implemented yet) — reported, never silently passed.
#
# Prints `RENDER-GATE SELFTEST GREEN` on success. Requires a headless browser
# (render-gate-run.py exits 3 if none) — a missing browser fails, never passes.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"                       # flow-ui repo root
FX=".claude/fixtures/render-gate"
IMPLEMENTED_RE='^C[0-6]'                                # Phase 1 checks
PORT="${RENDER_GATE_PORT:-8908}"

cd "$ROOT"
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SRV=$!; trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1

base="http://localhost:$PORT"
# c4 (overflow) must be judged at mobile width; everything else at desktop.
desktop_paths=(); mobile_paths=()
while IFS=$'\t' read -r fx code; do
  case "$fx" in
    */list-baseline.html) desktop_paths+=("$FX/$fx");;
    c4-*)                 mobile_paths+=("$FX/$fx");;
    *)                    desktop_paths+=("$FX/$fx");;
  esac
done < <(python3 -c "import json;[print(f['fixture']+'\t'+str(f['expect_code'])) for f in json.load(open('$FX/fixtures.json'))['fixtures']]")

OUT="$(python3 "$HERE/render-gate-run.py" --base "$base" "${desktop_paths[@]}")"
OUT_M="$(python3 "$HERE/render-gate-run.py" --base "$base" --viewport 375x812 "${mobile_paths[@]}")"

python3 - "$FX/fixtures.json" "$OUT" "$OUT_M" <<'PY'
import json, re, sys
manifest = json.load(open(sys.argv[1]))['fixtures']
results = {r['path'].split('/')[-1]: r for r in json.loads(sys.argv[2]) + json.loads(sys.argv[3])}
IMPL = re.compile(r'^C[0-6]')
fails, skips = [], []
for f in manifest:
    name = f['fixture'].split('/')[-1]
    r = results.get(name)
    if not r or r['verdict'] == 'DRIVER-ERROR':
        fails.append(f"{name}: driver error / not run ({r})"); continue
    codes = {x['code'] for x in r.get('findings', [])}
    if f['expect'] == 'RENDER-CLEAN':
        if r['findings']: fails.append(f"{name}: expected clean, got {sorted(codes)}")
        continue
    check = f['check']                                  # e.g. 'C0','C3'
    if not IMPL.match(check):
        skips.append(f"{name} ({check}, Phase 2)"); continue
    if not any(c.startswith(check) for c in codes):
        fails.append(f"{name}: expected {check} to fire, got {sorted(codes) or 'nothing'}")

for s in skips: print(f"  SKIP  {s}")
if fails:
    print("\nRENDER-GATE SELFTEST RED"); [print("  FAIL "+x) for x in fails]; sys.exit(1)
print("\nRENDER-GATE SELFTEST GREEN")
PY
