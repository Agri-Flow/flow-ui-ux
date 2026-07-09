# Design Tokens — flow-ui

## Rule: All design tokens live in `flow-ui/tokens/colors_and_type.css` — the canonical single source of truth

`flow-ui` is the design-system contract. Prototypes consume tokens via `<link>` to the canonical file; `flow-fe` mirrors the same values when implementing. There is one source, never two.

### Canonical location

```
flow-ui/tokens/colors_and_type.css   ← single source of truth
flow-ui/tokens/fonts/fonts.css       ← font imports (Inter, Menlo fallback)
```

The file has **two layers** in its `:root` block:

1. **shadcn HSL compatibility layer** — HSL triples for tokens consumed by Tailwind CDN utilities (`bg-primary`, `text-destructive`, `border-border`, etc.). Names follow shadcn convention: `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--card`, `--popover`, `--sidebar-*`.
2. **Hex aliases** for direct CSS authoring: `--green-50`…`--green-900`, `--gray-50`…`--gray-900`, semantic pairs (`--success`/`--success-bg`, `--warning`/`--warning-bg`, `--danger`/`--danger-bg`, `--info`/`--info-bg`), surfaces (`--bg`, `--bg-tint`, `--surface`), 6-level text ramp (`--fg-1`…`--fg-6`), 5-step radii (`--r-sm`/`--r-md`/`--r-lg`/`--r-xl`/`--r-pill`), 4-step shadow scale (`--shadow-card`/`--shadow-pop`/`--shadow-sidebar`/`--shadow-btn`), spacing scale (`--s-1`…`--s-12`), type scale (`--t-display`…`--t-micro`).

Both layers stay in sync — when a value changes in one, update its twin in the same edit.

### Full token reference

| Group | Token | Value |
|---|---|---|
| **Brand** | `--primary` / `--green-500` | `#1B8C4E` (HSL `148 76% 33%`) |
| **Surfaces** | `--background` / `--bg` | `#F0F2F5` (page plate) |
| | `--card` / `--surface` | `#FFFFFF` (cards/inputs) |
| | `--accent` / `--bg-tint` | `#F3FAF6` (brand-tint hovers, "Need help?", info chips) |
| **Text ramp** | `--fg-1` | `#0F1729` (highest emphasis) |
| | `--fg-2` / `--foreground` | `#1F2937` (primary body) |
| | `--fg-3` | `#374151` (secondary) |
| | `--fg-4` / `--muted-foreground` | `#5F6B7A` (muted) |
| | `--fg-5` | `#8896A4` (placeholder) |
| | `--fg-6` | `#9CA3AF` (disabled) |
| **Semantic** | `--success` / `--success-bg` | `#1B8C4E` / `#EEF6F2` |
| | `--warning` / `--warning-bg` | `#F59E0B` / `#FEF9E7` |
| | `--danger` / `--danger-bg` | `#E74C3C` / `#FEE2E2` |
| | `--info` / `--info-bg` | `#3B82F6` / `#EEF6FF` |
| | `--destructive` | `#E74C3C` (shadcn alias of `--danger`) |
| **Radii** | `--r-sm` / `--r-md` / `--r-lg` / `--r-xl` | 6 / 8 / 10 / 12 px |
| | `--radius` (shadcn base) | `0.75rem` → `rounded-lg` = 12 px (cards) |
| **Shadows** | `--shadow-card` | `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)` |
| | `--shadow-pop` | `0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)` |
| | `--shadow-sidebar` | `1px 0 4px rgba(0,0,0,0.04), 4px 0 16px rgba(0,0,0,0.08)` (directional) |
| | `--shadow-btn` | `0 1px 2px rgba(0,0,0,0.05)` |

### Tailwind utility coverage (prototype-side)

The inline `tailwind.config` in every prototype exposes these utility families that resolve to the canonical tokens:

- shadcn standards: `bg-primary`, `text-primary`, `border-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-destructive`, `bg-card`, `bg-popover`, `bg-sidebar`, etc.
- Semantic: `bg-success`, `bg-success-bg`, `text-success`; same for `warning`, `danger`, `info`.
- Surface aliases: `bg-page` (= `--bg`), `bg-tint` (= `--bg-tint`), `bg-surface` (= `--surface`).
- Text ramp: `text-fg-1` through `text-fg-6`.
- Explicit radii: `rounded-r-sm` (6), `rounded-r-md` (8), `rounded-r-lg` (10), `rounded-r-xl` (12).
- Shadow scale: `shadow-card`, `shadow-pop`, `shadow-sidebar`, `shadow-btn`.

