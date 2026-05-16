# HTML Prototypes — flow-ui

## Rule: Build faithful Tailwind + shadcn/ui prototypes matching production specs

All HTML files in `ui-flow/` must be production-grade prototypes that serve as the single source of truth for frontend implementation.

### File naming convention

Name files by feature/screen, not by epic:
- ✅ `qc-inspection.html` — QC form for mobile (E4)
- ✅ `inventory-ledger.html` — Stock dashboard (E5)
- ✅ `order-portal.html` — B2B order entry (E6)
- ❌ `epic-4.html` — too generic
- ❌ `e4-mobile.html` — avoid epic prefix

### Required structure in HTML

**All design tokens live in `flow-ui/tokens/colors_and_type.css` — the canonical single source of truth.** Prototypes `<link>` that file; never inline a `:root` block.

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
    // Keep this in sync with the canonical tokens file.
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
          'fg-1':'var(--fg-1)', 'fg-2':'var(--fg-2)', 'fg-3':'var(--fg-3)',
          'fg-4':'var(--fg-4)', 'fg-5':'var(--fg-5)', 'fg-6':'var(--fg-6)',
        },
        borderRadius: {
          lg:'var(--radius)', md:'calc(var(--radius) - 2px)', sm:'calc(var(--radius) - 4px)',
          'r-sm':'var(--r-sm)', 'r-md':'var(--r-md)', 'r-lg':'var(--r-lg)', 'r-xl':'var(--r-xl)',
        },
        boxShadow: {
          card:'var(--shadow-card)', pop:'var(--shadow-pop)',
          sidebar:'var(--shadow-sidebar)', btn:'var(--shadow-btn)',
        },
      } },
    }
  </script>
</head>
<body class="bg-background text-foreground font-sans">
  <!-- Prototype content -->
</body>
</html>
```

**Relative paths to `tokens/colors_and_type.css` by depth:**

| Prototype location | Path |
|---|---|
| `flow-ui/*.html` (root) | `tokens/colors_and_type.css` |
| `flow-ui/ui-flow/*.html` | `../tokens/colors_and_type.css` |
| `flow-ui/ui-flow/<epic>/*.html` | `../../tokens/colors_and_type.css` |

**Forbidden:** Inline `<style>:root { … }</style>` blocks defining color/spacing/radius tokens. The canonical file is the only place those values live.

### Color and spacing

- Use Tailwind utility classes only — no `<style>` blocks for layout/spacing
- Reference CSS variables for colors: `bg-[hsl(var(--primary))]`, `text-primary`, `border-border`
- Never use hardcoded hex colors — all colors come from CSS variables
- Spacing: use `space-4`, `p-6`, `m-2` (4px base unit)
- Border radius: `rounded-md` (0.5rem), `rounded-lg` (0.75rem)

### Component patterns (match `flow-fe`)

**Button:**
```html
<button class="px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90">
  Create Supplier
</button>
```

**Input:**
```html
<input
  type="text"
  placeholder="Search..."
  class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
/>
```

**Select (styled as input):**
```html
<select class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none">
  <option value="">Choose one...</option>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</select>
```

**Card:**
```html
<div class="border border-border rounded-lg p-6 bg-background">
  <h3 class="font-semibold text-foreground">Card Title</h3>
  <p class="text-muted-foreground text-sm">Card content</p>
</div>
```

**Badge (status):**
```html
<!-- Active state -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-primary">
  Active
</span>

<!-- Destructive state (QC failed, spoilage) -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
  Failed QC
</span>
```

**Form with validation:**
```html
<div class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-foreground mb-1">
      Email
    </label>
    <input
      type="email"
      placeholder="you@example.com"
      class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
    />
    <p class="text-destructive text-xs mt-1 hidden" id="email-error">
      Invalid email address
    </p>
  </div>
</div>
```

### Special state indicators

**Offline mode:**
```html
<div class="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
  <span class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
  <span class="text-xs text-yellow-800">Offline mode</span>
</div>
```

**QC quarantine state:**
```html
<div class="border-l-4 border-destructive p-4 bg-destructive/5">
  <p class="text-destructive font-semibold">Quarantined</p>
  <p class="text-destructive text-sm">Failed QC — Reason: Color defect</p>
</div>
```

**Expiry warning:**
```html
<div class="border border-destructive/20 rounded-md p-3 flex gap-2">
  <span class="text-destructive">⚠</span>
  <div>
    <p class="text-sm font-semibold text-foreground">Expiring soon</p>
    <p class="text-xs text-muted-foreground">Expires in 2 days</p>
  </div>
</div>
```

### Responsive design

- Desktop-first development (480px, 768px, 1024px breakpoints)
- Mobile screens (E4, E7) must be explicitly tested at 375px viewport width
- Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsive layouts
- Never use fixed widths except for sidebar (320px)

### Accessibility baseline

- All interactive elements focusable (`tabindex` if needed)
- Form inputs have associated `<label>` elements
- Color alone doesn't convey meaning (use icons, text, or borders)
- Sufficient contrast ratio (4.5:1 minimum for body text)
- Alt text for images: `<img src="..." alt="Supplier logo for Acme Farm" />`

### Version control

- Commit changed prototypes with story reference: `git add ui-flow/qc-inspection.html && git commit -m "feat(E4): QC inspection form prototype"`
- Never commit broken HTML (must render in browser)
- Test locally: `python3 -m http.server 8899` and visit `http://localhost:8899/ui-flow/`

### Figma push workflow

1. Local server running: `python3 -m http.server 8899`
2. Generate capture ID via Figma MCP
3. Open browser with hash params: `http://localhost:8899/ui-flow/qc-inspection.html#figmacapture=...`
4. Poll capture status until `completed`
5. Check Figma file for new frames in the corresponding epic page
