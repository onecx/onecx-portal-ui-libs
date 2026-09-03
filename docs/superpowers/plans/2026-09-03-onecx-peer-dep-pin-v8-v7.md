# Cherry-pick @onecx Peer Dependency Exact-Pinning Fix to v8 and v7 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port commit `a900061` (main's `@onecx/*` peer dependency exact-pinning fix, issue #673) onto the `v8` and `v7` branches so both branches pin `@onecx/*` peer dependencies to exact versions and `release-script.sh` no longer reintroduces `^` prefixes on release.

**Architecture:** Two independent branch-scoped work streams (one for `v8`, one for `v7`), each touching the same three kinds of files: `libs/*/package.json` peer dependency blocks, `release-script.sh`'s `sed` substitution, and `README.md`'s release-process section. Each branch's changes are committed on its own local branch created from the corresponding remote branch; there is no shared code path between the two streams other than the identical edit pattern.

**Tech Stack:** Bash (`release-script.sh`, `sed`, `jq`), npm, Nx monorepo tooling (`nx run-many -t build`), JSON (`package.json`).

**Spec:** internal-tasks issue #713 (embedded in the task prompt) and its implemented reference commit `onecx/onecx-portal-ui-libs@a900061` on `main`.

## Global Constraints

- Only `@onecx/*` peer dependency version strings change in `package.json` files — no other fields, no other dependency types (`dependencies`, `devDependencies`), no non-`@onecx` peer dependencies are touched.
- Preserve each entry's existing version number exactly; only remove the leading `^`. Do not bump versions.
- `v8` scope: 17 libraries — `angular-accelerator`, `angular-auth`, `angular-integration-interface`, `angular-remote-components`, `angular-standalone-shell`, `angular-testing`, `angular-utils`, `angular-webcomponents`, `integration-interface`, `ngrx-accelerator`, `ngrx-integration-interface`, `react-auth`, `react-integration-interface`, `react-remote-components`, `react-utils`, `react-webcomponents`, `shell-auth`. Do not touch `libs/angular-linter-rules/package.json`, `libs/ngrx-linter-rules/package.json`, `libs/accelerator/package.json`, `libs/build-utils/package.json`, or the root `package.json`.
- `v7` scope: 11 libraries — `angular-accelerator`, `angular-auth`, `angular-integration-interface`, `angular-remote-components`, `angular-standalone-shell`, `angular-testing`, `angular-utils`, `angular-webcomponents`, `integration-interface`, `ngrx-accelerator`, `ngrx-integration-interface`. Do not touch `libs/accelerator/package.json` or the root `package.json` (v7 has no `react-*`, `shell-auth`, `angular-linter-rules`, `ngrx-linter-rules`, or `build-utils` directories under `libs/`). Of these 11, `angular-testing` and `ngrx-accelerator` currently have zero `@onecx/*` peer dependency entries on `v7`, so those two files receive no textual change but remain in-scope for verification.
- `v6` and all lower version branches (`v5`, `v4`, `v3`) remain completely untouched — no commits, no branch checkouts that produce changes on them.
- Confirmed by direct inspection of `fork/v8` remote branch content: every in-scope library on `v8` currently pins `@onecx/*` peer dependencies at exactly `^8.8.0` (single consistent version across the branch).
- Confirmed by direct inspection of `fork/v7` remote branch content: every in-scope library on `v7` currently pins `@onecx/*` peer dependencies at exactly `^7.9.2` (single consistent version across the branch, where present).
- `release-script.sh`'s `sed` substitution line is byte-for-byte identical on `v8` and `v7`: `packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1^'$1'"/')`. `v8`'s script additionally contains a `libs/$folder/src/version.ts`-writing block that `v7`'s script lacks; that block is not touched by this plan.
- `README.md` release section text on both `v8` and `v7` is structurally identical (byte-for-byte matching `main`'s pre-fix content) at the insertion point: immediately after the line ending `...pre-releases[here].` and before the line `# Migrating to Angular 19, PrimeNG 19 and OneCX v6`. Insert the identical new `## OneCX peer dependency pinning` section verbatim from `main`'s post-fix content on both branches.
- Do not add any new automated test tooling — this matches upstream's decision (no shell-script test tooling exists in this repo).
- Work is performed from local branches created by checking out `fork/v8` and `fork/v7` into new branches named `fix/onecx-peer-dep-pinning-v8` and `fix/onecx-peer-dep-pinning-v7` respectively.

