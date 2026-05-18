# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Updated:** 2026-05-18 — reflects the post-PR-#16 pipeline (G10 + G12 gates, four active agents, `design-builder` Phase 6.5 sync-kit, PM contract loop). For day-to-day "what's shipped / in flight / deferred," **read [`ROADMAP.md`](./ROADMAP.md)** — it is the canonical living tracker and is updated every meaningful PR.

---

## What This Repo Is

`flow-ui` is the **design source of truth** for **AgriFlow Rwanda** ("Operation Harvest") — a B2B fresh produce distribution platform that solves Rwanda's ~40% post-harvest food loss through a Service-Based Retail (SBR) model. AgriFlow retains stock ownership until the final sale, removing operational burden from retail partners and replacing informal supply chains with a ledger-based digital twin.

This repo contains no application code — static HTML prototypes only (Tailwind via CDN, no TypeScript, no React, no build step). Its job is to define components, screens, and the design language, then promote signed-off work into the **design-system bundle** (`ui-flow/agriflow-rwanda-design-system/`) — the single source `flow-fe` and other agents read from. Figma push is a separate, opt-in mirror.

## Pipeline at a glance

```
_pm-plan/docs/stories/         ← THE CONTRACT (BDD scenarios, AC, tasks)
       │
       ▼  design-builder reads
ui-flow/e{N}-*/                ← STAGING HTML (iterative, the build)
       │  Phase 5.5 auto-lint runs after every write
       │  Optional autopilot loop (Phase 7) auto-revises mechanical findings
       │
       ▼  must pass G10 (design-linter) + G12 (story-coverage-auditor)
       │
       ▼  design-builder promote epic N
ui-flow/.../screens/           ← PROMOTED SCREENS (single source for flow-fe + other agents)
       │
       ▼  design-builder sync-kit epic N (Phase 6.5 — one-way HTML→JSX mirror)
ui-flow/.../agriflow-app/*.jsx ← VISUAL-REVIEW SPA (downstream, refreshed after promote)
```

**FE engineers, other agents, and external reviewers consume the design-system zone only.** Staging is the workshop. The JSX kit is downstream visual-review only — never a contract.

For the full pipeline contract see [`.claude/rules/prototypes.md`](./.claude/rules/prototypes.md) (promotion gates) and [`.claude/agents/MANIFEST.md`](./.claude/agents/MANIFEST.md) (agent roster + diagram).

**Related repos:**
| Repo | Role |
|---|---|
| `../flow-fe` | Production Next.js 16 frontend — implements what is designed here |
| `../flow-be` | NestJS backend (modular monolith) |
| `../_pm-plan` | PRD, epics, user stories (Jira FL project). Stories at `_pm-plan/docs/stories/story.N.M/` are the **product contract** that G12 enforces. PM agent: `_pm-plan/.claude/agents/story-pipeline.md` |
| `../strategic_plan` | 5-year business strategy |

---

## Agents in this repo

The full roster + spawning conventions live in [`.claude/agents/MANIFEST.md`](./.claude/agents/MANIFEST.md) — read it before invoking any of the agents below.

| Agent | Role | Trigger | Gate |
|---|---|---|---|
| [`design-builder`](./.claude/agents/design-builder.md) | Writes staging prototypes, applies revisions, runs the **autopilot** loop on mechanical findings (Phase 7), promotes to design system (Phase 6), **syncs the JSX kit after promote** (Phase 6.5), opt-in Figma push (Phase 4) | `design-builder epic N` / `story N.M` / `revise … — spec` / `autopilot …` / `promote …` / `sync-kit …` / `push …` | (produces; runs G1–G10 + G12 at promote) |
| [`design-linter`](./.claude/agents/design-linter.md) | Grep-based mechanical contract linter; tags findings `[P0]/[P1]/[P2]`; writes per-file reports to `reports/ux/`. Implemented by the shared script [`.claude/scripts/lint-prototypes.sh`](./.claude/scripts/lint-prototypes.sh) (single source of truth for all 24 gates). | `design-linter review epic N` / `review story N.M` / `review <path>` / `review all` | **G10** (`P0: 0  P1: 0`) |
| [`story-coverage-auditor`](./.claude/agents/story-coverage-auditor.md) | **Bidirectional** PM↔build inspector. Diffs `_pm-plan/docs/stories/story.N.M/user-story-N.M.md` BDD scenarios against staging HTML. Design-side findings (`[AC-MISSING]`) block promote; PM-side findings (`[STORY-MISSING-*]`, `[AC-UNRESOLVED]`) flow to `story-pipeline` via a separate PM-revise spec. | `story-coverage-auditor audit epic N` / `audit story N.M` / `audit <path>` / `audit all` | **G12** (`Design-side AC clean: YES`) |
| [`pr-reviewer`](./.claude/agents/pr-reviewer.md) | Reviews any GitHub PR against workspace conventions + design-system contracts. Multi-agent + confidence-scored (≥80). Posts a structured review comment via `gh pr comment`. | `pr-reviewer <PR#>` / `pr-reviewer current` | (post-merge gate; see Workflow rules below) |

