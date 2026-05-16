# flow-ui Rules — Design System Standards

This directory contains standards for design prototypes and the design token system. **`flow-ui` is the canonical source of truth — `flow-fe` mirrors these values when implementing.**

## Rules

- **[prototypes.md](prototypes.md)** — HTML prototypes `<link>` canonical tokens (no inline `:root`)
- **[tokens.md](tokens.md)** — All tokens live in `flow-ui/tokens/colors_and_type.css`

## Canonical files

- `flow-ui/tokens/colors_and_type.css` — the design-system contract
- `flow-ui/tokens/fonts/fonts.css` — font imports (Inter, Menlo fallback)
- `flow-ui/ui-flow/agriflow-rwanda-design-system/` — reference bundle (read-only context; previews symlink to canonical tokens)

## Key Constraints

- **No inline `:root` blocks** in prototypes — `<link>` `tokens/colors_and_type.css` instead
- **No hardcoded hex** in prototype markup — use Tailwind utilities (`bg-primary`, `text-warning`, `bg-success-bg`)
- **Role pills** use `bg-accent text-accent-foreground` (single-hue brand — Phase 4 decision, locked 2026-05-15)
- **Page titles** use `text-xl font-semibold text-foreground` (20 px Semibold) for in-app pages; reserve 24 px Bold for top-level dashboard headers
- Every prototype must include the Figma MCP capture script
- File naming: by feature (`qc-inspection.html`), not by epic (`epic-4.html`)
- Responsive design tested at 375 px, 768 px, 1024 px breakpoints
