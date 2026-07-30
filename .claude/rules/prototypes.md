# HTML Prototypes — flow-ui

## Rule: Build prototypes to the canonical pattern (breadcrumb-only header, 270 px sidebar, h-10 controls, tone-mapped pills, two-modal split)

All HTML in `ui-flow/` must be production-grade and follow the **locked design contracts** below. The contracts originate from the `design-decisions-from-chats` memory and the latest reference prototypes (`ui-flow/e2-partners-supplier-ecosystem/e2-supplier-directory.html`, `ui-flow/e1-identity-access-management/e1-edit-user.html`). Any new prototype must match them; any older prototype that diverges is wrong.

---

## Two-stage pipeline — staging vs design system

`ui-flow/` has two zones with different purposes. Every prototype begins life in staging; only **promoted** prototypes land in the design system. Other agents and `flow-fe` consume the design system only.

```
ui-flow/
  ├── e1-identity-access-management/       ← STAGING (draft, may iterate, not load-bearing)
  ├── e2-partners-supplier-ecosystem/      ← STAGING
  ├── e{N}-<epic-slug>/                    ← STAGING for any other epic
  │
  └── agriflow-rwanda-design-system/       ← DESIGN SYSTEM (single source of truth)
      └── project/
          ├── colors_and_type.css          ← bundle's local token copy (mirrors canonical)
          ├── preview/                     ← component-level demos (existing)
          ├── screens/                     ← PROMOTED screen prototypes land here
          │   ├── SCREENS-INDEX.md         ← catalog (one row per promoted file)
          │   ├── supplier-directory.html
          │   └── …
          └── ui_kits/agriflow-app/        ← JSX visual-review SPA (downstream mirror; refreshed by `design-builder sync-kit`)
              ├── index.html               ← SPA preview entry
              └── *.jsx                    ← visual-only (hardcoded hex, Nunito/Fraunces; NOT a contract)
```

### What "staging" means

- `design-builder` writes here on every `epic N` / `story N.M` / `revise …` build.
- Filenames keep the epic prefix: `e{N}-<screen-slug>.html`.
- Files may be incomplete, may fail lint, may change between commits.
- **Do not implement against staging.** FE engineers, other agents, designers consuming the contract — read the design-system zone, not staging.

### What "design system" means

- The single source of truth that `flow-fe` and other agents read from.
- Files only arrive via `design-builder promote …`, which runs the gating checks (see "Promotion gates" below). Direct edits to design-system files are forbidden.
- Filenames are flat — the `e{N}-` prefix is dropped on promotion (`e2-supplier-directory.html` → `supplier-directory.html`).
- The bundle's own `colors_and_type.css` (at `agriflow-rwanda-design-system/project/colors_and_type.css`) mirrors the canonical `flow-ui/tokens/colors_and_type.css`.
- Every promotion appends or updates a row in `SCREENS-INDEX.md`.

### Promotion gates

A staging file may be promoted only if **all** of these pass. The agent refuses to copy on any failure; the staging file stays put and the report explains the fix:

| Gate | Check | Pass |
|---|---|---|
| Sidebar consistency (P0-0, in G10) | Canonical sidebar structure present, no empty stub, no held D-016 routes (`partners/operations`, `suppliers/schedule`, `suppliers/history`) before their stories (2.5 / 2.6 / 2.7) ship | 0 violations |
| G1 | Token link present | `tokens/colors_and_type.css` referenced |
| G2 | No inline `:root` block | 0 occurrences |
| G3 | No stock Tailwind palette colors | 0 occurrences of `bg-(yellow|blue|red|green|purple|orange|teal|pink|indigo)-\d+` (same for `text-…`) |
| G4 | No hardcoded hex in markup | 0 occurrences |
| G5 | Breadcrumb-only header (desktop) | present, except on login / password-reset / access-denied / mobile-only |
| G6 | State coverage comments | form ≥ 3, list ≥ 3, detail ≥ 2 `<!-- STATE: -->` markers |
| G7 | Login uses `h-11` (login files only) | ≥ 1 occurrence |
| G8 | No `shadow-sm` / `-md` / `-lg` on cards | 0 occurrences |
| G9 | Active-leaf style per `flow-design.html`: active leaf / submenu-child = `bg-primary text-primary-foreground` fill; active parent = `text-primary`, no fill (INFORMATIONAL via lint P0-5; supersedes the 2026-05-15 bg-accent rule) | n/a |
| G10 | Reviewer signoff (mechanical compliance) | a review report exists at `reports/ux/<file-stem>-review.md` AND its Summary line reads `**P0: 0  P1: 0  …**` |
| G12 | Story signoff (design-side AC vs PM stories) | an epic-level story-coverage report exists at `reports/story-coverage/epic-N-story-coverage.md` for the file's parent epic AND its Summary line reads `**Design-side AC clean:** YES` |

Two signoffs, two sources, two failure modes:

- **G10** (`design-linter` → `reports/ux/`) — does this prototype obey the design contract? (token usage, h-10 controls, modal split, tone-mapped pills, etc.)
- **G12** (`story-coverage-auditor` → `reports/story-coverage/`) — does this implement every UI commitment the PM user-story BDD scenarios require? **G12 is bidirectional** — it also surfaces work the staging built that no story AC covers, but those PM-side findings go to a separate `epic-N-pm-revise-spec.md` for `story-pipeline` and do NOT block promote (only the design-side `**Design-side AC clean:** YES` line gates).

