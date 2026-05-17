# flow-ui Roadmap

**Canonical living tracker** for the design-system pipeline and the screens it produces. If you want to know "what's done, what's next, what's deferred" — read this file. It replaces the scattered "Not in this PR" sections across past PRs and the stale plan at `~/.claude/plans/before-runing-the-design-flickering-bear.md`.

## How this file is maintained

- **Every meaningful PR updates this file** as part of its diff. Moving an item from `Deferred` → `In flight` → `Shipped` is part of the same change that ships it.
- Format is table-driven so it stays scannable.
- Cross-link to PRs by number, not URL — easier to write, GitHub auto-renders them as links.
- Dates are ISO `YYYY-MM-DD`.
- When a deferred item gets picked up, move its row to `In flight` and update the `Status / next` cell.
- When something ships, move it to `Shipped` with the PR number and merge date.
- The `pr-reviewer` agent (eventually) will flag PRs that ship a roadmap-impacting change without updating this file.

---

## Shipped

| Date | PR | What landed | Notes |
|---|---|---|---|
| 2026-05-16 | #4 | feat(iam): redesign IAM screens + full auth flow (login + reset) | Baseline before pipeline existed |
| 2026-05-17 | #5 | feat(design): staging → promotion pipeline gated by design-linter | The two-stage pipeline foundation: `design-builder`, `design-linter`, gate G10, MANIFEST.md, canonical rules, 20 promoted screens (14 E1 + 6 E2 incl. new `supplier-documents`) |
| 2026-05-17 | #6 | feat(agents): add `pr-reviewer` for PR-level review before merge | Adapts Claude canonical `/code-review` pattern (5 parallel review agents + confidence scoring ≥80) with AgriFlow `[P0]/[P1]/[P2]` triage and design-system-specific checks |
| 2026-05-17 | #7 | Claude Code GitHub App workflows | Generic `/code-review` on every PR + `@claude` mention trigger |
| 2026-05-17 | #8 | feat(ci): AgriFlow design-review workflow (path-scoped) | `claude-design-review.yml` — runs `pr-reviewer` agent only on design-sensitive paths (`.claude/**`, `tokens/**`, `ui-flow/**`, `CLAUDE.md`, `color-palette.html`) |
| 2026-05-17 | #9 | feat(agents): **Layer 1** — auto-lint after every design-builder write | `design-builder` Phase 5.5 + shared `lint-prototypes.sh` (24 gates, single source of truth). Founder no longer manually invokes the linter between cycles. |

## In flight

| PR | Title | Status | Blocker |
|---|---|---|---|
| #10 | feat(agents): **Layer 2** — autopilot loop for mechanical findings | Open, awaiting review | Founder eyeball |
| **this PR** | feat(docs): add ROADMAP.md as canonical pipeline tracker | Open | — |

## Next up (recommended order)

| # | Item | Why | Effort |
|---|---|---|---|
| 1 | **First real autopilot run** (any open epic with known mechanical violations) | Validates Layer 2 in practice before adding more abstractions | < 1 hr |
| 2 | **`design-coverage-auditor` agent** (sibling to `design-linter`) | Mechanical linter is blind to feature-coverage gaps; the kit-vs-staging audit pattern we ran twice this session caught 36 missed gaps. Make it a permanent agent. | ~1 hr |
| 3 | **PR template** at `.github/PULL_REQUEST_TEMPLATE.md` | Structures context for `pr-reviewer`; includes a "ROADMAP.md updated?" checkbox | ~15 min |
| 4 | **Branch protection on `main`** (require status checks, require review, no force-push) | Turns advisory `pr-reviewer` comments into a real merge gate | ~5 min in repo settings (founder action) |
| 5 | **Layer 3** — `chief-of-staff` design-inspector for weekly design-health roll-up | Observability across cycles (lint backlog trends, promotion debt, recurring P0s) | ~1 hr |

## Deferred

