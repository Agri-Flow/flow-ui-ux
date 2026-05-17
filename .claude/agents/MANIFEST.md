# flow-ui Agents — Manifest

Index of agents owned by `flow-ui/`. `chief-of-staff` reads this on Phase 0 to know what is spawnable. Maintained in lockstep with each agent's `lifecycle.status:` frontmatter — when one diverges from the other, the deprecation linter (workspace Stop hook, agent-discipline Rule 7) flags it.

## Active

| Agent | Role | Trigger | Tools | Notes |
|---|---|---|---|---|
| [`design-builder`](design-builder.md) | Writes staging prototypes, applies revisions, runs the autopilot loop on mechanical findings, promotes to design system, opt-in Figma push | `design-builder epic N` / `story N.M` / `revise … — spec` / `autopilot …` / `promote …` / `push …` | Read, Glob, Grep, Write, Edit, Bash, figma MCP | Content-only; sandbox disabled. Autopilot never promotes or pushes; capped at 3 iterations |
| [`design-linter`](design-linter.md) | Grep-based mechanical linter; tags findings `[P0]/[P1]/[P2]`; writes per-file reports to `reports/ux/`; produces gate G10 signoff for promotion | `design-linter review epic N` / `review story N.M` / `review <path>` / `review all` | Read, Glob, Grep, Bash, Write | Read-only inspector. Sibling to `design-coverage-auditor` (G11) and the root-level `design-reviewer` (SUBJECTIVE) |
| [`pr-reviewer`](pr-reviewer.md) | Reviews any GitHub PR in flow-ui against workspace conventions + design-system contracts; adapts Claude's canonical multi-agent + confidence-scoring (≥80) pattern; tags `[P0]/[P1]/[P2]`; posts a single structured review comment via `gh pr comment` | `pr-reviewer <PR#>` / `pr-reviewer current` | Read, Glob, Grep, Bash, Agent | Read-only on PR code. Self-skips on closed/draft/trivial/already-reviewed |
| [`design-coverage-auditor`](design-coverage-auditor.md) | Compares the JSX UI kit against staging HTML to surface **feature-coverage gaps** the mechanical linter is blind to (missing flows, CTAs, states, fields, columns); tags findings `[GAP-CRITICAL]/[GAP-STATE]/[GAP-FIELD]/[GAP-VISUAL]` and maps each to `[P0]/[P1]/[P2]`; respects the "Unfinished in design" exemption list; writes per-epic reports to `reports/ux-coverage/` and emits a consolidated `design-builder revise` one-liner | `design-coverage-auditor audit epic N` / `audit story N.M` / `audit <path>` / `audit all` | Read, Glob, Grep, Bash, Write | Read-only inspector. Complementary to `design-linter` — different dimension (coverage vs compliance). Load-bearing as of 2026-05-17: produces gate G11 (`Coverage clean: YES`) for `design-builder promote` |

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
       ▼  (before promote — recommended on any "comprehensive" claim)
       │
design-coverage-auditor audit epic N        (compares JSX kit vs staging; tags
                                             [GAP-CRITICAL]/[GAP-STATE]/[GAP-FIELD]/
                                             [GAP-VISUAL]; respects exemptions;
                                             writes reports/ux-coverage/epic-N-coverage.md;
                                             emits a `revise` one-liner if not clean)
       │
       ▼  founder relays revise spec to design-builder if coverage not clean → loop back
       │
design-builder promote epic N               (runs gates G1–G10; copies into design system;
                                             appends SCREENS-INDEX.md)
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

For SUBJECTIVE review (judgment beyond mechanical compliance — brand feel, layout instinct), invoke the root-level `design-reviewer` agent instead. It runs its own loop (presents prototypes → collects natural-language feedback → dispatches via `ux-executor → design-builder revise`). The four reviewers compose; they do not overlap. Each asks a different question:

- `design-linter` — "does this obey the contract?" (mechanical compliance, grep-based)
- `design-coverage-auditor` — "does this implement every flow / CTA / state / field the kit shows?" (feature coverage, JSX↔staging diff)
- root `design-reviewer` — "does this look right to a human?" (subjective, natural-language)
- `pr-reviewer` — "is this PR safe to merge?" (PR-level multi-perspective)

## Scaffold / Paused / Retired

_None yet._

## Lifecycle conventions

- Status enum (per workspace `constants.md §8a`): `ACTIVE` / `SCAFFOLD` / `PAUSED` / `RETIRED`. Only `ACTIVE` agents are spawnable.
- Transitions go through `/role-lifecycle pause|resume|retire <agent>` at the monorepo root — never edit `lifecycle.status:` by hand.
- Sandbox templates and policy follow `constants.md §8b`. `design-builder` (content-only), `design-linter` (read-only), `pr-reviewer` (read-only + gh CLI), and `design-coverage-auditor` (read-only) all keep `sandbox.enabled: false`.
- Retired agents move to `_retired/YYYY-MM-DD_<name>.md` with a top-of-file `> ## ⚠️ RETIRED` callout; this MANIFEST drops them from "Active" and lists them under "Retired".

## Cross-references

- Design contracts: `flow-ui/.claude/rules/{prototypes,tokens,README}.md`
- Triage convention (P0/P1/P2): `.claude/rules/triage.md`
- Agent discipline: `.claude/rules/agent-discipline.md` (Rule 4 = exit protocol, Rule 6 = grep-first, Rule 7 = deprecation propagation)
- Decisions memory: `~/.claude/projects/-Users-daprince-projects-flow-orchestrator-flow-ui/memory/design-decisions-from-chats.md`