A file can pass G10 and fail G12 (clean tokens, missing AC behavior) or pass G12 and fail G10 (every AC implemented, `bg-yellow-100` swatches everywhere). Both must pass before promote. If a candidate file's epic is missing either report, `design-builder promote` refuses with the recommendation to run the relevant inspector first.

> **G11 was retired 2026-05-17** (file at `.claude/agents/_retired/2026-05-17_design-coverage-auditor.md`). It compared the JSX UI kit against staging HTML and refused promote unless they matched — directionality inverted. The JSX kit is a DOWNSTREAM visual-review SPA updated AFTER promotion (see `design-builder` Phase 6.5 — `sync-kit` mode), not a contract. Do NOT reintroduce a G11-style gate without first reading `~/.claude/projects/.../memory/feedback_design_pipeline_directionality.md`.

After a passing promote, `design-builder sync-kit epic N` (Phase 6.5) updates the JSX visual-review SPA to mirror the newly-promoted screens. The kit follows the screens; the screens follow the contract (G10 + G12); the contract is the PM story.

(A separate root-level `design-reviewer` handles SUBJECTIVE review — natural-language feedback from a human — and is not what gates G10 or G12 read. See `flow-ui/.claude/rules/README.md` for the role split.)

### Folder + file naming

- Staging file: `ui-flow/e{N}-<epic-slug>/e{N}-<screen-slug>.html`
- Promoted file: `ui-flow/agriflow-rwanda-design-system/project/screens/<screen-slug>.html` (flat, no `e{N}-` prefix)
- One file per screen. Reference an existing sibling (staging *or* promoted) before inventing a new pattern — keep cross-screen consistency.

---

## Required head + scaffold

**All design tokens live in `flow-ui/tokens/colors_and_type.css` — the canonical single source of truth.** Prototypes `<link>` that file; **never inline a `:root` block**.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Screen Name — AgriFlow Rwanda</title>
  <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Canonical tokens (path depth varies — see table below) -->
  <link rel="stylesheet" href="../../tokens/colors_and_type.css">
  <script>
    // Inline Tailwind CDN config — maps utility names to CSS variables.
    // Mirror flow-ui/tokens/colors_and_type.css exactly.
    tailwind.config = {
      theme: { extend: {
        colors: {
          border:'hsl(var(--border))', input:'hsl(var(--input))', ring:'hsl(var(--ring))',
          background:'hsl(var(--background))', foreground:'hsl(var(--foreground))',
          primary:     { DEFAULT:'hsl(var(--primary))',     foreground:'hsl(var(--primary-foreground))' },
          secondary:   { DEFAULT:'hsl(var(--secondary))',   foreground:'hsl(var(--secondary-foreground))' },
          muted:       { DEFAULT:'hsl(var(--muted))',       foreground:'hsl(var(--muted-foreground))' },
          accent:      { DEFAULT:'hsl(var(--accent))',      foreground:'hsl(var(--accent-foreground))' },
          destructive: { DEFAULT:'hsl(var(--destructive))', foreground:'hsl(var(--destructive-foreground))' },
          card:        { DEFAULT:'hsl(var(--card))',        foreground:'hsl(var(--card-foreground))' },
          popover:     { DEFAULT:'hsl(var(--popover))',     foreground:'hsl(var(--popover-foreground))' },
          sidebar: { DEFAULT:'hsl(var(--sidebar))', foreground:'hsl(var(--sidebar-foreground))',
                     border:'hsl(var(--sidebar-border))', accent:'hsl(var(--sidebar-accent))',
                     'accent-foreground':'hsl(var(--sidebar-accent-foreground))' },
          success: { DEFAULT:'var(--success)', bg:'var(--success-bg)' },
          warning: { DEFAULT:'var(--warning)', bg:'var(--warning-bg)' },
          danger:  { DEFAULT:'var(--danger)',  bg:'var(--danger-bg)', strong:'var(--danger-strong)' },
          info:    { DEFAULT:'var(--info)',    bg:'var(--info-bg)' },
          page:'var(--bg)', tint:'var(--bg-tint)', surface:'var(--surface)',
          'fg-1':'var(--fg-1)','fg-2':'var(--fg-2)','fg-3':'var(--fg-3)',
          'fg-4':'var(--fg-4)','fg-5':'var(--fg-5)','fg-6':'var(--fg-6)',
        },
        borderRadius: {
          lg:'var(--radius)', md:'calc(var(--radius) - 2px)', sm:'calc(var(--radius) - 4px)',
          'r-sm':'var(--r-sm)','r-md':'var(--r-md)','r-lg':'var(--r-lg)','r-xl':'var(--r-xl)',
        },
        boxShadow: {
          card:'var(--shadow-card)', pop:'var(--shadow-pop)',
          sidebar:'var(--shadow-sidebar)', btn:'var(--shadow-btn)',
        },
      } },
    }
  </script>
  <style>
    /* Only utility CSS — no token redefinitions */
    * { font-family: 'Inter', sans-serif; }
    body { background: var(--bg); min-height: 100vh; }
    .mono { font-family: 'Menlo','Monaco','Courier New',monospace; }
    table tbody tr:hover > td { background-color: var(--bg-tint); }
    table thead th { border-top: 1px solid hsl(var(--border)); }
  </style>