| Item | Why deferred | Next trigger |
|---|---|---|
| `pr-reviewer.md` CI-readiness fixes | The agent references monorepo-root files (`triage.md`, `agent-discipline.md`, `reports/ux/`) absent in CI's checkout. CI side-steps via design-linter pre-step. | First real CI run that shows degradation |
| Auto-promote from autopilot | Autopilot stays opt-in and never auto-promotes by design (quality > speed). | Revisit only if Layer 2 + Layer 3 prove safe across 20+ runs |
| Auto-push to Figma after promote | Figma is reference, not load-bearing; manual push works | When a teammate joins and forgets to push, causing visible drift |
| Conflict-resolution rule between the two CI reviewers (`/code-review` generic vs `pr-reviewer` AgriFlow) | Both may comment on the same PR with overlapping or contradictory advice. Currently the founder resolves manually. | When the noise becomes meaningful — count "duplicate concerns per PR" after 10 PRs |
| Metrics / observability dashboard | Premature — need 50+ PRs of history before trends are useful | After Layer 3 (design-inspector) provides weekly snapshots for a quarter |
| Watch-mode / file-watcher for design-linter | Founder doesn't need sub-second feedback; revise cycles take minutes anyway | Not foreseen |
| Onboarding doc for new contributors | Single-founder repo today | When a second contributor is about to join |
| Storybook / JS build step for prototypes | HTML-prototype level of fidelity is the right contract today | If FE asks for live-component fidelity instead of HTML |

---

## Design coverage status (which epics are promoted vs pending)

Per the 9 Phase 1 epics from `CLAUDE.md`. Status is per-epic, not per-screen — see `ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/SCREENS-INDEX.md` for the full per-screen catalog.

| Epic | Name | Staging | Promoted | Status |
|---|---|---:|---:|---|
| E1 | Identity & Access Management | 14 / 14 | 14 / 14 | ✅ Fully promoted (PR #5) |
| E2 | Partners & Supplier Ecosystem | 6 / 6 | 6 / 6 | ✅ Fully promoted (PR #5; `supplier-documents` graduated from kit placeholder) |
| E3 | Unified Product Catalog | 0 | 0 | ⏳ Not started |
| E4 | Smart Receiving & Batch Traceability | 0 | 0 | ⏳ Not started — **mobile-first** (warehouse clerk persona) |
| E5 | Ledger-Based Inventory Engine | 0 | 0 | ⏳ Not started |
| E6 | B2B Order & Fulfillment | 0 | 0 | ⏳ Not started |
| E7 | Logistics & Last-Mile Delivery | 0 | 0 | ⏳ Not started — **mobile-first** (driver persona) |
| E8 | Consignment & Retail Module | 0 | 0 | ⏳ Not started |
| E9 | Loss & Compliance Guardrail | 0 | 0 | ⏳ Not started |

**Coverage progress: 20 / ~90 screens** (rough estimate; E3–E9 screen counts will firm up as `_pm-plan` stories land).

**Epic dependency chain** (from `CLAUDE.md`): `E1 → E2 + E3 → E4 → E5 → E6 + E7 → E8 → E9`. E3 is the next natural epic to build.

---

## Cross-references

- **Pipeline orientation** (`~/.claude/projects/.../memory/project_design_pipeline.md`) — full agent + zone + gate orientation for any future agent doing design work. Now points to this ROADMAP as the canonical status tracker.
- **Locked design contracts** (`~/.claude/projects/.../memory/design-decisions-from-chats.md`) — the visual decisions the linter enforces (header rules, role pills, modals, etc.)
- **Promoted screens catalog** (`ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/SCREENS-INDEX.md`) — per-screen catalog with linter-report cross-links
- **Agents manifest** (`.claude/agents/MANIFEST.md`) — the 3 in-repo agents (`design-builder`, `design-linter`, `pr-reviewer`) and how they cooperate
- **Canonical rules** (`.claude/rules/{prototypes,tokens,README}.md`) — HTML scaffold, token mapping, promotion gates G1–G10
- **GitHub repo identity** (`~/.claude/projects/.../memory/reference_github_repo.md`) — this repo is `Agri-Flow/flow-ui-ux`; use `gh --repo Agri-Flow/flow-ui-ux`
