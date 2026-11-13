---
name: test-component
description: 'Verify uncommitted OneCX component changes before committing: build local libraries, copy them into a temporary generated app node_modules, and test with the released run-test-instance skill and Playwright. Use when component changes need functional or visual browser verification, or on explicit request.'
---

# Test a component in a generated app

Test before committing: build the real exported component from the current
worktree, including uncommitted edits, and copy its build output into the
temporary app's `node_modules` before building that app. No commit, release,
or publication of the library is needed. Keep the generated app,
downloaded tools, mocks, and evidence outside this repository. Browser checks
complement the repository's Jest tests and harnesses.

## 1. Define the checks

Inspect the diff, component API, harness, and relevant tests. Record the changed
behaviors and their observable outcomes, including relevant empty, populated,
error, keyboard, and responsive states. Ask for clarification when the expected
behavior or design is ambiguous.

Done when each changed behavior has a concrete interaction/assertion or visual
check. Preserve unrelated worktree changes throughout the workflow.

## 2. Fetch the released runner

Check `gh auth status`, Node/npm, and available Playwright browser tools.
From the repository root, create a unique external work directory and download
the latest stable release from `onecx/onecx-design-skills` using **gh**, not a
checkout of its default branch:

```bash
set -euo pipefail
REPO="$(pwd)"
mkdir -p "$HOME/.cache/onecx-component-tests"
WORK="$(mktemp -d "$HOME/.cache/onecx-component-tests/run.XXXXXXXX")"
TAG="$(gh release view --repo onecx/onecx-design-skills --json tagName --jq .tagName)"
ARCHIVE="$(gh release view "$TAG" --repo onecx/onecx-design-skills \
  --json assets --jq '.assets[].name | select(startswith("run-test-instance-") and endswith(".tar.gz"))')"
test -n "$ARCHIVE"
test "$(printf '%s\n' "$ARCHIVE" | wc -l)" -eq 1
gh release download "$TAG" --repo onecx/onecx-design-skills \
  --pattern "$ARCHIVE" --pattern SHA256SUMS --dir "$WORK"
(
  cd "$WORK"
  awk -v file="$ARCHIVE" '$2 == file { print; found++ } END { if (found != 1) exit 1 }' \
    SHA256SUMS > runner.sha256
  sha256sum --check --strict runner.sha256
  tar -xzf "$ARCHIVE" --no-same-owner --no-same-permissions
)
printf '%s\n' "$TAG" > "$WORK/runner-release.txt"
printf 'Work directory: %s\n' "$WORK"
```

For reuse, select the existing app directory explicitly; still download and
verify the current release into a new work directory.

Carry the printed absolute paths into subsequent commands; shell variables do not
necessarily survive tool calls. Read the downloaded `run-test-instance/SKILL.md`.
Read its `reference.md` when directed. Keep its complete bundle, including fonts.
Checksum or download failure blocks execution; report it explicitly.

Done when the recorded release's checksum passes and its skill has been read.

## 3. Generate an isolated app

Query the **OneCX documentation MCP** for the current UI workspace generator,
flavors, and options. Follow those instructions rather than assuming this example
stays current:

```bash
cd "$WORK"
npx --yes @onecx/create-workspace angular <unique-app-name>
```

Use `angular` for a simple component fixture, or `ngrx` when the scenario needs
store integration. Use a unique product/app name: the runner keys its cache and
server ownership by app id. Record the generator version and command. Inspect the
generated manifest and install its dependencies as documented.

Compare Node, Angular, the UI component library, and OneCX peer requirements
with this checkout before wiring libraries. In particular, a generator may
still emit PrimeNG/Angular 21 while this checkout uses Optimus UI/Angular 22.
Query the OneCX MCP migration guide and migrate the temporary app's packages,
imports, theme providers, icons, and styles together. Choose a compatible
installed Node runtime for app commands without changing the user's default.
If needed, choose a documented compatible generator version or align
dependencies **in the temporary app**, then reinstall there.
Ask before changing repository dependencies. MCP unavailability or an unresolved
compatibility problem is a blocker, not permission to invent a generator.

Done when generation/install succeed and the app can consume this branch's
library APIs without bypassing peer checks.

## 4. Wire fresh local builds

Use repository workspace tasks from `.vscode/tasks.json` for builds, tests, and
lint. Start with `nx build <changed-library>`; Nx builds its dependencies. Build
additional local libraries needed by the fixture when their APIs must match this
branch. Use the affected test/coverage task for the component's regression tests.
Wait for tasks to finish before proceeding.

Only copy outputs from builds that succeeded **during this run**. Inspect the
project's output configuration and built package manifest; `dist/libs/<library>`
is the usual location. An old `dist` directory is not evidence of a fresh build.
A build failure blocks verification of that component; report it and obtain
approval before repairing unrelated dependencies or source.

Install the generated app's dependencies first. Following this repository's
build-copy approach, replace the relevant packages under the temporary app's
`node_modules/@onecx` with fresh build outputs. Include local runtime dependencies
whose APIs changed or whose versions must match; retain generator/build tooling
that is not produced by this checkout. Move each replaced package into a backup
directory under `WORK` before copying, so stale files cannot survive. Leave
`.copy-build-to` and other developers' app installations untouched.

For each required library, copy the **complete package**, including its manifest,
secondary entry points, declarations, and assets. For example, after a successful
`nx build angular-accelerator` task, with absolute `REPO`, `APP`, and `WORK` paths:

