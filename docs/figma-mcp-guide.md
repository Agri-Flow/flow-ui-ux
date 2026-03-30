# Figma MCP Guide — flow-ui

Integration with Figma via Model Context Protocol (MCP) for design-to-code workflows.

## What is Figma MCP?

Model Context Protocol allows Claude Code to:
- ✅ Fetch Figma design metadata
- ✅ Extract design variables and tokens
- ✅ Generate screenshots of design pages
- ✅ Push HTML prototypes back to Figma via capture script
- ✅ Align designs with implementation specifications

## Setup

### Prerequisites

1. **Figma Account** — Sign up at https://www.figma.com
2. **AgriFlow Team Access** — Ask design lead for invite
3. **File Access** — Access to FLow-UI/UX file
4. **Claude Code** — Open from flow-ui directory

### File Information

| Property | Value |
|----------|-------|
| **File Name** | FLow-UI/UX Design System |
| **File Key** | `dAgFxdPwQDFNYgUGAO6RKt` |
| **Direct Link** | https://www.figma.com/file/dAgFxdPwQDFNYgUGAO6RKt/Flow-UI |
| **Team** | AgriFlow Rwanda |

## Using Figma MCP with Claude Code

### 1. Get Design Metadata

When in flow-ui directory, Claude can fetch design metadata:

**Available Data:**
- All pages and frames
- Component names and structure
- Design tokens (colors, typography, spacing)
- Variable definitions
- Layer organization

**Claude will use:**
```
mcp__figma-remote-mcp__get_metadata
```

### 2. Extract Design Variables

Fetch all design tokens defined in Figma:

**Variables Returned:**
- Color tokens (primary, accent, destructive, etc.)
- Typography variables (font families, sizes, weights)
- Spacing tokens (8px base unit: 4, 8, 12, 16, 24, 32, 48, 64)
- Border radius values
- Shadow definitions

**Claude will use:**
```
mcp__figma-remote-mcp__get_variable_defs
```

### 3. Get Design Context

Request design context for specific epic or component:

**Returns:**
- Page structure and hierarchy
- Component descriptions
- Interaction specs
- Color and typography usage
- Responsive design notes

**Claude will use:**
```
mcp__figma-remote-mcp__get_design_context
```

### 4. Generate Screenshots

Fetch visual screenshots of design pages:

**Useful For:**
- Comparing prototype to design
- Documenting current state
- Sharing progress with team
- Validating implementation matches design

**Claude will use:**
```
mcp__figma-remote-mcp__get_screenshot
```

### 5. Generate Design from Context

Create or update Figma designs based on code requirements:

**Capabilities:**
- Generate new component frames
- Update existing design pages
- Push prototype captures to Figma

**Claude will use:**
```
mcp__figma-remote-mcp__generate_figma_design
```

## Workflow Examples

### Example 1: Implement Button Component

**Process:**
1. Claude fetches button component metadata from Figma
2. Claude gets design variables (colors, spacing, typography)
3. Claude generates button HTML in `ui-flow/button.html`
4. Claude validates styling matches design tokens
5. Claude pushes prototype to Figma via capture script

### Example 2: Build New Epic Screen

**Process:**
1. Claude requests design context for Epic 3 (Product Catalog)
2. Claude fetches page structure and component list
3. Claude gets design metadata for all components
4. Claude generates HTML prototype (`ui-flow/product-catalog.html`)
5. Claude captures and pushes to Figma
6. Designer reviews in Figma, provides feedback
7. Claude updates prototype based on feedback

### Example 3: Sync Design Tokens

**Process:**
1. Claude extracts all design variable definitions from Figma
2. Claude generates CSS variable definitions
3. Claude updates `flow-ui/globals.css` and `tailwind.config.ts`
4. Claude commits changes with token updates
5. Frontend team pulls latest tokens

## Proto capture Workflow

HTML prototypes auto-push to Figma via the capture script:

### Script Location

Every HTML file must include:
```html
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
```

### Capture Process

1. **Local server running:**
   ```bash
   python3 -m http.server 8899
   ```

2. **Claude generates capture ID** via Figma MCP:
   ```
   mcp__figma-remote-mcp__generate_figma_design
   ```

3. **Open prototype with capture params:**
   ```
   http://localhost:8899/ui-flow/qc-inspection.html#figmacapture=<ID>&figmaendpoint=<ENDPOINT>&figmadelay=1500
   ```

4. **Capture script renders** and pushes to Figma

5. **Figma frame created** in appropriate epic page

6. **Check Figma** for new frame with prototype screenshot

## Figma File Structure

### Pages

