# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Repo Is

`flow-ui` is the **design source of truth** for **AgriFlow Rwanda** ("Operation Harvest") — a B2B fresh produce distribution platform that solves Rwanda's ~40% post-harvest food loss through a Service-Based Retail (SBR) model. AgriFlow retains stock ownership until the final sale, removing operational burden from retail partners and replacing informal supply chains with a ledger-based digital twin.

This repo contains no application code. It holds HTML-based UI prototypes built with Tailwind CSS (CDN) and shadcn/ui CSS variable conventions. Its job is to define components, screens, and the design language, then push them into Figma for implementation reference.

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
# Run from repo root — required for correct relative paths
python3 -m http.server 8899

# http://localhost:8899/ui-flow/flow-design.html   → sidebar / nav prototype
# http://localhost:8899/color-palette.html          → design token color palette

# After starting server, prototypes auto-push to Figma via MCP capture script
```

---

## Pushing Designs to Figma

**Target file:** FLow-UI/UX (`fileKey: dAgFxdPwQDFNYgUGAO6RKt`)

Both HTML files already contain the capture script — do not remove it:
```html
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
```

Capture workflow (local = Step 1B in Figma MCP instructions):
1. Ensure the server is running on port 8899
2. Generate a capture ID via the Figma MCP tool (`outputMode: "existingFile"`, `fileKey: dAgFxdPwQDFNYgUGAO6RKt`)
3. Open the URL with hash params:
```
http://localhost:8899/<file>#figmacapture=<id>&figmaendpoint=<endpoint>&figmadelay=1500&figmaselector=<css-selector>
```
4. Poll with the captureId until status is `completed`

Use `figmaselector` to target specific components (e.g., `aside` for sidebar, `body` for full page).

---

## Design System

### Brand & Color

AgriFlow's identity is rooted in agriculture and operational trust — the green communicates freshness and reliability, not decoration.

All tokens follow shadcn/ui's HSL CSS variable pattern, mirroring `../flow-fe/src/app/globals.css`:

| Token | HSL | Hex | Usage |
|---|---|---|---|
| `--primary` | `148 76% 33%` | `#1B8C4E` | Brand green — CTAs, active states, icons |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Text on primary backgrounds |
| `--accent` | `148 30% 95%` | `#F3FAF6` | Hover states, subtle green tints |
| `--accent-foreground` | `148 76% 28%` | — | Text on accent backgrounds |
| `--destructive` | `4 86% 58%` | `#E74C3C` | Errors, rejections, QC failures, spoilage alerts |
| `--muted` | `210 16% 96%` | `#F0F2F5` | Page backgrounds, disabled states |
| `--muted-foreground` | `215 16% 47%` | `#5F6B7A` | Secondary labels, placeholder text |
| `--foreground` | `222 47% 11%` | `#1F2937` | Primary body text |
| `--border` | `210 14% 91%` | `#E8EBE9` | Dividers, card borders |
| `--radius` | `0.5rem` | — | Global border radius |

Full 10-shade green (50–900) and gray scale are in `color-palette.html`. When adding tokens here, add them to `../flow-fe/src/app/globals.css` and `../flow-fe/tailwind.config.ts` simultaneously.

### Tailwind + shadcn Conventions

- All spacing, color, and radius use Tailwind utility classes — no custom CSS blocks
- Colors reference CSS variables (`text-primary`, `bg-accent`, `border-border`) not raw hex values
- Component patterns follow shadcn/ui: `SidebarMenuButton`, `Card`, `Avatar`, `Badge`, `Sheet`, `AlertDialog`
- Variant logic belongs in a `variants.ts` pattern (cva) when a component has more than 2 states

### Active States (Sidebar/Nav)

- Item **without** submenu, active → `bg-primary text-primary-foreground font-semibold`
- Item **with** submenu, parent active → `text-primary font-semibold` (no background fill)
- Submenu child, active → `bg-primary text-primary-foreground font-semibold`

### Typography

- Font: Inter (400, 500, 600, 700)
- Section labels: `text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground`
- Nav items: `text-[13.5px] font-medium`
- Submenu items: `text-[12.8px] font-normal`

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
- **QUARANTINE state** must be visually distinct from normal inventory states (use `--destructive` color treatment)
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
├── color-palette.html          # Full design token palette — push to Figma as reference
└── ui-flow/
    ├── flow-design.html        # Sidebar / nav prototype (Tailwind + shadcn)
    └── ui-examples/            # 41 screenshot references and design mockups
```

New HTML prototype files go in `ui-flow/`. Name them by feature: `qc-inspection.html`, `inventory-ledger.html`, etc.
