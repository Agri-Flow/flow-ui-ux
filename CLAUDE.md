# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Repo Is

`flow-ui` is the **design source of truth** for **AgriFlow Rwanda** ("Operation Harvest") — a B2B fresh produce distribution platform that solves Rwanda's ~40% post-harvest food loss through a Service-Based Retail (SBR) model. AgriFlow retains stock ownership until the final sale, removing operational burden from retail partners and replacing informal supply chains with a ledger-based digital twin.

This repo contains no application code. It holds HTML-based UI prototypes built with Tailwind CSS (CDN) and shadcn/ui CSS variable conventions. Its job is to define components, screens, and the design language, then promote signed-off work into the **design-system bundle** (`ui-flow/agriflow-rwanda-design-system/`) — the single source `flow-fe` and other agents read from. Figma push is a separate, opt-in mirror.

## Two-stage pipeline

```
ui-flow/e{N}-<epic-slug>/         ──┐  STAGING  (design-builder writes; iterative; not load-bearing)
                                    │
   design-builder revise + reviewer │  iterate until clean
                                    │
   design-builder promote story N.M │  ⇣  runs gating checks; refuses on any fail
                                    │
ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/
                                       PROMOTED  (read-only; consumed by FE + other agents)
```

**FE engineers, other agents, and external reviewers consume the design-system zone only.** Staging is the design workshop; its content may iterate or fail lint and is not load-bearing. See `.claude/rules/prototypes.md` "Promotion gates" for the checks every file must pass before promotion.

**Related repos:**
| Repo | Role |
|---|---|
| `../flow-fe` | Production Next.js 16 frontend — implements what is designed here |
| `../flow-be` | NestJS backend (modular monolith) |
| `../_pm-plan` | PRD, epics, user stories (Jira FL project) |
| `../strategic_plan` | 5-year business strategy |

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
# http://localhost:8899/ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/<file>.html

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

**`flow-fe` implements from the gated promoted HTML at `ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/*.html`** — produced by `design-builder promote …` after `design-linter` signs off (`P0: 0  P1: 0`). Catalog: `screens/SCREENS-INDEX.md`. (Separately, the root-level `design-reviewer` agent runs subjective / human-in-the-loop review — invoked when judgment beyond mechanical compliance is needed.)

**The `.jsx` files in the same bundle (`ui_kits/agriflow-app/*.jsx`) are visual review only.** They run via `<script type="text/babel">` in-browser, hardcode hex literals, ship legacy fonts, and bake in the `inked` / `field` surfaces that the production app does not ship. Do not treat them as an implementation contract. See `ui_kits/agriflow-app/README.md` for the full rationale.

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
3. **Responsive testing is mandatory.** Test every prototype at 375px (mobile), 768px (tablet), and 1024px (desktop) before pushing to Figma. Warehouse and driver screens (E4, E7) must be mobile-first.
4. **Design for real data.** Use realistic Rwandan names, realistic produce quantities (in KG), realistic RWF prices. "Lorem ipsum" and "Test User" hide layout problems that real data exposes.
5. **State completeness.** Every screen must show: default state, loading state, empty state, error state, and success state. A screen that only shows the happy path is an incomplete design.
6. **Design tokens are the contract.** When you define a color, spacing, or typography token, it must exist in `globals.css`, `tailwind.config.ts`, AND the Figma variables panel. Three sources, one truth.

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

## Sidebar Navigation (Current State)

The sidebar in `ui-flow/flow-design.html` maps to the app's route structure:

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

This maps to `../flow-fe/src/app/(dashboard)/` route structure — keep both in sync.

---

## File Structure

```
flow-ui/
├── CLAUDE.md
├── color-palette.html                            # Full design token palette
├── tokens/
│   ├── colors_and_type.css                       # Canonical token source of truth
│   └── fonts/fonts.css
├── .claude/
│   ├── agents/design-builder.md                  # The builder + promoter agent
│   └── rules/{README,prototypes,tokens}.md       # Design contracts + promotion gates
└── ui-flow/
    ├── flow-design.html                          # Legacy sidebar/nav prototype
    │
    │  ── STAGING (drafts — design-builder writes here) ─────────────────────
    ├── e1-identity-access-management/            # Per-epic staging folder
    │   ├── e1-login.html
    │   ├── e1-user-list.html
    │   ├── e1-edit-user.html                     # Reference slide-over modal (staging)
    │   └── e1-deactivate-user.html               # Reference centered modal (staging)
    ├── e2-partners-supplier-ecosystem/
    │   └── e2-supplier-directory.html            # Reference desktop prototype (staging)
    ├── ui-examples/                              # Screenshot references and design mockups
    │
    │  ── DESIGN SYSTEM (promoted, single source of truth) ──────────────────
    └── agriflow-rwanda-design-system/
        ├── README.md                             # Handoff guide for coding agents
        ├── chats/                                # Original design-chat transcripts
        └── project/
            ├── colors_and_type.css               # Bundle's token mirror
            ├── preview/                          # Component-level demos
            ├── screenshots/
            └── ui_kits/agriflow-app/
                ├── index.html                    # Bundle SPA preview
                ├── screens/                      # ← Promoted screen prototypes
                │   ├── SCREENS-INDEX.md          # Catalog (one row per promotion)
                │   └── <screen-slug>.html        # (no e{N}- prefix)
                ├── Dashboard.jsx / Users.jsx / … # React kit (legacy)
                └── README.md
```

### Where files go

- **New / draft prototypes:** `ui-flow/e{N}-<epic-slug>/e{N}-<screen-slug>.html` — `design-builder` writes here on every build (`epic N`, `story N.M`, `revise …`).
- **Signed-off prototypes:** promoted via `design-builder promote …`, which runs the gating checks and copies into `ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/<screen-slug>.html`.
- **FE / other-agent consumption:** read only from the design-system zone. Staging is internal workshop space.
