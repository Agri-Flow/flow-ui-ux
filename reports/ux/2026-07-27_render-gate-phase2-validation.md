# G13 Render Gate — Phase 2 Validation

**Date:** 2026-07-27 · **Spec:** `flow-orchestrator/.claude/rules/design-quality-gate.md` · Builds on Phase 1 (flow-ui-ux#55).

Phase 2 = add **C5 (Lucide-icon conformance)** + **C6 (form-pattern intent)** to the inspector and prove them non-vacuous. The gate now covers **C0–C6**.

## Added
| File | Change |
|---|---|
| `render-inspect.mjs` | + **C5** (each rendered `<path d>` must be a Lucide glyph; `fill` on an icon svg = non-Lucide since Lucide is stroke-only; `data-logo` svgs skipped) + **C6** (rendered form pattern matches `data-pattern="…=slide-over(W)\|page"`). Also C4 now skips a zero-width viewport (harness robustness). |
| `assets/lucide-paths.json` | 4113 normalized Lucide path-`d` strings, extracted from `flow-fe/node_modules/lucide-react/…` — the C5 reference set. |
| `render-gate-run.py` | loads the Lucide asset and passes `{lucidePaths}` into the inspector. |
| `render-gate.selftest.sh` | implemented scope C0→**C6** (c5/c6 no longer skipped). |
| fixtures | `_good/form-slideover.html` added (C6 positive + form-archetype C0 guard); `c6-wrong-pattern` carries `data-pattern`; baseline retry icon corrected to exact `refresh-cw` geometry. |

## Validation (live, in-app browser, real inspector + Lucide set)
| Fixture | Result |
|---|---|
| `_good/list-baseline` (list) | `RENDER-CLEAN` ✓ (C5 passes with exact Lucide paths) |
| `_good/form-slideover` (form) | `RENDER-CLEAN` ✓ (C0 form states present + C6 slide-over rendered as declared) |
| `c5-wrong-icon` | `C5-icon` fires (Heroicon uses `fill`) ✓ |
| `c6-wrong-pattern` | `C6-pattern` fires ("declared slide-over(480) but rendered static width 912px") + C0 (bare form) ✓ |

Full self-test logic verified **GREEN** across all 11 fixtures — 0 false positives, every C0–C6 check fires on its fixture.

## Notes / follow-ups surfaced
- **C5 brittleness is intentional but needs discipline.** C5 does an *exact* path-`d` match against the Lucide set (whitespace-normalized). A hand-typed path with any deviation flags — which is correct (`prototypes.md`: "source the geometry, don't draw it" — copy from `lucide-react`), and is exactly the miss it caught here (my baseline retry icon had a mistyped arc until fixed).
- **Brand mark must be tagged.** Real promoted screens' AgriFlow logo is a custom (non-Lucide) svg; it must carry `data-logo` or C5 flags it. A one-time retrofit when the gate runs on real screens.
- **C6 needs `data-pattern` on create/edit screens.** Same convention as `data-archetype` — a machine-readable marker `design-builder` emits going forward; pattern *choice* can't be grepped, only declared + checked.

## Where this leaves the rollout
C0–C6 all implemented + validated against the corpus. Still **advisory / not wired into CI** (pending the two Phase-1 decisions: the C3 brand-green calibration and the browser-in-CI question). Next: resolve those → run advisory over the *real* promoted screens (retrofit `data-logo` / `data-pattern`, confirm zero false positives) → flip C0–C6 (P0s) to blocking in `ux-executor` before `design-approval`.
