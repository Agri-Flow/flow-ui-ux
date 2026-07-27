# G13 Render Gate — Phase 1 Validation

**Date:** 2026-07-27 · **Spec:** `flow-orchestrator/.claude/rules/design-quality-gate.md` · **Corpus:** `.claude/fixtures/render-gate/` (Phase 0, merged flow-ui-ux#54)

Phase 1 = build **C0 (state completeness) + C1–C4** and prove non-vacuous against the fixture corpus. (C5 icons / C6 pattern are Phase 2, per the spec rollout.)

## What was built
| File | Role |
|---|---|
| `.claude/scripts/render-inspect.mjs` | The inspector. Runs in page context (computed DOM), returns `{archetype, findings, verdict}`. Checks C0–C4. Same body drives the agent (browser MCP) and CI (Playwright). |
| `.claude/scripts/render-gate-run.py` | Headless driver (Playwright-Python) — loads each URL, injects the inspector, emits JSON verdicts. Exits non-zero if no browser (a missing browser fails, never silently passes). |
| `.claude/scripts/render-gate.selftest.sh` | Mutation test — runs the driver over `fixtures.json`; asserts baseline `RENDER-CLEAN` + every C0–C4 fixture fires its code; prints `RENDER-GATE SELFTEST GREEN`. |

## Validation (live, via the in-app browser against the real inspector)
| Fixture | Expected | Inspector result | ✓ |
|---|---|---|---|
| `_good/list-baseline.html` | RENDER-CLEAN | `[]`, RENDER-CLEAN | ✓ |
| `c0-missing-loading` | C0 fires | `C0-missing-state`, VIOLATIONS | ✓ |
| `c1-invisible-state` | C1 fires | `C1-invisible-state`, VIOLATIONS | ✓ |
| `c2-fixed-position` | C2 fires | `C2-fixed`, VIOLATIONS | ✓ |
| `c3-low-contrast` | C3 fires | `C3-contrast 1.83 < 4.5`, ADVISORY | ✓ |
| `c4-mobile-overflow` (375px) | C4 fires | `C4-overflow 1241>375`, ADVISORY | ✓ |

Verdict semantics (refinement over the spec's two-value sketch): **P0 finding → `RENDER-VIOLATIONS`** (blocks, Phase 3); **P1-only → `RENDER-ADVISORY`** (reports, never blocks); **none → `RENDER-CLEAN`**. C0/C1/C2 are P0; C3/C4 are P1.

The self-test's assertion logic was verified GREEN against these exact outputs. Headless end-to-end execution is pending a browser (see Decision 2).

## Two decisions this surfaced (need founder input)

### Decision 1 — C3 flagged the brand primary green (real finding, not a fixture bug)
On its first run, C3 flagged **white text on the AgriFlow primary `#1B8C4E` = 4.28:1**, below WCAG AA 4.5 for normal text. That is every primary button in the product. Options:
- **(a)** Darken the brand primary slightly so white passes AA (~`#157F45`+) — a real brand change.
- **(b)** Accept `#1B8C4E` and hold **button label** text to the 3:1 UI-component threshold (WCAG 1.4.11), not 4.5 — i.e. C3 exempts interactive-control labels.
- **(c)** Accept as a known, documented exception.

The Phase-0 baseline fixture was set to an AA-passing green so it stays a valid clean guard; the real value is **not** silently changed anywhere. This is exactly the kind of finding advisory Phase 1 exists to surface *before* the gate is hard.

### Decision 2 — the gate needs a headless browser; flow-ui CI has none
flow-ui is a pure-static repo (no `package.json`); its CI runs only bash+python. The render gate needs a real browser. Options:
- **(a)** Add `pip install playwright && playwright install chromium` to flow-ui CI so `render-gate.selftest.sh` can wire into `Rule lint` (heavier CI, ~1 browser download).
- **(b)** Keep the gate in the **agent runtime only** (`ux-executor` drives it via the browser MCP at promote time) and leave CI as-is; the self-test runs locally/agent-side.

Until this is decided, the self-test is **not** wired into CI — consistent with the spec's "advisory until proven; require a check only after it reports on every input."

## Next
- **Phase 2:** C5 (Lucide-path conformance — needs the Lucide glyph set from `flow-fe/node_modules/lucide-react/`) + C6 (form-pattern intent). Their fixtures (`c5-`, `c6-`) already exist, currently SKIPPED by the self-test.
- **Then:** resolve Decisions 1–2 → run advisory over the real promoted screens (confirm zero false positives) → flip C0–C4 to blocking in `ux-executor` before `design-approval`.
