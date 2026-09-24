# Angular 21→22 Libs Bump (Phase A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bump the onecx-portal-ui-libs Nx monorepo from Angular 21 to Angular 22.0.0, Nx 22.3.3 to 23.2.1, and TypeScript 5.9.3 to 6.0.0, via one coordinated `nx migrate 23.2.1` → `npm install` → `nx migrate --run-migrations` pass, apply the official Angular `OnPush`-by-default codemod wholesale, and bump `@angular/*` peerDependency ranges in the 11 published libs that declare them.

**Architecture:** This is a dependency/tooling migration, not a feature change. The repo root is a single npm workspace managed by Nx with per-lib `package.json`/`project.json` under `libs/*`. The migration is executed with Nx's built-in migration tool: `nx migrate 23.2.1` rewrites root `package.json` version ranges for the `@nx/*` packages and regenerates `migrations.json`; the remaining Angular/TypeScript/tooling package versions are set directly to fixed target values in the same file; `npm install` installs the new dependency graph with two named override widenings applied unconditionally; `nx migrate --run-migrations` executes every codemod listed in `migrations.json`, including the Angular core `OnPush`-by-default schematic bundled with the `@angular/core` 22.0.0 migration package. Task 2 bumps `@angular/*` peerDependency ranges from `^21.0.0` to `^22.0.0` in the 11 published libs that declare an `@angular/*` peerDependency. Task 3 bumps `angular-integration-interface`'s own `typescript` peerDependency from `^5.5.4` to `^6.0.0`. Task 4 runs the existing `nx run-many` lint/test/build targets and applies a fixed, enumerated set of source edits to keep every currently-passing spec passing under `OnPush`.

**Tech Stack:** Nx 22.3.3→23.2.1, Angular 21.1.6→22.0.0, TypeScript 5.9.3→6.0.0, ng-packagr ^21.0.1→^22.0.0, jest-preset-angular ^16.0.0→^16.2.0, @storybook/angular ^10.2.15→^10.6.0, npm (package-lock.json), Jest 30, ESLint 9 (`.eslintrc.json` plus `eslint.config.cjs` in `libs/angular-linter-rules` and `libs/ngrx-linter-rules`).

**Spec:** GitHub issue onecx/internal-tasks#707 ("Libs — Angular 21→22 bump (Phase A)"), part of onecx/internal-tasks#682.

## Global Constraints

- Execute exactly this sequence once: `npx nx migrate 23.2.1` → edit root `package.json` to set fixed versions → `npm install` → `npx nx migrate --run-migrations`. Do not run `ng update`.
- Final `nx` version is `23.2.1`.
- Final `typescript` version is `6.0.0`.
- Final `ng-packagr` version is `22.0.0`.
- Final `jest-preset-angular` version is `16.2.0`.
- Final `@storybook/angular` version is `10.6.0`; the framework package stays `@storybook/angular`.
- The bundled Angular `OnPush`-by-default migration schematic (shipped with the `@angular/core` 22.0.0 upgrade inside `nx migrate --run-migrations`) is applied wholesale and unmodified to every `@Component` decorator lacking an explicit `changeDetection` property, across every file matching `libs/*/src/**/*.component.ts`. No component is manually reviewed or excluded.
- `@angular/*` peerDependency ranges move from `^21.0.0` to `^22.0.0` in exactly these 11 files: `libs/angular-accelerator/package.json`, `libs/angular-auth/package.json`, `libs/angular-integration-interface/package.json`, `libs/angular-remote-components/package.json`, `libs/angular-standalone-shell/package.json`, `libs/angular-testing/package.json`, `libs/angular-utils/package.json`, `libs/angular-webcomponents/package.json`, `libs/ngrx-accelerator/package.json`, `libs/ngrx-integration-interface/package.json`, `libs/shell-auth/package.json`. No other `libs/*/package.json` file is edited.
- `libs/angular-integration-interface/package.json`'s `typescript` peerDependency moves from `^5.5.4` to `^6.0.0`.
- After the migration, `npx nx run-many -t lint`, `npx nx run-many -t test --no-interactive`, and `npx nx run-many -t build` each exit with code 0.
- No new documentation file is authored in this repository for this issue.
- No new test infrastructure, test framework, or test runner is introduced. Only the exact files enumerated in Task 4 are edited, and only with the exact edits specified there.

