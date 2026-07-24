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
ui-flow/agriflow-rwanda-design-system/project/screens/<file>.html
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
| E1 | Login | login.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-login.html | reports/ux/e1-login-review.md |
| E1 | Password Reset | password-reset.html | Operations Manager / Admin | 2026-07-23 | ui-flow/e1-identity-access-management/e1-password-reset.html | reports/ux/e1-password-reset-review.md |
| E1 | Access Denied | access-denied.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-access-denied.html | reports/ux/e1-access-denied-review.md |
| E1 | Account Activation | account-activation.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-account-activation.html | reports/ux/e1-account-activation-review.md |
| E1 | User List | user-list.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-user-list.html | reports/ux/e1-user-list-review.md |
| E1 | User Management | user-management.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-user-management.html | reports/ux/e1-user-management-review.md |
| E1 | Edit User | edit-user.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-edit-user.html | reports/ux/e1-edit-user-review.md |
| E1 | Deactivate User | deactivate-user.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-deactivate-user.html | reports/ux/e1-deactivate-user-review.md |
| E1 | Audit Log Viewer | audit-log-viewer.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-audit-log-viewer.html | reports/ux/e1-audit-log-viewer-review.md |
| E1 | Role Management | role-management.html | Operations Manager / Admin | 2026-07-23 | ui-flow/e1-identity-access-management/e1-role-management.html | reports/ux/e1-role-management-review.md |
| E1 | Create Role | create-role.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-create-role.html | reports/ux/e1-create-role-review.md |
| E1 | Edit Role | edit-role.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-edit-role.html | reports/ux/e1-edit-role-review.md |
| E1 | Edit Permissions | edit-permissions.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e1-identity-access-management/e1-edit-permissions.html | reports/ux/e1-edit-permissions-review.md |
| E1 | User Permissions | user-permissions.html | Operations Manager / Admin | 2026-07-23 | ui-flow/e1-identity-access-management/e1-user-permissions.html | reports/ux/e1-user-permissions-review.md |
| E2 | Supplier Directory | supplier-directory.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e2-partners-supplier-ecosystem/e2-supplier-directory.html | reports/ux/e2-supplier-directory-review.md |
| E2 | Supplier Documents | supplier-documents.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e2-partners-supplier-ecosystem/e2-supplier-documents.html | reports/ux/e2-supplier-documents-review.md |
| E2 | Supplier Price Book | supplier-price-book.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e2-partners-supplier-ecosystem/e2-supplier-price-book.html | reports/ux/e2-supplier-price-book-review.md |
| E2 | Supplier Profile | supplier-profile.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e2-partners-supplier-ecosystem/e2-supplier-profile.html | reports/ux/e2-supplier-profile-review.md |
| E2 | Supplier Registration | supplier-registration.html | Operations Manager / Admin (or Farmer / Supplier — self-onboarding flow) | 2026-05-17 | ui-flow/e2-partners-supplier-ecosystem/e2-supplier-registration.html | reports/ux/e2-supplier-registration-review.md |
| E2 | Supplier Scorecard | supplier-scorecard.html | Operations Manager / Admin | 2026-05-17 | ui-flow/e2-partners-supplier-ecosystem/e2-supplier-scorecard.html | reports/ux/e2-supplier-scorecard-review.md |
