# flow-ui Agents — Manifest

Index of agents owned by `flow-ui/`. `chief-of-staff` reads this on Phase 0 to know what is spawnable. Maintained in lockstep with each agent's `lifecycle.status:` frontmatter — when one diverges from the other, the deprecation linter (workspace Stop hook, agent-discipline Rule 7) flags it.

## Active

| Agent | Role | Trigger | Tools | Notes |
|---|---|---|---|---|
| [`design-builder`](design-builder.md) | Writes staging prototypes, applies revisions, runs the autopilot loop on mechanical findings, promotes to design system, **syncs the JSX visual-review kit after promote (Phase 6.5)**, opt-in Figma push | `design-builder epic N` / `story N.M` / `revise … — spec` / `autopilot …` / `promote …` / `sync-kit …` / `push …` | Read, Glob, Grep, Write, Edit, Bash, figma MCP | Content-only. Autopilot never promotes or pushes; capped at 3 iterations. `sync-kit` is a one-way HTML→JSX mirror, only runs after a successful promote |
| [`design-linter`](design-linter.md) | Grep-based mechanical linter; tags findings `[P0]/[P1]/[P2]`; writes per-file reports to `reports/ux/`; produces gate G10 signoff for promotion | `design-linter review epic N` / `review story N.M` / `review <path>` / `review all` | Read, Glob, Grep, Bash, Write | Read-only inspector. Sibling to `story-coverage-auditor` (G12) and the root-level `design-reviewer` (SUBJECTIVE) |
| [`pr-reviewer`](pr-reviewer.md) | Reviews any GitHub PR in flow-ui against workspace conventions + design-system contracts; adapts Claude's canonical multi-agent + confidence-scoring (≥80) pattern; tags `[P0]/[P1]/[P2]`; posts a single structured review comment via `gh pr comment` | `pr-reviewer <PR#>` / `pr-reviewer current` | Read, Glob, Grep, Bash, Agent | Read-only on PR code. Self-skips on closed/draft/trivial/already-reviewed |
| [`pr-autopilot`](pr-autopilot.md) | Watches a PR through CI, reads `agriflow-design-review` structured findings, auto-fixes mechanical P0/P1 findings (capped loop, max 3 iters, oscillation + no-progress safety), escalates non-mechanical findings to founder, merges when clean. Mirrors `design-builder` Phase 7 loop shape. | `/goal pr-autopilot <PR#>` / `pr-autopilot cancel <PR#>` | Read, Edit, Glob, Grep, Bash | Requires founder `/goal` invocation (delegation of push + merge authority). `--dry-run` flag available. Reads ONLY `agriflow-design-review` check — not `claude-review`. |
| [`story-coverage-auditor`](story-coverage-auditor.md) | **Bidirectional** auditor that diffs PM user stories (`_pm-plan/docs/stories/`) against staging HTML — design-side findings (AC built insufficient) block promote; PM-side findings (work built without AC, including UI/UX best-practice additions) flow back to `story-pipeline` as a separate revise spec. Tags `[AC-MISSING]/[AC-UNRESOLVED]/[STORY-MISSING-CRITICAL]/[STORY-MISSING-BP]/[AC-DRIFT]`. Writes per-epic reports to `reports/story-coverage/` (the main report + a PM-revise spec the founder relays manually) | `story-coverage-auditor audit epic N` / `audit story N.M` / `audit <path>` / `audit all` | Read, Glob, Grep, Bash, Write | Read-only inspector. Spans `flow-ui` ↔ `_pm-plan`. Load-bearing as of 2026-05-17: produces gate G12 (`Design-side AC clean: YES`) for `design-builder promote`. PM-side findings are advisory (do NOT block promote) — they are `story-pipeline`'s homework |
| [`address-pr-comments`](address-pr-comments.md) | Resolves human reviewer comments on an open flow-ui PR end-to-end (gather → plan → fix HTML/tokens → G10 re-lint → push to the PR branch → reply). Self-sufficient. **Never promotes, never pushes to Figma, never merges, never edits design-system files.** | `/address-pr-comments <PR# \| url \| comment>` | Read, Glob, Grep, Write, Edit, Bash | model: sonnet. Distinct from `pr-reviewer` (produces reviews) and `pr-autopilot` (mechanical pre-merge loop) — this resolves human reviewer comments |

## Pipeline (how they cooperate)