---

## Task 1: Create working branch from v8 and apply package.json peer dependency pinning

**Files:**
- Modify: `libs/angular-accelerator/package.json`
- Modify: `libs/angular-auth/package.json`
- Modify: `libs/angular-integration-interface/package.json`
- Modify: `libs/angular-remote-components/package.json`
- Modify: `libs/angular-standalone-shell/package.json`
- Modify: `libs/angular-testing/package.json`
- Modify: `libs/angular-utils/package.json`
- Modify: `libs/angular-webcomponents/package.json`
- Modify: `libs/integration-interface/package.json`
- Modify: `libs/ngrx-accelerator/package.json`
- Modify: `libs/ngrx-integration-interface/package.json`
- Modify: `libs/react-auth/package.json`
- Modify: `libs/react-integration-interface/package.json`
- Modify: `libs/react-remote-components/package.json`
- Modify: `libs/react-utils/package.json`
- Modify: `libs/react-webcomponents/package.json`
- Modify: `libs/shell-auth/package.json`

**Interfaces:**
- Consumes: nothing (first task on the `v8` stream).
- Produces: a local branch `fix/onecx-peer-dep-pinning-v8` with all 17 `package.json` files updated, ready for Task 2 (release-script.sh) and Task 3 (README.md) on the same branch.

- [ ] **Step 1: Create and check out the working branch from v8**

```bash
git fetch fork
git checkout -b fix/onecx-peer-dep-pinning-v8 fork/v8
```

- [ ] **Step 2: Verify current caret-pinned state before editing**

```bash
grep -n '"@onecx/' libs/angular-accelerator/package.json libs/angular-auth/package.json libs/angular-integration-interface/package.json libs/angular-remote-components/package.json libs/angular-standalone-shell/package.json libs/angular-testing/package.json libs/angular-utils/package.json libs/angular-webcomponents/package.json libs/integration-interface/package.json libs/ngrx-accelerator/package.json libs/ngrx-integration-interface/package.json libs/react-auth/package.json libs/react-integration-interface/package.json libs/react-remote-components/package.json libs/react-utils/package.json libs/react-webcomponents/package.json libs/shell-auth/package.json
```

Expected: every matched line shows a value of exactly `^8.8.0` (e.g. `"@onecx/accelerator": "^8.8.0",`).

- [ ] **Step 3: Strip the `^` prefix from every `@onecx/*` peer dependency across all 17 files in one pass**

```bash
for f in libs/angular-accelerator/package.json \
         libs/angular-auth/package.json \
         libs/angular-integration-interface/package.json \
         libs/angular-remote-components/package.json \
         libs/angular-standalone-shell/package.json \
         libs/angular-testing/package.json \
         libs/angular-utils/package.json \
         libs/angular-webcomponents/package.json \
         libs/integration-interface/package.json \
         libs/ngrx-accelerator/package.json \
         libs/ngrx-integration-interface/package.json \
         libs/react-auth/package.json \
         libs/react-integration-interface/package.json \
         libs/react-remote-components/package.json \
         libs/react-utils/package.json \
         libs/react-webcomponents/package.json \
         libs/shell-auth/package.json; do
  sed -i -E 's/("@onecx\/[^"]+": *)"\^([^"]+)"/\1"\2"/' "$f"
done
```

- [ ] **Step 4: Verify every `@onecx/*` peer dependency is now exact-pinned (no `^`)**

```bash
grep -rn '"@onecx/[^"]*": *"\^' libs/*/package.json
```

Expected: no output (empty result means no remaining caret-prefixed `@onecx/*` entries anywhere under `libs/`).

```bash
git diff --stat
```

Expected: exactly the 17 files listed above appear as modified, with no other files touched.

- [ ] **Step 5: Confirm each modified file is valid JSON**