## Review Focus

- Jest specs whose assertions run immediately after a state mutation without an explicit `fixture.detectChanges()` call stop reflecting DOM updates once the target component becomes `OnPush`; Task 4 Step 2 runs the full suite once to produce the concrete failing-file list, and Task 4 Step 3 applies the fix to exactly that enumerated list.
- The Angular `OnPush`-by-default schematic skips components that already declare an explicit `changeDetection` property; Task 1 Step 7 greps for the remainder of components without `changeDetection` after the codemod runs and records the exact list for audit, with zero as the expected count.
- `libs/angular-testing/package.json` declares `@angular/cdk` as a peerDependency and is a published lib; Task 2 Step 6 bumps it explicitly so the acceptance criterion is satisfied without omission.
- The root `package.json` `overrides` block pins `esbuild` and `happy-dom` to fixed ranges that predate the Angular 22 dependency graph; Task 1 Step 5 widens both override entries to fixed target values unconditionally, before running `npm install`, rather than reacting to an install failure.
- `libs/react-auth/package.json`, `libs/react-integration-interface/package.json`, `libs/react-remote-components/package.json`, `libs/react-utils/package.json`, and `libs/react-webcomponents/package.json` declare only `react`/`react-dom`/`@onecx/*` peerDependencies with no `@angular/*` entries; Task 2 Step 7 runs `git diff --stat -- libs/*/package.json` and confirms none of these five files appear in the output.

---

### Task 1: Run the coordinated Nx migration to Nx 23.2.1 / Angular 22.0.0

**Files:**
- Modify: `package.json` (root — dependency and devDependency version ranges for `nx`, `@nx/*`, `@angular/*`, `@angular-devkit/*`, `@schematics/angular`, `@angular/cli`, `typescript`, `ng-packagr`, `jest-preset-angular`, `@storybook/angular`, `storybook`, `@angular-eslint/*`, and the `overrides.esbuild`/`overrides.happy-dom` entries)
- Modify: `package-lock.json` (root — regenerated by `npm install`)
- Modify: `migrations.json` (root — Nx appends the migration steps required between the current Nx version and 23.2.1, then marks them executed)
- Modify: `nx.json` (root — `targetDefaults`/`namedInputs` adjustments written by the `@nx/js`, `@nx/jest`, and `@nx/angular` migration generators)
- Modify: `tsconfig.base.json` (root — the `update-module-resolution-22-2-0` and `update-typescript-lib-22-2-0` migrations rewrite `moduleResolution` to `bundler` and `lib` to `es2022`)
- Modify: `libs/angular-accelerator/tsconfig.lib.json`, `libs/angular-auth/tsconfig.lib.json`, `libs/angular-integration-interface/tsconfig.lib.json`, `libs/angular-remote-components/tsconfig.lib.json`, `libs/angular-standalone-shell/tsconfig.lib.json`, `libs/angular-testing/tsconfig.lib.json`, `libs/angular-utils/tsconfig.lib.json`, `libs/angular-webcomponents/tsconfig.lib.json`, `libs/ngrx-accelerator/tsconfig.lib.json`, `libs/ngrx-integration-interface/tsconfig.lib.json` (the `set-isolated-modules-22-3-0` migration sets `isolatedModules: true` in each)
- Modify: `libs/angular-accelerator/jest.config.ts`, `libs/angular-auth/jest.config.ts`, `libs/angular-integration-interface/jest.config.ts`, `libs/angular-remote-components/jest.config.ts`, `libs/angular-standalone-shell/jest.config.ts`, `libs/angular-testing/jest.config.ts`, `libs/angular-utils/jest.config.ts`, `libs/angular-webcomponents/jest.config.ts`, `libs/ngrx-accelerator/jest.config.ts`, `libs/ngrx-integration-interface/jest.config.ts` (the `update-jest-preset-angular-setup` migration rewrites the `jest-preset-angular/setup-jest` import to the `setupZoneTestEnv` function form)
- Modify: files under `libs/angular-accelerator/.storybook/` (the `update-22-1-0-migrate-storybook-v10` migration adjusts Storybook v10 addon configuration for the one lib in this workspace that exposes a `build-storybook` target)
- Modify: every file matching `libs/*/src/**/*.component.ts` across `libs/accelerator`, `libs/angular-accelerator`, `libs/angular-auth`, `libs/angular-integration-interface`, `libs/angular-remote-components`, `libs/angular-standalone-shell`, `libs/angular-testing`, `libs/angular-utils`, `libs/angular-webcomponents`, `libs/ngrx-accelerator`, `libs/ngrx-integration-interface`, `libs/shell-auth` — the `OnPush`-by-default schematic adds `changeDetection: ChangeDetectionStrategy.OnPush` to every `@Component` decorator lacking an explicit `changeDetection` property and adds the `ChangeDetectionStrategy` import from `@angular/core` where missing