### Usage in HTML prototypes

Always use the utility classes; never hardcode hex.

**Good:**
```html
<button class="bg-primary text-primary-foreground rounded-md hover:opacity-90">Create</button>
<span class="bg-success-bg text-success px-2 py-0.5 rounded-r-sm">Active</span>
<span class="bg-warning-bg text-warning px-2 py-0.5 rounded-r-sm">Pending</span>
<aside class="bg-sidebar shadow-sidebar border-r border-border">…</aside>
<div class="bg-page min-h-screen">…</div>   <!-- page plate -->
<div class="bg-card rounded-lg shadow-card p-6">Card</div>
```

**Bad:**
```html
<button style="background: #1B8C4E; color: white;">Create</button>
<span class="bg-yellow-100 text-yellow-800">Pending</span>          <!-- use bg-warning-bg text-warning -->
<span class="bg-blue-50 text-blue-700">Manager</span>                <!-- role pills: bg-accent text-accent-foreground -->
<div style="background: #f0f2f5;">…</div>                            <!-- use bg-page -->
```

### Semantic usage patterns

| Situation | Token |
|---|---|
| Primary action (Create, Save, Confirm) | `bg-primary text-primary-foreground` |
| Secondary action (Cancel) | `text-muted-foreground hover:text-foreground` |
| Brand-tint hover (sidebar row, "Need help?", info chip) | `bg-accent` / `bg-tint` |
| Status — active / success | `bg-success-bg text-success` |
| Status — pending / warning | `bg-warning-bg text-warning` |
| Status — error / inactive | `bg-danger-bg text-danger` |
| Status — info | `bg-info-bg text-info` |
| QC failure / spoilage / destructive | `bg-destructive/5 text-destructive border-destructive` |
| Role pill (Manager / Picker / Driver / Finance) | `bg-accent text-accent-foreground` (single-hue brand) |
| Page background | `bg-background` (= page plate `#F0F2F5`) |
| Card surface on page | `bg-card rounded-lg shadow-card` |
| Form input | `border-border focus:ring-primary` |
| Placeholder text | `text-fg-5` |
| Disabled state | `text-fg-6 opacity-50` |

### Design decisions (locked 2026-05-15)

**Role colors — Option B (single-hue brand):** Roles are distinguished by label/icon, not by hue. All role pills use `bg-accent text-accent-foreground`. The previous multi-hue approach (Admin=green, Manager=blue, Picker=orange, Driver=purple, Finance=teal) was retired during the design-system alignment pass.

**Page title sizing:** `text-xl font-semibold text-foreground` (20 px Semibold) for in-app pages. The bundle's larger `--t-display` (24 px Bold) is reserved for top-level dashboard headers.

### Adding or changing tokens

1. Edit `flow-ui/tokens/colors_and_type.css` — change the value in **both** the HSL layer and its hex twin in the same edit.
2. Run a verification grep across `flow-ui/ui-flow/` to confirm no stale hardcoded values remain.
3. When `flow-fe` consumes a new token, mirror it in `flow-fe/src/app/globals.css` and `flow-fe/tailwind.config.ts` — `flow-ui` is the contract.

> **Self-consistency gate (cross-repo audit F-9).** `.claude/scripts/check-token-consistency.sh` (CI job `Token self-consistency`) asserts that every alias documenting the same canonical color agrees by exact hex — so the "change both the HSL layer and its hex twin in the same edit" rule above is enforced, not just documented. The downstream half lives in flow-fe (`yarn tokens:check` against a committed snapshot of this file). Editing a color here means updating all its twins (e.g. `--primary` comment = `--green-500` = `--success` = `--link`) and, downstream, refreshing the flow-fe snapshot.

### Figma integration

The Figma FLow-UI/UX file has a Variables panel that mirrors these tokens. When tokens change, push the canonical CSS to Figma via the MCP capture script so both sources of truth stay aligned.

### Dark mode (future)

Reserved for a later phase. Definitions will use `prefers-color-scheme: dark` media query and live in the same canonical file under a sibling block.