```bash
for f in libs/angular-accelerator/package.json libs/angular-auth/package.json libs/angular-integration-interface/package.json libs/angular-remote-components/package.json libs/angular-standalone-shell/package.json libs/angular-testing/package.json libs/angular-utils/package.json libs/angular-webcomponents/package.json libs/integration-interface/package.json libs/ngrx-accelerator/package.json libs/ngrx-integration-interface/package.json libs/react-auth/package.json libs/react-integration-interface/package.json libs/react-remote-components/package.json libs/react-utils/package.json libs/react-webcomponents/package.json libs/shell-auth/package.json; do
  node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" && echo "OK: $f"
done
```

Expected: `OK: <path>` printed for all 17 files, no JSON parse errors.

- [ ] **Step 6: Commit**

```bash
git add libs/angular-accelerator/package.json libs/angular-auth/package.json libs/angular-integration-interface/package.json libs/angular-remote-components/package.json libs/angular-standalone-shell/package.json libs/angular-testing/package.json libs/angular-utils/package.json libs/angular-webcomponents/package.json libs/integration-interface/package.json libs/ngrx-accelerator/package.json libs/ngrx-integration-interface/package.json libs/react-auth/package.json libs/react-integration-interface/package.json libs/react-remote-components/package.json libs/react-utils/package.json libs/react-webcomponents/package.json libs/shell-auth/package.json
git commit -m "fix: pin @onecx peer dependency versions exactly instead of caret ranges (v8)

Cherry-picks the package.json portion of onecx/onecx-portal-ui-libs@a900061
onto v8. Implements onecx/internal-tasks#713."
```

---

## Task 2: Fix release-script.sh on v8 to stop re-adding the caret prefix

**Files:**
- Modify: `release-script.sh`

**Interfaces:**
- Consumes: the `fix/onecx-peer-dep-pinning-v8` branch produced by Task 1 (same branch, continue committing on it).
- Produces: an updated `release-script.sh` on the same branch, ready for Task 3 (README.md).

- [ ] **Step 1: View the current sed substitution line to confirm its exact text**

```bash
grep -n "sed -E" release-script.sh
```

Expected output line:

```
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1^'$1'"/')
```

- [ ] **Step 2: Replace the line to remove the `^` from the sed replacement**

Open `release-script.sh` and replace the line found in Step 1 with these two lines:

```
    # Pin @onecx/* peer dependencies to an exact version (no caret) so released libraries stay consistent and package-manager version drift is minimized; runtime sharing is determined by host/remote Module Federation shared-dependency configuration.
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1'$1'"/')
```

- [ ] **Step 3: Verify the exact resulting content**

```bash
grep -n -A1 "Pin @onecx" release-script.sh
```

Expected:

```
    # Pin @onecx/* peer dependencies to an exact version (no caret) so released libraries stay consistent and package-manager version drift is minimized; runtime sharing is determined by host/remote Module Federation shared-dependency configuration.
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1'$1'"/')
```

```bash
grep -n "\^'\\\$1'" release-script.sh
```

Expected: no output (confirms no remaining `^`-prefixed substitution pattern in the script).

- [ ] **Step 4: Confirm the script is still syntactically valid bash**

```bash
bash -n release-script.sh && echo "syntax OK"
```

Expected: `syntax OK` with no errors.

- [ ] **Step 5: Commit**

```bash
git add release-script.sh
git commit -m "fix: stop prefixing release @onecx peer dependency versions with ^ (v8)

Cherry-picks the release-script.sh portion of
onecx/onecx-portal-ui-libs@a900061 onto v8."
```

---

## Task 3: Document the exact-pin convention in README.md on v8

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the `fix/onecx-peer-dep-pinning-v8` branch produced by Tasks 1–2 (same branch, continue committing).
- Produces: a documented `README.md` on the same branch; this is the final task of the v8 stream (verification happens in Task 7).

- [ ] **Step 1: Locate the exact insertion point**

```bash
grep -n "pre-releases\[here\]\.\|# Migrating to Angular 19" README.md
```

Expected: a line ending `...pre-releases[here].` immediately followed (after one blank line) by a line `# Migrating to Angular 19, PrimeNG 19 and OneCX v6`.

- [ ] **Step 2: Insert the new "OneCX peer dependency pinning" section**

Find this exact text in `README.md`:

```
To find out more on pre-releases with semantic-release, please refer https://semantic-release.gitbook.io/semantic-release/recipes/release-workflow/pre-releases[here].

# Migrating to Angular 19, PrimeNG 19 and OneCX v6
```