| Page | Purpose | Status |
|------|---------|--------|
| **Design Tokens** | Color palette, typography, spacing | ✅ Complete |
| **Components** | Reusable UI components | ✅ In Progress |
| **E1: Identity & Access** | Login, Register, Profile screens | ✅ Complete |
| **E2: Partners** | Supplier management screens | ✅ In Progress |
| **E3: Products** | Product catalog screens | ✅ In Progress |
| **E4: Receiving** | QC inspection, batch intake | ✅ Planned |
| **E5: Inventory** | Stock levels, movements | ✅ Planned |
| **E6: Orders** | B2B order management | ✅ Planned |
| **E7: Logistics** | Delivery tracking, routes | ✅ Planned |
| **E8: Consignment** | Retail module | ✅ Planned |
| **E9: Compliance** | Audit logs, reporting | ✅ Planned |

### Design Tokens Page

**Color Tokens:**
- Primary: `#1B8C4E` (AgriFlow green)
- Accent: `#F3FAF6` (Light green hover)
- Destructive: `#E74C3C` (Red for errors/QC failures)
- Neutral palette (grays, whites)

**Typography:**
- Heading 1: Inter 32px Bold
- Heading 2: Inter 24px Bold
- Body: Inter 16px Regular
- Small: Inter 14px Regular
- Caption: Inter 12px Regular

**Spacing:**
- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px (8px base unit)

**Border Radius:**
- sm: 0.25rem
- md: 0.5rem
- lg: 0.75rem

### Components Page

Library of reusable components:
- Buttons (primary, secondary, ghost, destructive)
- Inputs (text, email, password, select)
- Forms (with validation states)
- Cards (user, product, order)
- Navigation (sidebar, tabs)
- Modals (alert, form, confirm)
- Badges (status indicators)
- Loaders (spinners, progress)

## Best Practices

### For Designers

✅ **Do:**
- Name components clearly: `Button/Primary`, `Input/Text`
- Use design tokens consistently
- Document component states (default, hover, active, disabled)
- Create component descriptions
- Keep file organized by epic

❌ **Don't:**
- Use hardcoded colors in components
- Mix design tokens and custom colors
- Create duplicate components
- Leave components unnamed
- Forget to update Figma when design changes

### For Developers

✅ **Do:**
- Reference Figma for design specs before coding
- Use Claude to fetch design context
- Match CSS variable tokens exactly
- Test prototypes at different breakpoints
- Push screenshots back to Figma

❌ **Don't:**
- Hardcode colors — use CSS variables
- Assume spacing values — fetch from Figma
- Skip design validation
- Create components not in Figma design system
- Leave prototypes out of sync with Figma

## Troubleshooting

### MCP Connection Issues

**Error:** "Cannot fetch Figma metadata"

**Solutions:**
1. Verify file key is correct: `dAgFxdPwQDFNYgUGAO6RKt`
2. Check Figma account is logged in
3. Verify team access is granted
4. Restart Claude Code
5. Check MCP permissions in `.claude/settings.json`

### Capture Script Not Working

**Error:** "Prototype not appearing in Figma"

**Solutions:**
1. Verify server running: `python3 -m http.server 8899`
2. Check capture script included in HTML
3. Verify capture ID is correct in URL
4. Check browser console for errors
5. Try opening file directly in Figma

### Design Tokens Not Matching

**Error:** "Colors in prototype differ from Figma"

**Solutions:**
1. Fetch latest tokens via MCP
2. Update CSS variable definitions
3. Clear browser cache: Ctrl+Shift+Del
4. Verify Tailwind config matches tokens
5. Test with updated variables

## Integration Checklist

When implementing a new epic:

- [ ] Access Figma FLow-UI/UX file
- [ ] Review Design Tokens page
- [ ] Review Components page
- [ ] Review epic-specific page (E1–E9)
- [ ] Use Claude to fetch design metadata
- [ ] Extract all design variables
- [ ] Create HTML prototypes with correct tokens
- [ ] Push prototypes to Figma via capture script
- [ ] Get designer approval
- [ ] Implement in flow-fe with matching styles
- [ ] Update Figma with implementation screenshots
- [ ] Close epic in design workflow

## Next Steps

1. **Access Figma:** https://www.figma.com/file/dAgFxdPwQDFNYgUGAO6RKt/Flow-UI
2. **Request team access** from design lead
3. **Start Claude in flow-ui:** `code flow-ui`
4. **Fetch design metadata** via MCP
5. **Build prototypes** matching design system
6. **Push to Figma** via capture script

---

**Figma MCP integration ready!** 🎨