```
design-builder epic N                       (writes to ui-flow/e{N}-*/)
       │
       ▼
       Phase 5.5 auto-lints                 (.claude/scripts/lint-prototypes.sh; populates
                                             reports/ux/; appended to builder's report)
       │
       ▼
       ┌──── Manual loop ───────────────────┐    ┌──── Opt-in autopilot loop ─────────┐
       │ founder reads Lint pass section,   │    │ design-builder autopilot epic N    │
       │ copies suggested revise one-liner  │    │   • lint → partition findings      │
       │                                    │ OR │   • auto-revise MECHANICAL only    │
       │ design-builder revise epic N — …   │    │     (max 3 iters; safety stops)    │
       │ (Phase 5.5 re-lints automatically) │    │   • escalate NON-mechanical to     │
       │                                    │    │     founder                        │
       │ loop until P0:0 P1:0               │    │   • never promotes, never pushes   │
       └────────────────────────────────────┘    └────────────────────────────────────┘
                       │                                          │
                       └──────────────┬───────────────────────────┘
                                      ▼  when clean (P0:0 P1:0 on all files)
                                      │
       ▼  (before promote — G12 required)
       │
story-coverage-auditor audit epic N         (BIDIRECTIONAL: PM story BDD scenarios
                                             vs staging HTML; tags [AC-MISSING]/
                                             [AC-UNRESOLVED]/[STORY-MISSING-CRITICAL]/
                                             [STORY-MISSING-BP]/[AC-DRIFT];
                                             writes reports/story-coverage/epic-N-story-coverage.md
                                             AND reports/story-coverage/epic-N-pm-revise-spec.md;
                                             design-side findings → design-builder revise;
                                             PM-side findings → founder relays to story-pipeline)
       │
       ▼  founder relays design-side revise to design-builder; PM-side spec to story-pipeline → loop
       │
design-builder promote epic N               (runs gates G1–G10 + G12; copies into
                                             design system; appends SCREENS-INDEX.md)
       │
       ▼  Phase 6.5 — JSX visual-review kit sync (HTML→JSX, one-way)
       │
design-builder sync-kit epic N              (updates ui_kits/agriflow-app/*.jsx so the
                                             clickable SPA renders the newly-promoted
                                             screens; never the source of truth)
       │
       ▼  optionally
       │
design-builder push <promoted-path>.html    (mirror into Figma)
       │
       ▼  founder opens PR (per the git-branching memory: never push direct to main)
       │
pr-reviewer <PR#>                           (multi-agent review + confidence scoring;
                                             posts structured comment via gh pr comment)
       │
       ▼  founder addresses feedback, re-reviews if needed, then merges via GitHub
```

**Manual vs autopilot loop:** both produce the same end state (P0:0 P1:0 across all files). Manual gives the founder full control over every revise spec; autopilot removes the relay step for mechanical fixes only (with hard safety caps). Pick autopilot when the linter findings are deterministic (e.g. "10 files all have `bg-yellow-500` swatches" — pure mechanical); pick manual when revise specs need judgment (state coverage, breadcrumb context, brand decisions). Autopilot will escalate non-mechanical findings back to the founder anyway, so it's safe to default to autopilot for any epic and intervene when it escalates.

For SUBJECTIVE review (judgment beyond mechanical compliance — brand feel, layout instinct), invoke the root-level `design-reviewer` agent instead. It runs its own loop (presents prototypes → collects natural-language feedback → dispatches via `ux-executor → design-builder revise`). The four active reviewers compose; they do not overlap. Each asks a different question:

- `design-linter` — "does this obey the contract?" (mechanical compliance, grep-based) → **G10**
- `story-coverage-auditor` — "does this match the PM story BDD scenarios — both directions?" (PM contract enforcement) → **G12** design-side only; PM-side feeds `story-pipeline`
- root `design-reviewer` — "does this look right to a human?" (subjective, natural-language)
- `pr-reviewer` — "is this PR safe to merge?" (PR-level multi-perspective)

> **G11 / `design-coverage-auditor` was retired the day it landed (2026-05-17).** Its directionality was inverted — it treated the JSX kit as the contract that staging must satisfy, but the kit is a DOWNSTREAM visual-review SPA updated AFTER promotion by `design-builder sync-kit` (Phase 6.5). G12 (`story-coverage-auditor`) is the sole feature-completeness gate. See the Retired section above + the `feedback_design_pipeline_directionality` memory for the full story.

## Scaffold / Paused / Retired

### Retired

| Agent | Retired on | Reason | Path |
|---|---|---|---|
| `design-coverage-auditor` | 2026-05-17 | Directional model was inverted — treated JSX kit as the contract that staging must match, but the kit is a DOWNSTREAM visual-review SPA updated AFTER promotion via `design-builder sync-kit` (Phase 6.5). G12 (`story-coverage-auditor`) is the sole feature-completeness gate. See [`feedback_design_pipeline_directionality`] memory for full reasoning. | `_retired/2026-05-17_design-coverage-auditor.md` |

## Lifecycle conventions

- Status enum (per workspace `constants.md §8a`): `ACTIVE` / `SCAFFOLD` / `PAUSED` / `RETIRED`. Only `ACTIVE` agents are spawnable.
- Transitions go through `/role-lifecycle pause|resume|retire <agent>` at the monorepo root — never edit `lifecycle.status:` by hand.
- Retired agents move to `_retired/YYYY-MM-DD_<name>.md` with a top-of-file `> ## ⚠️ RETIRED` callout; this MANIFEST drops them from "Active" and lists them under "Retired".

## Cross-references

- Design contracts: `flow-ui/.claude/rules/{prototypes,tokens,README}.md`
- Triage convention (P0/P1/P2): `.claude/rules/triage.md`
- Agent discipline: `.claude/rules/agent-discipline.md` (Rule 4 = exit protocol, Rule 6 = grep-first, Rule 7 = deprecation propagation)
- Decisions memory: `~/.claude/projects/-Users-daprince-projects-flow-orchestrator-flow-ui/memory/design-decisions-from-chats.md`
