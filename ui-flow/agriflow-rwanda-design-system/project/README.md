# AgriFlow Rwanda — Design System

AgriFlow Rwanda is an **agricultural supply-chain operations platform** built for cooperatives, processors, distributors, and government partners in Rwanda. It centralises orders, inventory, logistics, suppliers, and finance for actors moving food from farm to market — with a strong focus on **reducing post-harvest food loss** (the recurring tagline across login/auth screens).

The figma file ships three sections, all branded as AgriFlow Rwanda:

- **Design System** — color palette, sidebar navigation (collapsible).
- **Identity & Access Management** — login, sign-up, password reset, MFA, account-locked states; user/role/audit-log managers.
- **Partners & Supplier Ecosystem** — supplier directory, scorecard, price book, profile, register-supplier flows.

> **Note on naming:** the figma color-palette frame is mislabeled "FleetFlow Color Palette" and the sidebar component is named "FleetFlow Sidebar (Tailwind + shadcn)". All in-product copy and the logo say **AgriFlow**. We treat AgriFlow as canonical; the FleetFlow names appear to be leftover from a template.

## Sources

- **Figma file:** `FLow-UI_UX.fig` — mounted as a virtual filesystem in the original session.
  - `/Page-1/Design-System` — palette + sidebar
  - `/Page-1/Identity-Access-Management` — auth + IAM screens
  - `/Page-1/Partners-Supplier-Ecosystem` — supplier flows
- **No codebase was attached.** All visual decisions are derived from the figma JSX pseudocode and screenshots.

## Index

```
README.md                       — this file
SKILL.md                        — agent skill manifest
colors_and_type.css             — CSS variables for color + type (semantic)
fonts/                          — webfont files (or links to Google Fonts)
assets/
  logo/                         — AgriFlow logos (mark + lockup)
  icons/                        — feather/lucide-style stroke icons used in the product
  illustrations/                — empty states, brand splash imagery
preview/                        — design-system specimen cards (palettes, type, components)
ui_kits/
  agriflow-app/                 — the operations web-app UI kit (sidebar, tables, forms)
slides/                         — (omitted — no slide template was provided)
```

UI Kits:

- `ui_kits/agriflow-app/index.html` — sidebar + dashboard + suppliers directory
  (interactive); login screen reachable on first load if you set `authed=false`
  in `App`.

Preview cards (registered for the Design System tab):

- Brand: Logo
- Colors: Primary, Neutral, Semantic, Surface
- Type: Display, Body, Eyebrow + Mono
- Spacing: Radii, Shadows, Spacing scale
- Components: Buttons, Inputs, Pills & Badges, Card, Sidebar nav rows, Alerts, Avatars, Table row
```

## CONTENT FUNDAMENTALS

**Voice:** clear, calm, slightly formal. Operational SaaS tone. The product is used in
mixed-language settings (Rwanda; the figma is in English), so phrasing favours short,
plain words over marketing flourish.

**Person:** **second person** ("Enter your credentials to access the platform", "Welcome back").
Helpdesk copy uses third-person task labels ("Reducing post-harvest food loss in Rwanda").

**Casing:**
- **Sentence case** in body copy and most buttons ("Sign in", "Forgot your password?").
- **Title Case** for page titles, table headers, navigation labels ("User Management",
  "Audit Log Viewer", "Supplier Directory").
- **ALL CAPS, tracked +1.2px, 10–11px** for tiny section labels in the sidebar
  ("MAIN", "OPERATIONS", "ANALYTICS") and palette swatch group headers
  ("PRIMARY — GREEN", "NEUTRAL — GRAY", "SEMANTIC COLORS").

**Tone examples** (verbatim from the figma):
- "Welcome back" / "Enter your credentials to access the platform"
- "Reducing post-harvest food loss in Rwanda"
- "Need help?" / "Go to Help Center →"
- "Account temporarily locked"
- Status pills: "Active", "Pending", "Suspended", "Expired"
- Numeric badge in nav: "12" (orders count) — terse, just the number.

**Emoji:** **none in the UI.** A single chevron glyph "❯" appears as the sidebar-collapse
indicator; this is the Unicode character, not an emoji.

**Punctuation:**
- Em-dashes used sparingly in palette labels ("Primary — Green").
- Right arrow "→" used in CTA links to Help / external destinations.
- Stars "★" used to mark the canonical primary swatch ("Green 500 ★").

**Numbers:** badges and counters render as bare integers; no "+" suffix observed.

## VISUAL FOUNDATIONS

**Color vibe.** Single-hue brand: a deep agricultural green `#1B8C4E` (Green 500) anchors
the palette. Surrounding it are nine-step green and gray ramps plus four semantic colors
(success green, warning amber `#F59E0B`, danger red `#E74C3C` / `#EF4444`, info blue
`#3B82F6`). Backgrounds are warm-cool neutral (`#F0F2F5` page, `#F3FAF6` green tint for
brand surfaces). The overall feel is **sober, utilitarian, optimistic** — closer to
finance/ops dashboards than to consumer agtech.

**Type.** Inter at four weights (Regular 400, Medium 500, Semi Bold 600, Bold 700).
Body 14px / labels 13.5px / micro 11–12px / tiny caps 10–11px tracked +1.2px.
Headings 18–24px Bold. **Courier New** and **Menlo** appear in the audit-log viewer
for code/JSON strings — keep them as the mono fallback. No display face; Inter does
everything.

**Spacing.** 4-pt base, with frequent 8/12/16/20/24/32/48 px stops. Sidebar list items
sit on a 40px row with 8px outer gutter and 8–12px inner padding. Palette swatch cards
are `~135×110` rectangles. Form fields are roughly 44–48px tall.