**Retired:** [`design-coverage-auditor`](./.claude/agents/_retired/2026-05-17_design-coverage-auditor.md) — shipped + retired same day (2026-05-17). Its directional model was inverted: it compared the JSX kit against staging and refused promote unless they matched, treating the JSX as the contract. The kit is a downstream visual-review SPA refreshed AFTER promotion by `design-builder sync-kit` Phase 6.5 — never authoritative. G12 is the sole feature-completeness gate. Do NOT spawn this agent and do NOT reintroduce a G11-style gate without first reading the retirement callout in that file.

**SUBJECTIVE review** (judgment beyond mechanical compliance — brand feel, layout instinct) is handled by the root-level [`design-reviewer` agent](../.claude/agents/design-reviewer.md) at the monorepo root, NOT by any agent in this repo. It collects natural-language feedback and dispatches revisions via `ux-executor → design-builder revise`.

---

## Promote gates (what the pipeline enforces)

A staging file may be promoted into the design-system zone only if both mechanical gates pass. See [`.claude/rules/prototypes.md`](./.claude/rules/prototypes.md) "Promotion gates" for the full G1–G9 mechanical checks plus G10 and G12.

| Gate | Source | Catches | Summary-line grep |
|---|---|---|---|
| **G10** | `design-linter` → `reports/ux/<file-stem>-review.md` | Contract drift (token usage, h-10 controls, modal split, status-pill tones, multi-hue role pills, etc.) | `^**P0: 0  P1: 0` |
| **G12** | `story-coverage-auditor` → `reports/story-coverage/epic-N-story-coverage.md` | PM contract drift (story BDD scenarios not implemented; bidirectional — surfaces orphan work for PM via separate `epic-N-pm-revise-spec.md`) | `^**Design-side AC clean:** YES` |

A file can pass G10 and fail G12 (clean tokens, missing AC behavior) or pass G12 and fail G10 (every AC implemented, `bg-yellow-100` swatches everywhere). Both must pass before `design-builder promote` will land it.

The lint script — [`.claude/scripts/lint-prototypes.sh`](./.claude/scripts/lint-prototypes.sh) — is the canonical implementation of all 24 gates. Both `design-linter` and `design-builder` Phase 5.5 call it. If you change a gate definition, update the script AND the corresponding Phase 1 table in `design-linter.md` in lockstep; drift between the two is a discipline violation.

---

## Workflow rules (locked 2026-05-17 onwards)

These apply to every PR in this repo and to every agent that ships code or rule changes. Full text in the monorepo-root rule [`./.claude/rules/story-discipline.md`](../.claude/rules/story-discipline.md) (when merged) and in per-session memory notes.

1. **Push needs local approval first.** After a local commit, do NOT `git push` until the founder has explicitly said "push it" (or equivalent). Show the diff first; wait for confirmation.
2. **PRs wait for CI + review before merge.** No chained `gh pr create` → `gh pr merge`. Wait for CI workflows to finish AND for `pr-reviewer` (or the founder) to post a structured review. Only then merge on explicit founder approval.
3. **Story Done = all AC + all tasks pass.** A story is complete only when every BDD scenario / checklist item AND every `task-N.M.K.md` file passes. No partial credit. Inspectors must emit `STATUS: PARTIAL` (not `COMPLETE`) when any AC fails.
4. **Implementation discoveries flow back to PM.** When an executor finds a missing task, missing feature, UX best-practice addition, or scope-creep flow during implementation, surface it in a `## Discoveries for PM` section in the exit report. Founder relays to `story-pipeline`. Never absorb silently into the current PR. (G12 enforces this for design; the workspace rule generalizes to BE/FE.)
5. **JSX kit is downstream, never a contract.** The PM story is the contract (G12). The JSX UI kit (`ui_kits/agriflow-app/*.jsx`) is a visual-review SPA refreshed by `design-builder sync-kit` Phase 6.5 AFTER successful promote. Do NOT diff staging against the kit and treat the kit as authoritative.

