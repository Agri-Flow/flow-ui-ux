# Plan: `pr-autopilot` — reusable PR-merge autopilot agent

**Drafted:** 2026-05-18 (end of session that hand-executed the workflow on PR #18)
**Refined pass 1:** 2026-05-18 — 13 correctness + spec gaps addressed
**Refined pass 2:** 2026-05-18 — 13 failure-mode findings addressed (C1-C4, H1-H5, M1-M4)
**Status:** PLAN — not implemented yet
**Form factor:** new agent at `flow-ui/.claude/agents/pr-autopilot.md`, callable as `pr-autopilot <PR#>` or via `/goal pr-autopilot <PR#>`
**Reusability:** primary target is `Agri-Flow/flow-ui-ux`. Portable to `Agri-Flow/flow-orchestrator` and other AgriFlow repos with a one-line repo arg.

---

## §0. Review-delegation contract (load-bearing — read before implementing)

**Invoking `/goal pr-autopilot N` is the founder delegating review authority to the CI `agriflow-design-review` workflow for this PR.** This satisfies `feedback_pr_workflow` Rule 2 ("PRs wait for CI + review before merge") without requiring the founder to personally read the review.

This delegation is scoped: it applies only to the PR number passed, only to mechanical findings the CI reviewer surfaces, and only for the duration of that autopilot run. Non-mechanical findings always escalate back to the founder.

**Two CI workflows run on every PR (important — they are not the same thing):**

| Workflow file | Check name | What it does | Comment format |
|---|---|---|---|
| `claude-code-review.yml` | `claude-review` | Generic `/code-review` plugin — catches general bugs, CLAUDE.md compliance | Plugin's own format — **no `[P0]/[P1]` tags, no `pr-reviewer:v1` marker** |
| `claude-design-review.yml` | `agriflow-design-review` | Runs `design-linter` then `pr-reviewer` agent — enforces design-system contracts | Posts `<!-- pr-reviewer:v1 -->` comment with `[P0]/[P1]/[P2]` findings |

`pr-autopilot` reads findings from the **`agriflow-design-review`** workflow only — that is the one that posts structured `[P0]/[P1]` findings. The `claude-review` check is a parallel generic pass; its output format is not parseable by this agent.

`agriflow-design-review` is **path-scoped** — it only fires when the PR touches `.claude/**`, `tokens/**`, `ui-flow/**`, `CLAUDE.md`, or `color-palette.html`. Non-design PRs have no `pr-reviewer:v1` comment; autopilot adjusts its gates accordingly (see Phase 5 Invariant C).

If the founder has any doubt about whether a PR is suitable for autopilot, they should NOT use `pr-autopilot` — read the review manually instead.

---

## 1. Why this exists

Today's PR #18 was the prototype for this flow. The founder set a `/goal` ("check the pr status, until the pr review finishes and the pipeline passed then merge it") and I hand-executed the workflow:

1. Polled CI in a background `until` loop (~16-22 min)
2. Once CI green, read the `agriflow-design-review` workflow's `pr-reviewer:v1` comment for findings
3. Review came back with 2 [P0] findings → fixed locally → committed → pushed
4. CI re-ran on the new HEAD
5. Re-review clean (0 P0/P1) → `gh pr merge --squash --delete-branch`
6. Synced local `main`

The pattern was hand-executed cleanly but is full of branch points (CI may hang, review may flag non-mechanical issues, fix may take multiple iterations). Codifying it removes the founder-relay step "now go through the merge checklist for PR N."

This agent mirrors `design-builder autopilot` Phase 7: same loop shape (build → check → fix mechanical → re-check), same safety caps (max iterations, oscillation detection, escalate non-mechanical), different domain (PR lifecycle vs. design lint).

---

## 2. Trigger + arguments

```
pr-autopilot <PR#>
pr-autopilot <PR#> --repo <owner>/<name>      # default: Agri-Flow/flow-ui-ux
pr-autopilot <PR#> --max-iterations <N>       # default: 3
pr-autopilot <PR#> --method squash|merge|rebase  # override merge method (see resolution below)
pr-autopilot <PR#> --dry-run                  # phases 0-3 execute; phases 4-5 print what they would do
pr-autopilot cancel <PR#>                     # clear lock + post STATUS: CANCELLED comment
```

`--skip-review` and `--review-only` are **not supported in v1**. Invoking either emits `STATUS: BLOCKED — flag not supported in v1; approve manually` and exits.

**Merge method resolution (Phase 0):**
1. `--method` flag (explicit wins)
2. GitHub repo settings via `gh api /repos/$REPO --jq '{squash:.allow_squash_merge,merge:.allow_merge_commit,rebase:.allow_rebase_merge}'` — pick the first enabled in order: squash → merge → rebase
3. Default fallback: `squash`

**Invocation via `/goal`:**
```
/goal pr-autopilot 18
```

---

## 3. Phases

### Phase 0 — Auth + lock + resolve PR + workflow shape

**Step 0.1 — Auth check:**
```bash
gh auth status &>/dev/null || { echo "STATUS: BLOCKED — gh not authenticated"; exit 1; }
```

**Step 0.2 — Concurrent-invocation guard:**
```bash
LOCK="reports/autopilot/PR-${PR_NUMBER}.lock"
mkdir -p reports/autopilot

if [ -f "$LOCK" ]; then
  # Portable mtime: works on macOS (stat -f) and Linux (stat -c)
  if command -v python3 &>/dev/null; then
    LOCK_AGE=$(python3 -c "import os,sys,time; print(int(time.time()-os.path.getmtime(sys.argv[1])))" "$LOCK" 2>/dev/null || echo 0)
  else
    LOCK_AGE=$(( $(date +%s) - $(date -r "$LOCK" +%s 2>/dev/null || echo $(date +%s)) ))
  fi
  if [ "$LOCK_AGE" -lt 3600 ]; then
    echo "STATUS: BLOCKED — pr-autopilot already running for PR #${PR_NUMBER} (lock age: ${LOCK_AGE}s)"
    exit 1
  fi
fi

echo "$$" > "$LOCK"
trap 'rm -f "$LOCK"' EXIT   # cleans up on normal exit, error, SIGTERM; not on SIGKILL
```

**Step 0.3 — Resolve PR + workflow shape:**
```bash
PR_NUMBER=$ARGUMENTS
REPO=${REPO:-Agri-Flow/flow-ui-ux}

PR_DATA=$(gh --repo "$REPO" pr view "$PR_NUMBER" \
  --json state,isDraft,mergeable,mergeStateStatus,headRefOid,headRefName,statusCheckRollup,labels,title)

# Refuse conditions
STATE=$(echo "$PR_DATA" | jq -r '.state')
IS_DRAFT=$(echo "$PR_DATA" | jq -r '.isDraft')
MERGEABLE=$(echo "$PR_DATA" | jq -r '.mergeable')
HAS_SKIP=$(echo "$PR_DATA" | jq -r '[.labels[].name] | any(. == "skip-autopilot")' )
TITLE=$(echo "$PR_DATA" | jq -r '.title')

[ "$STATE" = "OPEN" ]        || { echo "STATUS: BLOCKED — PR is $STATE"; exit 1; }
[ "$IS_DRAFT" = "false" ]    || { echo "STATUS: BLOCKED — PR is draft"; exit 1; }
[ "$MERGEABLE" != "CONFLICTING" ] || { echo "STATUS: BLOCKED — merge conflict; rebase required"; exit 1; }
[ "$HAS_SKIP" = "false" ]    || { echo "STATUS: BLOCKED — [skip-autopilot] label present"; exit 1; }
echo "$TITLE" | grep -q "\[skip-autopilot\]" && { echo "STATUS: BLOCKED — [skip-autopilot] in title"; exit 1; }

# Detect workflow shape
CHECK_COUNT=$(echo "$PR_DATA" | jq '[.statusCheckRollup | length] | first')
if [ "$CHECK_COUNT" -eq 0 ]; then
  CI_MODE="none"   # no-CI repo — skip Phase 1
else
  CI_MODE="with-ci"
fi

# Detect whether the design review workflow is in play for this PR
DESIGN_REVIEW_PRESENT=$(echo "$PR_DATA" | jq \
  '[.statusCheckRollup[] | select(.name == "agriflow-design-review")] | length > 0')

# Resolve merge method
METHOD_FLAG="${METHOD:-""}"
if [ -z "$METHOD_FLAG" ]; then
  REPO_SETTINGS=$(gh api "/repos/$REPO" \
    --jq '{squash:.allow_squash_merge,merge:.allow_merge_commit,rebase:.allow_rebase_merge}')
  if echo "$REPO_SETTINGS" | jq -e '.squash == true' &>/dev/null; then
    METHOD_FLAG="squash"
  elif echo "$REPO_SETTINGS" | jq -e '.merge == true' &>/dev/null; then
    METHOD_FLAG="merge"
  else
    METHOD_FLAG="rebase"
  fi
fi
```

### Phase 1 — Wait for CI green

Skip entirely when `CI_MODE="none"` (no-CI repo).

```bash
DEADLINE=$(( $(date +%s) + 2400 ))   # 40-min hard cap

until gh --repo "$REPO" pr view "$PR_NUMBER" \
    --json statusCheckRollup \
    --jq '[.statusCheckRollup | length > 0, (.statusCheckRollup[].status == "COMPLETED")] | all' \
    | grep -q true; do
  if [ "$(date +%s)" -gt "$DEADLINE" ]; then
    STUCK_URL=$(gh --repo "$REPO" pr view "$PR_NUMBER" \
      --json statusCheckRollup \
      --jq '[.statusCheckRollup[] | select(.status != "COMPLETED")] | first | .detailsUrl')
    echo "STATUS: BLOCKED — CI stuck after 40 min. See: $STUCK_URL"
    exit 1
  fi
  sleep 60
done
```

Note: `length > 0` guard prevents an empty `statusCheckRollup` from immediately returning true (jq `all` on an empty array is true).

**Do NOT use `ScheduleWakeup`** — Stop-hook fires between wakeups and creates noisy back-and-forth. Background bash + harness notification is cleaner.

On completion:
- If any check `conclusion != "SUCCESS"`: `STATUS: BLOCKED — CI red`. Surface check name + `detailsUrl`. Exit.
- If all SUCCESS: proceed.

### Phase 2 — Read the review

**Fetch the latest `pr-reviewer:v1` comment (reverse-sorted, handles >100 comments):**

```bash
# Fetch most-recent-first so we get the latest comment even on high-comment PRs
REVIEW_COMMENT=$(gh api \
  "/repos/$REPO/issues/$PR_NUMBER/comments?per_page=100&direction=desc&page=1" \
  --jq '[.[] | select(.body | contains("<!-- pr-reviewer:v1 -->"))] | first')
```

**If `DESIGN_REVIEW_PRESENT` is false** (path-scoped workflow didn't fire — non-design PR):
- No `pr-reviewer:v1` comment exists or is expected
- Set `P0_COUNT=0`, `P1_COUNT=0`, `P2_COUNT=0` and proceed as "no findings"
- Log: "agriflow-design-review absent (non-design PR) — skipping review gate; claude-review SUCCESS is the sole gate"

**If `DESIGN_REVIEW_PRESENT` is true and `REVIEW_COMMENT` is null:**
- Poll up to 60 s (12 × 5s) for the comment to appear (CI workflow lags check completion by a few seconds):
```bash
for _ in $(seq 1 12); do
  sleep 5
  REVIEW_COMMENT=$(gh api \
    "/repos/$REPO/issues/$PR_NUMBER/comments?per_page=100&direction=desc&page=1" \
    --jq '[.[] | select(.body | contains("<!-- pr-reviewer:v1 -->"))] | first')
  [ "$REVIEW_COMMENT" != "null" ] && [ -n "$REVIEW_COMMENT" ] && break
done
if [ -z "$REVIEW_COMMENT" ] || [ "$REVIEW_COMMENT" = "null" ]; then
  echo "STATUS: BLOCKED — agriflow-design-review check passed but no pr-reviewer:v1 comment posted after 60s"
  exit 1
fi
```

### Phase 3 — Decide

**Findings extraction (locked format — grep only):**

```bash
COMMENT_BODY=$(echo "$REVIEW_COMMENT" | jq -r '.body // ""')

# Extract by triage tier
P0_FINDINGS=$(echo "$COMMENT_BODY" | grep -E '^[0-9]+\. \*\*\[P0\]\*\*')
P1_FINDINGS=$(echo "$COMMENT_BODY" | grep -E '^[0-9]+\. \*\*\[P1\]\*\*')
P2_FINDINGS=$(echo "$COMMENT_BODY" | grep -E '^[0-9]+\. \*\*\[P2\]\*\*')

P0_COUNT=$(echo "$P0_FINDINGS" | grep -c '[^[:space:]]' || echo 0)
P1_COUNT=$(echo "$P1_FINDINGS" | grep -c '[^[:space:]]' || echo 0)
P2_COUNT=$(echo "$P2_FINDINGS" | grep -c '[^[:space:]]' || echo 0)
```

**Fail-closed:** if grep finds zero matches AND the comment body lacks a `STATUS:` line, treat as unparseable → `STATUS: BLOCKED — could not extract structured findings from pr-reviewer:v1 comment`. Do NOT merge.

**Decision table:**

| Review outcome | Action |
|---|---|
| 0 P0, 0 P1, 0 P2 | Proceed to Phase 5 (merge) |
| 0 P0, 0 P1, N P2 | Proceed to Phase 5 (P2 are informational; don't block) |
| ≥1 P0 OR ≥1 P1, **all mechanical** | Proceed to Phase 4 (auto-fix loop) |
| ≥1 P0 OR ≥1 P1, **any non-mechanical** | `STATUS: PARTIAL — escalation`. Surface to founder. Exit. |
| Unparseable comment | `STATUS: BLOCKED`. Surface. Exit. |

**Mechanical vs non-mechanical classifier:**

Default to **non-mechanical** when uncertain.

Mechanical (auto-fixable in `Agri-Flow/flow-ui-ux`):
- Stale path strings, broken cross-references, typos in copied content
- Missing entries in a catalog (SCREENS-INDEX.md row, MANIFEST table row)
- Token-link depth mismatches
- Stale ASCII tree diagrams (exact class of bug from PR #18)
- Missing `<!-- STATE: -->` comments per gate G6
- Stock palette / hardcoded hex (gates G3/G4)
- `h-9` instead of `h-10` (gate G7)

Non-mechanical (escalate — never auto-fix):
- Logic / behavior changes
- Architecture or interface decisions
- Brand / visual judgment calls
- "PR scope is wrong" findings
- Security / compliance concerns
- Anything requiring reading the founder's intent

**Classifier scope note:** this list is calibrated for `Agri-Flow/flow-ui-ux` (design-lint findings). When `--repo` targets another repo, ALL findings default to non-mechanical → escalate. A per-repo classifier can be added later via `.claude/rules/pr-autopilot.mechanical.md`.

### Phase 4 — Auto-fix mechanical findings (capped loop)

**Step 4.0 — Branch checkout (required before any Edit):**

```bash
HEAD_REF=$(echo "$PR_DATA" | jq -r '.headRefName')
git fetch origin "$HEAD_REF"
git checkout -B "$HEAD_REF" "origin/$HEAD_REF"
# Fail if local tree has uncommitted changes that block checkout
```

If checkout fails: `STATUS: BLOCKED — cannot checkout ${HEAD_REF}; local tree has uncommitted changes`. Never apply fixes to `main`.

**Step 4.1 — Save original PR title (for [force-review] toggle):**

```bash
ORIGINAL_TITLE=$(gh --repo "$REPO" pr view "$PR_NUMBER" --json title -q .title)
```

**Loop:**

```
PREV_FINGERPRINT=""
PREV_PREV_FINGERPRINT=""
EDITED_FILES=()    # track explicitly — never use git add -A or git add .
iteration = 0

while iteration < MAX_ITERATIONS:
    iteration += 1

    # Apply mechanical fixes using Edit tool only (Write only for net-new required files)
    for finding in mechanical_findings:
        apply_fix(finding)              # Edit existing file
        EDITED_FILES.append(file_path)  # track touched path explicitly

    # Fingerprint current findings for oscillation/no-progress detection
    CURRENT_FINGERPRINT = sha256( sort( P0_FINDINGS + P1_FINDINGS ) )

    if CURRENT_FINGERPRINT == PREV_FINGERPRINT:
        STATUS: BLOCKED — no progress (same findings as previous iteration)
        break
    if CURRENT_FINGERPRINT == PREV_PREV_FINGERPRINT:
        STATUS: BLOCKED — oscillating (findings alternate between two states)
        break

    PREV_PREV_FINGERPRINT = PREV_FINGERPRINT
    PREV_FINGERPRINT = CURRENT_FINGERPRINT

    # Commit — add only explicitly tracked files
    git add "${EDITED_FILES[@]}"
    EDITED_FILES=()   # reset for next iteration

    SCOPE=$(echo "$ORIGINAL_TITLE" | grep -oP '\(\K[^)]+' || echo "pr-autopilot")
    git commit -m "fix(${SCOPE}): address pr-reviewer P0/P1 findings (iter ${iteration})"

    # Toggle [force-review] in PR title so pr-reviewer doesn't self-skip on re-push
    gh --repo "$REPO" pr edit "$PR_NUMBER" --title "[force-review] $ORIGINAL_TITLE"

    # Push
    git push origin "$HEAD_REF"
    NEW_HEAD_OID=$(git rev-parse HEAD)

    # Guard against CI check staleness: wait until a check with startedAt > push time appears
    PUSH_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    for _ in $(seq 1 24); do   # up to 2 min
      sleep 5
      NEW_CHECK=$(gh --repo "$REPO" pr view "$PR_NUMBER" \
        --json statusCheckRollup \
        --jq "[.statusCheckRollup[] | select(.startedAt > \"$PUSH_TIME\")] | length > 0")
      [ "$NEW_CHECK" = "true" ] && break
    done

    # Wait for CI green on new HEAD (Phase 1)
    run Phase 1

    # Wait for new pr-reviewer:v1 comment on new SHA (up to 5 min = 60 × 5s)
    NEW_REVIEW=""
    for _ in $(seq 1 60); do
      sleep 5
      CANDIDATE=$(gh api \
        "/repos/$REPO/issues/$PR_NUMBER/comments?per_page=100&direction=desc&page=1" \
        --jq "[.[] | select(.body | contains(\"<!-- pr-reviewer:v1 -->\")) \
               | select(.body | contains(\"<!-- reviewed-sha: $NEW_HEAD_OID -->\"))] | first")
      if [ "$CANDIDATE" != "null" ] && [ -n "$CANDIDATE" ]; then
        NEW_REVIEW="$CANDIDATE"
        break
      fi
    done

    if [ -z "$NEW_REVIEW" ] || [ "$NEW_REVIEW" = "null" ]; then
        STATUS: BLOCKED — no new pr-reviewer:v1 comment for SHA $NEW_HEAD_OID after 5 min
        break
    fi

    # Restore original title now that new review comment has landed
    gh --repo "$REPO" pr edit "$PR_NUMBER" --title "$ORIGINAL_TITLE"

    # Re-parse findings from new comment
    run Phase 3 on NEW_REVIEW
    if review is clean: break
    if any finding is non-mechanical: STATUS: PARTIAL — escalation; break

if iteration == MAX_ITERATIONS and review still not clean:
    STATUS: PARTIAL — exceeded iteration cap (${MAX_ITERATIONS})
    # Restore title in case it's still force-review
    gh --repo "$REPO" pr edit "$PR_NUMBER" --title "$ORIGINAL_TITLE"
```

**Safety guards:**
- **Iteration cap:** default 3. Hard stop.
- **No-progress detection:** two consecutive iterations with identical finding fingerprints → stop.
- **Oscillation detection:** current fingerprint matches two-iters-ago fingerprint → stop.
- **Non-mechanical escalation:** any non-mechanical finding at any iteration → escalate immediately.
- **Title cleanup:** `ORIGINAL_TITLE` is always restored before exit (normal or error) via a second trap or explicit restore in every exit path.

**Dry-run mode:** in `--dry-run`, Phase 4 prints "would fix: `<finding>`" and "would commit: `<message>`" without applying any Edit or running `git`. Phase 1 still executes (wait for CI). Phase 3 still executes (parse findings). Phase 5 prints "would merge: `gh pr merge $PR_NUMBER --$METHOD_FLAG --delete-branch`" and exits without merging.

### Phase 5 — Pre-merge invariants + merge

**Invariant A — merge state:**
```bash
MERGE_STATE=$(gh --repo "$REPO" pr view "$PR_NUMBER" --json mergeStateStatus -q .mergeStateStatus)
[ "$MERGE_STATE" = "CLEAN" ] || fail "mergeStateStatus=$MERGE_STATE (expected CLEAN)"
```

**Invariant B — all CI checks green (with-ci mode only):**
```bash
ALL_GREEN=$(gh --repo "$REPO" pr view "$PR_NUMBER" \
  --json statusCheckRollup \
  --jq '[.statusCheckRollup[].conclusion] | all(. == "SUCCESS")')
[ "$ALL_GREEN" = "true" ] || fail "one or more CI checks not SUCCESS"
```

**Invariant C — latest review was written against current HEAD (design PRs only):**

Invariant C is **skipped** when `DESIGN_REVIEW_PRESENT` is false (path-scoped workflow didn't fire for this PR — no `pr-reviewer:v1` comment is expected).

When `DESIGN_REVIEW_PRESENT` is true:

```bash
HEAD_OID=$(gh --repo "$REPO" pr view "$PR_NUMBER" --json headRefOid -q .headRefOid)

# Use the structured anchor embedded by pr-reviewer (see cross-agent dependency note in §9)
LATEST_REVIEW_BODY=$(gh api \
  "/repos/$REPO/issues/$PR_NUMBER/comments?per_page=100&direction=desc&page=1" \
  --jq '[.[] | select(.body | contains("<!-- pr-reviewer:v1 -->"))] | first | .body // ""')

REVIEW_SHA=$(echo "$LATEST_REVIEW_BODY" \
  | grep -oP '(?<=<!-- reviewed-sha: )[0-9a-f]{40}(?= -->)')

if [ -z "$REVIEW_SHA" ]; then
  fail "pr-reviewer:v1 comment lacks <!-- reviewed-sha: SHA --> anchor — pr-reviewer.md needs updating"
fi
[ "$REVIEW_SHA" = "$HEAD_OID" ] || \
  fail "latest review was for SHA $REVIEW_SHA, current HEAD is $HEAD_OID"
```

If any invariant fails: `STATUS: BLOCKED — pre-merge invariant violated: <which>`. Surface and exit.

**Merge:**
```bash
gh --repo "$REPO" pr merge "$PR_NUMBER" --${METHOD_FLAG} --delete-branch
git checkout main
git pull --ff-only origin main
# Clean up local PR branch
git branch -d "$HEAD_REF" 2>/dev/null || true

# Verify
MERGED=$(gh --repo "$REPO" pr view "$PR_NUMBER" --json state -q .state)
[ "$MERGED" = "MERGED" ] || echo "WARNING: post-merge state check returned $MERGED"
```

If `git pull --ff-only` fails (local main diverged): `STATUS: BLOCKED — local main diverged; run git pull manually`.

### Phase 6 — Final report

```markdown
STATUS: COMPLETE | PARTIAL | BLOCKED — <one-line reason if not COMPLETE>

## PR Autopilot Roll-up — PR #N

- **Repo:** Agri-Flow/flow-ui-ux
- **Title:** <PR title>
- **Started:** <ISO>    **Completed:** <ISO>    **Wall time:** <Nh Nm>
- **Iterations:** N (max: 3)
- **CI runs triggered:** N
- **Design review present:** YES | NO (non-design PR — Invariant C skipped)
- **Findings mechanical/non-mechanical:** N / N
- **Findings auto-fixed:** N
- **Final merge:** YES (--squash) | NO

### Timeline
| Time | Phase | Event |
|---|---|---|
| HH:MM | 0 | PR resolved; workflow shape: with-ci; design-review: present; merge-method: squash |
| HH:MM | 0 | Lock acquired at reports/autopilot/PR-N.lock |
| HH:MM | 1 | CI started on <SHA> |
| HH:MM | 1 | CI green (claude-review ✅, agriflow-design-review ✅) |
| HH:MM | 2 | pr-reviewer:v1 comment found (reviewed-sha: <SHA>) |
| HH:MM | 3 | 2 P0, 0 P1 — all mechanical |
| HH:MM | 4 | iter 1: 2 fixes committed as <SHA>; title → [force-review] |
| HH:MM | 4 | iter 1: push; new check startedAt detected |
| HH:MM | 4 | iter 1: CI green; new pr-reviewer:v1 comment on <SHA>; title restored |
| HH:MM | 3 | iter 1 re-review: 0 P0, 0 P1 — clean |
| HH:MM | 5 | Invariants A/B/C passed; merged at <merge-SHA> |
| HH:MM | 5 | Local main fast-forwarded; PR branch deleted |

### Escalations
(non-mechanical findings, unexpected state, or surprises this run)
- None this cycle.

### Discipline Self-Check
- [x] Rule 3 (Verification): post-merge `git log --oneline -3` confirmed merge SHA
- [x] Rule 4 (Exit protocol): STATUS line emitted
- [x] Rule 6 (Grep-first): all "review clean" claims backed by grep against pr-reviewer:v1 comment body
- [x] §0 (Review-delegation): /goal invocation is founder's delegation; agriflow-design-review is canonical reviewer
- [x] Workflow rule `feedback_pr_workflow`: CI green + review-SHA invariant satisfied before merge
- [x] `git add` used only against explicitly tracked EDITED_FILES (no -A, no .)
```

---

## 4. Stop conditions (mapped to `/goal` hook)

```bash
# Hook fires when this returns true:
gh --repo "$REPO" pr view "$PR_NUMBER" --json state -q .state | grep -q "MERGED"
```

**Cancel (`pr-autopilot cancel <PR#>`):**
```bash
LOCK="reports/autopilot/PR-${PR_NUMBER}.lock"
rm -f "$LOCK"
gh --repo "$REPO" pr comment "$PR_NUMBER" \
  --body "**pr-autopilot:** Run cancelled by founder. STATUS: CANCELLED."
echo "Note: any background CI-wait loop still running will exit when the session ends."
```

---

## 5. Inputs / outputs

**Reads:**
- `gh pr view N`, `gh pr view N --json …`
- `gh api /repos/$REPO/issues/$PR_NUMBER/comments?direction=desc` (reverse-sorted — handles >100 comments)
- `gh api /repos/$REPO` (merge method settings)
- All workspace rules (`flow-ui/.claude/rules/`, `.claude/rules/`)
- `git fetch`, `git log`, `git status`

**Writes:**
- `reports/autopilot/PR-N.lock` (ephemeral; trap-cleaned on exit)
- Auto-fix commits on the PR branch (Phase 4) — tracked file list only
- Console roll-up (Phase 6)

**Does NOT write:** ROADMAP.md (removed from scope — authorship act, not mechanical follow-through).

**Tools required:** Read, Edit, Glob, Grep, Bash

---

## 6. Composition with existing infrastructure

| It uses | For |
|---|---|
| CI `agriflow-design-review` workflow | Canonical reviewer — reads its `pr-reviewer:v1` comment |
| CI `claude-review` workflow | Generic pass — informational; NOT parsed for `[P0]/[P1]` findings |
| `design-linter` (existing) | Indirectly — `agriflow-design-review` runs it as a pre-step |
| `design-builder` Phase 7 conventions | Loop safety guards (cap, no-progress, oscillation) |
| `gh` CLI | All PR API access + merge |
| `git` | Branch checkout (Phase 4), commit, push, sync main |
| `reports/autopilot/PR-N.lock` | Concurrent-invocation guard |
| `<!-- reviewed-sha: SHA -->` anchor in `pr-reviewer:v1` comment | Invariant C SHA verification without ambiguous hex grep |

---

## 7. Open design questions for the founder

**Resolved during refinement passes:**
- **Q1 (push auth scope):** `/goal pr-autopilot N` covers all in-loop pushes (documented in §0).
- **Q2 (ROADMAP update):** removed from scope — see §5.
- **Q5 (human comments mid-flight):** any `type == "User"` comment posted between iterations → escalate. Bot comments (Dependabot, GitHub Actions) are skipped.
- **C1 (wrong check name):** fixed — uses `agriflow-design-review`.
- **C2 (self-skip loop breakage):** fixed — `[force-review]` title toggle in Phase 4.
- **C3 (non-design PRs):** fixed — Invariant C skipped when `DESIGN_REVIEW_PRESENT` is false.
- **C4 (SHA grep ambiguity):** fixed — `<!-- reviewed-sha: SHA -->` anchor; see cross-agent dependency in §9.
- **H1-H5, M1-M4:** addressed throughout phases.

**Remaining open:**

1. **Cross-repo `pr-reviewer` comment format (Q3).** `Agri-Flow/flow-orchestrator` has no CI. `--repo flow-orchestrator` emits `STATUS: BLOCKED — cross-repo review not yet validated` until tested.

2. **Bot vs human comment detection.** The `gh api comments` response includes `user.type`. Filter: skip comments where `user.type == "Bot"` when checking for mid-flight human intervention. Needs implementation.

3. **Passive multi-PR mode (Q7).** Deferred — Layer 4 ambition. After 5+ successful manual invocations.

---

## 8. Implementation effort estimate

- **Agent file `pr-autopilot.md`:** ~500 lines
- **Required co-change `pr-reviewer.md`:** add `<!-- reviewed-sha: $PR_HEAD_SHA -->` anchor to comment template (1-line change — see §9 prerequisites)
- **Required co-change `.gitignore`:** add `reports/autopilot/` entry (1-line change)
- **Memory updates:** note in `project_design_pipeline.md` + MEMORY index entry
- **Docs:** update `MANIFEST.md` Active table (1 row); brief mention in `flow-ui/CLAUDE.md` "Agents in this repo"
- **ROADMAP:** add to In flight when implementation lands

Total estimate: ~2 hr for the agent file + co-changes + integration.

---

## 9. Migration path / first runs

### Prerequisites (must land before the agent file)

These two changes must be in `main` before `pr-autopilot` is usable:

**P1 — Add `<!-- reviewed-sha: SHA -->` anchor to `pr-reviewer.md` comment template.**
In `pr-reviewer.md` Phase 6, both comment templates must embed this anchor immediately after `<!-- pr-reviewer:v1 -->`:

```markdown
<!-- pr-reviewer:v1 -->
<!-- reviewed-sha: <full-PR-head-SHA-from-Phase-0-PR_HEAD_SHA> -->
## PR review
…
```

This is the anchor `pr-autopilot` Invariant C reads. Without it, every Invariant C check fails with "comment lacks reviewed-sha anchor."

**P2 — Add `reports/autopilot/` to `.gitignore`.**
```
# pr-autopilot lock files (ephemeral)
reports/autopilot/
```

Without this, lock files surface in `git status` and risk being swept into fix commits if `git add` is used loosely.

### Rollout steps

1. Land P1 + P2 in a single PR (trivial — 2 lines changed)
2. Land `pr-autopilot.md` agent file in its own PR (which can itself be autopiloted — meta but works)
3. First real invocation: next PR that opens → founder says `/goal pr-autopilot N`
4. After 5 successful runs, retire the manual `/goal "check pr status..."` recipe
5. After 10+ runs with ≥2 auto-fix cycles, consider passive multi-PR mode

---

## 10. Cross-references

- **Memory:** `feedback_pr_workflow` (source rules), `project_design_pipeline` (pipeline position)
- **Existing agents:** `design-builder` Phase 7 (loop safety pattern), CI `agriflow-design-review` workflow (canonical reviewer), `pr-reviewer.md` (must be updated per §9 P1)
- **Existing rules:** `.claude/rules/agent-discipline.md` (Rule 4 exit protocol), `.claude/rules/story-discipline.md` (Rule 2 — "Escalations" section)
- **Workflow files:** `.github/workflows/claude-design-review.yml` (agriflow-design-review), `.github/workflows/claude-code-review.yml` (claude-review — generic, NOT the structured reviewer)
- **Prototype run:** 2026-05-18 hand-execution on PR #18 (transcript IS the spec)