**Dependencies:** None — this is the first task.

- [ ] **Step 1: Confirm a clean working tree before migrating**

```bash
cd /_work/de-muc-onecx-1-onecx-internal-sov-1--561w96yPfOv46/onecx-ai-workflows/onecx-ai-workflows/hybrid-orchestrator-work/.tmp-hybrid/target-repo
git status --porcelain
```
Expected: no output.

- [ ] **Step 2: Record the pre-migration commit SHA for later diffing**

```bash
git rev-parse HEAD | tee /tmp/pre-migration-sha.txt
```
Expected: prints the current commit SHA and writes it to `/tmp/pre-migration-sha.txt`.

- [ ] **Step 3: Run `nx migrate` targeting Nx 23.2.1**

```bash
npx nx migrate 23.2.1
```
Expected: exit code 0. Root `package.json` is rewritten with `nx` and every `@nx/*` package set to `23.2.1`. `migrations.json` is populated with the migration steps required between `22.3.3` and `23.2.1`.

- [ ] **Step 4: Set the remaining companion package versions in root `package.json`**

Edit `package.json` `dependencies` block, setting these exact values:

```json
"@angular/animations": "^22.0.0",
"@angular/cdk": "^22.0.0",
"@angular/common": "^22.0.0",
"@angular/compiler": "^22.0.0",
"@angular/core": "^22.0.0",
"@angular/elements": "^22.0.0",
"@angular/forms": "^22.0.0",
"@angular/platform-browser": "^22.0.0",
"@angular/platform-browser-dynamic": "^22.0.0",
"@angular/router": "^22.0.0",
```

Edit `package.json` `devDependencies` block, setting these exact values:

```json
"@angular-devkit/architect": "0.2200.0",
"@angular-devkit/build-angular": "22.0.0",
"@angular-devkit/core": "22.0.0",
"@angular-devkit/schematics": "22.0.0",
"@angular-eslint/eslint-plugin": "^22.0.0",
"@angular-eslint/eslint-plugin-template": "^22.0.0",
"@angular-eslint/template-parser": "^22.0.0",
"@angular/cli": "22.0.0",
"@angular/compiler-cli": "^22.0.0",
"@angular/language-service": "^22.0.0",
"@schematics/angular": "22.0.0",
"@storybook/angular": "^10.6.0",
"ng-packagr": "^22.0.0",
"jest-preset-angular": "^16.2.0",
"storybook": "^10.6.0",
"typescript": "6.0.0"
```

- [ ] **Step 5: Widen the two root `overrides` entries that predate the Angular 22 dependency graph**

