# AgriFlow Web App — UI Kit

> ## ⚠️ READ FIRST — JSX is for visual review only
>
> The `.jsx` files in this folder run via `<script type="text/babel">` in `index.html` (Babel-standalone, in-browser). **They are not a React build, not a TypeScript codebase, and not the implementation contract for `flow-fe`.** Their job is to let designers + the founder click through the kit holistically, exercise the tweaks panel (surface / density / voice), and eyeball the system end-to-end.
>
> **`flow-fe` and any other implementing agent reads from `./screens/` instead** — the gated promoted HTML produced by `design-builder promote …` after passing `design-linter` signoff. The promoted HTML is the contract: token-linked, hex-clean, state-covered, linter-signed. The JSX is not.
>
> Why the split: the JSX hardcodes 600+ hex literals across the major screens, ships Nunito / Fraunces / IBM Plex Mono (not the canonical Inter), bakes in the `inked` / `field` surfaces that the production app does not ship, and has no module / TS / linter scaffolding. Translating it to Next.js + shadcn + Radix buys nothing over re-implementing fresh from the promoted HTML, and it inherits the drift.
>
> See `./screens/SCREENS-INDEX.md` for the catalog of promoted files, and `flow-ui/.claude/rules/prototypes.md` for the full pipeline + promotion gates.

---

Hi-fidelity recreation of the AgriFlow Rwanda operations platform from
`/Page-1/Identity-Access-Management` and `/Page-1/Partners-Supplier-Ecosystem`
in the figma file.

## Screens

- `Login` — split-screen brand panel + form (matches IAM "Login — AgriFlow Rwanda").
- `Dashboard` — stat row + recent orders table + top suppliers + impact card.
- `Suppliers` — directory with filter chips, status pills, on-time + quality columns.
- Other nav items (Orders, Products, Inventory, etc.) link to a placeholder card.

## Components

- `Sidebar` — 270px collapsible left rail, brand-tinted active state, section headers,
  Need-Help card, user footer. Expands Dashboard child rows when active.
- `Header` — page title + subtitle, ⌘K search, bell, action buttons.
- `Card`, `StatCard`, `Pill`, `Badge`, `Button` (primary / secondary / ghost / danger).

## Run

Open `index.html`. The header/dashboard/suppliers are all interactive — click sidebar
items to switch screens.

## Iconography

Lucide via CDN. Names used: `layout-dashboard`, `shopping-cart`, `package`, `users`,
`truck`, `boxes`, `warehouse`, `user-cog`, `bar-chart-3`, `file-text`, `settings`,
`life-buoy`, `search`, `bell`, `filter`, `download`, `plus`, `chevron-down`,
`chevron-right`.
