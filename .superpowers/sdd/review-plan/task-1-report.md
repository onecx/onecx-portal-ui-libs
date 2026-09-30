Status: success

Commit: 815d90b1 docs: clarify tier scope wording — use 'single application' instead of 'core application'

Check: Searched contribution-testing pages for "core application" and inspected the three target descriptions; updated scope wording to "single OneCX application"/"single application" in the three files.

Concerns:
- docs/modules/onecx-portal-ui-libs/pages/contribution-testing/integration.adoc still references "core application" (related list). Integration.adoc was not in scope for Task 1 per the brief.

Report path: .superpowers/sdd/review-plan/task-1-report.md

Verification steps run:
- Performed a ripgrep search for the string "core application" inside the contribution-testing pages and reviewed the three target files to confirm edits.
- Staged and committed the three modified files (no push).

Files changed:
- docs/modules/onecx-portal-ui-libs/pages/contribution-testing/index.adoc
- docs/modules/onecx-portal-ui-libs/pages/contribution-testing/application-only.adoc
- docs/modules/onecx-portal-ui-libs/pages/contribution-testing/local-only.adoc

Notes:
- This is a docs-only change; no build was executed as there is no project docs build command in package scripts.
- Do not push the commit; Task 2 will handle further edits to the local-only introduction if required.


Fix round 1 — integration.adoc related-link update

- Change: Updated related-link description in docs/modules/onecx-portal-ui-libs/pages/contribution-testing/integration.adoc to read "testing a change confined to a single OneCX application." (removed 'core')
- Check: ripgrep returned: No matches found for "core application" in the contribution-testing pages.

