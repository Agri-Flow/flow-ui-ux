# Design Review — deactivate-user

**Reviewed file:** `ui-flow/agriflow-rwanda-design-system/project/screens/deactivate-user.html`
**Reviewed on:** 2026-06-28
**Reviewer:** `lint-prototypes.sh` (shared script — design-builder Phase 5.5 + design-linter agent)
**Screen type:** detail (state minimum: 2)

## Summary
**P0: 0  P1: 0  P2: 3**
**Promotable: YES** (gate G10 = P0:0 P1:0)

## Findings

### P2 — informational

- [P2] P2-1: Inline SVG count is 80 (> 20). Icon system would deduplicate.
- [P2] P2-2: File is 1027 lines (> 500). Consider splitting state previews into sibling files.
- [P2] P2-4: Phone field present but `.mono` class missing. Phone numbers + IDs use `.mono` for typographic consistency.

## Skipped gates

- P0-5 (sidebar active-leaf fill) — informational only; grep ambiguous, pending rewrite
- P0-8 (login h-11) — skipped (not a login file)

## Discipline self-check
- Rule 4 (exit protocol): this report IS the exit record
- Rule 6 (grep-first): every finding above cites the grep that proved it
- Triage hygiene: only [P0] / [P1] / [P2] / [OK] tags used
