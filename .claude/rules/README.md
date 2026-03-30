# flow-ui Rules — Design System Standards

This directory contains standards for design prototypes and the design token system.

## Rules

- **[prototypes.md](prototypes.md)** — HTML prototypes follow Tailwind + shadcn pattern
- **[tokens.md](tokens.md)** — All colors reference CSS variables, not hardcoded hex

## Key Constraints

- Every prototype must include the Figma MCP capture script
- All colors use CSS variable references (`bg-primary`, `text-destructive`)
- Prototypes are tested locally before pushing to Figma
- File naming: by feature (`qc-inspection.html`), not by epic (`epic-4.html`)
- Responsive design tested at 375px, 768px, 1024px breakpoints
