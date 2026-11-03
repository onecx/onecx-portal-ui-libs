---
name: dev-docs-audit
description: "Audit every Area of the OneCX libs dev-docs/ against libs and Shell code, one subagent and PR per Area; `seams` mode later fixes what spans Areas."
disable-model-invocation: true
---

# Dev Docs Audit

You are the orchestrator. Two repos are in play:
- **Libs**: default [onecx/onecx-portal-ui-libs](https://github.com/onecx/onecx-portal-ui-libs). It is the evidence, the place where changes are made, and the base for every PR. The `org/repo` is an intake input (`<libs repo>`) that defaults to this, so a fork target works too.
- **Shell**: default [onecx/onecx-shell-ui](https://github.com/onecx/onecx-shell-ui). It is evidence only. The `org/repo` is an intake input (`<shell repo>`).

Each Area gets its own subagent, worktree, branch and PR. The subagent audits and fixes the Area until a **clean pass**.

- **Area / Unit**: as defined in [references/unit-rules.md](references/unit-rules.md).
- **Brief**: what the user says an Area must cover, plus the facts that must be included.
- **Pass**: a full audit of every page in an Area, followed by applying every finding. A **clean pass** finds nothing.
- **Audit record**: `dev-docs/<area>/.last-audit.json` for each Area, plus `dev-docs/.last-audit.json` for the seams. Each one stores the libs and Shell commits the last audit traced against, in the shape shown in [references/area-agent.md](references/area-agent.md#audit-record).
  - With a record, the run is a *maintenance run*: the code investigation covers only the commit history since those commits.
  - With no record, it is a *full run* against the whole libs and Shell codebase.
- `<skill>` is this skill's directory. `<ws>` is `<session-folder>/files/dev-docs-audit/<run-id>/`, where `<run-id>` is the start time as `YYYYMMDD-HHMM`. If no session folder is in context, use `$(mktemp -d)`. Create `<ws>/{sources,worktrees,reports}` before first use.

Invocations:
- `/dev-docs-audit [libs-branch] [shell-branch]` audits the Areas. Follow Steps 1–3.
- `/dev-docs-audit seams [libs-branch] [shell-branch]` fixes what spans Areas: the root index, cross-Area links and concept ownership. Run it only after a human has reviewed the Area PRs and all of them have merged into the libs branch. Run Step 1 sub-steps 1, 4 and 5 (questions, clones, sources), then follow [references/seams.md](references/seams.md).

Both branches default to `main`.

Harness tools: a *user question* is `ask_user` in Copilot CLI and `AskUserQuestion` in Claude Code. A *subagent* is the `task` tool (`agent_type: general-purpose`, `mode: background`) in Copilot CLI and the `Task` tool (`subagent_type: general-purpose`, `run_in_background: true`) in Claude Code. Subagents cannot ask the user, which is why Step 1 collects everything up front.

## Step 1 — Intake

Ask every question first. Clone nothing until the answers are in.

1. **Repos and branches**: take the libs branch and the Shell branch from the arguments. Take `<libs repo>` (the `org/repo` to push to) and `<shell repo>` (read-only) from the arguments too, defaulting to `onecx/onecx-portal-ui-libs` and `onecx/onecx-shell-ui`. If the user names a fork, set `<libs repo>` to it. If either branch is missing, ask for both in one user question (default `main`).
   - **Pre-flight, before dispatching any agent**: verify the base branch actually exists on the PR target with `gh api "repos/<libs repo>/branches/<libs-branch>"`. A 404 here is the failure the dry-run hit: the base branch lived only on a fork, so a PR against upstream could never open. If it 404s on `<libs repo>`, say so and ask which `org/repo` to target. Also confirm the account can open a PR there (e.g. `gh api "repos/<libs repo>" --jq .full_name` resolves and the account has write access). Only proceed when both hold.
2. **Folders**: list `dev-docs/` on the libs branch without cloning, using `gh api "repos/<libs repo>/contents/dev-docs?ref=<libs-branch>"`. Read the root `README.adoc` and every `dev-docs/<folder>/.last-audit.json` the same way. Classify every subfolder into one of these classes:
   - *Area*: indexed in the root index as `— \`<slug>/\`` with a matching folder.
   - *Unindexed or renamed*: has Unit-shaped pages, but its slug is missing from the index or differs from it (for example `theming/` versus `theming-assets/`).
   - *Legacy / other*: listed in the index as superseded or other.

   If `dev-docs/README.adoc` or `dev-docs/unit-template.adoc` is missing, the tree does not follow the Area/Unit convention: say so and stop.
3. **Areas and briefs**: send one user question.
   - Show the folder table, with each Area's last-audit date, or *first run* when it has no record.
   - Ask whether to audit each folder as an Area (under which index slug) or to skip it. The default audits every Area and every unindexed folder. Every skip is explicit.
   - Give each audited Area one optional free-text field: "What must this Area cover, and which information must it include?" An empty field means the Area has no brief, and its subagent skips the brief check.
4. **Clones**:
   - **Libs**: clone `<libs repo>` into `<ws>/repo`, check out the libs branch, and pin `LIBS_SHA` with `git rev-parse HEAD`.
   - **Shell**: clone `<shell repo>` with `--filter=blob:none --branch <shell-branch>` into `<ws>/sources/<shell repo>`, and pin `SHELL_SHA`.

   Every Area uses the same pinned pair, so all PRs trace against one snapshot.
5. **Sources and maps**:
   - Collect every other link prefix shaped `https://github.com/<org>/<repo>/blob/<ref>` used in pages. For each distinct `org/repo/ref`, run `git init` in `<ws>/sources/<org>/<repo>/<ref>/`, then `git fetch --depth 1 https://github.com/<org>/<repo> <ref>` and `git checkout FETCH_HEAD`.
   - Write one `--map <prefix>=<checkout dir>` pair per source. Pages link the Shell through `{shell}` (a `https://github.com/<shell repo>/blob/<ref>` prefix), so map that prefix to the Shell checkout, whatever the Shell branch is.

Done when:
- both branches are set, and every folder has a user-confirmed class;
- every audited Area has a brief or is marked *no brief*;
- both SHAs are pinned, and every source is checked out and mapped.

Record all of this in `<ws>/intake.md`.

## Step 2 — Dispatch

Launch one general-purpose subagent per Area, all in the background and in parallel. Give each one:
- `<libs repo>`, `<shell repo>`, `<ws>`, the repo path `<ws>/repo` and the Area slug;
- `LIBS_SHA`, `SHELL_SHA`, the libs branch, the Shell branch and the run id;
- the brief verbatim, or *no brief*;
- the `--map` pairs;
- the report path `<ws>/reports/<area>.md`;
- this instruction: "Read `<skill>/references/area-agent.md` first and follow it exactly."

The subagent creates its own worktree and branch. It stops at the **Finish** step and does **not** push or open a PR. Wait for the completion notifications.

Done when every subagent has returned its branch name, its commit list, its clean status, its run mode with a drift summary, its Handoff list and its report path, or else a failure reason. If an Area hit the pass cap, mark it *draft* for Step 3. Ask the user whether to re-dispatch that Area for more passes on the same branch.

## Step 3 — Verify, push, report

The subagents stopped before pushing. The orchestrator now verifies each Area's work **independently** and, only then, pushes and opens the PR. Do not open a PR on a subagent's word alone.

For each returned Area, in its worktree:
1. **Re-run the linter**: `python3 <skill>/scripts/lint.py <ws>/worktrees/<area>/dev-docs --area <area> --map <map pairs>` must exit 0 (on a not-clean pass, report no hard finding; only `planned-link` and the warn-only voice kinds). This re-derives the subagent's lint claim rather than trusting it. The `<map pairs>` are the `--map URL=DIR` pairs from intake.
2. **Spot-check correctness claims**: for every correctness finding the report lists, open the named code file and confirm the *claim before → after* against it. A claim that does not survive this check is reverted or escalated to the user, not merged.
3. **Confirm the diff is in-scope**: `git -C <ws>/worktrees/<area> diff --name-only <libs branch>` lists only `dev-docs/<area>/` pages plus the Area's `.last-audit.json`. Anything else is a Handoff item that leaked into the branch — pull it back out and record it in the report.
4. **Push and open the PR**: `git -C <ws>/worktrees/<area> push -u origin <branch>`, then `gh pr create --repo <libs repo> --base <libs branch> --head <branch> --title "docs(<area>): audit <Area title>" --body-file <ws>/reports/<area>.md`. Add `--draft` when the Area is marked *draft* (no clean pass reached). `origin` is `<libs repo>` — the fork or upstream the intake pre-flight validated.

If a verification step fails for an Area, do not push it: log the failure in the table and surface it to the user for a decision.

Then report:
1. Give the user one table with these columns: Area, run mode, previous audit → now (short SHAs), relevant commits, passes, clean pass (Y/N), words before → after, verify (lint + spot-check + diff in-scope: pass/fail), PR URL, open questions.
2. Below the table, list every unverified fact and open question, and the combined Handoff list. The Handoff list is the input for the seams run.
3. Remove the worktrees with `git worktree remove`, and keep the branches.
4. Tell the user the next step: review and merge the Area PRs into the libs branch, then run `/dev-docs-audit seams <libs-branch> <shell-branch>`.

## Ground rules

- Pages read as the team's own documentation. The audit, this skill and the PRs stay out of page content. The audit record is data, not a page.
- The Shell repo and the source checkouts are read-only. All libs writes go to audit branches, merged through PRs.
- Showcase slide decks are out of scope.
