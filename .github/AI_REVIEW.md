# AI pull request reviews

AI Review requests asynchronous, advisory reviews when eligible pull requests are
opened, updated with new commits, or marked ready for review. It does not approve,
request changes, merge, or execute pull-request code.

## Review an existing pull request

- Post a new PR conversation comment containing exactly `@ai-review`.
  Inline code-review comments, edited comments, and comments on issues do not trigger it.
- Alternatively, open **Actions → AI Review → Run workflow**, select the default
  branch (`main`), and enter the pull request number.

Both manual triggers and automatic requests require the requester to have
`write`, `maintain`, or `admin` access to this repository. PRs from team forks
into this repository are eligible through all three triggers; the requester
must have access to this consumer repository, not just the fork. Drafts,
closed PRs, deleted head repositories, and bot authors/requesters are not eligible.
PR authors must have an owner, member, or collaborator association, or verified
`write`, `maintain`, or `admin` access to this consumer repository.
The repository token can report a team member as `CONTRIBUTOR` because
association visibility depends on authentication; the dispatcher checks actual
author permissions when the association does not establish eligibility.
Manual requests fetch the current PR
state before dispatching. Ineligible manual requests fail with a generic diagnostic;
unrelated comments and ineligible automatic events are skipped.

Repeated requests use the central review's incremental behavior: an already
reviewed head is a no-op; new commits are reviewed since the last reviewed head.
Workflow success means the request was accepted, not that the review has finished.
Findings appear on the pull request when the central review completes.

## Maintainer setup

1. Make the existing `CI_PAT` Actions secret available to this repository. It must
   belong to the agreed service account and have **Actions: write** on the review
   destination. The built-in repository token cannot dispatch to another repository.
2. Set the Actions secret `AI_REVIEW_DISPATCH_REPOSITORY` to the private review
   destination in `owner/repository` form. Keep it a secret, not a repository
   variable or workflow input.
3. Ensure the destination has `hybrid-agent-pipeline.yml` on `main` and supports
   the `review-gh-pr` profile.
4. The central workflow still loads GitHub credentials from Vault for its
   `github.actor`, which will be the `CI_PAT` account, not the commenter or PR author.
   Provision that service identity's `github_token` at
   `secret/data/users/<service-account>/tokens` and, where applicable, its
   `github_token_onecx`. The central token needs target-repository read access and
   **Pull requests: read & write**, plus access to the central repository for
   checkpoints and to any required skills releases. Its Vault OIDC policy must
   allow the central workflow. ai-passport credentials stay in the central
   workflow; no personal Copilot token is needed for this review profile.

The consumer uses `github.token` only to verify requester permissions and read
current PR metadata. It uses `CI_PAT` only for dispatch; it no longer reads
actor-specific tokens from Vault or requires consumer OIDC permissions.
Author permission lookup failures and insufficient author access fail with
`Review dispatch author authorization failed.` without exposing raw GitHub output.

The workflow loads its dispatcher, tests, and optional review guidance from
`main` for every trigger, with credential persistence disabled. It does not
inherit the PR target branch or base commit: release branches may have no
automation files installed. It never checks out PR-head content.
To explicitly use another trusted automation branch, tag, or commit, set the
Actions repository variable `AI_REVIEW_AUTOMATION_REF`. This is a maintainer
configuration choice, not a PR-supplied value.

The central workflow is dispatched separately with `--ref main`, regardless of
the consumer checkout or PR target. Set the Actions repository variable
`AI_REVIEW_DISPATCH_REF` only when intentionally running another central
workflow branch or tag. Both variables are optional and default to `main`;
they do not replace the confidential destination secret.

Manual Actions runs from branches other than the repository default branch are
skipped. For fork reviews, the central review reads the head through this
repository's `refs/pull/<number>/head`; it does not need separate access to the
fork or permission to push to it.
Optional additive review focus can be supplied in `.github/ai-review.md`
on the selected trusted automation ref (at most 4,000 JavaScript UTF-16 code units).
Missing or empty guidance uses the standard focus; oversized or unreadable
guidance fails explicitly.

Dispatch output and raw GitHub errors are suppressed so tokens, the destination,
and private guidance do not appear in workflow logs. Missing configuration,
authorization failures, lookup failures, and dispatch failures return non-zero
with a generic diagnostic. Provision the above prerequisites before enabling
reviews; an accepted dispatch can still fail centrally if its credentials are absent.

Offline dispatcher validation (no credentials or dependencies required):

```sh
node --test .github/scripts/ai-review-dispatch.test.mjs
```

Keep the adjacent `ai-review-dispatch.test-helpers.mjs` with the tests when
deploying trusted automation. Test helpers and environment validation are
extracted from the packaged setup to satisfy this repository's Clean Code guardrail;
the authorization and dispatch contract is unchanged.
