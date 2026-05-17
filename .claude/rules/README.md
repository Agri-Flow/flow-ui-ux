# flow-ui Rules — Design System Standards

This directory contains the **canonical design contracts** for AgriFlow Rwanda prototypes. Every agent working in this repo must conform to the rules below.

## Agents

Two agents live in this repo (`flow-ui/.claude/agents/`); one related agent lives at the monorepo root and handles a different concern:

- **`design-builder`** (this repo) — writes prototypes to staging, applies revisions, and promotes signed-off files into the design system (also opt-in push to Figma).
- **`design-linter`** (this repo) — read-only grep linter; tags findings `[P0] / [P1] / [P2]` and writes per-file reports to `reports/ux/`. Its signoff (`P0: 0  P1: 0`) is gate G10 for promotion. **Mechanical compliance** — asks "does this prototype obey the contract?"
- **`design-reviewer`** (monorepo root, `.claude/agents/design-reviewer.md`) — presents prototypes to the founder, collects natural-language feedback, structures it into a revision spec, dispatches via `ux-executor → design-builder`. **Subjective review** — asks "does this prototype look right to a human?"

The default loop: `design-builder` writes → `design-linter` grades → founder reads roll-up → `design-builder revise …` → `design-linter` re-grades → clean → `design-builder promote …`. Nothing lands in the design system without a clean linter report.

When mechanical fixes alone aren't enough (judgment calls, brand feel, layout instinct), invoke `design-reviewer` to run the subjective loop in parallel. The two roles compose; they do not overlap.

## Two-stage pipeline (read this first)

`ui-flow/` has two zones. The pipeline always runs one way:

```
ui-flow/e{N}-<epic-slug>/         ──┐  STAGING  (design-builder writes; iterative; not load-bearing)
                                    │
   design-builder revise + reviewer │  iterate until clean
                                    │
   design-builder promote story N.M │  ⇣  runs gating checks; refuses on any fail
                                    │
ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/
                                       PROMOTED  (single source of truth for FE + other agents)
```

- `flow-fe` and any other agent consuming AgriFlow UI **read from the design-system zone only**. Treat staging as an internal workshop.
- Files promoted into the design system drop the `e{N}-` prefix on copy (`e2-supplier-directory.html` → `supplier-directory.html`).
- Every promotion appends or updates a row in `agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/SCREENS-INDEX.md`.
- The promotion gating checklist is in `prototypes.md` ("Promotion gates").

## Rules

- **[prototypes.md](prototypes.md)** — Pipeline definition, HTML scaffold, every locked structural pattern (breadcrumb-only header, 270 px sidebar, h-10 controls, modal split, tables, action menus, status pills, 5-state coverage, forbidden classes), and the promotion gates.
- **[tokens.md](tokens.md)** — token → utility mapping. All tokens live in `flow-ui/tokens/colors_and_type.css`; the design-system bundle has a mirror copy at `agriflow-rwanda-design-system/project/colors_and_type.css`.

## Canonical files

- `flow-ui/tokens/colors_and_type.css` — token contract (HSL layer + hex aliases)
- `flow-ui/tokens/fonts/fonts.css` — font imports (Inter, Menlo fallback)
- `flow-ui/ui-flow/agriflow-rwanda-design-system/` — **design-system bundle (consumed by FE + agents)**
  - `project/colors_and_type.css` — bundle's token mirror
  - `project/preview/` — component-level demos
  - `project/ui_kits/agriflow-app/screens/` — promoted screen prototypes
  - `project/ui_kits/agriflow-app/screens/SCREENS-INDEX.md` — catalog (one row per promotion)
- **Reference prototypes (used as ground truth for the canonical pattern):**
  - `flow-ui/ui-flow/e2-partners-supplier-ecosystem/e2-supplier-directory.html` — desktop (sidebar, breadcrumb header, filter bar, table, action menu)
  - `flow-ui/ui-flow/e1-identity-access-management/e1-edit-user.html` — slide-over modal
  - `flow-ui/ui-flow/e1-identity-access-management/e1-deactivate-user.html` — centered modal

  Note: these reference files currently live in staging because they pre-date the pipeline. They are the visual contracts the agent and reviewer cite, and they should be promoted (after passing the gates) as part of the next reviewer pass.

## Canonical pattern — checklist

Every new prototype must satisfy all of the following. Anything older that diverges is wrong and should be migrated when next touched.

