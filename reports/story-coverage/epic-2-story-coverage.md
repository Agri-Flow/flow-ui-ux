# Story Coverage Audit — Epic 2 (Partners & Supplier Ecosystem, FL-5)

**Audited stories:** user-story-2.1.md, user-story-2.2.md, user-story-2.3.md, user-story-2.4.md, user-story-2.5.md, user-story-2.6.md, user-story-2.7.md
**Audited staging/promoted files:** supplier-directory.html, supplier-registration.html, supplier-profile.html, supplier-scorecard.html, supplier-price-book.html, supplier-documents.html (promoted: `flow-ui/ui-flow/agriflow-rwanda-design-system/project/screens/`)
**Audited on:** 2026-06-27
**Auditor:** `story-coverage-auditor`

## Summary
**[AC-MISSING]: 1   [AC-UNRESOLVED]: 7   [STORY-MISSING-CRITICAL]: 2   [STORY-MISSING-BP]: 6   [AC-DRIFT]: 4**
**Design-side severity:** P0: 1 (AC-MISSING)   P1: 0 (no G12-blocking AC-DRIFT)   P2: 0
**PM-side severity:** P0: 2 (STORY-MISSING-CRITICAL)   P1: 7 (AC-UNRESOLVED) + 4 (non-blocking AC-DRIFT)   P2: 6 (STORY-MISSING-BP)
**Design-side AC clean:** NO   (1 AC-MISSING on Story 2.1 Scenario 3 — see breakdown below)
**PM-side AC clean:** NO    (advisory only — does not block G12)

### Per-AC breakdown (Design-side, the G12 gate inputs)

| Story | Status | Scenario | Built? | Verdict |
|---|---|---|---|---|
| 2.1 | To Do | Sc1 Register supplier (name/contact/location/bank, appears in directory) | YES | OK |
| 2.1 | To Do | Sc2 Contract upload (S3, pre-signed 1-hr link, view) | YES | OK |
| 2.1 | To Do | **Sc3 Suspend with MANDATORY reason note** | **PARTIAL** | **[AC-MISSING]** — suspend modal has no reason input |
| 2.2 | Draft | Sc1/Sc2/Sc3 (map product, dup-detect, price-book table) | YES | OK (story is Draft — informational) |
| 2.3 | To Do | Sc1 metrics / Sc2 high-risk+badge / Sc3 no-data | YES | OK (all 3 states present) |
| 2.4 | To Do | Sidebar-infrastructure (structural/token-level) | n/a | OK — no screen-behavior AC (expected per task brief) |
| 2.5 | To Do | Partner Operations dashboard (`/partners/operations`) | NO prototype | [AC-DRIFT] — no prototype built; route feature not yet designed |
| 2.6 | To Do | Supplier Delivery Schedule (`/suppliers/schedule`) | NO prototype | [AC-DRIFT] — no prototype built; route feature not yet designed |
| 2.7 | To Do | Supplier Transaction History (`/suppliers/history`) | NO prototype | [AC-DRIFT] — no prototype built; route feature not yet designed |

---

## Design-side findings (block promote — design-builder must fix)

### [AC-MISSING] — story AC unimplemented in staging  →  P0
- [AC-MISSING] Story 2.1 Scenario 3 — the Suspend confirmation modal does not capture the **mandatory suspension reason note** the AC requires.
  Story evidence: `_pm-plan/docs/stories/story.2.1/user-story-2.1.md:38` — "When they toggle `is_active: false` **with a mandatory suspension reason note**"
  Staging proof: `supplier-profile.html` suspend modal (lines 411–462) contains supplier-info card + impact callout + audit rail + Cancel/Suspend buttons, but **no `<textarea>` / reason input**. The reason string ("RICA certification expired") appears only in the *post-suspension display banner* (line 556) — it is shown, never collected. `grep -iE '<textarea|reason for suspen|mandatory' supplier-profile.html` within the suspend modal → 0.
  Fix: Add a required reason field (textarea or reason-code select + optional note) to the suspend confirmation modal, with client-side "required" validation gating the Suspend button. Mirror the centered-confirmation-modal pattern (icon → title → subtitle → reason field → footer + audit rail).

### [AC-DRIFT] — references/locked-decision conflict (design-blocking)  →  P1
- [OK] None design-blocking. The three To-Do routes with no prototype (2.5/2.6/2.7) are reported as non-blocking AC-DRIFT in the PM-side section — none is referenced by a Done/InProgress story citing a *built* file, so per the tag rule they do not block G12.

---

## PM-side findings (advisory for design — story-pipeline must fix)