---

## Figma Setup

### Access the Design File

**File:** FLow-UI/UX Design System
**File Key:** `dAgFxdPwQDFNYgUGAO6RKt`

**Direct Link:**
```
https://www.figma.com/file/dAgFxdPwQDFNYgUGAO6RKt/Flow-UI
```

### Install Figma

From root project dev-setup:
```bash
cd dev-setup
bash setup.sh --tool figma        # Desktop app
bash setup.sh --tool figma-cli    # CLI tools
```

### Quick Start

1. **Sign in:** Create or use existing Figma account at figma.com
2. **Open file:** Use link above or search "Flow-UI" in Figma
3. **Request access:** Ask design lead to add you to AgriFlow team
4. **Explore:** Review Design Tokens, Components, and Epic pages

### Figma MCP Integration

Claude Code can fetch Figma metadata and screenshots via MCP:

```bash
# When in flow-ui directory, Claude can:
# - Get design metadata for all pages
# - Extract design variables and tokens
# - Generate design context for implementation
# - Fetch component screenshots
```

See `docs/figma-mcp-guide.md` for detailed MCP usage.

## Previewing Files

```bash
# Run from the flow-ui repo root — required for relative paths to resolve
python3 -m http.server 8899

# --- DESIGN SYSTEM (promoted, read-only — what FE and other agents reference) ---
# http://localhost:8899/ui-flow/agriflow-rwanda-design-system/project/preview/index.html
# http://localhost:8899/ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/index.html
# Promoted screens (one file per row, listed in SCREENS-INDEX.md):
# http://localhost:8899/ui-flow/agriflow-rwanda-design-system/project/screens/<file>.html

# --- STAGING (drafts — design-builder writes here; may iterate / fail lint) ---
# http://localhost:8899/ui-flow/e2-partners-supplier-ecosystem/e2-supplier-directory.html  → desktop reference
# http://localhost:8899/ui-flow/e1-identity-access-management/e1-edit-user.html            → slide-over modal reference
# http://localhost:8899/ui-flow/e1-identity-access-management/e1-deactivate-user.html      → centered modal reference

# --- ANCILLARY ---
# http://localhost:8899/ui-flow/flow-design.html  → legacy sidebar/nav prototype
# http://localhost:8899/color-palette.html        → design-token palette

# Figma push is opt-in — see "Pushing Designs to Figma" below for the manual trigger
```

---

## Pushing Designs to Figma (manual, opt-in)

**Target file:** FLow-UI/UX (`fileKey: dAgFxdPwQDFNYgUGAO6RKt`)

Pushing a prototype into Figma is **never automatic**. The `design-builder` agent's default flow stops after the HTML files are written and verified — you decide when (and whether) to push. Eyeball the prototype in a browser first; push only when the build is ready to share.

Every prototype already embeds the capture script (the script no-ops unless the URL carries `#figmacapture=…` hash params, so it is safe to keep in the file):

```html
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
```

**Trigger via the agent (preferred):**

```bash
design-builder push epic 2                               # push every Epic 2 prototype
design-builder push story 2.1                            # push one story's prototype
design-builder push ui-flow/e2-…/e2-supplier-profile.html  # push one named file
design-builder epic 2 --push                             # build AND push (rare — explicit opt-in)
```

**Trigger by hand (no agent):**

1. `cd flow-ui && python3 -m http.server 8899`
2. Generate a capture ID via the Figma MCP tool (`outputMode: "existingFile"`, `fileKey: dAgFxdPwQDFNYgUGAO6RKt`)
3. Open `http://localhost:8899/ui-flow/e{N}-<slug>/<file>.html#figmacapture=<id>&figmaendpoint=<endpoint>&figmadelay=1500&figmaselector=body`
4. Poll the captureId until status is `completed`
5. Stop the server: `lsof -ti:8899 | xargs kill -9`

Use `figmaselector` to target specific components (e.g. `aside` for the sidebar alone, `body` for the full page).

---

## Design System

AgriFlow's identity is rooted in agriculture and operational trust — the green communicates freshness and reliability, not decoration.

**The design contract lives in three files, in this order of authority:**

1. `flow-ui/tokens/colors_and_type.css` — token values (HSL layer + hex aliases). Single source of truth.
2. `flow-ui/.claude/rules/tokens.md` — token → utility mapping and semantic usage.
3. `flow-ui/.claude/rules/prototypes.md` — HTML scaffold + every locked structural pattern.

