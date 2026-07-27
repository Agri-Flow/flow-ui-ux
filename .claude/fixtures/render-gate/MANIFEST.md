# Render-Gate Fixture Corpus (G13 — Phase 0)

**Spec:** `flow-orchestrator/.claude/rules/design-quality-gate.md` (G13, Rendered-Visual Gate).
**Purpose:** the known-bad + known-good inputs the G13 checks are proven against. Per the spec's regression discipline, **a check that passes its own bad fixture is vacuous** — this corpus is what makes that testable (§3 of the spec; the `green-after-disable = vacuous` rule).

This is **Phase 0**: seed the corpus. The checks themselves (`render-inspect.mjs`) land in Phase 1 and iterate `fixtures.json`.

---

## The corpus

| Fixture | Archetype | Exercises | Expected verdict | Represents a real defect from |
|---|---|---|---|---|
| `_good/list-baseline.html` | list | **all** | `RENDER-CLEAN` | clean reference — the false-positive guard |
| `c0-missing-loading.html` | list | C0 | `RENDER-VIOLATIONS` | Epic 3 catalog shipped with no loading skeleton |
| `c0-missing-empty.html` | list | C0 | `RENDER-VIOLATIONS` | Epic 2 partner screens shipped with no empty state |
| `c0-missing-error.html` | list | C0 | `RENDER-VIOLATIONS` | Epic 3 screens shipped with no error+retry state |
| `c1-invisible-state.html` | list | C1 | `RENDER-VIOLATIONS` | Epic 3 retail-pricing: labels present but `class="hidden"` (pass 7) |
| `c2-fixed-position.html` | list | C2 | `RENDER-VIOLATIONS` | Epic 3: `position:fixed` panels occluding content; `fixed bottom-6` the `inset-0` grep missed |
| `c3-low-contrast.html` | list | C3 | `RENDER-VIOLATIONS` | low-contrast text 300 green tests missed (`browser-verify` memory) |
| `c4-mobile-overflow.html` | list | C4 | `RENDER-VIOLATIONS` | `w-[Npx]` in a centered grid overflowed mobile |
| `c5-wrong-icon.html` | list | C5 | `RENDER-VIOLATIONS` | Epic 3 pass 1: Heroicons/hand-drawn instead of Lucide |
| `c6-wrong-pattern.html` | form | C6 | `RENDER-VIOLATIONS` | Epic 3 pass 3: Add/Edit built as a full page where the pattern is a 480px slide-over |

Each defect fixture isolates **exactly one** defect (real historical screens had several overlapping — worse for pinpointing which check fires). `fixtures.json` is the machine-readable form the Phase-1 self-test consumes.

> **Why synthetic, not the real bad screens:** Epic 3 landed via a squash-merge (`flow-ui-ux#53`, "10 founder-review passes"), so the intermediate bad versions are not in git history. Single-defect synthetic fixtures are the right substitute — and are cleaner mutation inputs regardless.

---

## The machine-readable convention (established here; adopted by screens + design-builder in Phase 1)

The real screens today mark state variants with **eyebrow text only** (`Loading — …`, `Alternate state · …`) and **zero** machine-readable markers — which is exactly why a text gate can't reason about them. G13 requires a stable marker:

- **State band:** `data-state-band="<state>"` on the wrapping element. States: `loading`, `empty`, `filtered-empty`, `error`, `populated`, `not-found`, `default`, `field-validation-error`, `submitting`, `success`, `submit-failure`, `confirm`, `pending`, `failure`, `unavailable`.
- **Archetype:** `<!-- @archetype: list|form|detail|mutation|degraded -->` at the top of the file.
- **Pattern intent:** `<!-- @pattern: <field>=<pattern> -->` (e.g. `create=slide-over(480)`).

**Phase-1 transition plan** (documented here so it is not lost):
1. `render-inspect.mjs` recognises the `data-state-band` marker **and**, as a fallback, the legacy eyebrow-text convention — so existing screens are not instantly all-red.
2. `design-builder` emits `data-state-band` / `@archetype` / `@pattern` on every new screen.
3. Existing promoted screens are retrofitted with the markers (one PR per epic), after which the legacy-text fallback is retired.

---

## Required-state matrix (the C0 contract — mirrors the spec §2 C0 table)

| Archetype | Required states |
|---|---|
| `list` | loading, empty, filtered-empty, error(+retry), populated |
| `form` | default, field-validation-error, submitting, success, submit-failure |
| `detail` | loading, not-found, error, populated |
| `mutation` | confirm, pending, success, failure |
| `degraded` | explicit `unavailable` ("available with Epic N") — never a fake `0` |

---

## How Phase 1 uses this

`render-gate.selftest.sh` starts a static server, runs `render-inspect.mjs` over every entry in `fixtures.json`, and asserts:
1. `_good/list-baseline.html` → `RENDER-CLEAN` (no false positives).
2. every `cN-*` fixture → `RENDER-VIOLATIONS` **containing its `expect_code`** (the check is not vacuous).

It must print `RENDER-GATE SELFTEST GREEN`, and is wired into flow-ui's `Rule lint` CI so the gate cannot rot. Adding a new check to G13 means adding its bad fixture here first.