### [STORY-MISSING-CRITICAL] — built work no story specifies  →  P0 (PM)
- [STORY-MISSING-CRITICAL] `supplier-profile.html` — a full **Reactivate supplier** flow is built (confirmation modal + RICA-renewal guard) but no E2 story AC covers reactivation.
  Staging evidence: `supplier-profile.html:469-508` — "Reactivate Uwimana Farms?" modal; `:569` — "Supplier must renew their RICA certification before reactivation."
  Story proof: `grep -rin 'reactivat' _pm-plan/docs/stories/story.2.*/user-story-*.md` → 0 (across all 7 E2 stories). Story 2.1 Scenario 3 covers suspension only; the inverse (reactivation) and its RICA-renewal precondition are unspecified.
  Fix for PM: Add a "Reactivating a suspended supplier" scenario to Story 2.1 §4, including the RICA-expiry guard (cannot reactivate while RICA cert is expired) and the audit-log write.

- [STORY-MISSING-CRITICAL] `supplier-registration.html` / `supplier-profile.html` — a **RICA certification** concept is built (RICA cert-number field on registration `placeholder="RICA-2024-XXXXX"`; RICA-expired risk badge; RICA-expiry blocks reactivation) but no E2 story AC mentions capturing or tracking RICA certification.
  Staging evidence: `supplier-registration.html` RICA field; `supplier-profile.html:556,569` RICA expiry references.
  Story proof: `grep -rin 'RICA' _pm-plan/docs/stories/story.2.*/user-story-*.md` → 0. (RICA compliance IS named in `_pm-plan/CLAUDE.md` as an E2 expectation, but no story AC operationalizes it.)
  Fix for PM: Add AC to Story 2.1 (or a new story) covering RICA cert-number capture at onboarding, expiry tracking, the "RICA Expired" danger badge, and its effect on supplier usability.

### [STORY-MISSING-BP] — UI/UX best-practice additions (informational)  →  P2 (PM)
- [STORY-MISSING-BP] `supplier-directory.html` — empty state ("no suppliers match filters — CTA to register") + loading skeletons. No story AC mandates these.
  Fix for PM: add an explicit empty-state + loading AC to Story 2.1.
- [STORY-MISSING-BP] `supplier-registration.html` — `filled-valid` and `error` (validation) form states. No AC specifies inline validation rendering.
  Fix for PM: add a validation-error-state AC to Story 2.1.
- [STORY-MISSING-BP] `supplier-documents.html` — empty, loading, and S3-error states + Upload slide-over. (S3-error partially traces to Story 2.1 §6 edge case; empty/loading do not.)
  Fix for PM: add empty/loading-state AC to Story 2.1 documents scope.
- [STORY-MISSING-BP] `supplier-price-book.html` — empty state, loading skeleton, and "suspended supplier — Add Mapping disabled" state. (The disabled-when-suspended behavior traces to Story 2.2 §6 edge case; empty/loading do not.)
  Fix for PM: add empty/loading-state AC to Story 2.2.
- [STORY-MISSING-BP] `supplier-scorecard.html` — `low-confidence` state (traces to Story 2.3 §6 edge case — already specified, OK), plus `loading skeleton` and `no rejections recorded` states (not in AC).
  Fix for PM: add loading-skeleton + no-rejections-state AC to Story 2.3.
- [STORY-MISSING-BP] `supplier-profile.html` — `suspended` page state (banners + disabled actions). Partially implied by Story 2.1 Sc3 ("hidden from workflows"); the on-profile banner + disabled-action treatment is a BP addition.
  Fix for PM: add a "suspended supplier profile view" AC to Story 2.1.

### [AC-UNRESOLVED] — story has unanswered PM questions  →  P1 (PM)
- [AC-UNRESOLVED] Story 2.1 §8 — "Should a contract document be mandatory before a supplier is usable in receiving?" + "Do we need a Maker/Checker approval workflow for registration?" (2 open questions; the build assumes optional contract + autonomous registration.)
- [AC-UNRESOLVED] Story 2.2 §8 — 3 open questions (mandatory contract upload for price mapping; historical pricing log vs overwrite; Maker/Checker for price changes). Story is also `Status: Draft`.
- [AC-UNRESOLVED] Story 2.3 §8 — 2 open questions (automated notification on 20% threshold; supplier-facing scorecard visibility).
- [AC-UNRESOLVED] Story 2.5 §9 — 5 PM ASSUMPTIONs (Partners-vs-Suppliers entity; Sprint-2 data availability; "all partners" vs "today's active"; delivery-status model; D-016/2.4.4 pairing).
- [AC-UNRESOLVED] Story 2.6 §9 — 5 PM ASSUMPTIONs (PO workflow; who confirms a delivery; calendar vs list; supplier portal; D-016 follow-up).
- [AC-UNRESOLVED] Story 2.7 §9 — 5 PM ASSUMPTIONs (event taxonomy; history-vs-scorecard boundary; event-sourcing approach; FDA export fields; D-016 follow-up).
- [AC-UNRESOLVED] Story 2.3 — full scorecard data depends on Epic 4 (Smart Receiving), which is unbuilt; Sprint 2 ships a stub per the story. The prototype satisfies all screen-behavior AC, so this is informational, not a design defect.

