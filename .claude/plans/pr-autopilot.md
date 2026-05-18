# Plan: `pr-autopilot` — reusable PR-merge autopilot agent

**Drafted:** 2026-05-18 (end of session that hand-executed the workflow on PR #18)
**Status:** PLAN — not implemented yet
**Form factor:** new agent at `flow-ui/.claude/agents/pr-autopilot.md`, callable as `pr-autopilot <PR#>` or via `/goal pr-autopilot <PR#>`
**Reusability:** primary target is `Agri-Flow/flow-ui-ux`. Portable to `Agri-Flow/flow-orchestrator` and other AgriFlow repos with a one-line repo arg.

---

## 1. Why this exists

Today's PR #18 was the prototype for this flow. The founder set a `/goal` ("check the pr status, until the pr review finishes and the pipeline passed then merge it") and I hand-executed the workflow:

1. Polled CI in a background `until` loop (~16-22 min)
2. Once CI green, spawned `pr-reviewer N` for the structured review
3. Review came back with 2 [P0] findings → I fixed them locally → committed → pushed
4. CI re-ran on the new HEAD
5. Re-spawned `pr-reviewer N [force-review]` (to bypass the self-skip on existing comments)
6. Re-review came back clean (0 P0/P1) → `gh pr merge --merge --delete-branch`
7. Synced local `main`

The pattern was hand-executed cleanly but is full of branch points (CI may hang, review may flag non-mechanical issues, fix may take multiple iterations). Codifying it removes the founder-relay step "now go through the merge checklist for PR N."

This agent is the **operational analogue** of `design-builder autopilot` (Phase 7): same loop shape (build → check → fix mechanical → re-check), same safety caps (max iterations, oscillation detection, escalate non-mechanical), different domain (PR lifecycle vs. design lint).

---

## 2. Trigger + arguments

```
pr-autopilot <PR#>
pr-autopilot <PR#> --repo <owner>/<name>      # default: Agri-Flow/flow-ui-ux
pr-autopilot <PR#> --max-iterations <N>       # default: 3 (same as design-builder Phase 7)
pr-autopilot <PR#> --skip-review              # CI-only mode (only valid if repo has CI but no pr-reviewer)
pr-autopilot <PR#> --review-only              # review-only mode (only valid if repo has no CI, e.g. flow-orchestrator)
pr-autopilot <PR#> --dry-run                  # report what it would do, never merge
```

Invocation via `/goal`:

```
/goal pr-autopilot 18
```

The `/goal` wrapper sets up the Stop-hook condition; the agent body runs the actual phases.

---

## 3. Phases

### Phase 0 — Resolve PR + repo + workflow shape

```bash
PR_NUMBER=$ARGUMENTS
REPO=${REPO:-Agri-Flow/flow-ui-ux}
gh --repo "$REPO" pr view "$PR_NUMBER" --json state,isDraft,mergeable,mergeStateStatus,headRefOid,statusCheckRollup,comments,labels
```

Refuse with `STATUS: BLOCKED` if:
- PR is closed / merged / draft
- PR has `[skip-autopilot]` label or token in title
- `gh` not authenticated
- mergeable is `CONFLICTING` (rebase needed; founder action)

Detect workflow shape from `statusCheckRollup` length:
- `≥1 check` → `--with-ci` mode (default for flow-ui-ux)
- `0 checks` → `--no-ci` mode (flow-orchestrator); skip Phase 1, go straight to Phase 2

### Phase 1 — Wait for CI green (background until-loop)

Use `Bash run_in_background=true` with the proven pattern:

```bash
until [ "$(gh --repo "$REPO" pr view "$PR_NUMBER" --json statusCheckRollup --jq '[.statusCheckRollup[].status] | all(. == "COMPLETED")')" = "true" ]; do
  sleep 60
done
```

**Do NOT use `ScheduleWakeup`** — the Stop hook fires between wakeups and creates noisy back-and-forth (lesson from PR #18 session). Background bash is the cleaner pattern; the harness notifies on completion.

On notification:
- Re-read `statusCheckRollup` for conclusions
- If any check `conclusion != "SUCCESS"` → `STATUS: BLOCKED — CI red (see <details URL>)`. Surface the failing check + escalate.
- If all SUCCESS → proceed.

Timeout: 40 min (typical workflows take ≤25 min; longer means stuck CI).

### Phase 2 — Get a review

If `--review-only` mode OR repo has no `pr-reviewer` agent registered, prompt the founder for explicit "review looks good, merge."

Else spawn `pr-reviewer <PR#>`. Capture STATUS line + findings count from the agent's return.

**Self-skip handling:** if the agent skipped because of an existing prior comment (re-review case), retry once with `[force-review]` in the prompt.

### Phase 3 — Decide

Parse the review result:

| Review outcome | Action |
|---|---|
| 0 P0, 0 P1, 0 P2 | Proceed to Phase 5 (merge) |
| 0 P0, 0 P1, N P2 | Proceed to Phase 5 (P2 are informational; don't block) |
| ≥1 P0 OR ≥1 P1, **all mechanical** | Proceed to Phase 4 (auto-fix loop) |
| ≥1 P0 OR ≥1 P1, **any non-mechanical** | `STATUS: PARTIAL — escalation`. Surface findings to founder. Exit. |
| Agent BLOCKED for any reason | `STATUS: BLOCKED`. Surface. Exit. |

**Mechanical vs non-mechanical classifier** (heuristic, fallback to "non-mechanical" when unsure):

Mechanical (auto-fixable):
- Stale path strings, broken cross-references, typos in copied content
- Missing entries in a catalog (SCREENS-INDEX.md row, MANIFEST table row)
- Token-link depth mismatches
- Stale ASCII tree diagrams (the exact class of bug from PR #18)
- Missing `<!-- STATE: -->` comments per gate P1-9
- Stock palette / hardcoded hex (per gates P0-3 / P0-4)
- `h-9` instead of `h-10` (per gate P1-4)

Non-mechanical (escalate):
- Logic / behavior changes
- Architecture or interface decisions
- Brand / visual judgment calls
- "PR scope is wrong" findings
- Security / compliance concerns
- Anything where the fix requires reading the founder's intent

### Phase 4 — Auto-fix mechanical findings (capped loop)

Mirrors design-builder Phase 7 contract:

```
iteration = 0
while iteration < MAX_ITERATIONS:
    iteration += 1

    # Apply fixes
    for finding in mechanical_findings:
        apply_fix(finding)  # uses Edit tool, never Write

    # Commit
    git add <touched files>
    git commit -m "fix(<scope>): address pr-reviewer [P0]/[P1] findings (iter N)"

    # Push (auto-approved within autopilot — the founder authorized via /goal)
    git push

    # Wait for CI re-run
    run Phase 1

    # Re-review
    run Phase 2 with [force-review] in prompt

    if review is clean: break
    if findings_unchanged_from_previous_iter: STATUS: BLOCKED (no progress); break
    if findings_oscillate (same fingerprint as iter N-2): STATUS: BLOCKED (oscillation); break

if iteration == MAX_ITERATIONS and review still not clean:
    STATUS: PARTIAL — exceeded iteration cap
```

**Safety guards** (lifted from design-builder Phase 7):
- **Iteration cap:** default 3. Hard stop.
- **No-progress detection:** SHA-fingerprint the set of findings each iter. If two consecutive iters produce identical fingerprints, stop with "no progress."
- **Oscillation detection:** if iter N's fingerprint matches iter N-2's, stop with "oscillating."
- **Never auto-fix non-mechanical findings.** If any non-mechanical finding appears, exit Phase 4 immediately and escalate.

### Phase 5 — Merge

Pre-merge sanity check:
```bash
gh --repo "$REPO" pr view "$PR_NUMBER" --json mergeStateStatus,reviewDecision,statusCheckRollup
```

Require:
- `mergeStateStatus == "CLEAN"` (or `"UNSTABLE"` only if `--no-ci` mode)
- All `statusCheckRollup[].conclusion == "SUCCESS"` (CI mode)
- At least one `pr-reviewer:v1` comment exists (unless `--skip-review`)

If any fail: `STATUS: BLOCKED — pre-merge invariants violated`. Surface and exit.

If all pass:
```bash
gh --repo "$REPO" pr merge "$PR_NUMBER" --merge --delete-branch
git checkout main && git pull origin "$(gh --repo "$REPO" repo view --json defaultBranchRef -q .defaultBranchRef.name)"
```

### Phase 6 — Final report

```markdown
STATUS: COMPLETE | PARTIAL | BLOCKED — <one-line reason if not COMPLETE>

## PR Autopilot Roll-up — PR #N

- **Repo:** Agri-Flow/flow-ui-ux
- **Title:** <PR title>
- **Started:** <ISO>    **Completed:** <ISO>    **Wall time:** <Nh Nm>
- **Iterations:** N (max: 3)
- **CI runs triggered:** N
- **pr-reviewer spawns:** N
- **Findings auto-fixed:** N
- **Final merge:** YES | NO

### Timeline
| Time | Phase | Event |
|---|---|---|
| HH:MM | 1 | CI started on <SHA> |
| HH:MM | 1 | CI green on <SHA> |
| HH:MM | 2 | pr-reviewer returned 2 P0, 0 P1, 0 P2 (mechanical: 2/2) |
| HH:MM | 4 | iter 1: 2 fixes committed in <SHA> |
| HH:MM | 4 | iter 1: CI green, re-review clean |
| HH:MM | 5 | merged at <merge-SHA> |

### Discoveries for PM
(per workspace `story-discipline.md` Rule 2)
- None this cycle.   (or actual discoveries)

### Discipline Self-Check
- [x] Rule 3 (Verification): post-merge `git log --oneline -3` confirmed
- [x] Rule 4 (Exit protocol): STATUS line emitted
- [x] Rule 6 (Grep-first): every "review clean" claim grep-backed via the agent's comment
- [x] Workflow rule `feedback_pr_workflow`: push approvals satisfied by the `/goal` authorization; CI + review gates respected
```

---

## 4. Stop conditions (mapped to `/goal` hook)

`pr-autopilot` is the canonical agent for the `/goal` recipe used today. The hook condition that satisfies completion:

```
PR <N> is in state MERGED on remote AND local main is fast-forwarded to include it
```

Hook check:
```bash
gh --repo "$REPO" pr view "$PR_NUMBER" --json state -q .state | grep -q "MERGED"
```

The hook auto-clears when this returns true.

---

## 5. Inputs / outputs

**Reads:**
- `gh pr view N`, `gh pr view N --json …`, `gh pr diff N`
- The PR's diff on `git fetch` of the remote branch
- All workspace rules (`flow-ui/.claude/rules/`, `.claude/rules/`)
- The `pr-reviewer` agent's posted comment
- `git status` / `git log`

**Writes:**
- Auto-fix commits on the PR branch (Phase 4)
- Console roll-up (Phase 6)
- Optional: append a row to `flow-ui/ROADMAP.md` Shipped table on successful merge (debatable — see Open Questions §7)

**Tools required:** Read, Edit, Glob, Grep, Bash, Agent (to spawn `pr-reviewer`)

**Sandbox:** `enabled: false` — needs `gh`, `git push`, and local edits across the repo.

---

## 6. Composition with existing infrastructure

This agent does NOT duplicate work; it orchestrates existing agents and tools:

| It uses | For |
|---|---|
| `pr-reviewer` (existing) | The review (Phase 2, re-review at each iteration) |
| `design-linter` (existing) | Indirectly — `pr-reviewer` consults its reports |
| `design-builder` autopilot Phase 7 conventions | Loop safety guards (cap, no-progress, oscillation) |
| `gh` CLI | All PR API access + merge |
| `git` | Branch checkout, commit, push, sync main |
| The `feedback_pr_workflow` memory | Rule 1 (push approval) is satisfied at the `/goal` level — once founder invokes `/goal pr-autopilot N`, that IS the push authorization for the duration of this autopilot run |

---

## 7. Open design questions for the founder

These are calls I'd want answered before implementing:

1. **Push authorization scope.** Today's `feedback_pr_workflow` Rule 1 says push needs local approval first. Inside an autopilot run, the agent will push multiple times (one per fix iteration). Does the `/goal pr-autopilot N` invocation count as authorization for all in-loop pushes, or do you want a per-push prompt? *My recommendation: once via `/goal` is enough — that's the autopilot covenant. Per-push prompts defeat the purpose.*

2. **Should it touch ROADMAP.md?** The PR I just merged didn't auto-update ROADMAP's Shipped table for itself. Doing it inside autopilot would close that loop, but it adds scope. *My recommendation: do it. One Edit to ROADMAP.md as the last action before merge, on the PR branch, so the row lands with the merge. Founder can disable with `--no-roadmap`.*

3. **What about PR #4 (`Agri-Flow/flow-orchestrator`)?** That repo has no CI. The `--no-ci --review-only` modes should handle it, but the `pr-reviewer` agent today is registered in `flow-ui/.claude/agents/` — does it work cross-repo? *Open: needs testing. May need a per-repo `pr-reviewer` registration.*

4. **Should the agent open the PR too?** Today's flow was: founder commits + pushes + opens PR → invokes autopilot. Could the autopilot also call `gh pr create`? *My recommendation: no. PR creation is a deliberate authorship act ("I'm ready to share this work"). Merging is the mechanical follow-through. Keep the line there.*

5. **What about reviewer comments that AREN'T from pr-reviewer?** A human teammate could leave a comment requesting changes between iterations. Should autopilot pause? *My recommendation: yes — if any comment is added by a user other than `pr-reviewer` between iterations, escalate. This is the "founder redirected mid-flight" case.*

6. **Hook integration.** Should `/goal pr-autopilot N` set a Stop hook automatically that watches for the PR's MERGED state? *Likely yes — that's the natural composition.*

7. **Scheduling.** Should there be a passive mode that watches all open PRs and autopilots them? *Not now — that's a Layer 4 ambition, after this agent proves itself on 5+ manual invocations.*

---

## 8. Implementation effort estimate

- **Agent file:** ~400 lines (similar in scope to `story-coverage-auditor.md`)
- **Test scaffolding:** none beyond a real PR
- **Memory updates:** small note in `project_design_pipeline.md` + a new MEMORY index entry
- **Docs:** update `MANIFEST.md` Active table (1 row); brief mention in `flow-ui/CLAUDE.md` "Agents in this repo"
- **ROADMAP:** add to In flight when implementation lands

Total estimate: ~1-1.5 hr of focused work for the agent file + integration.

---

## 9. Migration path / first runs

1. Land the agent file in a PR (which would itself be a candidate first invocation — meta but works)
2. First non-meta invocation: when the next real PR opens, founder says `/goal pr-autopilot N`
3. After 5 successful runs, retire the manual `/goal "check pr status..."` recipe in favor of this agent
4. After 10+ runs and at least 2 cycles of auto-fix, consider promoting Open Q #7 (passive multi-PR mode) to Next-up

---

## 10. Cross-references

- **Memory:** `feedback_pr_workflow` (the source rules), `feedback_story_completion_and_pm_loop` (Discoveries-for-PM section in Phase 6 report), `project_design_pipeline` (where this fits in the broader pipeline)
- **Existing agents:** `design-builder` Phase 7 (loop safety pattern source), `pr-reviewer` (the review producer this agent consumes)
- **Existing rules:** `.claude/rules/agent-discipline.md` (Rule 4 exit protocol — the Phase 6 report shape), `.claude/rules/story-discipline.md` (Rule 2 discoveries-to-PM)
- **Prototype run:** 2026-05-18 hand-execution on PR #18 (the transcript IS the spec)
