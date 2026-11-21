# AI pull request reviews

AI Review requests asynchronous, advisory reviews when eligible pull requests are
opened, updated with new commits, or marked ready for review. It does not approve,
request changes, merge, or execute pull-request code.

## Review an existing pull request

- Post a new PR conversation comment containing exactly `@ai-review`.
  Inline code-review comments, edited comments, and comments on issues do not trigger it.
- Alternatively, open **Actions → AI Review → Run workflow**, select the default
  branch (`main`), and enter the pull request number.

The review runs as the PR author, with the author's own tokens from Vault, so
only the PR author can request it. Comments, manual runs, and pushes by anyone
else are skipped with a notice, and so are re-runs started by anyone but the
original requester; ask the author to comment `@ai-review`.
The author must have `write`, `maintain`, or `admin` access to this repository.
PRs from team forks into this repository are eligible through all three triggers;
the author must have access to this consumer repository, not just the fork. Drafts,
closed PRs, deleted head repositories, and bot authors/requesters are not eligible.
Manual requests fetch the current PR
state before dispatching. Other ineligible manual requests fail with a generic diagnostic;
unrelated comments and ineligible automatic events are skipped.

Repeated requests use the central review's incremental behavior: an already
reviewed head is a no-op; new commits are reviewed since the last reviewed head.
Workflow success means the request was accepted, not that the review has finished.
Findings appear on the pull request when the central review completes.

## Maintainer setup

1. Each PR author stores their own `github_token_onecx` at
   `secret/data/users/<login>/tokens` in Vault (`https://vault.dev.one-cx.org`).
   It needs **Actions: write** on the review destination, because the built-in
   repository token cannot dispatch to another repository. The Vault JWT role
   `github-onecx-role` must accept this repository's Actions OIDC tokens and let
   each run read only its actor's own path.
2. Set the Actions secret `AI_REVIEW_DISPATCH_REPOSITORY` to the private review
   destination in `owner/repository` form. Keep it a secret, not a repository
   variable or workflow input.
3. Ensure the destination has `hybrid-agent-pipeline.yml` on `main` and supports
   the `review-gh-pr` profile.
4. The dispatched run's `github.actor` is the PR author, so the central workflow
   loads the author's `github_token` from the same Vault path. It needs
   target-repository read access and **Pull requests: read & write**, plus access
   to the central repository for checkpoints and to any required skills releases.
   ai-passport credentials stay in the central workflow; no personal Copilot token
   is needed for this review profile.

The consumer uses `github.token` only to verify requester permissions and read
current PR metadata. Only after that check confirms the requester is the PR
author does it read the requester's own Vault path, through the job's OIDC token
(`id-token: write`), and it uses that token only for dispatch. A failed Vault
lookup (missing entry or key, or an OIDC role that rejects this repository) fails
the **Load the PR author's dispatch token** step with Vault's own error.

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