</head>
<body class="bg-page">
  <!-- shell -->
</body>
</html>
```

**Relative path to the token file by location:**

| Prototype location | Path | Notes |
|---|---|---|
| `flow-ui/*.html` (root) | `tokens/colors_and_type.css` | canonical |
| `flow-ui/ui-flow/*.html` | `../tokens/colors_and_type.css` | canonical |
| `flow-ui/ui-flow/e{N}-*/*.html` (**staging**) | `../../tokens/colors_and_type.css` | canonical |
| `flow-ui/ui-flow/agriflow-rwanda-design-system/project/screens/*.html` (**promoted**) | `../colors_and_type.css` | bundle's local mirror (sibling); the canonical at `../../../tokens/colors_and_type.css` is also acceptable via the symlink |

`design-builder promote …` rewrites the `<link>` automatically on copy — never edit it by hand on a promoted file.

**Forbidden:** inline `<style>:root { … }</style>` blocks defining color / spacing / radius / shadow tokens. The canonical file is the only place those values live.

---

## Page shell (desktop)

Two-column shell. Sidebar 270 px on the left; main content on the right starts with a **breadcrumb-only header band**; the page title + primary action live in the content area below the header.

### Canonical Sidebar (Desktop)

Every non-auth screen must include a full sidebar with the structure below. Auth screens (login, password-reset, access-denied, account-activation) exempt — those carry a brand panel only, not a sidebar.

**Brand Lockup (36×36 + wordmark):**
```html
<div class="h-14 flex items-center px-4 border-b border-border">
  <div class="flex items-center gap-2.5">
    <div class="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
      <svg class="w-5 h-5 text-white" /* AgriFlow leaf icon */ />
    </div>
    <span class="text-foreground font-bold text-[15px]">AgriFlow</span>
  </div>