```bash
set -euo pipefail
LIB=angular-accelerator
SOURCE="$REPO/dist/libs/$LIB"
TARGET="$APP/node_modules/@onecx/$LIB"
test -f "$SOURCE/package.json"
test -d "$APP/node_modules"
BACKUP="$(mktemp -d "$WORK/package-backup.XXXXXXXX")"
mkdir -p "$APP/node_modules/@onecx"
if [ -e "$TARGET" ] || [ -L "$TARGET" ]; then
  mv "$TARGET" "$BACKUP/$LIB"
fi
mkdir "$TARGET"
cp -a "$SOURCE/." "$TARGET/"
```

Repeat with the actual output path and package name for every required local
dependency. Repeat the copy after **every** successful library rebuild; linking
or installing a local snapshot once does not update the temporary app when the
agent changes the component again.

Record each package name, source output, successful build task, and bundle
SHA-256 in the work directory. Check that the app's package resolution reaches
the copied package and that its bundle hash equals the freshly built output.
After another install, rebuild or re-copy before testing; installs can overwrite
local packages. After each component edit, rebuild, re-copy, and rebuild the app.
When aligning the app across a OneCX major version, local package manifests may
be needed during dependency installation to resolve the correct peers. Finish
all dependency installation first, then perform the explicit build-output copy
above. `file:` dependencies, tarballs, symlinks, and published versions are not
a substitute for copying the current successful build before verification.

Done when the changed component and required local dependencies resolve to
the copied packages inside the temporary app's `node_modules`, with hashes
matching the current successful build. Published packages may supply unchanged
dependencies, but never substitute for the component being verified.

## 5. Create a focused fixture and run it

In the generated app only, import the component through its public package API
and add a dedicated fixture route. Use realistic inputs and visible output/state
for events so Playwright can assert behavior. Reuse component examples and
harness scenarios. Add translated fixture strings. Keep the fixture focused on
the checks from step 1; do not copy the component implementation into the app.
Preserve the generated bootstrap/router initialization. For OneCX Angular
routes, use the public `startsWith` matcher with `initializeRouter` so the
fixture matches below the runner's `/test/` base href, rather than a root-only
Angular path.

Follow the downloaded runner's build, init, mock, serve, and check steps.
Its `T` shorthand assumes `.claude/skills/run-test-instance`; substitute:

```bash
cd "$APP"
node "$WORK/run-test-instance/onecx-test.mjs" init
```

Use that absolute script path for every runner command, keeping the generated app
as the working directory. App commands without a matching workspace task can
run there directly. Use the route and work paths printed by `init`; fill every
required BFF mock from its actual schema. Set the test page's theme to `onecx`
for these library fixtures: generated apps may have no OneCX git remote, causing
the runner to choose `none`. Keep the shell-replacement logic in the runner.
Include the library's generated utility stylesheet and the current UI library's
theme provider; a themed page background alone does not verify component
styling. Inspect dynamic component controls as well as their host.
Check that `init` actually linked the compiled stylesheet. Some runner releases
mistake an `@import` inside a CSS comment for an unresolved import. Enable CSS
minification in the temporary app's development build and rerun `init` when
that happens; keep the released runner unchanged.

Start `serve` as a tracked background process, choose a free port through `init
--port` if needed, and confirm HTTP readiness and runner ownership. Use the
execution environment's background-service rules; keep the server attached for
a self-contained check, or detach only when permitted and needed across turns.
Run `check` on the fixture route. Install Playwright into the runner's external
tools directory only if its check reports it missing, following its instructions.
If the current Playwright release does not support the host OS, use a
host-compatible version in an isolated external installation, record that
version, and retry. Report an unresolved browser prerequisite as a blocker.

Done when `check` reports `App loaded: yes` and `OK: no problems found`, and the
fixture visibly renders the changed component. A healthy server alone is not a
passing component test.

## 6. Verify with Playwright

Use available Playwright browser tools against the running fixture. Assert each
behavior from step 1 with user-visible locators and observable results, including
keyboard interaction where relevant. Check browser errors and failed requests;
distinguish expected error-scenario responses from unexpected failures.
If browser tools cannot launch in the environment, run a headless Playwright
script from the external work directory using the runner's installed browser.
Keep the same assertions, screenshots, and error checks.

Capture and **open** desktop and mobile screenshots (for example 1440x900 and
390x844) at relevant interaction states. Inspect layout, clipping, typography,
theme, overlays, focus, and component-specific visuals. Compare supplied designs
or existing baselines when available; without a baseline, report visual
inspection rather than claiming pixel-equivalence. Save screenshots and
interaction results outside the repository. Iterate on actual component defects,
rebuilding and re-copying as in step 4, then repeat affected assertions.
Verify that the browser supports the CSS features used by this branch (including
`CSSScopeRule` for scoped themes). Browser-default control colors or nonempty
screenshots are not proof that the theme loaded. Check meaningful geometry and
computed styles, and report visual verification as blocked if the available
browser cannot render the component's real styles.

Done when every planned assertion passes and both viewport screenshots have
been inspected. Report failures or unavailable browser capabilities as blockers,
not as successful visual verification.

## 7. Report and stop

Close browser contexts you created and run the downloaded runner's `stop` from
the generated app directory, even after a failed check. Verify that this run's
server/process has stopped; terminate only your tracked process if needed.
Leave unrelated processes alone.

Keep the app, runner release/checksum record, mocks, provenance, results, and
screenshots for reuse outside the repository. Reused fixtures still need a
fresh release lookup and fresh local builds for each verification run. Report:

- component, scenarios, assertion results, and desktop/mobile visual findings;
- upstream tag, generator version, and local package provenance;
- app, evidence, and screenshot paths, plus a rerun command;
- Jest coverage results when run, or an explicit reason they were not run;
- blockers and server shutdown status.

Finish with `git status`: only intended changes and pre-existing user edits
should remain. No generated app or downloaded upstream skill belongs in git.