### [AC-DRIFT] — references / not-yet-built routes  →  P1 (PM-side, non-blocking)
- [AC-DRIFT] Story 2.5 (`/partners/operations`) — story has 5 full screen-behavior scenarios and a "Design HTML prototype" task (2.5.3), but **no prototype exists** in staging or promoted screens. `find ui-flow -iname '*operations*'` → 0. Whole route feature not yet designed/built (authored 2026-06-27 from D-016).
- [AC-DRIFT] Story 2.6 (`/suppliers/schedule`) — 5 scenarios + task 2.6.3 prototype, **no prototype exists**. `find ui-flow -iname '*schedule*'` → 0.
- [AC-DRIFT] Story 2.7 (`/suppliers/history`) — 6 scenarios + task 2.7.3 prototype, **no prototype exists**. `find ui-flow -iname '*history*'` → 0.
- [AC-DRIFT] Story 2.2 UI References table cites only `e2-supplier-price-book.html`, but its Sc1/Sc2 (add/duplicate mapping) and the broader supplier directory it describes also live in `supplier-directory.html` / `supplier-profile.html`. Minor references-table omission; design-reviewer call (non-blocking — story is Draft).

## Notable observations
- **Story-status mix:** 2.1/2.3/2.4/2.5/2.6/2.7 = `To Do`; 2.2 = `Draft`. Per the tag rules, 2.2's AC are informational only (story still being authored) and 2.2's coverage is reported but does not block. The 6 supplier screens are already **promoted** while their stories are still `To Do` — the build is ahead of the story lifecycle, which is why the PM-side findings exist.
- **2.5/2.6/2.7 are same-day (2026-06-27) D-016 spin-out stories** documenting future routes. Treating their unbuilt prototypes as 16 individual AC-MISSING findings would be noise (the whole sub-feature is unbuilt, per the "entire feature not built yet" skip rule). They are consolidated as 3 non-blocking AC-DRIFT entries instead. These routes also appear on the memory "Unfinished in design — Partners screens (sidebar nav only)" exemption list.
- **2.4 is sidebar-infrastructure** — its AC are structural/token-level (canonical sidebar block, consistency gate, D-016 hold-out), not screen-behavior. As expected per the task brief, it produced 0 design-side AC gap findings. Correct.
- **Documents tab** is fully built (`supplier-documents.html` + promoted) — any "missing Documents tab" finding would be a false positive per the memory exemption note (retired 2026-05-17). Not flagged.

## Open questions
- Should the **Reactivate** flow and the **RICA certification** capture be folded into Story 2.1, or split into a new Story 2.8 (Supplier Lifecycle: suspend/reactivate/RICA compliance)? The build treats them as one supplier-profile surface; PM should decide ticket granularity.
- For 2.5/2.6/2.7: should the design prototypes be built this sprint (the stories are `To Do` with prototype tasks), or are the stories intentionally ahead of design? If the former, these 3 AC-DRIFT items become design-side AC-MISSING once the stories move to In Progress.

## Suggested design-side revise spec (copy-paste ready — for design-builder)
```
design-builder revise epic 2 — In supplier-profile.html, add a MANDATORY reason field to the Suspend confirmation modal (Story 2.1 Scenario 3): a required reason-code select and/or textarea between the impact callout and the footer, with the Suspend button disabled until a reason is entered. Keep the centered-confirmation-modal pattern (icon → title → subtitle → reason field → Cancel/Suspend footer + audit-log rail). The reason must be captured at suspend time, not only displayed in the post-suspension banner.
```

## Suggested PM-side revise spec (copy-paste ready — for story-pipeline)
A separate file at `reports/story-coverage/epic-2-pm-revise-spec.md` contains the consolidated PM-side findings in the format the founder relays to the `story-pipeline` agent. See that file.

## Discipline self-check
- Rule 4 (exit protocol): this report + the pm-revise spec are the exit record; STATUS returned in final message
- Rule 6 (grep-first): every finding cites story-line evidence + a staging grep (or a `find`→0 for the unbuilt routes)
- Triage hygiene: only [AC-MISSING] / [AC-UNRESOLVED] / [STORY-MISSING-CRITICAL] / [STORY-MISSING-BP] / [AC-DRIFT] / [OK] tags used; severity roll-up maps to [P0]/[P1]/[P2]