</div>
```

**Section Hierarchy (Main, Operations, Compliance, Analytics) — authoritative source: `ui-flow/flow-design.html`:**

> **`flow-design.html` is the true AgriFlow sidebar** (founder-ruled 2026-06-28). Every promoted screen embeds its `<aside>` verbatim (in-flow flex variant: `flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto`) plus the submenu-collapse CSS + `initActive()` nav JS. The hierarchy below mirrors it; the older HTML scaffold example further down is illustrative only — copy from `flow-design.html` / a promoted screen, not from the example.

- **Main:** Dashboard → **Executive, Operations, Sales, Inventory, Logistics**; Orders (badge); Products; Partners → **List, Stores, Operations, Performance**; Suppliers → **List, Purchase, Schedule, History, Performance**
- **Operations:** Inventory → **Stock, Intake, Expiry & Waste, Storage**; Logistics → **Planning, Execution, Fleet**; Users → **All Users, Roles & Permissions**
- **Compliance:** Audit Logs  *(audit-log-viewer home; breadcrumb Compliance → Audit Logs; added per founder ruling 2026-06-28 — `flow-design.html` omitted it but the screen + Story 1.2 require a nav home)*
- **Analytics:** Finance → **Revenue, Payments, Reports**; Reports → **Sales, Inventory, Waste**; Settings

**D-016 — APPROVED + APPLIED (2026-06-28):**
D-016 is approved (Option A). The 3 routes are now **included** in the canonical sidebar: `partners/operations` (Partners → Operations), `suppliers/schedule` (Suppliers → Schedule), `suppliers/history` (Suppliers → History). The former held-route lint guard (P0-0b) has been **removed** — no hold remains. Reference: `reports/decisions/closed/2026-06-27_D-016_sidebar-routes-in-scope.md`.

**Active-Leaf Rule (flow-design.html canonical — supersedes the 2026-05-15 bg-accent rule):**
- Active leaf / active submenu child: `bg-primary text-primary-foreground font-semibold` (green fill — per flow-design.html)
- Active parent (has submenu): `text-primary font-semibold` only (no background)
- Hover (inactive): `hover:bg-accent hover:text-accent-foreground transition-colors`
- Note: lint P0-5 (active-leaf) remains INFORMATIONAL; this style is a token-based fill (`bg-primary`), not a stock palette colour, so it passes G10.

**Logout Affordance:**
Bottom-of-sidebar footer with user profile card (initials avatar + name + role + dropdown chevron) — can double as a logout menu.

**Full Scaffold Example:**
```html
<body class="bg-page">
<div class="flex min-h-screen">

  <!-- Sidebar (270 px, shadow-sidebar) -->
  <aside class="w-[270px] bg-sidebar shadow-sidebar border-r border-border flex flex-col shrink-0">
    <!-- Logo lockup: 36×36 green tile + "AgriFlow" wordmark -->
    <div class="h-14 flex items-center px-4 border-b border-border">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.8.66 21 21 0 0 1-3 11.4 7 7 0 0 1-7 5.05Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>
        </div>
        <span class="text-foreground font-bold text-[15px]" style="letter-spacing:-0.3px">AgriFlow</span>
      </div>
    </div>

    <!-- Nav sections -->
    <!-- D-016 RESOLVED 2026-06-27 -> Option A (in-scope): partners/operations | suppliers/schedule | suppliers/history
         Add to this sidebar only once their owning stories (2.5 / 2.6 / 2.7) are built; keep ABSENT until then.
         See reports/decisions/closed/2026-06-27_D-016_sidebar-routes-in-scope.md -->
    <!-- ACTIVE-LEAF (flow-design.html canonical 2026-06-28): active leaf / submenu-child = bg-primary text-primary-foreground font-semibold (green fill); active parent (has submenu) = text-primary, no fill. Supersedes the 2026-05-15 bg-accent rule. -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
      <!-- Main -->
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground px-3 mb-2">Main</p>
        <div class="space-y-0.5">
          <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <svg class="w-4 h-4 shrink-0" /* dashboard icon */></svg>
            Dashboard
          </a>
          <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <svg class="w-4 h-4 shrink-0" /* orders icon */></svg>
            Orders
            <span class="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </a>
          <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <svg class="w-4 h-4 shrink-0" /* products icon */></svg>
            Products
          </a>
          <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <svg class="w-4 h-4 shrink-0" /* suppliers icon */></svg>
            Suppliers
          </a>
          <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <svg class="w-4 h-4 shrink-0" /* partners icon */></svg>
            Partners
          </a>
        </div>
      </div>

      <!-- Operations -->
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground px-3 mb-2">Operations</p>
        <div class="space-y-0.5">
          <!-- Inventory with submenu -->
          <div>
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              <svg class="w-4 h-4 shrink-0" /* inventory icon */></svg>
              Inventory
              <svg class="w-4 h-4 ml-auto" /* chevron-down icon */></svg>
            </a>
            <!-- Submenu (show/hide toggled by parent) -->
            <div class="space-y-0.5 ml-2 mt-0.5 border-l border-sidebar-border pl-3">
              <a href="#" class="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12.8px] font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Stock
              </a>
              <a href="#" class="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12.8px] font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Intake
              </a>
              <a href="#" class="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12.8px] font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Expiry & Waste
              </a>
              <a href="#" class="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12.8px] font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Storage
              </a>
            </div>
          </div>

          <!-- Logistics with submenu -->
          <div>
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              <svg class="w-4 h-4 shrink-0" /* logistics icon */></svg>
              Logistics
              <svg class="w-4 h-4 ml-auto" /* chevron-down icon */></svg>
            </a>
            <!-- Submenu -->
            <div class="space-y-0.5 ml-2 mt-0.5 border-l border-sidebar-border pl-3">
              <a href="#" class="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12.8px] font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Planning
              </a>
              <a href="#" class="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12.8px] font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Execution
              </a>
              <a href="#" class="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12.8px] font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Fleet
              </a>
            </div>
          </div>

          <!-- Users with sub-routes (All Users, Roles & Permissions) -->
          <div>
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              <svg class="w-4 h-4 shrink-0" /* users icon */></svg>
              Users
              <svg class="w-4 h-4 ml-auto" /* chevron-down icon */></svg>
            </a>
            <!-- Submenu -->
            <div class="space-y-0.5 ml-2 mt-0.5 border-l border-sidebar-border pl-3">
              <a href="#" class="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12.8px] font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                All Users
              </a>
              <a href="#" class="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12.8px] font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Roles & Permissions
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Compliance/Analytics -->
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground px-3 mb-2">Analytics</p>
        <div class="space-y-0.5">
          <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <svg class="w-4 h-4 shrink-0" /* reports icon */></svg>
            Reports
          </a>
          <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <svg class="w-4 h-4 shrink-0" /* audit logs icon */></svg>
            Audit Logs
          </a>
          <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <svg class="w-4 h-4 shrink-0" /* settings icon */></svg>
            Settings
          </a>
        </div>
      </div>
    </nav>

    <!-- User profile footer (logout affordance) -->
    <div class="border-t border-border p-3">
      <div class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer">
        <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary text-xs font-bold">JU</div>
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-medium text-foreground truncate">Jean Uwimana</p>
          <p class="text-[11px] text-muted-foreground truncate">Admin</p>
        </div>
        <svg class="w-4 h-4 text-muted-foreground shrink-0" /* dropdown chevron */></svg>
      </div>
    </div>
  </aside>

  <!-- Main -->
  <div class="flex-1 overflow-auto bg-page">

    <!-- Breadcrumb-only header band — no title, search, bell, or action buttons -->
    <header class="bg-card border-b border-border" style="padding:16px 28px">
      <nav class="text-[13px] text-muted-foreground">
        <span>AgriFlow</span>
        <span class="mx-2 text-fg-6">/</span>
        <span>Section</span>
        <span class="mx-2 text-fg-6">/</span>
        <span class="text-foreground font-bold">Current page</span>
      </nav>
    </header>

    <div class="p-7 space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-xl font-semibold text-foreground">Page Title</h1>
          <p class="text-sm text-muted-foreground mt-1">One-line description.</p>
        </div>
        <button class="inline-flex items-center justify-center h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity gap-2 shadow-btn">
          Primary Action
        </button>
      </div>

      <!-- content cards -->
    </div>
  </div>