### Scaffold
- [ ] `<link rel="stylesheet" href="…/tokens/colors_and_type.css">` (depth-appropriate `../`)
- [ ] Tailwind CDN config matches the one in `prototypes.md` (no drift)
- [ ] No inline `<style>:root { … }</style>` token block
- [ ] No hardcoded hex in markup (`style="background:#…"`, `bg-[#…]`)
- [ ] No stock Tailwind palette colors (`bg-yellow-100`, `text-blue-700`, `bg-red-50` …)

### Layout
- [ ] Sidebar 270 px, `bg-sidebar shadow-sidebar border-r border-border`
- [ ] Active leaf nav: `bg-accent text-primary font-semibold` (no `bg-primary` fill)
- [ ] Active parent (has submenu): `text-primary font-semibold` only (no background)
- [ ] Header band is **breadcrumb-only** — no title, search, bell, or actions
- [ ] Page title + primary action live in the content area below the header
- [ ] `bg-page` is the body plate; cards float on top with `bg-card border border-border rounded-lg shadow-card`

### Form controls
- [ ] Inputs / selects / buttons are uniformly **`h-10`** (login primary CTA is the only `h-11`)
- [ ] Labels are top-aligned, never inline-right
- [ ] Phone inputs show the `🇷🇼 +250` flag prefix
- [ ] Error state uses `border-danger` + `text-danger` helper (not `border-destructive`)

### Pills + badges
- [ ] Role pills are single-hue brand: `bg-accent text-accent-foreground` (multi-hue retired 2026-05-15)
- [ ] Status pills are tone-mapped pairs: `bg-success-bg text-success`, `bg-warning-bg text-warning`, `bg-danger-bg text-danger`, `bg-info-bg text-info`
- [ ] QUARANTINE / FAILED QC use the **danger tone pair** (uppercase, bold), never solid `bg-destructive`
- [ ] Inline meta badges (HIGH RISK, RICA Expired, LOW CONFIDENCE) match the danger / warning tone pairs

### Tables
- [ ] Headers in Title Case (not ALL CAPS), 12 px, font-weight 600, `text-muted-foreground`
- [ ] `<th>` carries `border-top: 1px solid hsl(var(--border))` (via the page-level `<style>` block)
- [ ] Last data column right-aligned; 44 px Actions column with no visible "Actions" label
- [ ] Row hover: `tr:hover > td { background-color: var(--bg-tint); }` (brand-tint, not gray)
- [ ] Pagination footer: "Showing X–Y of Z" left, prev / numbered (32 px) / next right

### Modals (two distinct patterns — do not mix)
- [ ] Confirmations → **centered modal** `max-w-[480px]` with icon-in-circle + footer + audit rail
- [ ] Multi-field forms → **slide-over** `w-[480px]` right panel with scrollable sections + sticky footer + audit rail
- [ ] Audit rail copy on any action that writes to `audit_logs`

### Action menus
- [ ] 260 px wide, `bg-popover rounded-r-xl shadow-pop`
- [ ] Each row: 32 px brand-tinted icon tile + label + sub-label + chevron right
- [ ] Hover row uses `bg-page`

### Filter bars
- [ ] Search + 2–3 compact selects (all `h-10`) + Apply / Clear
- [ ] Active filter chips render **below** the row with × close buttons + results count

### Typography
- [ ] Page title in content area: `text-xl font-semibold text-foreground` (20 px Semibold)
- [ ] 24 px Bold reserved for top-level dashboard headers only
- [ ] Section eyebrows: `text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground`
- [ ] Use the six-step text ramp (`text-fg-1` … `text-fg-6`); don't invent gray utilities

### State coverage
- [ ] Every screen ships the applicable subset of: default, loading, empty, error, success (+ domain states: quarantine, offline, suspended, deactivated). Comment-divided in the HTML.

### Responsive + a11y
- [ ] Tested at 375 / 768 / 1024 px
- [ ] WCAG 2.1 AA contrast (≥ 4.5:1 body, ≥ 3:1 UI)
- [ ] Mobile touch targets ≥ 44 × 44 px (warehouse / driver screens)

### Plumbing
- [ ] Every prototype includes the Figma MCP capture script
- [ ] **Staging** file lives in `ui-flow/e{N}-<epic-slug>/e{N}-<screen-slug>.html`
- [ ] **Promoted** file (after `design-builder promote …`) lives in `ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/<screen-slug>.html` and is registered in `SCREENS-INDEX.md`
- [ ] FE / other agents consume only from the design-system zone — never from `e{N}-<slug>/`
- [ ] Doesn't pretend the **unfinished list** is done (see `prototypes.md` "Forbidden")

If a story brief asks for something that conflicts with this checklist, surface it as an open question — don't silently build the retired pattern.