Replace it with:

```
To find out more on pre-releases with semantic-release, please refer https://semantic-release.gitbook.io/semantic-release/recipes/release-workflow/pre-releases[here].

## OneCX peer dependency pinning

`@onecx/*` peer dependencies declared in `libs/*/package.json` are pinned to exact versions (no `^` or other semver range) rather than caret ranges. These exact pins help prevent and detect package-manager version drift, but the Host Application and remotes still need to declare the intended shared dependencies and runtime version behavior in their Module Federation configuration. `release-script.sh` maintains this pinning automatically by rewriting all `@onecx/*` peer dependency versions to the new release version, without a `^` prefix, on every release.

# Migrating to Angular 19, PrimeNG 19 and OneCX v6
```

- [ ] **Step 3: Verify the exact inserted content**

```bash
grep -n -A2 "## OneCX peer dependency pinning" README.md
```

Expected:

```
## OneCX peer dependency pinning

`@onecx/*` peer dependencies declared in `libs/*/package.json` are pinned to exact versions (no `^` or other semver range) rather than caret ranges. These exact pins help prevent and detect package-manager version drift, but the Host Application and remotes still need to declare the intended shared dependencies and runtime version behavior in their Module Federation configuration. `release-script.sh` maintains this pinning automatically by rewriting all `@onecx/*` peer dependency versions to the new release version, without a `^` prefix, on every release.
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: document @onecx peer dependency exact-pinning convention (v8)

Cherry-picks the README.md portion of onecx/onecx-portal-ui-libs@a900061
onto v8."
```

---

## Task 4: Create working branch from v7 and apply package.json peer dependency pinning

**Files:**
- Modify: `libs/angular-accelerator/package.json`
- Modify: `libs/angular-auth/package.json`
- Modify: `libs/angular-integration-interface/package.json`
- Modify: `libs/angular-remote-components/package.json`
- Modify: `libs/angular-standalone-shell/package.json`
- Modify: `libs/angular-testing/package.json`
- Modify: `libs/angular-utils/package.json`
- Modify: `libs/angular-webcomponents/package.json`
- Modify: `libs/integration-interface/package.json`
- Modify: `libs/ngrx-accelerator/package.json`
- Modify: `libs/ngrx-integration-interface/package.json`

**Interfaces:**
- Consumes: nothing (first task on the `v7` stream, independent of Tasks 1–3).
- Produces: a local branch `fix/onecx-peer-dep-pinning-v7` with all 11 `package.json` files processed (9 of them textually changed, 2 unchanged because they have no `@onecx/*` entries), ready for Task 5 (release-script.sh) and Task 6 (README.md) on the same branch.

- [ ] **Step 1: Create and check out the working branch from v7**

```bash
git fetch fork
git checkout -b fix/onecx-peer-dep-pinning-v7 fork/v7
```

- [ ] **Step 2: Verify current caret-pinned state before editing**

```bash
grep -n '"@onecx/' libs/angular-accelerator/package.json libs/angular-auth/package.json libs/angular-integration-interface/package.json libs/angular-remote-components/package.json libs/angular-standalone-shell/package.json libs/angular-testing/package.json libs/angular-utils/package.json libs/angular-webcomponents/package.json libs/integration-interface/package.json libs/ngrx-accelerator/package.json libs/ngrx-integration-interface/package.json
```

Expected: every matched line except in `libs/angular-testing/package.json` and `libs/ngrx-accelerator/package.json` shows a value of exactly `^7.9.2` (e.g. `"@onecx/accelerator": "^7.9.2",`). `libs/angular-testing/package.json` and `libs/ngrx-accelerator/package.json` produce no `@onecx/*` matches on `v7` — this is the known, verified baseline for those two files and requires no edit.

- [ ] **Step 3: Strip the `^` prefix from every `@onecx/*` peer dependency across all 11 files in one pass**

```bash
for f in libs/angular-accelerator/package.json \
         libs/angular-auth/package.json \
         libs/angular-integration-interface/package.json \
         libs/angular-remote-components/package.json \
         libs/angular-standalone-shell/package.json \
         libs/angular-testing/package.json \
         libs/angular-utils/package.json \
         libs/angular-webcomponents/package.json \
         libs/integration-interface/package.json \
         libs/ngrx-accelerator/package.json \
         libs/ngrx-integration-interface/package.json; do
  sed -i -E 's/("@onecx\/[^"]+": *)"\^([^"]+)"/\1"\2"/' "$f"
done
```

- [ ] **Step 4: Verify every `@onecx/*` peer dependency is now exact-pinned (no `^`)**

```bash
grep -rn '"@onecx/[^"]*": *"\^' libs/*/package.json
```

Expected: no output.

```bash
git diff --stat
```

Expected: exactly 9 files appear as modified — all 11 in-scope files except `libs/angular-testing/package.json` and `libs/ngrx-accelerator/package.json`, which are unchanged byte-for-byte because they have no `@onecx/*` peer dependency lines on `v7`.

- [ ] **Step 5: Confirm each of the 11 in-scope files is still valid JSON**

```bash
for f in libs/angular-accelerator/package.json libs/angular-auth/package.json libs/angular-integration-interface/package.json libs/angular-remote-components/package.json libs/angular-standalone-shell/package.json libs/angular-testing/package.json libs/angular-utils/package.json libs/angular-webcomponents/package.json libs/integration-interface/package.json libs/ngrx-accelerator/package.json libs/ngrx-integration-interface/package.json; do
  node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" && echo "OK: $f"
done
```

Expected: `OK: <path>` printed for all 11 files, no JSON parse errors.

- [ ] **Step 6: Commit**

```bash
git add libs/angular-accelerator/package.json libs/angular-auth/package.json libs/angular-integration-interface/package.json libs/angular-remote-components/package.json libs/angular-standalone-shell/package.json libs/angular-testing/package.json libs/angular-utils/package.json libs/angular-webcomponents/package.json libs/integration-interface/package.json libs/ngrx-accelerator/package.json libs/ngrx-integration-interface/package.json
git commit -m "fix: pin @onecx peer dependency versions exactly instead of caret ranges (v7)

Cherry-picks the package.json portion of onecx/onecx-portal-ui-libs@a900061
onto v7. Implements onecx/internal-tasks#713."
```

---

## Task 5: Fix release-script.sh on v7 to stop re-adding the caret prefix

**Files:**
- Modify: `release-script.sh`

**Interfaces:**
- Consumes: the `fix/onecx-peer-dep-pinning-v7` branch produced by Task 4 (same branch, continue committing).
- Produces: an updated `release-script.sh` on the same branch, ready for Task 6 (README.md).

- [ ] **Step 1: View the current sed substitution line to confirm its exact text**

```bash
grep -n "sed -E" release-script.sh
```

Expected output line (identical text to v8's pre-fix line; v7's script has no `version.ts`-writing block):

```
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1^'$1'"/')
```

- [ ] **Step 2: Replace the line to remove the `^` from the sed replacement**

Open `release-script.sh` and replace the line found in Step 1 with these two lines:

```
    # Pin @onecx/* peer dependencies to an exact version (no caret) so released libraries stay consistent and package-manager version drift is minimized; runtime sharing is determined by host/remote Module Federation shared-dependency configuration.
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1'$1'"/')
```

- [ ] **Step 3: Verify the exact resulting content**

```bash
grep -n -A1 "Pin @onecx" release-script.sh
```

Expected:

```
    # Pin @onecx/* peer dependencies to an exact version (no caret) so released libraries stay consistent and package-manager version drift is minimized; runtime sharing is determined by host/remote Module Federation shared-dependency configuration.
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1'$1'"/')
```

```bash
grep -n "\^'\\\$1'" release-script.sh
```

Expected: no output.

- [ ] **Step 4: Confirm the script is still syntactically valid bash**

```bash
bash -n release-script.sh && echo "syntax OK"
```

Expected: `syntax OK` with no errors.

- [ ] **Step 5: Commit**

```bash
git add release-script.sh
git commit -m "fix: stop prefixing release @onecx peer dependency versions with ^ (v7)

Cherry-picks the release-script.sh portion of
onecx/onecx-portal-ui-libs@a900061 onto v7."
```

---

## Task 6: Document the exact-pin convention in README.md on v7

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the `fix/onecx-peer-dep-pinning-v7` branch produced by Tasks 4–5 (same branch, continue committing).
- Produces: a documented `README.md` on the same branch; this is the final task of the v7 stream (verification happens in Task 7).

- [ ] **Step 1: Locate the exact insertion point**

```bash
grep -n "pre-releases\[here\]\.\|# Migrating to Angular 19" README.md
```

Expected: a line ending `...pre-releases[here].` immediately followed (after one blank line) by a line `# Migrating to Angular 19, PrimeNG 19 and OneCX v6`.

- [ ] **Step 2: Insert the new "OneCX peer dependency pinning" section**

Find this exact text in `README.md`:

```
To find out more on pre-releases with semantic-release, please refer https://semantic-release.gitbook.io/semantic-release/recipes/release-workflow/pre-releases[here].

# Migrating to Angular 19, PrimeNG 19 and OneCX v6
```

Replace it with:

```
To find out more on pre-releases with semantic-release, please refer https://semantic-release.gitbook.io/semantic-release/recipes/release-workflow/pre-releases[here].

## OneCX peer dependency pinning

`@onecx/*` peer dependencies declared in `libs/*/package.json` are pinned to exact versions (no `^` or other semver range) rather than caret ranges. These exact pins help prevent and detect package-manager version drift, but the Host Application and remotes still need to declare the intended shared dependencies and runtime version behavior in their Module Federation configuration. `release-script.sh` maintains this pinning automatically by rewriting all `@onecx/*` peer dependency versions to the new release version, without a `^` prefix, on every release.

# Migrating to Angular 19, PrimeNG 19 and OneCX v6
```

- [ ] **Step 3: Verify the exact inserted content**

```bash
grep -n -A2 "## OneCX peer dependency pinning" README.md
```

Expected:

```
## OneCX peer dependency pinning

`@onecx/*` peer dependencies declared in `libs/*/package.json` are pinned to exact versions (no `^` or other semver range) rather than caret ranges. These exact pins help prevent and detect package-manager version drift, but the Host Application and remotes still need to declare the intended shared dependencies and runtime version behavior in their Module Federation configuration. `release-script.sh` maintains this pinning automatically by rewriting all `@onecx/*` peer dependency versions to the new release version, without a `^` prefix, on every release.
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: document @onecx peer dependency exact-pinning convention (v7)

Cherry-picks the README.md portion of onecx/onecx-portal-ui-libs@a900061
onto v7."
```

---

## Task 7: Verify both branches install, build, and release cleanly, and confirm v6 is untouched

**Files:**
- None modified (verification only, run once per branch).

**Interfaces:**
- Consumes: the completed `fix/onecx-peer-dep-pinning-v8` branch (Tasks 1–3) and the completed `fix/onecx-peer-dep-pinning-v7` branch (Tasks 4–6).
- Produces: recorded verification evidence (command output) confirming both branches are ready; no code output.

- [ ] **Step 1: Install dependencies and build on the v8 branch**

```bash
git checkout fix/onecx-peer-dep-pinning-v8
npm ci
```

Expected: `npm ci` exits with code 0 and reports no unresolved or invalid peer dependency errors for any `@onecx/*` package.

```bash
npx nx run-many -t build
```

Expected: exit code 0; all 17 in-scope libraries plus any dependent library targets build successfully (no failed tasks reported in the Nx summary).

- [ ] **Step 2: Run release-script.sh against a throwaway copy on v8 and confirm no `^`-prefixed @onecx peer dependencies are produced**

```bash
rm -rf /tmp/v8-release-fixture
cp -r . /tmp/v8-release-fixture
cd /tmp/v8-release-fixture
bash release-script.sh 8.8.1 latest
grep -rn '"@onecx/[^"]*": *"\^' libs/*/package.json
```

Expected: the `grep` command produces no output (empty result), confirming no `@onecx/*` peer dependency in any `libs/*/package.json` was rewritten with a `^` prefix. Every `@onecx/*` peer dependency value in `libs/*/package.json` now reads `8.8.1`.

```bash
cd -
rm -rf /tmp/v8-release-fixture
```

- [ ] **Step 3: Install dependencies and build on the v7 branch**

```bash
git checkout fix/onecx-peer-dep-pinning-v7
npm ci
```

Expected: `npm ci` exits with code 0 and reports no unresolved or invalid peer dependency errors for any `@onecx/*` package.

```bash
npx nx run-many -t build
```

Expected: exit code 0; all 11 in-scope libraries plus any dependent library targets build successfully (no failed tasks reported in the Nx summary).

- [ ] **Step 4: Run release-script.sh against a throwaway copy on v7 and confirm no `^`-prefixed @onecx peer dependencies are produced**

```bash
rm -rf /tmp/v7-release-fixture
cp -r . /tmp/v7-release-fixture
cd /tmp/v7-release-fixture
bash release-script.sh 7.9.3 latest
grep -rn '"@onecx/[^"]*": *"\^' libs/*/package.json
```

Expected: the `grep` command produces no output (empty result). Every `@onecx/*` peer dependency value in `libs/*/package.json` now reads `7.9.3`.

```bash
cd -
rm -rf /tmp/v7-release-fixture
```

- [ ] **Step 5: Confirm v6 and below remain untouched**

```bash
git checkout fork/v6
git status
```

Expected: `git status` reports a clean working tree with no local modifications, confirming Tasks 1–6 never checked out or edited `v6` (they operate exclusively on `fix/onecx-peer-dep-pinning-v8` and `fix/onecx-peer-dep-pinning-v7`).

```bash
git diff fork/v6 origin/v6 --stat
```

Expected: no output, confirming the local `v6` tracking ref matches its remote unchanged.

- [ ] **Step 6: Return to the v8 working branch and record verification results**

```bash
git checkout fix/onecx-peer-dep-pinning-v8
```

Record the exit codes and grep outputs captured in Steps 1–4 as the manual verification evidence required by the Definition of Done. No commit is produced by this task.

---

## Verification Steps

1. `git diff fork/v8 fix/onecx-peer-dep-pinning-v8 --stat` — confirm exactly 19 files changed (17 `package.json` files + `release-script.sh` + `README.md`), no unrelated files.
2. `git diff fork/v7 fix/onecx-peer-dep-pinning-v7 --stat` — confirm exactly 11 files changed (9 `package.json` files with `@onecx/*` entries + `release-script.sh` + `README.md`; `libs/angular-testing/package.json` and `libs/ngrx-accelerator/package.json` are unchanged since they have no `@onecx/*` peer dependencies on v7).
3. On each branch: `grep -rn '"@onecx/[^"]*": *"\^' libs/*/package.json` returns no output.
4. On each branch: `npm ci` exits 0 with no peer dependency resolution errors.
5. On each branch: `npx nx run-many -t build` exits 0 with all libraries built successfully.
6. On each branch: running `bash release-script.sh <new-version> <channel>` against a throwaway fixture copy of the repository produces no `^`-prefixed `@onecx/*` peer dependency entries and correctly updates all `@onecx/*` peer dependency values to `<new-version>`.
7. `grep -n "## OneCX peer dependency pinning" README.md` on each branch returns exactly one match, with content matching `main`'s post-fix wording verbatim.
8. `git checkout fork/v6 && git status` shows a clean working tree with zero modifications, confirming no cross-branch edits occurred.

## Notes

- The two branch streams (Tasks 1–3 for v8, Tasks 4–6 for v7) are fully independent of each other and are executed as separate local branches (`fix/onecx-peer-dep-pinning-v8` and `fix/onecx-peer-dep-pinning-v7`) checked out from different remote base branches (`fork/v8` and `fork/v7`).
- This plan produces local commits on `fix/onecx-peer-dep-pinning-v8` and `fix/onecx-peer-dep-pinning-v7`; pushing these branches to the remote and opening pull requests targeting `v8` and `v7` respectively is performed via the standard PR-creation workflow after Task 7's verification passes.
- The `sed` command used in Task 1 Step 3 and Task 4 Step 3 matches only `"@onecx/<name>": "^<version>"` patterns and leaves non-`@onecx` dependencies untouched, since the pattern requires the literal `@onecx/` prefix inside the quoted key.
- `libs/angular-testing/package.json` and `libs/ngrx-accelerator/package.json` on `v7` have zero `@onecx/*` peer dependency entries; this is the verified current state of those files on `fork/v7`, so Task 4 correctly produces no textual diff for them while still including them in the sed loop and JSON-validity check for completeness.