**Backgrounds.** **Flat fills, no gradients, no patterns, no photography in core UI.**
The login page uses a split-screen: white form on the right, solid `#1B8C4E` panel on
the left with white headline copy ("Reducing post-harvest food loss in Rwanda") and a
small stat row. No imagery. The dashboard / list pages sit on the `#F0F2F5` background;
cards are pure white.

**Animation.** Not specified in the figma; the file is static. We assume subtle,
**short fades (150–200ms, ease-out)** for hover/menu transitions and a slightly longer
**220ms ease** for sidebar collapse. No bouncing, no parallax. Conservative motion.

**Hover.** Sidebar items shift to a **light-green tint** background (`#F3FAF6`-ish) and
the text + icon shift to `#1B8C4E`. Buttons darken ~one step (Green 500 → Green 600 on
hover; Green 600 → Green 700 on press). Links use simple opacity 0.85.

**Press.** Slight darkening; **no shrinking transform**. Maintains size to feel reliable,
not bouncy.

**Borders.** A single hairline at `1px solid #E8EBE9` (or `#E5E8EB`) is the dominant
divider. Cards use this border with `borderRadius: 12` and a soft shadow. Dividers in
sidebar are 1px `#F0F0F0`.

**Shadows.**
- Card / popover: `1px 0 4px rgba(0,0,0,0.04), 4px 0 16px rgba(0,0,0,0.08)` — directional,
  used on the sidebar; for cards use the equivalent dropping downward.
- Subtle: `0 1px 2px rgba(0,0,0,0.05)` for elevated buttons.
- No inner shadows. No glow. No colored shadows.

**Capsules vs pills.** Status uses **rounded-full pills** with tinted background +
darker text (e.g. green-50 bg, green-700 text for "Active"; red-50 bg, red-700 text for
"Suspended"; yellow-50 bg, yellow-700 text for "Pending"). Numeric notification badges
are red `#E74C3C` filled, white text, ~10px bold, fully rounded.

**Layout rules.**
- Fixed left sidebar 270px (collapsible to icon rail).
- Main content fluid; max content width ~1320px on wide screens.
- Top bar inside content (page title + actions), not a full-width chrome bar.
- Tables span the content width; cards arranged in 2–4 column grids.

**Transparency / blur.** **Not used.** The product is opaque-on-opaque. Shadows do
the layering work.

**Imagery.** None in the core figma — the product is data-first. The brand mark uses
a green rounded-square tile with a white "F" (figma) / "A" (when treated as AgriFlow).
We treat the mark as a flat green tile + white letter; no gradients on the logo.

**Corner radii.**
- 6px — small inputs, tags
- 8px — buttons, list items, rows
- 10–12px — cards, modals, the brand logo tile
- 14–17px — circular avatars, small toggle pills
- 9999px — status pills, notification badges

**Cards.** White fill, 1px `#E8EBE9` border, 12px radius, `0 1px 3px rgba(0,0,0,0.04)`
shadow. Padding usually 24px. Internal section dividers use the same border color.

## ICONOGRAPHY

The figma uses **stroke-based, 18×18 px line icons** drawn at ~1.5px weight inside an
18px frame, sitting in 20×20 hit boxes inside 40×40 list items. The stroke style and
weight are **a 1:1 match for [Lucide](https://lucide.dev)** (the open-source feather
fork that powers shadcn/ui, which the sidebar's filename hints at).

Implementation choices:

- **No icon font ships in the figma.** Vectors are flattened SVG paths.
- We **link Lucide via CDN** as the canonical icon set for this design system. This is
  a *substitution*, not a copy — flag for the user.
- Specific icons used in the sidebar map cleanly to Lucide names: `layout-dashboard`,
  `shopping-cart`, `package`, `users`, `truck`, `boxes`, `warehouse`, `bar-chart-3`,
  `file-text`, `settings`, `chevron-down`, `chevron-right`, `life-buoy`.
- **Emoji are never used as icons.** A single Unicode chevron `❯` appears as the
  sidebar-collapse handle.
- The brand mark itself (the green rounded-tile with letter inside) functions as both
  logo and favicon — see `assets/logo/`.

When working in this system, **prefer Lucide names**. If a Lucide icon doesn't fit, use
the closest match and note the substitution; do not draw new SVG icons.

## BRAND MARKS

The AgriFlow leaf mark ships as **two canonical SVGs** in `assets/logo/`. Pick by the
surface the mark sits on (contrast rule):

| Asset | What it is | Use on | How to place |
|---|---|---|---|
| `agriflow-badge.svg` | Green rounded badge with a **white** leaf (self-contained tile) | **Light / white** surfaces — sidebar & nav brand lockups, light cards | Drop into a `rounded-[10px] overflow-hidden` tile at `w-10 h-10` (or `size-9`/`36px`). No wrapper background — the badge bakes in its own `#1B8C4E` tile. |
| `agriflow-leaf.svg` | **Green** leaf on transparent (no tile) | **Green** surfaces — auth brand panels (login / password-reset / account-activation) | Place inside a solid **white** tile (`bg-card` / `#fff`) `rounded-[10px]`, leaf filling it (`w-full h-full`). |

**Wordmark:** "AgriFlow" in Inter **700**, **22px**, `letter-spacing:-0.3px` — `#1B8C4E`
on light surfaces, white on green. Canonical reference: `preview/logo.html` (`.word`).

**Retired (do not reintroduce):** the rotated raster marks `leaf-rotated-white.png`,
`leaf-rotated-green.png`, and `leaf-rotated.png` were removed 2026-07-06 — the promoted
screens migrated in PR #38, and the ui-kit / preview references in this follow-up. Use the
two SVGs above instead. The remaining `leaf-source*.png` / `leaf-cropped.png` /
`leaf-sprite.png` files are **raw source art**, not display marks — never reference them
from a prototype.
