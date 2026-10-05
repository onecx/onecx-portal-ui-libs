Task 1 report: Clarify custom AuthServiceFactory migration

Summary

I updated the Angular 19 migration docs to clarify how custom AuthServiceFactory implementations should behave under the v6 libs/shell-auth implementation. The change replaces a short generic note with a dedicated subsection that:

- Explains that the wrapper awaits async configuration reads before loading the remote factory.
- States that factories may return AuthService synchronously or as a Promise and will be awaited.
- Explains the injector callback may return a Promise for injected values (e.g., CONFIG) and shows how to make a factory async and await injected values when required.

Files changed

- docs/modules/onecx-portal-ui-libs/pages/migrations/angular-19/update-configuration-service-usage.adoc

What I changed

- Replaced the previous NOTE block about custom AuthServiceFactory with a new subsection "Custom AuthServiceFactory".
- Added explanatory bullets and two paired before/after TypeScript code examples:
  - Synchronous factory (no change required) — shows a factory that returns the service synchronously.
  - Asynchronous factory (await injected configuration) — shows an incorrect synchronous attempt and the corrected async factory that awaits injector(Injectables.CONFIG).
- Left a final NOTE reiterating that synchronous factories remain valid and that the libs/shell-auth implementation accepts both direct and Promise returns.

Why / correctness

The examples and guidance follow the implementation in:
- libs/shell-auth/src/lib/auth.service.ts (AuthServiceFactory type allows AuthService | Promise<AuthService>)
- libs/shell-auth/src/lib/auth-service-wrapper.ts (AuthServiceWrapper awaits configuration properties and awaits/resolves the factory result; the injector callback may return a Promise for values like CONFIG)

Verification performed

- Verified the edited AsciiDoc file saved under the target repository.
- Committed the change in the target repo branch.
- Ran git diff --check for the commit; no whitespace or other diff check errors were reported.

Git commit

- Commit: f849bc17
- Message: docs(migration): clarify custom AuthServiceFactory sync/async behavior and examples
- Co-author trailer: Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>

One-line verification result

- git diff --check: clean (no issues)

Concerns

- None: change is documentation-only and matches library behavior. I did not run an Antora build because external dependencies are not required for this textual change; the change is limited to one AsciiDoc file.

Path to this report

./.superpowers/sdd/2026-10-05-incorporate-pr-1773-feedback/task-1-report.md


Round 2 fix summary

- Adjusted the synchronous factory example so it no longer consumes injector results at all; it now demonstrates a truly synchronous factory that returns `CustomAuthService` directly.
- Kept the asynchronous example unchanged so it continues to show awaiting `Injectables.CONFIG` before constructing the service.

Verification

- `git diff --check`

Output:
- clean (no issues)
