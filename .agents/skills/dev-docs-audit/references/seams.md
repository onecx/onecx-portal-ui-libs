# Seams (separate invocation)

Run this after the Area PRs have been reviewed and merged into the libs branch. It fixes what no single Area owns. `<libs repo>`, `<shell repo>`, `LIBS_SHA`, `SHELL_SHA` and the `--map` pairs come from Step 1 sub-steps 1, 4 and 5 of [SKILL.md](../SKILL.md).

1. **Gate**: list the open audit PRs with `gh pr list --repo <libs repo> --base <libs-branch> --state open --limit 500 --json number,headRefName,url --jq '[.[] | select(.headRefName | startswith("docs/dev-docs-audit-"))]'`. If any remain, list them and ask whether to continue or wait.
2. **Handoffs**: run the same command with `--state merged`, adding `body` to `--json`. Keep the newest run id per Area; the run id is the `YYYYMMDD-HHMM` in the branch name. Collect the Handoff section from each kept PR body, since the PR body is the Area report.
3. **Worktree**: run `git -C <ws>/repo worktree add <ws>/worktrees/_seams -b docs/dev-docs-audit-<run-id>-seams $LIBS_SHA`.
4. **Lint**: run `python3 <skill>/scripts/lint.py dev-docs <--map pairs>`.
5. **Checks**: give each item a verdict.
   - **Handoffs**: every collected Handoff item is applied.
   - **Root index**: every Area entry links its README if one exists. Every written Unit is linked. Every unlinked entry is a page that is still unwritten. Folder slugs match index slugs. Every folder outside the index is listed under the superseded or other sections, or reported to the user.
   - **Cross-Area links**: every link into another Area resolves to a file and anchor, or targets a planned slug. Inbound links to Units that were renamed, split or removed are updated.
   - **Concept ownership**: each concept is explained once, in the Area whose index scope line owns it. Other Areas keep one sentence plus a link.
   - **Terminology**: shared terms (Topic, Remote Component, Slot, Workspace, …) use the spelling of the root index.
   - **Shared pages**: `unit-template.adoc` and the root `README.adoc` describe the rules the Areas now follow, including the audit record.
6. **Fix**: apply every fix in `_seams`, re-run lint, and repeat sub-steps 4–6. This branch may edit any file under `dev-docs/`, because the Area PRs have already merged.
7. **Record**: write `dev-docs/.last-audit.json`. It has the shape of the Area records in [area-agent.md](area-agent.md#audit-record), plus `"scope": "seams"`.
8. **PR**: push the branch and run `gh pr create --repo <libs repo> --base <libs-branch> --head <branch>`. The body lists every seam fix and every Handoff item with its outcome.

Done when lint reports no hard finding (only `planned-link` and the warn-only voice kinds), and every check holds.

Finish by giving the user the PR URL, the list of fixes, and anything left for a human decision.
