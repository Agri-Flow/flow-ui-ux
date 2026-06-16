# flow-ui git hooks

flow-ui is a static-HTML repo with no `package.json`, so it can't use husky.
Hooks live here and are wired via git's native `core.hooksPath`.

## Enable (once per clone)

```bash
git config core.hooksPath .githooks
```

That's the only setup step. After it, every `git commit` runs `.githooks/pre-commit`.

## What `pre-commit` does

Runs the canonical 24-gate design linter (`.claude/scripts/lint-prototypes.sh`) on the
**promoted screens you staged** (`ui-flow/agriflow-rwanda-design-system/project/screens/*.html`)
and **blocks the commit** if any is not clean (P0 > 0 or P1 > 0). The promoted screens are the
single source of truth `flow-fe` consumes, so they must always pass. This is the same
deterministic G10 gate `.github/workflows/ci.yml` runs — catching it locally means green CI.

- No staged promoted screens → the hook is a no-op (exits 0).
- **Staging prototypes (`ui-flow/e{N}-*/`) are intentionally not gated** — staging is an
  iterative workshop, allowed to be incomplete until `design-builder promote` runs G10+G12.
  Promoted screens should change via `design-builder promote`, not hand-edits; this gate
  catches a hand-edit that drifts the contract.
- Also blocks direct commits to `main` (branch + PR instead).
- Override in a true emergency: `git commit --no-verify` (discouraged; document why).
