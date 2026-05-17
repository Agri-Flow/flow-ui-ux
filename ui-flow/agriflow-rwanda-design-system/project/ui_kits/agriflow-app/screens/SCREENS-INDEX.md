# Promoted Screens — AgriFlow Rwanda Design System

This directory holds **promoted, gated prototypes** — the single source of truth that `flow-fe` and other agents read from when implementing or referencing AgriFlow UI.

## What lives here

Every `.html` file in this folder has passed the `design-builder` promotion gates:

- Links the canonical token file (no inline `:root`)
- No stock Tailwind palette colors (`bg-yellow-*`, `bg-blue-*`, `bg-red-*`, etc.)
- No hardcoded hex in markup
- Breadcrumb-only header (where applicable)
- Required state coverage (`<!-- STATE: default | loading | empty | error | success -->`)
- Sidebar shell and component patterns match the canonical pattern in `flow-ui/.claude/rules/prototypes.md`
- Linter signoff (`design-linter`) with **0 P0 / 0 P1** findings

## How files get here

Files are **never written here directly**. They flow through this pipeline:

```
ui-flow/e{N}-<epic-slug>/<file>.html           ← staging (design-builder writes)
        │
        │  design-builder revise + design-linter iterate until clean
        ▼
ui-flow/e{N}-<epic-slug>/<file>.html (signed off)
        │
        │  design-builder promote story N.M
        │  (runs gating checks; refuses on any fail)
        ▼
ui-flow/agriflow-rwanda-design-system/project/ui_kits/agriflow-app/screens/<file>.html
        │
        │  catalog updated in this index
        ▼
SCREENS-INDEX.md (one row appended / updated per promotion)
```

The `e{N}-` prefix is dropped on promotion — promoted filenames are flat (`supplier-directory.html`, not `e2-supplier-directory.html`).

## How to consume from FE / other agents

- **Read-only.** Treat every file here as a contract. If you spot a problem, do not edit in place — file a revision request that drives `design-builder revise …` against the staging copy, then re-promote.
- **Tokens.** The bundle's `colors_and_type.css` (at `agriflow-rwanda-design-system/project/colors_and_type.css`) is the depth-appropriate copy of the canonical `flow-ui/tokens/colors_and_type.css`. Either is fine to cite; values are identical.
- **Decisions log.** See `flow-ui/.claude/rules/prototypes.md` and the project memory `design-decisions-from-chats` for the locked design contracts that every promoted file already complies with.

## Catalog

Append a row per promotion. Use absolute repo-relative paths.

| Epic | Screen | File (in this folder) | Persona | Promoted on | Source (staging) | Linter report |
|---|---|---|---|---|---|---|
| _none yet — populated by `design-builder promote …`_ |  |  |  |  |  |  |