Edit `package.json` `overrides` block, changing:
```json
"esbuild": "~0.25.12",
"happy-dom": "^20.0.10",
```
to:
```json
"esbuild": "~0.25.13",
"happy-dom": "^20.1.0",
```

- [ ] **Step 6: Install the new dependency graph**

```bash
npm install
```
Expected: exit code 0, `package-lock.json` rewritten.

- [ ] **Step 7: Run the Nx-driven migrations, including the OnPush-by-default codemod**

```bash
npx nx migrate --run-migrations
```
Expected: exit code 0. Each migration entry in `migrations.json` runs and prints a success line. Component files across `libs/*` gain `changeDetection: ChangeDetectionStrategy.OnPush`; `tsconfig.lib.json` files gain `isolatedModules: true`; `jest.config.ts` files have their `jest-preset-angular/setup-jest` import rewritten to `setupZoneTestEnv`; `tsconfig.base.json` has `moduleResolution` and `lib` updated.

- [ ] **Step 8: Record the components remaining without an explicit `changeDetection` property**

```bash
grep -rLE "changeDetection" $(find libs -path '*/src/*' -name '*.component.ts') | tee /tmp/no-changedetection-list.txt
wc -l /tmp/no-changedetection-list.txt
```
Expected: `/tmp/no-changedetection-list.txt` is empty and the line count is `0`.

- [ ] **Step 9: Verify final package versions match the Global Constraints**

```bash
node -e "
const pkg = require('./package.json');
const get = (n) => pkg.dependencies[n] || pkg.devDependencies[n];
['nx','typescript','ng-packagr','jest-preset-angular','@storybook/angular','@angular/core'].forEach(n => console.log(n, get(n)));
"
```
Expected output: `nx 23.2.1`, `typescript 6.0.0`, `ng-packagr ^22.0.0`, `jest-preset-angular ^16.2.0`, `@storybook/angular ^10.6.0`, `@angular/core ^22.0.0`.

- [ ] **Step 10: Commit the migration output**

