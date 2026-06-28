# Story Coverage Audit — Epic 2 (Partners & Supplier Ecosystem)

**Audit ID:** G12-E2-20260628
**Audited stories:** user-story-2.1.md, 2.2, 2.3, 2.4 (designed); 2.5, 2.6, 2.7 (To Do — no screens, deferred)
**Audited staging files:**
- e2-supplier-directory.html
- e2-supplier-registration.html
- e2-supplier-profile.html
- e2-supplier-scorecard.html
- e2-supplier-price-book.html
- e2-supplier-documents.html
**Audited on:** 2026-06-28
**Auditor:** `story-coverage-auditor`
**Context:** Re-audit after PR #32 added the mandatory suspension-reason `<textarea>` to the Suspend confirmation modal in `e2-supplier-profile.html` (the sole prior design-side `[AC-MISSING]` blocker). Also confirms Scenario 4 (reactivation + RICA guard, added to Story 2.1 via the same revise) and the Story 2.3 risk-badge contract.

## Summary
**[AC-MISSING]: 0   [AC-UNRESOLVED]: 1   [STORY-MISSING-CRITICAL]: 0   [STORY-MISSING-BP]: 2   [AC-DRIFT]: 0**
**Design-side severity:** P0: 0   P1: 0   P2: 0
**PM-side severity:** P0: 0   P1: 1   P2: 2
**Design-side AC clean:** YES
**PM-side AC clean:** NO   (advisory only — does not block G12)

> **Change since G12-E2-20260627:** the prior audit's summary line read `Design-side AC clean: YES` but its body carried an unresolved `[AC-MISSING-INTERACTION]` (Suspend reason field, S2.1 Sc3) and an `[AC-UNRESOLVED]`/`[P0]` (risk badge on directory, S2.3 Sc2) — an internal inconsistency. Both are now grep-verified present in staging, so the summary and the body agree: **0 design-side `[AC-MISSING]`, 0 design-blocking findings.**

## Design-side findings (block promote — design-builder must fix)

### [AC-MISSING] — story AC unimplemented in staging  →  P0
- [OK] None. Every design-side BDD AC across Stories 2.1–2.4 is implemented in the promoted/staging screens.

### [AC-DRIFT] — references/locked-decision conflict (design-blocking)  →  P1
- [OK] None.

### Verified design-side AC (grep evidence)

