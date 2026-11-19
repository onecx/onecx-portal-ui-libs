# Area audit (subagent brief)

You own one Area. First pick the code scope, then loop **passes** until a **clean pass**, then record the audit and open the Area's PR.

The orchestrator gave you:
- `<libs repo>` (the `org/repo` to push to) and `<shell repo>` (read-only), plus `<ws>`, the repo path and the Area slug;
- `LIBS_SHA`, `SHELL_SHA`, the libs branch, the Shell branch and the run id;
- the brief (or *no brief*) and the `--map` pairs;
- the report path.

`<skill>` is the directory that contains this file's `references/` folder.

**Scope**: write only inside `dev-docs/<area>/`. Some changes belong outside that folder: root index entries, other Areas, `unit-template.adoc`, and inbound links to Units you renamed, split or removed. Record those in the report's **Handoff** section instead. The seams run applies them later, after the Area PRs merge. Libs code at `LIBS_SHA` (inside your worktree) and the source checkouts are your read-only evidence. Shell state resets between commands, so start every command with `cd <worktree> &&`.

## Setup

1. Create your branch: `git -C <repo> worktree add <ws>/worktrees/<area> -b docs/dev-docs-audit-<run-id>-<area> $LIBS_SHA`. If it fails on a ref lock, the other subagents are creating theirs at the same time: retry.
2. Read [unit-rules.md](unit-rules.md), [audit-lenses.md](audit-lenses.md) and [cutting-tests.md](cutting-tests.md).
3. Measure the baseline with `python3 <skill>/scripts/measure.py dev-docs/<area>`.

## Code scope

Pick the run mode from the audit record. The mode sets how much code the coverage and correctness lenses investigate. Lint and the readability lens always cover every page.

1. Read `dev-docs/<area>/.last-audit.json`, and set `OLD_LIBS` and `OLD_SHELL` from it.
   - **Maintenance run**: the record exists, and `git cat-file -e <old>` succeeds in both repos. The code scope is the commit history since the last audit, and nothing older.
   - **Full run**: the record is missing, or an old commit is gone (say which one in the report). The code scope is the whole libs and Shell codebase. Skip the rest of this section, log *Drift: skipped (first run)*, and go to Pass 1.
2. **History** (maintenance only). In each repo, run `git log --no-merges --name-status <OLD>..<SHA> -- . ':(exclude,glob)**/*.spec.*'`. If both logs are empty, there is no drift: log it and go to Pass 1.
3. **Sources**: run `python3 <skill>/scripts/lint.py dev-docs --area <area> --map <map pairs> --list-sources` (from the worktree, so `dev-docs` is this Area's root and `root.parent` is the worktree = the libs checkout). The `libs` rows are paths in the libs repo, and the other rows are paths in the Shell checkout.
4. **Triage**: give every commit a verdict.
   - **Relevant**: the commit touches a listed source, touches code under a listed source's directory, or changes something the Area's pages name (a Topic, service, token, export, config key or default). Read its diff with `git show <sha> -- <paths>`.
   - **No impact**: give a one-line reason. Commits of the same kind, such as dependency bumps, may share one verdict.
5. **Findings**: turn every relevant commit into pass-1 findings.
   - A modified source: re-trace every claim that cites it (correctness lens).
   - A renamed or deleted source: fix the links, and re-trace the claims (correctness lens).
   - New, removed or changed public surface in the Area's code: coverage lens.
   - A deprecation, breaking change or new Topic: check that the pages reflect it.

Done when every commit since the last audit has a verdict, and every relevant commit has at least one finding.

## Pass N

1. **Audit**:
   - Run `python3 <skill>/scripts/lint.py dev-docs --area <area> <--map pairs>`.
   - Run every page, including `README.adoc`, through the three lenses in [audit-lenses.md](audit-lenses.md). In pass 1, add the drift findings.
   - Record each finding as: page, section, lens, finding, fix, evidence. For the correctness lens, the evidence is the code file.
   - A finding names the rule, fact or cutting test that fails. A reword without one of these is not a finding, which keeps the loop converging.
   - Done when every page has a verdict per lens: either its findings, or *clean*.
   - **Clean pass**: lint reports no hard finding (only `planned-link` plus the warn-only voice kinds) and every page is clean under every lens. Triage every warn in the lint output: fix it per [cutting-tests.md](cutting-tests.md) *Voice*, or log it under *Open questions* with the reason. Go to Record.
2. **Apply**:
   - Apply the content and structure fixes first.
   - Then copy every page you are about to tighten to `<report path's directory>/snapshots/<area>/pass-N/` and tighten it with [cutting-tests.md](cutting-tests.md).
   - Each tightened page must pass `python3 <skill>/scripts/measure.py --check-preserved <snapshot> <page>`.
   - Done when every finding is either applied or moved to *Open questions* with its reason.
3. **Commit and loop**: commit as `docs(<area>): audit pass N`, then start pass N+1.
   - If a fix flips back and forth between passes, keep the version the correctness lens supports and log it once as an open question.
   - Pass 3 is the cap. If pass 3 still has findings, commit it, list the findings as *Remaining*, and go to Record.

## Record

Write `dev-docs/<area>/.last-audit.json` and commit it as `docs(<area>): record audit`:

<a id="audit-record"></a>
```json
{
  "audited": "<YYYY-MM-DD>",
  "libs":  { "repo": "<libs repo>", "branch": "<libs branch>", "commit": "<LIBS_SHA>" },
  "shell": { "repo": "<shell repo>", "branch": "<shell branch>", "commit": "<SHELL_SHA>" },
  "passes": <N>,
  "clean": <true|false>
}
```

## Report

Re-run `measure.py dev-docs/<area>` for the *after* numbers. Then write the report to the report path, using these sections in order:

1. **Summary**: previous audit → this audit (short SHAs, or *first run*), passes run, whether a clean pass was reached, and a measurement table (page | words before → after | Δ % | read min).
2. **Drift**: the run mode, then each commit since the last audit (repo | short SHA | subject | verdict | findings). On a full run, write *first run*.
3. **Per pass**: for each pass, a findings table (page | lens | finding | action) and the counts per lens.
4. **Per file**: every edited file, with all of its changes across passes. Include each correction against the code as *claim before → after* plus the evidence file.
5. **Unverified facts**, **Open questions** and **Remaining**.
6. **Handoff**: every change needed outside the Area, with the exact target file and the edit.

## Finish

Do **not** push or open a PR. The orchestrator verifies the work independently (it re-runs `lint.py` and spot-checks correctness claims) before pushing and opening the PR itself. Return to the orchestrator: the branch name, the commit list (`git rev-list --reverse <libs branch>..HEAD` with subjects), whether a clean pass was reached (Y/N), the passes run, a one-line drift summary, the Handoff list, and the report path.