</div>
</body>
```

## Page shell (mobile-first — Clerk, Picker, Driver)

```html
<body class="bg-page">
<div class="min-h-screen flex flex-col max-w-[420px] mx-auto">
  <div class="bg-warning text-white text-xs text-center py-1">Offline — changes will sync when reconnected</div>
  <div class="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
    <button class="p-2" aria-label="Back">←</button>
    <h1 class="text-base font-semibold text-foreground">Screen Title</h1>
  </div>
  <div class="flex-1 px-4 py-6 space-y-4 bg-page"><!-- content --></div>
  <div class="sticky bottom-0 bg-card border-t border-border p-4">
    <button class="w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold">Primary Action</button>
  </div>
</div>
</body>
```

---

## Component contracts

The values below are locked. Don't substitute. When in doubt, open `e2-supplier-directory.html` and copy.

### Icons — Lucide only (locked 2026-07-25)

**Every icon is [Lucide](https://lucide.dev).** Founder direction 2026-07-25, first applied to the Epic 3 staging screens.

This is a correctness rule, not a taste rule: `flow-fe` already imports `lucide-react` in 61 source files, and the design system is the contract FE builds against — a prototype drawn with non-Lucide glyphs guarantees a design↔build mismatch the FE scaffolder has to silently reconcile.

- **Source the geometry, don't draw it.** Copy the exact path data from the locally installed package the FE renders — `flow-fe/node_modules/lucide-react/dist/esm/icons/<icon-name>.js`. Each file exports an `__iconNode` array of `["path"|"circle"|"line"|"polyline"|"rect", {…attrs}]` tuples; translate those directly into inline SVG children. Verify the icon name exists in that directory before using it — never guess a name.
- **Inline the SVG. No CDN, no `<script>`, no icon font.** Prototypes stay self-contained and offline-renderable. (The Tailwind CDN and the Figma capture script are the only permitted external scripts — see "Required head + scaffold".)
- **Canvas:** `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"` — Lucide's native geometry.
- **Stroke weight is `stroke-[1.8]`, not Lucide's default `2`.** The system deliberately runs a lighter stroke. Keep it; don't restore the Lucide default per-icon.
- **One concept, one glyph.** The same meaning must not use two different icons across screens.
- **Accessibility:** decorative icons carry `aria-hidden="true"`; meaningful icons carry `role="img"` + `aria-label` (plus `<title>` where it aids the screen reader). An icon-only button must always have an accessible name. Never drop a label while swapping a path.

### Form controls

- **Inputs / selects / outlined buttons / primary buttons are all `h-10`.** The only exception is the login primary CTA, which is `h-11`.
- Labels are top-aligned, never inline-right.
- Required marker: `<span class="text-danger">*</span>`.
- Error state: replace `border-input` with `border-danger`, swap `focus:ring-ring` for `focus:ring-danger`, append `<p class="text-xs text-danger mt-1">…</p>`.
- **Phone inputs** always show the `🇷🇼 +250` flag prefix:

```html
<div class="flex items-stretch h-10 rounded-md border border-input overflow-hidden bg-card">
  <span class="inline-flex items-center gap-1 px-3 bg-page text-sm text-foreground border-r border-input">🇷🇼 +250</span>
  <input class="flex-1 px-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring" placeholder="788 123 456" />
</div>
```

### Buttons

| Variant | Class |
|---|---|
| Primary | `inline-flex items-center justify-center h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-btn` |
| Primary (login only) | swap `h-10` → `h-11` |
| Outline | `inline-flex items-center justify-center h-10 px-5 rounded-md border border-input bg-card text-sm font-semibold text-foreground hover:bg-accent transition-colors` |
| Ghost / Clear | `h-10 px-3 rounded-md text-sm font-semibold text-primary hover:bg-accent transition-colors` |
| Destructive | `h-10 px-5 rounded-md bg-danger text-white text-sm font-semibold hover:opacity-90 transition-opacity` |

### Status pills — always tone-mapped pairs

```html
<span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success">Active</span>
<span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning-bg text-warning">Pending</span>
<span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger-bg  text-danger">Suspended</span>
<span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info-bg    text-info">Update available</span>
<!-- QUARANTINE / FAILED QC — danger tone pair, uppercase, bold (NOT solid red) -->
<span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-danger-bg text-danger">Quarantine</span>
```

### Role pills — single-hue brand (locked 2026-05-15)

All roles (Admin / Manager / Picker / Driver / Finance) use the same chip. The earlier multi-hue palette (green / blue / orange / purple / teal) is **retired**.

```html
<span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">Manager</span>
```

### Inline meta badges (HIGH RISK / RICA Expired / LOW CONFIDENCE / Immutable)

```html
<span class="inline-flex px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wide bg-danger-bg text-danger">High Risk</span>
<span class="inline-flex px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wide bg-warning-bg text-warning">Low Confidence</span>
```

### Cards

`bg-card border border-border rounded-lg shadow-card` with `padding:18px` for small / stat cards and `p-6` for large content cards. Never `shadow-sm` / `shadow-md` / `shadow-lg`.

### Tables

- Header band reads as contained: `<th>` gets `border-top: 1px solid hsl(var(--border))` via the page-level `<style>` block.
- Header cells: `text-left text-xs font-semibold text-muted-foreground` with `padding:14px 22px`. **Title Case**, not ALL CAPS.
- Row hover: declared once in the `<style>` block as `table tbody tr:hover > td { background-color: var(--bg-tint); }`.
- Last data column right-aligned; tight gap to the 44 px fixed Actions column (no visible "Actions" label).
- Pagination footer: "Showing X–Y of Z" left, prev / numbered page buttons (32 px) / next right.

