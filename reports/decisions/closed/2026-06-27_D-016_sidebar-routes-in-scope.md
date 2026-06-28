# D-016 — 3 Extra Sidebar Routes: In-Scope Product or Scaffolding to Remove

> _Mirror copy for in-tree reference. The canonical founder decision queue lives in the orchestrator repo (`reports/decisions/closed/`); this copy exists so the breadcrumbs in `.claude/rules/prototypes.md` resolve within `flow-ui-ux`._

- **Status:** CLOSED — **Option A (In-scope; write stories)**
- **Opened:** 2026-06-22
- **Closed:** 2026-06-27
- **Decided by:** Founder (Prince Sengayire)
- **Source:** `reports/cycles/RUN-20260622-2133/fe-report.md`:6 (fe-inspector [P1])

## Decision

**Option A — In-scope routes — write stories.** All three routes — `partners/operations`, `suppliers/schedule`, `suppliers/history` — are confirmed real E2 (Partners & Supplier Ecosystem) product routes, not scaffolding. PM authors user stories for them; no removal.

## Options (as presented)

- [x] **A. In-scope routes — write stories:** all three are real E2 product routes; pm-executor to generate stories before the E2 sprint starts. No removal.
- [ ] B. Scaffold to remove.
- [ ] C. Partial — mixed ruling.
- [ ] D. Defer.

## Rationale

The founder added all three routes to the canonical sidebar reference (`flow-ui/ui-flow/flow-design.html`) during the 2026-06-27 sidebar work, confirming intent to ship them as real navigation. Ruling them in-scope resolves the fe-inspector P1 (dead-route ambiguity) and unblocks the canonical sidebar.

## Follow-up actions (triggered by this closure)

1. **PM authors 3 user stories** under Epic 2 (one per route) — delegated to `pm-executor` on 2026-06-27. Until those stories exist + are built, the 3 routes remain out of the *promoted* sidebar (they live in the `flow-design.html` reference).
2. **Story 2.4 (Canonical Sidebar Standardization + Consistency Gate)** — its D-016 hold-out (Task 2.4.4) transitions from "block the 3 routes" to "routes are in-scope, pending their own stories." When the 3 route stories are built, the routes are added to the canonical sidebar block (Task 2.4.1) and the hold-out comment is lifted.
3. The fe-inspector P1 finding clears once the routes have stories.

## Context (original)

The FE sidebar contained three sub-items with no corresponding user story or AC in `_pm-plan`: `partners/operations`, `suppliers/schedule`, `suppliers/history`. Detected by fe-inspector as a P1 in the Epic 1 cycle run (2026-06-22). This decision rules them in-scope (A).
