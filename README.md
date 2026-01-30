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