### Filter bar

Search input + 2–3 compact selects + Apply / Clear, all `h-10`. Active filter chips appear **below** the row as `bg-accent text-accent-foreground` rounded-full chips with a small × close button, ending in:

```html
<span class="text-fg-6">|</span>
<span>24 suppliers found</span>
```

### Action menu (3-dot row popover)

260 px wide white card, `rounded-r-xl`, `shadow-pop`. Each item: 32 × 32 icon tile (`bg-accent text-primary`) + label + sub-label + chevron right. Hover row `bg-page`.

```html
<div class="w-[260px] bg-popover border border-border rounded-r-xl shadow-pop overflow-hidden p-1.5">
  <p class="px-2.5 pt-2 pb-1.5 text-[12px] font-semibold text-muted-foreground">Open supplier as…</p>
  <a class="flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-page transition-colors">
    <span class="w-8 h-8 rounded-r-md bg-accent text-primary inline-flex items-center justify-center shrink-0">[icon]</span>
    <span class="flex-1 min-w-0">
      <span class="block text-sm font-semibold text-foreground">Label</span>
      <span class="block text-[11.5px] text-fg-4">Sub-label</span>
    </span>
    <span class="text-fg-6">›</span>
  </a>
</div>
```

### Modals — two distinct patterns, do not mix

**Centered modal** for confirmations (deactivate, suspend, save permissions, delete). Icon-in-circle (tone-colored) → title → subtitle → optional content → footer (Cancel left / primary CTA right) → audit-log rail.

```html
<div class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,0.5);" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="bg-card border border-border rounded-lg shadow-pop w-full max-w-[480px] p-6 mx-4">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 rounded-full bg-danger-bg text-danger inline-flex items-center justify-center shrink-0">[icon]</div>
      <div class="flex-1">
        <h2 id="modal-title" class="text-base font-semibold text-foreground">Deactivate user?</h2>
        <p class="text-sm text-muted-foreground mt-1">[Subtitle]</p>
      </div>
    </div>
    <div class="mt-6 flex items-center justify-end gap-2">
      <button class="h-10 px-5 rounded-md border border-input bg-card text-sm font-semibold text-foreground hover:bg-accent">Cancel</button>
      <button class="h-10 px-5 rounded-md bg-danger text-white text-sm font-semibold hover:opacity-90">Deactivate</button>
    </div>
    <p class="mt-4 text-xs text-muted-foreground border-t border-border pt-3">This action will be recorded in the audit log (5-year retention per Rwanda FDA).</p>
  </div>
</div>
```

**Slide-over (480 px right panel)** for multi-field forms (add / edit user, add product mapping, edit supplier). Scrollable form sections with uppercase section eyebrows; sticky footer with Cancel left / primary right; audit rail above footer.

```html
<div class="fixed inset-0 z-50 flex justify-end" style="background: rgba(0,0,0,0.3);">
  <div class="w-[480px] bg-card border-l border-border shadow-pop flex flex-col animate-in slide-in-from-right">
    <div class="px-6 py-4 border-b border-border flex items-center justify-between">
      <h2 class="text-base font-semibold text-foreground">Edit user</h2>
      <button class="p-2 text-fg-4 hover:bg-accent rounded-md" aria-label="Close">×</button>
    </div>
    <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6"><!-- fields --></div>
    <div class="px-6 py-4 border-t border-border bg-card">
      <p class="text-xs text-muted-foreground mb-3">All user changes are recorded in the audit log (5-year retention per Rwanda FDA).</p>
      <div class="flex items-center justify-end gap-2">
        <button class="h-10 px-5 rounded-md border border-input bg-card text-sm font-semibold text-foreground hover:bg-accent">Cancel</button>
        <button class="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 shadow-btn">Save changes</button>
      </div>
    </div>
  </div>
</div>
```

### File upload

```html
<div class="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-card">
  <p class="text-sm font-medium text-foreground">Drop file here or <span class="text-primary">browse</span></p>
  <p class="text-xs text-fg-5">PDF, PNG, JPG — max 10 MB</p>
</div>
```

### Alert / banner

```html
<div class="flex items-start gap-3 p-3 rounded-md bg-warning-bg border border-warning/30">
  <p class="text-sm text-warning">Warning message</p>
</div>
```

### Domain-specific states

- **Offline (mobile):** `bg-warning text-white text-xs text-center py-1` strip at the very top of the screen.
- **Quarantine card stripe:** `border-l-4 border-danger p-4 bg-danger-bg` with `text-danger font-semibold` headline.
- **Expiry warning chip on inventory cards:** `bg-warning-bg text-warning` chip + FIFO date label.

---

## Typography rules

- Page title (in-app content area): `text-xl font-semibold text-foreground` (20 px Semibold).
- Top-level dashboard headers only: 24 px Bold (`--t-display`) — never for sub-pages.
- Section eyebrows / labels: `text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground`.
- Body text: `text-sm text-foreground` (= `--fg-2`). Use the six-step ramp (`text-fg-1` … `text-fg-6`); never invent gray utilities. Map: body = fg-2, table secondary = fg-4, placeholder = fg-5, disabled = fg-6.
- Phone numbers and IDs use the `.mono` class.

---