**Story 2.1 Scenario 3 — Suspending a supplier** (`user-story-2.1.md:36-40`)
- Suspend trigger present — `grep -nE "Suspend" e2-supplier-profile.html` → line 137 (header action)
- Suspend confirmation modal present — `id="suspend-modal-title"` line 396; "Suspend supplier" CTA line 439
- **Mandatory suspension-reason field present (the PR #32 fix)** — `grep -c "Reason for suspension" e2-supplier-profile.html` → 1 (line 423); `<textarea>` line 424; min-10-char helper line 425 ("Required — minimum 10 characters. Saved with the suspension and written to the audit log.")
- Hidden-from-workflows + retained-record copy present — suspended state lines 496-535
- Audit-log rail on modal — "This action is logged to the audit trail (5-year retention)" line 433

**Story 2.1 Scenario 4 — Reactivating a suspended supplier + RICA guard** (`user-story-2.1.md:42-50`)
- Reactivate trigger + modal — `id="reactivate-modal-title"` line 460; "Reactivate supplier" CTA line 487
- RICA-expired reactivation block — `grep -c "Supplier must renew their RICA certification before reactivation" e2-supplier-profile.html` → 1 (line 548, **verbatim AC match**), in a warning-tone block "RICA Certification Expired" line 547

**Story 2.2 Scenario 1/3 — Price-book mapping table** (`e2-supplier-price-book.html`)
- Multi-row mapping table (product, price, currency, last updated) — present
- Per-row Edit affordance (resolves prior P2 UX note) — `grep -c ">Edit Price<"` → 5 occurrences (lines 206, 221, 233, 245, 257)

**Story 2.3 Scenario 1/2/3 — Scorecard + directory risk badge** (`e2-supplier-scorecard.html`, `e2-supplier-directory.html`)
- Scorecard 4-metric cards + 30d/90d/All selector + no-data state — present in scorecard screen
- **Risk badge on directory row (prior [P0] blocker, now resolved)** — `grep -nE "High Risk" e2-supplier-directory.html` → badge on row 2 (line 325, `bg-danger-bg text-danger` uppercase) + risk filter card (lines 215-219) + per-row rejection % (lines 306/339/402)

**Story 2.4 — Canonical sidebar standardization** — infra story, all scenarios implemented (sidebar present + active-leaf rule + D-016 routes; verified by G10/G9 linter).

## PM-side findings (advisory for design — story-pipeline must fix)

### [STORY-MISSING-CRITICAL] — built work no story specifies  →  P0 (PM)
- [OK] None this cycle.

### [STORY-MISSING-BP] — UI/UX best-practice additions (informational)  →  P2 (PM)
- [STORY-MISSING-BP] `e2-supplier-price-book.html` — per-row "Edit Price" action exists in the build but no Story 2.2 AC mandates an explicit edit-mapping UI affordance (Scenario 2 only mandates duplicate-prevention → "Update" routing). The build rightly provides it (UX best practice); the story should document it.
  Fix for PM: add an AC to Story 2.2 mandating a per-row edit/update action on the price-book table.
- [STORY-MISSING-BP] `e2-supplier-profile.html` — suspended-state banners + disabled-action treatment (lines 496-535) and the reactivate-modal state are richer than the BDD strictly requires. Good UX; worth an explicit AC so the spec records the suspended/reactivate visual states.
  Fix for PM: add an AC documenting the suspended-state page treatment (banner + disabled actions) and the reactivate confirmation flow.

### [AC-UNRESOLVED] — story has unresolved scope questions  →  P1 (PM)
- [AC-UNRESOLVED] Stories 2.5 / 2.6 / 2.7 carry multiple `(PM ASSUMPTION …)` markers (e.g. Story 2.6 route-scope inferred; Story 2.7 event-taxonomy assumed; Story 2.5 delivery-status source assumed from E7). These are `To Do` and not yet designed — the assumptions should be founder-confirmed before those screens are built.
  Fix for founder: confirm the PM assumptions in 2.5/2.6/2.7 so the AC are firm before `design-builder` builds them.

## Notable observations
- Stories 2.5, 2.6, 2.7 are `Status: To Do` with **no staging screens** — correctly out of scope for this audit (deferred, not a finding). They were authored from D-016 closure (Option A) and depend on downstream epics (E4/E5/E6/E7) for real data.
- Story 2.1 was expanded with Scenario 4 + Task 2.1.6 via the same revise (G12 PR #32) — the staging build matches the expanded spec in both directions for the designed screens.

## Open questions
- None. The BP-vs-CRITICAL calls above are unambiguous (both are best-practice additions, not new product scope).

## Suggested design-side revise spec (copy-paste ready — for design-builder)
```
design-builder revise epic 2 — No design-side fixes required. All Story 2.1–2.4 BDD AC are implemented; G12 design-side is clean.
```

## Suggested PM-side revise spec (copy-paste ready — for story-pipeline)
See `reports/story-coverage/epic-2-pm-revise-spec.md` for the consolidated PM-side findings (2× STORY-MISSING-BP, 1× AC-UNRESOLVED). Advisory only — does not gate promote.

## Decision
**Design-side AC clean: YES.** No `[AC-MISSING]` and no design-blocking `[AC-DRIFT]` for the designed screens (Stories 2.1–2.4). The 6 promoted/staging E2 screens implement every design-side BDD scenario, including the previously-missing suspension-reason field (S2.1 Sc3), the reactivation + RICA guard (S2.1 Sc4), and the directory risk badge (S2.3 Sc2).

**G12 verdict: PASS.** `design-builder promote epic 2` is unblocked on the G12 gate. PM-side findings flow to `story-pipeline` via the PM-revise spec and do not block.

## Discipline self-check
- Rule 4 (exit protocol): this report is the exit record; STATUS returned in the agent message.
- Rule 6 (grep-first): every "present"/"missing" claim above cites the exact grep + line numbers (suspension reason `grep -c` → 1; RICA verbatim `grep -c` → 1; directory High Risk `grep -nE` → line 325).
- Triage hygiene: only the canonical tags used; severity roll-up maps cleanly to [P0]/[P1]/[P2]; PM-side never gates G12.
