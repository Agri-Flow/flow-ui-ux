# flow-ui Agents — Manifest

Index of agents owned by `flow-ui/`. `chief-of-staff` reads this on Phase 0 to know what is spawnable. Maintained in lockstep with each agent's `lifecycle.status:` frontmatter — when one diverges from the other, the deprecation linter (workspace Stop hook, agent-discipline Rule 7) flags it.

## Active

| Agent | Role | Trigger | Tools | Notes |
|---|---|---|---|---|
| [`design-builder`](design-builder.md) | Writes staging prototypes, applies revisions, promotes to design system, opt-in Figma push | `design-builder epic N` / `story N.M` / `revise … — spec` / `promote …` / `push …` | Read, Glob, Grep, Write, Edit, Bash, figma MCP | Content-only; sandbox disabled |
| [`design-linter`](design-linter.md) | Grep-based mechanical linter; tags findings `[P0]/[P1]/[P2]`; writes per-file reports to `reports/ux/`; produces gate G10 signoff for promotion | `design-linter review epic N` / `review story N.M` / `review <path>` / `review all` | Read, Glob, Grep, Bash, Write | Read-only inspector. Sibling to the root-level `design-reviewer` which handles SUBJECTIVE review |

## Pipeline (how they cooperate)

```
design-builder epic N                       (writes to ui-flow/e{N}-*/)
       │
       ▼
design-linter review epic N                 (greps; writes reports/ux/<stem>-review.md)
       │
       ▼  founder reads roll-up, copies the suggested revise one-liner
       │
design-builder revise epic N — <spec>       (surgical edits to staging)
       │
       ▼
design-linter review epic N                 (re-grade; aim for P0:0 P1:0)
       │
       ▼  when clean
       │
design-builder promote epic N               (runs gates G1–G10; copies into design system; appends SCREENS-INDEX.md)
       │
       ▼  optionally
       │
design-builder push <promoted-path>.html    (mirror into Figma)
```

For SUBJECTIVE review (judgment beyond mechanical compliance — brand feel, layout instinct), invoke the root-level `design-reviewer` agent instead. It runs its own loop (presents prototypes → collects natural-language feedback → dispatches via `ux-executor → design-builder revise`). The two reviewers compose; they do not overlap.

## Scaffold / Paused / Retired

_None yet._

## Lifecycle conventions

- Status enum (per workspace `constants.md §8a`): `ACTIVE` / `SCAFFOLD` / `PAUSED` / `RETIRED`. Only `ACTIVE` agents are spawnable.
- Transitions go through `/role-lifecycle pause|resume|retire <agent>` at the monorepo root — never edit `lifecycle.status:` by hand.
- Sandbox templates and policy follow `constants.md §8b`. `design-builder` (content-only) and `design-linter` (read-only) both keep `sandbox.enabled: false`.
- Retired agents move to `_retired/YYYY-MM-DD_<name>.md` with a top-of-file `> ## ⚠️ RETIRED` callout; this MANIFEST drops them from "Active" and lists them under "Retired".

## Cross-references

- Design contracts: `flow-ui/.claude/rules/{prototypes,tokens,README}.md`
- Triage convention (P0/P1/P2): `.claude/rules/triage.md`
- Agent discipline: `.claude/rules/agent-discipline.md` (Rule 4 = exit protocol, Rule 6 = grep-first, Rule 7 = deprecation propagation)
- Decisions memory: `~/.claude/projects/-Users-daprince-projects-flow-orchestrator-flow-ui/memory/design-decisions-from-chats.md`