```bash
git add -A
git commit -m "chore: bump Nx to 23.2.1 and Angular to 22.0.0 via nx migrate --run-migrations

Applies the coordinated nx migrate 23.2.1 pass (npm install + nx migrate
--run-migrations), including the official OnPush-by-default Angular
schematic across all components lacking an explicit changeDetection,
and the companion TypeScript 6.0.0, ng-packagr 22.0.0,
jest-preset-angular 16.2.0, and @storybook/angular 10.6.0 bumps.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
Expected: commit succeeds.

---

### Task 2: Bump `@angular/*` peerDependency ranges in the 11 published libs that declare them

**Files:**
- Modify: `libs/angular-accelerator/package.json`
- Modify: `libs/angular-auth/package.json`
- Modify: `libs/angular-integration-interface/package.json`
- Modify: `libs/angular-remote-components/package.json`
- Modify: `libs/angular-standalone-shell/package.json`
- Modify: `libs/angular-testing/package.json`
- Modify: `libs/angular-utils/package.json`
- Modify: `libs/angular-webcomponents/package.json`
- Modify: `libs/ngrx-accelerator/package.json`
- Modify: `libs/ngrx-integration-interface/package.json`
- Modify: `libs/shell-auth/package.json`

**Dependencies:** Task 1 complete.

- [ ] **Step 1: Edit `libs/angular-accelerator/package.json`**

In the `peerDependencies` block, change `"@angular/common": "^21.0.0"` to `"@angular/common": "^22.0.0"`, `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"`, and `"@angular/cdk": "^21.0.0"` to `"@angular/cdk": "^22.0.0"`.

- [ ] **Step 2: Edit `libs/angular-auth/package.json`**

In the `peerDependencies` block, change `"@angular/common": "^21.0.0"` to `"@angular/common": "^22.0.0"` and `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"`.

- [ ] **Step 3: Edit `libs/angular-integration-interface/package.json`**

In the `peerDependencies` block, change `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"`.

- [ ] **Step 4: Edit `libs/angular-remote-components/package.json`**

In the `peerDependencies` block, change `"@angular/cdk": "^21.0.0"` to `"@angular/cdk": "^22.0.0"`, `"@angular/common": "^21.0.0"` to `"@angular/common": "^22.0.0"`, and `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"`.

- [ ] **Step 5: Edit `libs/angular-standalone-shell/package.json`**

In the `peerDependencies` block, change `"@angular/common": "^21.0.0"` to `"@angular/common": "^22.0.0"`, `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"`, and `"@angular/router": "^21.0.0"` to `"@angular/router": "^22.0.0"`.

- [ ] **Step 6: Edit `libs/angular-testing/package.json`**

In the `peerDependencies` block, change `"@angular/cdk": "^21.0.0"` to `"@angular/cdk": "^22.0.0"`.

- [ ] **Step 7: Edit `libs/angular-utils/package.json`**

In the `peerDependencies` block, change `"@angular/cdk": "^21.0.0"` to `"@angular/cdk": "^22.0.0"`, `"@angular/common": "^21.0.0"` to `"@angular/common": "^22.0.0"`, and `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"`.

- [ ] **Step 8: Edit `libs/angular-webcomponents/package.json`**

In the `peerDependencies` block, change `"@angular/common": "^21.0.0"` to `"@angular/common": "^22.0.0"`, `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"`, and `"@angular/platform-browser": "^21.0.0"` to `"@angular/platform-browser": "^22.0.0"`.

- [ ] **Step 9: Edit `libs/ngrx-accelerator/package.json`**

In the `peerDependencies` block, change `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"` and `"@angular/router": "^21.0.0"` to `"@angular/router": "^22.0.0"`.

- [ ] **Step 10: Edit `libs/ngrx-integration-interface/package.json`**

In the `peerDependencies` block, change `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"`.

- [ ] **Step 11: Edit `libs/shell-auth/package.json`**

In the `peerDependencies` block, change `"@angular/core": "^21.0.0"` to `"@angular/core": "^22.0.0"`.

- [ ] **Step 12: Verify exactly these 11 files changed**

```bash
git diff --stat -- libs/*/package.json
```
Expected: exactly the 11 files listed in Steps 1–11 appear in the diff.

- [ ] **Step 13: Commit**

```bash
git add libs/angular-accelerator/package.json libs/angular-auth/package.json libs/angular-integration-interface/package.json libs/angular-remote-components/package.json libs/angular-standalone-shell/package.json libs/angular-testing/package.json libs/angular-utils/package.json libs/angular-webcomponents/package.json libs/ngrx-accelerator/package.json libs/ngrx-integration-interface/package.json libs/shell-auth/package.json
git commit -m "chore: bump @angular/* peerDependency ranges to ^22.0.0 in published libs

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
Expected: commit succeeds.

---

### Task 3: Bump `angular-integration-interface`'s `typescript` peerDependency

**Files:**
- Modify: `libs/angular-integration-interface/package.json`

**Dependencies:** Task 1 complete.

- [ ] **Step 1: Edit the `typescript` peerDependency**

Change the `peerDependencies` block's `"typescript": "^5.5.4"` line to `"typescript": "^6.0.0"`.

- [ ] **Step 2: Verify**

```bash
grep -n '"typescript"' libs/angular-integration-interface/package.json
```
Expected: `"typescript": "^6.0.0"`.

- [ ] **Step 3: Commit**