## 5-state coverage (mandatory)

Every screen renders the applicable subset of: **default, loading, empty, error, success**, plus domain states (quarantine, offline, suspended, deactivated). Use HTML comment dividers in the file:

```html
<!-- STATE: default -->
<!-- STATE: loading (skeletons) -->
<!-- STATE: empty (illustration + CTA) -->
<!-- STATE: error (inline + toast) -->
<!-- STATE: success (toast + state badge change) -->
<!-- STATE: offline (mobile only) -->
<!-- STATE: quarantine (inventory only) -->
```

A screen that ships only the happy path is incomplete.

---

## Canvas layers — product, state bands, spec notes (locked 2026-07-30)

**Why this exists.** A prototype canvas serves two audiences at once: the **product** (what `flow-fe` implements literally, what a warehouse clerk sees) and the **spec** (what a developer or agent needs in order to build it). Until now both were drawn with the same `bg-card` + `text-[10px]` eyebrow treatment, so there was no way — visually or mechanically — to tell a developer note from real UI. The founder flagged it on `e4-batch-intake-qc.html`, where "Active, verified suppliers only (Epic 2 registry)" and "From Product Master (Epic 3)" render exactly like product microcopy. The same confusion had already shipped a literal `Available with Story 4.5` string into a KPI tile, on a canvas FE builds verbatim.

Every element on the canvas belongs to exactly one of three layers.

| Layer | What it is | Marker | Ships to FE? |
|---|---|---|---|
| **Product** | The screen itself. Default styling, no marker. | *(none)* | **Yes** — this is the contract |
| **State band** | An alternate rendering of the same product screen (loading, empty, error, success, domain states). | `data-annotation="state"` | No — one state is implemented; bands are the catalogue |
| **Spec note** | Commentary for whoever builds it: where data comes from, what blocks submit, retention rules, scope boundaries. | `data-annotation="spec"` | **Never** |

### Spec notes live in the annotation rail, outside the app frame

Spec notes are **not** placed in the content column. The page shell gains a third flex column after the content:

```html
<body class="bg-page" data-annotations="off">
  <div data-annotation="chrome"><!-- prototype toggle strip; see below --></div>
  <!-- wraps below 2xl so the rail flows UNDER the product instead of narrowing it -->
  <div class="flex flex-wrap 2xl:flex-nowrap min-h-screen">
    <aside id="sidebar" class="w-[270px] …">…</aside>
    <div class="flex-1 min-w-0"><!-- PRODUCT — the app --></div>
    <aside data-annotation="spec"
      class="annotation-rail w-full 2xl:w-[320px] shrink-0 border-t 2xl:border-t-0 2xl:border-l …">
      <!-- spec notes, in document order, each naming the section it describes -->
    </aside>
  </div>
</body>
```

The app frame boundary is what carries the distinction — commentary sits **beside** the app, never inside it. Notes reference their target by name ("re: Received weight"); do **not** add markers, badges or numbers into the product column to anchor them, because that reintroduces exactly the pollution this rule removes.

**The rail must never subtract width from the product column at a width where the product is meant to be reviewed.** A fixed `w-[320px] shrink-0` rail is wrong: at 1280 px — the desktop width "Responsive testing" targets — it takes a third of the content column, so turning annotations on distorts the very layout you turned them on to read. (Measured on `e4-batch-intake-qc.html`: content 1010 px → 690 px, a 32 % cut that pushed banner copy into one-word-per-line wrapping.)

So the rail is responsive, and the invariant is: **the product column's rendered width is identical annotations-on and annotations-off at every viewport below `2xl` (1536 px).**

- **≥ 1536 px (`2xl`)** — rail sits beside the content, 320 px, as a third column.
- **< 1536 px** — the shell wraps (`flex-wrap 2xl:flex-nowrap`) and the rail stacks full-width *below* the product column. It stays the same `[data-annotation="spec"]` element, still hidden when annotations are off; only its placement changes.

Verify by measuring, not by reading the classes: render at 1280 px, toggle annotations on and off, and confirm the content column's `getBoundingClientRect().width` is unchanged.

**Treatment:** the rail is deliberately outside the product palette — no `bg-card`, no `shadow-card`, no product eyebrow. Use a flat tinted panel, a `mono` `SPEC` chip, and `text-muted-foreground` body copy at AA contrast. It must be impossible to mistake for a product surface at a glance.

### The toggle

`<body data-annotations="off">` is the **default** — the canvas opens as the product, clean. A labelled control in the `data-annotation="chrome"` strip flips it to `"on"`, revealing the rail and every state band. Founder review happens with annotations off; build and spec reading happen with them on.

Implement with a CSS rule keyed off the body attribute (`[data-annotations="off"] [data-annotation="spec"], [data-annotations="off"] [data-annotation="state"] { display: none }`) plus a collapse of the rail column. The chrome strip itself is always visible — it is prototype scaffolding, honestly labelled as such, and is stripped by FE along with everything else carrying `data-annotation`.

### State bands: the label is `Alternate state ·`

The promoted design system uses **`Alternate state · <name>`** (8 of 28 screens). Epic 4 staging drifted to `State — <name>`; that is wrong and is reconciled on next touch. `design-quality-gate.md` C1 keys its visibility check off this convention — a band that does not carry it is invisible to the gate.

