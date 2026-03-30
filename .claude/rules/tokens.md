# Design Tokens — flow-ui

## Rule: All design tokens flow from CSS variables to Tailwind to components

The design system is built on semantic color tokens that coordinate across Figma, HTML prototypes, and the Next.js frontend.

### Color token hierarchy

**Base tokens (CSS variables):**
```css
:root {
  /* Brand primary — AgriFlow green */
  --primary: 148 76% 33%;           /* #1B8C4E */
  --primary-foreground: 0 0% 100%;  /* #FFFFFF */

  /* Accent — hover backgrounds, subtle highlights */
  --accent: 148 30% 95%;            /* #F3FAF6 */
  --accent-foreground: 148 76% 28%; /* unused, reserved */

  /* Error/destructive — QC failures, spoilage, deletions */
  --destructive: 4 86% 58%;         /* #E74C3C */

  /* Neutral palette */
  --muted: 210 16% 96%;             /* #F0F2F5 */
  --muted-foreground: 215 16% 47%;  /* #5F6B7A */
  --foreground: 222 47% 11%;        /* #1F2937 */
  --border: 210 14% 91%;            /* #E8EBE9 */
  --background: 0 0% 100%;          /* #FFFFFF */

  /* UI ring (focus states) */
  --ring: 148 76% 33%;              /* same as primary */

  /* Spacing base unit */
  --radius: 0.5rem;
}
```

**Full color scale (greens, grays):**
See `color-palette.html` for 10-shade palettes (50–900). Reference for design documentation only.

### Tailwind color mapping

All Tailwind utilities map to CSS variables:
```css
@tailwind base;

@layer base {
  :root {
    @apply [color-variable-definitions];
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 rounded-md bg-primary text-primary-foreground;
  }
}
```

### Usage in HTML prototypes

Always use CSS variable references, not hardcoded colors:

**Good:**
```html
<button class="bg-primary text-primary-foreground hover:opacity-90">Create</button>
<div class="text-muted-foreground">Secondary label</div>
<div class="border border-border rounded-md">Card</div>
```

**Bad:**
```html
<button style="background: #1B8C4E; color: white;">Create</button>
<div style="color: #5F6B7A;">Secondary label</div>
<div style="border: 1px solid #E8EBE9;">Card</div>
```

### Frontend integration (flow-fe)

Tokens are defined in `src/app/globals.css` and `tailwind.config.ts`:
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)",
        // ... etc
      },
    },
  },
};
```

When adding new tokens here, **simultaneously update:**
1. `flow-ui/globals.css` (or inline in HTML `<style>`)
2. `flow-ui/tailwind.config.ts`
3. HTML prototypes in `ui-flow/`

### Semantic usage patterns

| Situation | Token |
|-----------|-------|
| Primary action (Create, Save, Confirm) | `bg-primary text-primary-foreground` |
| Secondary action (Cancel, Delete icon) | `text-muted-foreground hover:text-foreground` |
| Hover state on cards/rows | `bg-accent` |
| Error message / failed QC / spoilage alert | `text-destructive` or `border-destructive` |
| Disabled state (input, button) | `bg-muted text-muted-foreground opacity-50` |
| Form input | `border-border focus:ring-primary` |
| Secondary text (labels, hints) | `text-muted-foreground` |
| Card/container border | `border-border` |
| Page background | `bg-background` |

### Example: QC Failure State

When a batch fails QC, use destructive styling throughout:
```html
<div class="border-l-4 border-destructive bg-destructive/5 p-4">
  <div class="flex items-start gap-3">
    <span class="text-destructive text-xl">✕</span>
    <div>
      <h4 class="font-semibold text-destructive">QC Failed</h4>
      <p class="text-sm text-foreground">Reason: Color defect</p>
      <button class="mt-2 px-3 py-1 rounded text-destructive border border-destructive hover:bg-destructive/10">
        View Details
      </button>
    </div>
  </div>
</div>
```

### Dark mode (future)

Token definitions use `prefers-color-scheme: dark` media query:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --foreground: 0 0% 100%;
    --background: 222 47% 11%;
    /* ... inverted values */
  }
}
```

Currently all designs target light mode. Dark mode tokens are reserved for Phase 2.

### Figma integration

Figma FLow-UI/UX file has a Variables panel that mirrors these tokens:
- Export color variables from Figma Variables panel
- Use in component instances to ensure consistency
- Push prototype changes back to Figma via MCP capture script
