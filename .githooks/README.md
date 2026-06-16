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
**staging prototypes you staged** (`ui-flow/e{N}-*/*.html`) and **blocks the commit** if any
is non-promotable (P0 > 0 or P1 > 0). This is the same deterministic G10 gate that
`.github/workflows/ci.yml` runs — so catching it locally means green CI.

- No staged prototypes → the hook is a no-op (exits 0).
- Also blocks direct commits to `main` (branch + PR instead).
- Override in a true emergency: `git commit --no-verify` (discouraged; document why).