### No internal identifiers outside the rail

`Epic N`, `Story N.M`, `FL-N`, task ids, table names (`receiving_logs`, `audit_logs`), and module names (`Product Master`) may appear **only** inside `[data-annotation]`. In product copy they are a defect: the promoted design system is implemented literally, so an epic reference inside a helper line ships to a warehouse clerk.

Where a helper line carries genuine user value *and* a spec reference, split it — keep the user-facing half in the product, move the reference to the rail. "Two decimal places maximum — RSB measurement standard" becomes product copy "Two decimal places maximum" plus a rail note carrying the RSB rationale.

---

## Forbidden in prototypes (linter targets)

- **Spec notes inside the app frame.** Commentary lives in the annotation rail (`[data-annotation="spec"]`), never as a `bg-card` panel in the content column.
- **Internal identifiers in product copy** — `Epic N`, `Story N.M`, `FL-N`, `Task N.M.K`, table names, module names — outside `[data-annotation]`.
- **`State — <name>`** band labels. The convention is `Alternate state · <name>`.
- **Anchor markers in the product column** (numbered badges, footnote markers) that exist only to point at a spec note.
- Inline `<style>:root { … }</style>` token blocks. Tokens are linked, not inlined.
- Hardcoded hex anywhere (`style="background:#1B8C4E"`, `bg-[#F0F2F5]`, `text-[#5F6B7A]`).
- Stock Tailwind palette colors that bypass tokens: `bg-yellow-100`, `text-yellow-800`, `bg-blue-50`, `text-blue-700`, `bg-red-50`, `text-red-600`, etc. Use the tone-paired tokens (`bg-warning-bg text-warning`, `bg-info-bg text-info`, `bg-danger-bg text-danger`).
- Solid `bg-destructive` fills on routine statuses. QUARANTINE / FAILED QC use the danger **tone pair**.
- Multi-hue role pills. All roles use `bg-accent text-accent-foreground`.
- Header band carrying title / search / notifications / actions. Header is breadcrumb-only.
- Input / select / button heights other than `h-10` (login primary CTA is the only `h-11`).
- `shadow-sm` / `shadow-md` / `shadow-lg` on cards. Use `shadow-card`, `shadow-pop`, `shadow-sidebar`, `shadow-btn`.
- Non-Lucide icons — Heroicons, Feather, Material, or hand-drawn `<path>` data. Icons are Lucide only, inlined from `flow-fe/node_modules/lucide-react/…` (see "Icons — Lucide only").
- ALL-CAPS table headers. Title Case.
- Visible "Actions" header label on the row-actions column.
- Pretending the **unfinished list** is done (Documents tab on SupplierDetail, Orders detail page, Products / Inventory / Logistics / Partners detail screens, CSV / PDF export on audit log, Permissions diff modal, tweaks-panel persistence) — render placeholder copy, not invented detail.

---

## Responsive testing

Test every prototype at three viewports before pushing to Figma:
- 375 px (mobile — mandatory for E4 QC / E7 driver)
- 768 px (tablet — warehouse use)
- 1024 px (desktop — manager / admin)

Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsive grids. Never use fixed widths except the 270 px sidebar, the 480 px modal/slide-over, the 260 px action menu, and the 420 px mobile shell.

---

## Accessibility baseline

- All interactive elements are focusable.
- Inputs have associated `<label>` (or `aria-label` for icon-only buttons).
- Color alone never conveys meaning — pair with icon and text.
- Body text contrast ≥ 4.5:1; UI text ≥ 3:1.
- Mobile touch targets ≥ 44 × 44 px (warehouse + driver screens).
- Images: meaningful `alt` text.

---

## Figma push workflow (manual, opt-in)

Pushing prototypes into the Figma FLow-UI/UX file is **never automatic**. Builds and revisions stop after the prototypes land on disk and verification greps pass. Push only when (a) you have reviewed the HTML locally in a browser, and (b) you have decided the build is ready to share.

The capture script is embedded in every prototype (`<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>`). It only does work when the URL carries `#figmacapture=…` hash params, so leaving it in the file is safe.

**Trigger via the agent (preferred):**

- `design-builder push epic N` — push every Epic N prototype
- `design-builder push story N.M` — push the single Story N.M prototype
- `design-builder push ui-flow/e{N}-<slug>/<file>.html` — push one named file
- `design-builder epic N --push` — opt-in to push as part of a build (rare; explicit consent)

**Trigger by hand (no agent):**

1. `cd flow-ui && python3 -m http.server 8899`
2. Generate a capture ID via the Figma MCP tool (`outputMode: existingFile`, `fileKey: dAgFxdPwQDFNYgUGAO6RKt`).
3. Open `http://localhost:8899/ui-flow/e{N}-<slug>/<file>.html#figmacapture=<id>&figmaendpoint=<endpoint>&figmadelay=1500&figmaselector=body`.
4. Poll the captureId until `completed`.
5. Check the FLow-UI/UX file for the new frame under the matching epic page.
6. Stop the server when done: `lsof -ti:8899 | xargs kill -9`.

---

## Version control

Commit prototypes with story reference: `git add ui-flow/e4-receiving/e4-qc-inspection.html && git commit -m "feat(E4): QC inspection form prototype"`. Never commit broken HTML (must render in the browser). Test locally on port 8899 before pushing.
