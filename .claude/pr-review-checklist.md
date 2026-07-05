# flow-ui PR-Review Checklist (CI digest)

Condensed, machine-review digest of `.claude/rules/prototypes.md` + `.claude/rules/tokens.md` +
`flow-ui/CLAUDE.md`, for the `agriflow-design-review` job. **This one file replaces reading the
full design-contract corpus at review time** — read it, then review the precomputed diff. The
canonical rules stay the source of truth; keep this digest in sync when a contract changes.

Tag every finding `[P0]` / `[P1]` / `[P2]` (per `.claude/rules/triage.md`). Review **only** the
changed `*.html` in the diff (staging `ui-flow/e{N}-*/…` and promoted
`agriflow-rwanda-design-system/project/screens/…`).

**G10 evidence:** deterministic 24-gate lint output for any changed STAGING prototype is in
`reports/ux/` (populated by the prior step). Read it — if a gate is already clean there, don't
re-flag it; if `reports/ux/` is empty, no staging changed → treat G10 as N/A (do NOT flag a missing
report). Your value-add is the judgment the script can't do: convention adherence, promotion-pipeline
integrity, and a shallow bug scan of the diff.

---

## [P0] — must flag (design-contract breaks)

- **Token link missing / inlined tokens** (G1/G2): every prototype `<link>`s the canonical
  `tokens/colors_and_type.css` (depth-appropriate `../`); **no** inline `<style>:root{…}</style>`
  token block.
- **Stock Tailwind palette colors** (G3): no `bg-`/`text-`/`border-(yellow|blue|red|green|purple|
  orange|teal|pink|indigo|gray|slate)-\d+`. Use tone pairs (`bg-warning-bg text-warning`,
  `bg-success-bg text-success`, `bg-danger-bg text-danger`, `bg-info-bg text-info`).
- **Hardcoded hex in markup** (G4): no `style="…#rrggbb…"`, `bg-[#…]`, `text-[#…]`.
- **Header not breadcrumb-only** (G5): the header band carries only breadcrumbs — no title, search,
  bell, or action buttons. (Exempt: login / password-reset / access-denied / account-activation.)
- **Control height** other than `h-10` on inputs/selects/buttons — the **only** `h-11` is the login
  primary CTA.
- **Card shadow** `shadow-sm` / `-md` / `-lg` (G8) — use `shadow-card` / `shadow-pop` / `shadow-btn`.
- **Multi-hue role pills** (retired 2026-05-15) — all roles use `bg-accent text-accent-foreground`.
- **Solid `bg-destructive` on a routine status** — QUARANTINE / FAILED QC use the danger **tone pair**
  (`bg-danger-bg text-danger`, uppercase, bold), not solid red.
- **Promoted screen integrity** (`screens/*.html`): must have a `SCREENS-INDEX.md` row and the token
  link resolving at `../colors_and_type.css`.

## [P1] — surface, don't block

- **State coverage** (G6): form ≥ 3, list ≥ 3, detail ≥ 2 `<!-- STATE: … -->` comment markers.
- **Table conventions**: Title-Case headers (not ALL CAPS); last data column right-aligned; 44 px
  Actions column with **no** visible "Actions" label; row hover uses `var(--bg-tint)`.
- **Modal a11y**: centered confirm modal / slide-over form carries `role="dialog"`, `aria-modal`,
  `aria-labelledby`; and the **audit-log rail** copy on any action that writes `audit_logs`.
- **Login uses `h-11`** on its primary CTA (G7, login files only).
- **Sidebar**: 270 px `bg-sidebar shadow-sidebar`; active leaf / submenu-child
  `bg-primary text-primary-foreground font-semibold` (green fill); active parent `text-primary`, no
  fill. No held/undefined routes ahead of their story.
- **Shallow bug scan** of the diff (broken markup, dead `href`, mismatched tags, pretending an
  unfinished list/tab is done).

## [P2] — informational

- Typography drift (page title `text-xl font-semibold`; section eyebrows
  `text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground`; six-step `text-fg-*`
  ramp — don't invent gray utilities).
- Minor spacing/readability nits the linter already tolerates.

---

## Verdict format

Post ONE top-level `gh pr comment` beginning with the marker `<!-- pr-reviewer:v1 -->`, then a
`P0:n P1:n P2:n` roll-up and the tagged findings (most-severe first). Use
`mcp__github_inline_comment__create_inline_comment` (confirmed: true) for specific lines only; use
the full PR head SHA in any code links. If there are no substantive findings, post
`<!-- pr-reviewer:v1 --> No flow-ui design-system issues found.` Only post GitHub comments — do not
return the review as a chat message.
