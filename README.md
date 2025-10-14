# onecx-portal-ui-libs

OneCx portal UI libraries

# Changelog

[Changelog](CHANGELOG.md)

# Release configuration

OneCX Portal UI Libs is using https://semantic-release.gitbook.io/semantic-release[semantic-release]for packages release. In this repository the following branches are important in context of making new releases:

- **v5** - contains source code for `v5` distribution tag compatible with Angular 18.
- **v6** - contains source code for `v5` distribution tag compatible with Angular 19.
- **main** - contains source code for `rc` distribution tag with features for future release of OneCX.

# Releasing libs

In order to release new version of libs, use `create-release` action to run the release workflow for **desired branch**.

## Release versioning

Depending on the commits included for a release in the `v5` or `v6` branch, the version of the `latest` distribution tag varies. Below, a list of example version changes is presented for `v5` releases:

- Release fix commit - The patch version increments (e.g., `5.1.3` &#8594; `5.1.4`).
- Release feat commit - The minor version increments (e.g., `5.1.3` &#8594; `5.2.0`).
- Release commit with breaking change - The major version increments (e.g., `5.1.3` &#8594; `6.0.0`).
- Release changes merged from pre-release branch - The major version increments (e.g., `5.1.3` &#8594; `6.0.0`).

# Pre-releases

The https://semantic-release.gitbook.io/semantic-release[semantic-release] allows to create pre-releases. In this repository, `main` branch should contain source code which could be released as a release candidate.

In order to release new version of pre-release (`rc` distribution tag) of OneCX libraries, use `create-release` action to run the release workflow for **main branch**.

## Pre-release versioning

Depending on the commits included for a release in the `main` branch, the version of the `rc` distribution tag varies. Below, a list of example version changes is presented:

- Release fix commit - The patch version increments (e.g., `6.0.0-rc.3` &#8594; `6.0.0-rc.4`).
- Release feat commit - The minor version increments (e.g., `6.0.0-rc.3` &#8594; `6.0.0-rc.4`).
- Release commit with breaking change - The major version increments (e.g., `6.0.0-rc.3` &#8594; `7.0.0-rc.1`).
- Release changes merged from pre-release branch - The major version increments (e.g., `6.0.0-rc.3` &#8594; `7.0.0-rc.1`).

To find out more on pre-releases with semantic-release, please refer https://semantic-release.gitbook.io/semantic-release/recipes/release-workflow/pre-releases[here].

# Migrating to Angular 19, PrimeNG 19 and OneCX v6

Run the following commands in your project's terminal and follow the instructions:

1. `npx nx g @nx/eslint:convert-to-flat-config` (this is only necessary if you have the `.eslint.json` still)
2. `npx nx generate @angular/core:control-flow` (https://angular.dev/reference/migrations/control-flow)
3. `npx nx generate @angular/core:inject` (https://angular.dev/reference/migrations/inject-function)

# SonarQube Code Analysis

This repository provides npm scripts to run SonarQube analysis on the UI libraries. Two dedicated scripts are available for different use cases.

## Available Scripts

### `npm run sonar -- <library-name>`

Runs SonarQube analysis for a specific library. **Requires a library name as argument.**

**Usage:**

```bash
npm run sonar -- angular-auth
npm run sonar -- accelerator
npm run sonar -- portal-integration-angular
```

**What it does:**

1. Validates that the specified library exists
2. Runs tests for the specified library using `nx run-many -t test -p <library>`
3. Normalizes the LCOV coverage reports
4. Changes to the library directory and runs `sonarqube-scanner`

**Error handling:**

- Throws an error if no library name is provided
- Throws an error if the specified library doesn't exist
- Lists all available libraries when an error occurs

### `npm run sonar:all`

Runs SonarQube analysis for all libraries in the workspace. **No arguments required.**

**Usage:**

```bash
npm run sonar:all
```

**What it does:**

1. Runs tests for all libraries using `nx run-many -t test`
2. Normalizes the LCOV coverage reports
3. Automatically detects all libraries from the `reports` folder
4. Runs `sonarqube-scanner` for each detected library
5. Skips libraries that don't have corresponding directories

**Error handling:**

- Checks if the reports folder exists
- Warns if no libraries are found to scan
- Skips libraries that don't have corresponding directories

## Implementation Details

- **`sonar`** script uses `sonar-single.js` - dedicated for single library analysis
- **`sonar:all`** script uses `sonar-all.js` - dedicated for all libraries analysis
- Each script has its own validation and error handling logic
- Both scripts provide clear feedback about what they're doing

## Prerequisites

- SonarQube Scanner must be installed (`npm install`)
- Each library must have a `sonar-project.properties` file configured
- SonarQube docker must be accessible and configured

# Update to latest minor version of libs

1. run the following command in your project's terminal to run onecx migrations:

```
curl -sL https://raw.githubusercontent.com/onecx/onecx-portal-ui-libs/refs/heads/main/update_libs.sh | bash -
```

2. run `npm run build` to check if it builds successfully after the migrations

# Local migration testing

To test migration locally use verdaccio and the migration guide.

The [v6 migration file](./libs/nx-migration-utils/src/lib/common-migrations/common-migrate-onecx-to-v6.utils.ts) has to be updated with appropriate OneCX packages version.

```
onecxDependencies.forEach((dep) => {
      json.dependencies[dep] = '^6.0.0-rc.X'
    })
```

# Update from v3 to v4 guide

[Update guide](update-guide.md)
