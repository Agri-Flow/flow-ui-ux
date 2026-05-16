# AgriFlow Web App — UI Kit

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