Do **not** restate token values here — they drift. If you need a quick reference, see `flow-ui/.claude/rules/README.md` for the canonical-pattern checklist.

### What `flow-fe` (and other implementing agents) reads

**`flow-fe` implements from the gated promoted HTML at `ui-flow/agriflow-rwanda-design-system/project/screens/*.html`** — produced by `design-builder promote …` after both **G10** (`design-linter` → `P0: 0  P1: 0`) and **G12** (`story-coverage-auditor` → `Design-side AC clean: YES`) sign off. Catalog: `screens/SCREENS-INDEX.md`.

**The `.jsx` files in the same bundle (`ui_kits/agriflow-app/*.jsx`) are visual review only — and refreshed by `design-builder sync-kit` (Phase 6.5) AFTER each promote.** The kit is downstream: HTML→JSX, never reverse. JSX files hardcode hex literals, ship legacy fonts (Nunito / Fraunces), and bake in `inked` / `field` surfaces that production does not ship — these are intentional JSX-only divergences, not contracts. Do not extract behavior from the kit; do not diff staging against the kit and treat the kit as authoritative (that was G11's mistake — see the [retired-agent callout](./.claude/agents/_retired/2026-05-17_design-coverage-auditor.md)). See `ui_kits/agriflow-app/README.md` for the full rationale.

### Canonical pattern (summary — full rules in `prototypes.md`)

- **Tokens linked, never inlined.** Prototypes `<link>` `tokens/colors_and_type.css`. No `<style>:root>…</style>` blocks.
- **Sidebar 270 px** with `shadow-sidebar`. Active leaf: `bg-accent text-primary font-semibold` (no `bg-primary` fill). Active parent (has submenu): `text-primary font-semibold` only.
- **Header band is breadcrumb-only** — no title, search, bell, or action buttons. Page title + primary action live in the content area.
- **All inputs / selects / buttons are `h-10`.** Login primary CTA is the only `h-11`.
- **Role pills single-hue brand** (`bg-accent text-accent-foreground`). Multi-hue Admin/Manager/Picker/Driver/Finance retired 2026-05-15.
- **Status pills are tone-mapped pairs** (`bg-success-bg text-success`, `bg-warning-bg text-warning`, `bg-danger-bg text-danger`, `bg-info-bg text-info`). QUARANTINE / FAILED QC use the **danger tone pair** uppercase-bold — never solid `bg-destructive`.
- **Tables:** Title-Case headers, row hover `var(--bg-tint)`, right-aligned last data column, 44 px Actions column with no visible label.
- **Modals:** centered `max-w-[480px]` for confirmations; slide-over `w-[480px]` for multi-field forms. Both carry the audit-log rail when an action writes `audit_logs`.
- **No stock Tailwind colors** (`bg-yellow-100`, `text-blue-700`, etc.). Use the semantic tone pairs.
- **5-state coverage** per screen: default, loading, empty, error, success (+ domain states: quarantine, offline, suspended, deactivated).

### Typography

- Font: Inter (400, 500, 600, 700).
- Page title (content area): `text-xl font-semibold text-foreground` (20 px Semibold). 24 px Bold reserved for top-level dashboard headers only.
- Section eyebrows: `text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground`.
- Nav items: `text-[13.5px] font-medium`. Submenu items: `text-[12.8px] font-normal`.
- Use the six-level text ramp (`text-fg-1` … `text-fg-6`); don't invent gray utilities.

---

## Quality Standards — Design System

**Priority: design quality and fidelity over speed of prototype creation.** Every prototype is the contract that the frontend implements — inaccurate prototypes produce inaccurate implementations.

1. **Pixel-perfect prototypes.** Every spacing, color, and typography choice must use the design token system. No approximations. If it looks "close enough" in the prototype but uses hardcoded values, it will diverge in production.
2. **Accessibility in design, not just code.** Sufficient contrast ratios (4.5:1 minimum). Touch targets of 44x44px minimum for mobile screens. Clear focus states. Error states that don't rely on color alone (use icons + text).
3. **Responsive testing is mandatory.** Test every prototype at 375px (mobile), 768px (tablet), and 1024px (desktop) — view in a browser at `localhost:8899` (see "Previewing Files" below). Warehouse and driver screens (E4, E7) must be mobile-first. Figma push is a separate, opt-in mirror — not part of the test loop.
4. **Design for real data.** Use realistic Rwandan names, realistic produce quantities (in KG), realistic RWF prices. "Lorem ipsum" and "Test User" hide layout problems that real data exposes.
5. **State completeness.** Every screen must show: default state, loading state, empty state, error state, and success state. A screen that only shows the happy path is an incomplete design.
6. **Design tokens are the contract.** The canonical source is [`tokens/colors_and_type.css`](./tokens/colors_and_type.css) in this repo — both an HSL layer (Tailwind utilities) and hex aliases. `flow-fe` mirrors it in `globals.css` + `tailwind.config.ts`; Figma mirrors it in its variables panel. **One source (here), two mirrors.** Never inline `:root` blocks in prototypes — `<link>` the canonical file.

---

## Product Scope — Screens to Design

The design system must cover all 9 Phase 1 epics. Use the personas and constraints below to inform every screen.

### Epics & Key Screens

| Epic | Jira | Key Screens |
|---|---|---|
| **1. IAM** | FL-4 | Login, role management, audit log viewer |
| **2. Partners & Suppliers** | FL-5 | Supplier list, supplier profile, scorecard, contract upload |
| **3. Product Catalog** | FL-6 | SKU list, SKU detail (storage type, shelf-life), category management |
| **4. Receiving & QC** | FL-7 | Mobile QC inspection form, batch traceability ID, photo capture, quarantine routing |
| **5. Inventory Ledger** | FL-8 | Real-time stock dashboard, FIFO ledger view, expiry alerts |
| **6. B2B Orders** | FL-9 | Order portal, picking list, invoice generation |
| **7. Logistics & Delivery** | FL-10 | Driver mobile app, PoD capture, GPS drop-off confirmation |
| **8. Consignment & Retail** | FL-11 | Consignment tracker per store, daily sales log, settlement invoice |
| **9. Loss & Compliance** | FL-12 | Loss dashboard, temperature log viewer, FDA Audit Mode export |

### Personas & Design Priorities

| Persona | Interface | Priority |
|---|---|---|
| **Operations Manager / Admin** | Desktop-first, data-dense, full sidebar nav | Analytics, compliance, team management |
| **Retailer / Supermarket Manager** | Desktop or tablet | Order placement, sales reporting, consignment status |
| **Warehouse QC Clerk & Picker** | **Mobile-first**, large tap targets, offline-capable | QC form, picking list, barcode scan feedback |
| **Logistics / Delivery Driver** | **Mobile-first**, offline-first (8hr min), minimal UI | PoD capture, GPS confirm, delivery list |
| **Farmer / Supplier** | Desktop or mobile | Onboarding form, scorecard view |

### Critical UI Constraints (from PRD)

These constraints must be reflected visually in designs, not just in code:

- **QC rejection always requires photo + reason code** — the form must make these mandatory and visually prominent
- **QUARANTINE state** must be visually distinct from normal inventory states — use the **danger tone pair** (`bg-danger-bg text-danger`, uppercase, bold). Solid `bg-destructive` is reserved for irreversible destructive CTAs (Deactivate, Delete), not status indicators.
- **FIFO indicators** — expiry dates must be visible on all batch/inventory cards; near-expiry items need a warning state
- **Offline mode** — warehouse and driver screens must include an offline indicator and a sync status badge
- **Audit trail** — any action that writes to the audit log should have visible confirmation (toast/badge)
- **FDA Audit Mode** — compliance screens need a clear "Export" action with date range selector

---

## Sidebar Navigation

The **current** sidebar lives inside each promoted screen at `ui-flow/agriflow-rwanda-design-system/project/screens/*.html` (and is mirrored in the JSX kit at `Sidebar.jsx` for the visual-review SPA). It maps to `../flow-fe/src/app/(dashboard)/` — keep both in sync.

The legacy nav prototype at `ui-flow/flow-design.html` predates the current pipeline; preserve it for archival reference but **do not edit it as the source of nav truth** — promoted screens are the contract.

Approximate structure (from current promoted screens):

```
Main
  Dashboard → Executive, Operations, Sales, Inventory, Logistics
  Orders (badge: unread count)
  Products
  Partners → List, Stores, Performance
  Suppliers → List, Purchase, Performance

Operations
  Inventory → Stock, Intake, Expiry & Waste, Storage
  Logistics → Planning, Execution, Fleet
  Users

Analytics
  Finance → Revenue, Payments, Reports
  Reports → Sales, Inventory, Waste
  Settings
```

---

## File Structure

```
flow-ui/
├── CLAUDE.md                                     # This file
├── ROADMAP.md                                    # Canonical living tracker (shipped/in flight/deferred)
├── color-palette.html                            # Full design-token palette reference
│
├── tokens/                                       # CANONICAL design-token source of truth
│   ├── colors_and_type.css                       # HSL layer + hex aliases (shadcn-compatible)
│   └── fonts/fonts.css
│
├── docs/
│   └── figma-mcp-guide.md                        # Figma MCP integration guide
│
├── feedback/                                     # Long-form design-audit notes (manual; rare)
│
├── .claude/
│   ├── agents/                                   # 4 active + 1 retired (see "Agents in this repo")
│   │   ├── MANIFEST.md                           # Canonical roster + pipeline diagram
│   │   ├── design-builder.md                     # Builds / revises / autopilots / promotes / sync-kits / pushes
│   │   ├── design-linter.md                      # G10 grep-based contract linter
│   │   ├── story-coverage-auditor.md             # G12 bidirectional PM↔build inspector
│   │   ├── pr-reviewer.md                        # Post-PR multi-agent review
│   │   └── _retired/
│   │       └── 2026-05-17_design-coverage-auditor.md   # Audit trail only — do NOT spawn
│   ├── rules/
│   │   ├── README.md                             # Pipeline overview + canonical-pattern checklist
│   │   ├── prototypes.md                         # HTML scaffold + locked structural patterns + G1–G12 gates
│   │   └── tokens.md                             # Token → utility mapping
│   └── scripts/
│       └── lint-prototypes.sh                    # Canonical implementation of all 24 gates (G10 + G1–G9)
│
└── ui-flow/
    ├── flow-design.html                          # Legacy nav prototype — preserved, not the source of nav truth
    │
    │  ── STAGING (drafts — design-builder writes here; iterative; NOT load-bearing) ──
    ├── e1-identity-access-management/            # 14 files (E1: IAM)
    │   ├── e1-login.html, e1-password-reset.html, e1-account-activation.html
    │   ├── e1-user-list.html, e1-user-management.html, e1-edit-user.html, e1-deactivate-user.html
    │   ├── e1-role-management.html, e1-create-role.html, e1-edit-role.html
    │   ├── e1-user-permissions.html, e1-edit-permissions.html
    │   ├── e1-audit-log-viewer.html
    │   └── e1-access-denied.html
    ├── e2-partners-supplier-ecosystem/           # 6 files (E2: Partners & Suppliers)
    │   ├── e2-supplier-directory.html, e2-supplier-registration.html, e2-supplier-profile.html
    │   ├── e2-supplier-scorecard.html, e2-supplier-price-book.html, e2-supplier-documents.html
    ├── ui-examples/                              # Screenshot references / design mockups (read-only inputs)
    │
    │  ── DESIGN SYSTEM (promoted, single source of truth for flow-fe + other agents) ──
    └── agriflow-rwanda-design-system/
        ├── README.md                             # Handoff guide for coding agents
        ├── chats/                                # Original design-chat transcripts
        └── project/
            ├── colors_and_type.css               # Bundle's local token mirror (synced with tokens/colors_and_type.css)
            ├── preview/                          # Component-level demos
            ├── screenshots/
            └── ui_kits/agriflow-app/
                ├── index.html                    # SPA preview entry
                ├── screens/                      # ← 20 promoted screens land here (E1: 14, E2: 6)
                │   ├── SCREENS-INDEX.md          # Catalog (one row per promotion)
                │   └── <screen-slug>.html        # Flat naming (no e{N}- prefix)
                ├── *.jsx                         # Visual-review SPA — refreshed by `design-builder sync-kit`
                │                                 #   after each promote; hardcodes hex / Nunito-Fraunces
                │                                 #   by design (visual-only, NOT a contract)
                └── README.md                     # JSX-kit caveats — READ FIRST before treating .jsx as source
```

### Where files go

- **New / draft prototypes:** `ui-flow/e{N}-<epic-slug>/e{N}-<screen-slug>.html` — `design-builder` writes here on every build (`epic N`, `story N.M`, `revise …`).
- **Signed-off prototypes:** promoted via `design-builder promote …`, which runs G1–G10 + G12 and copies into `ui-flow/agriflow-rwanda-design-system/project/screens/<screen-slug>.html` (flat naming).
- **JSX visual-review kit:** refreshed by `design-builder sync-kit …` (Phase 6.5) AFTER promote — strictly HTML→JSX, one-way.
- **FE / other-agent consumption:** read only from the design-system `screens/*.html` zone. Staging is internal workshop space; the JSX kit is visual review only.