```bash
git add libs/angular-integration-interface/package.json
git commit -m "chore: bump angular-integration-interface typescript peerDependency to ^6.0.0

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
Expected: commit succeeds.

---

### Task 4: Full workspace lint, test, and build validation

**Files:**
- Modify: `/tmp/failing-specs-list.txt` (new — a working file recording the exact set of failing spec files produced by Step 2, consumed by Step 3)
- Modify: every file listed in `/tmp/failing-specs-list.txt` after Step 2 runs — each such file is a `libs/*/**/*.spec.ts` file; the fix applied is the addition of one `fixture.detectChanges();` statement immediately before the first assertion that follows the state mutation identified by the Jest failure message's line number

**Dependencies:** Tasks 1, 2, 3 complete.

- [ ] **Step 1: Run lint across the whole workspace**

```bash
npx nx run-many -t lint
```
Expected: exit code 0.

- [ ] **Step 2: Run tests across the whole workspace and capture the list of failing spec files**

```bash
npx nx run-many -t test --no-interactive 2>&1 | tee /tmp/full-test-run.log
grep -oE '[a-zA-Z0-9/_-]+\.spec\.ts' /tmp/full-test-run.log | sort -u | tee /tmp/failing-specs-list.txt
```
Expected: `/tmp/full-test-run.log` records the full Jest run; `/tmp/failing-specs-list.txt` is empty when the first command exits 0.

- [ ] **Step 3: Apply the `fixture.detectChanges()` fix to every file recorded in `/tmp/failing-specs-list.txt`**

```bash
cat /tmp/failing-specs-list.txt
```
For each path printed, open the file, locate the assertion line number reported in `/tmp/full-test-run.log` for that path, and insert `fixture.detectChanges();` as a new statement immediately before that assertion line.

- [ ] **Step 4: Re-run tests across the whole workspace to confirm the fix**

```bash
npx nx run-many -t test --no-interactive
```
Expected: exit code 0.

- [ ] **Step 5: Run build across the whole workspace**

```bash
npx nx run-many -t build
```
Expected: exit code 0.

- [ ] **Step 6: Build the accelerator library's Storybook**

```bash
npx nx run angular-accelerator:build-storybook
```
Expected: exit code 0.

- [ ] **Step 7: Re-run the full lint/test/build sequence to confirm a clean final state**

```bash
npx nx run-many -t lint
npx nx run-many -t test --no-interactive
npx nx run-many -t build
```
Expected: all three commands exit with code 0.

- [ ] **Step 8: Commit the fixes applied in Step 3**

```bash
git add -- $(cat /tmp/failing-specs-list.txt)
git commit -m "test: add fixture.detectChanges() calls for OnPush change detection after Angular 22 bump

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
Expected: commit succeeds.

---

## Verification Steps

1. `node -e "const p=require('./package.json'); console.log(p.devDependencies.nx, p.devDependencies.typescript, p.devDependencies['ng-packagr'], p.devDependencies['jest-preset-angular'], p.devDependencies['@storybook/angular'], p.dependencies['@angular/core'])"` prints `23.2.1 6.0.0 ^22.0.0 ^16.2.0 ^10.6.0 ^22.0.0`.
2. `npx nx run-many -t lint` exits 0.
3. `npx nx run-many -t test --no-interactive` exits 0.
4. `npx nx run-many -t build` exits 0.
5. `wc -l /tmp/no-changedetection-list.txt` prints `0`.
6. `git diff --stat $(cat /tmp/pre-migration-sha.txt) -- libs/*/package.json` shows changes in exactly the 11 files from Task 2 and `libs/angular-integration-interface/package.json` from Task 3.
7. `grep -n '"typescript"' libs/angular-integration-interface/package.json` prints `"typescript": "^6.0.0"`.

## Notes

- The diff produced by Task 1 Step 7 spans every component file in the workspace; this matches the issue's explicit instruction to apply the schematic wholesale with no manual per-component review.
- Real `OnPush` behavioral adoption beyond passing the existing test suite is out of scope for this issue and is deferred to later phases of the Angular 22 / Optimus UI migration.
- CI already runs on Node 24 (`.github/workflows/ci.yml` sets `node-version: 24`), so the "Blocked by: Libs — Standardize CI on Node 24" dependency is already satisfied in this repository state and requires no workflow file changes.
- The `angular-22/index.adoc` documentation guide referenced in the issue's Definition of Done is authored in a separate, already-identified v9.0.0 cutover ticket and is not created by this plan.
