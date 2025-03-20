# onecx-portal-ui-libs

OneCx portal UI libraries

# Changelog

[Changelog](CHANGELOG.md)

# Release configuration

OneCX Portal UI Libs is using https://semantic-release.gitbook.io/semantic-release[semantic-release]for packages release. In this repository the following branches are important in context of making new releases:

- **main** - contains source code for `latest` distribution tag.
- **develop** - contains source code for `rc` distribution tag with features for future release of OneCX.

# Releasing libs

The `main` branch contains the source code for the `latest` distribution tag of OneCX libraries. In order to release new version of libs, use `create-release` action to run the release workflow for **main branch**.

## Release versioning

Depending on the commits included for a release in the `main` branch, the version of the `latest` distribution tag varies. Below, a list of example version changes is presented:

- Release fix commit - The patch version increments (e.g., `5.1.3` &#8594; `5.1.4`).
- Release feat commit - The minor version increments (e.g., `5.1.3` &#8594; `5.2.0`).
- Release commit with breaking change - The major version increments (e.g., `5.1.3` &#8594; `6.0.0`).
- Release changes merged from pre-release branch - The major version increments (e.g., `5.1.3` &#8594; `6.0.0`).

# Pre-releases

The https://semantic-release.gitbook.io/semantic-release[semantic-release] allows to create pre-releases. In this repository, `develop` branch should contain source code which could be released as a release candidate.

In order to release new version of pre-release (`rc` distribution tag) of OneCX libraries, use `create-release` action to run the release workflow for **develop branch**.

## Pre-release versioning

Depending on the commits included for a release in the `develop` branch, the version of the `rc` distribution tag varies. Below, a list of example version changes is presented:

- Release fix commit - The patch version increments (e.g., `6.0.0-rc.3` &#8594; `6.0.0-rc.4`).
- Release feat commit - The minor version increments (e.g., `6.0.0-rc.3` &#8594; `6.0.0-rc.4`).
- Release commit with breaking change - The major version increments (e.g., `6.0.0-rc.3` &#8594; `7.0.0-rc.1`).
- Release changes merged from pre-release branch - The major version increments (e.g., `6.0.0-rc.3` &#8594; `7.0.0-rc.1`).

To find out more on pre-releases with semantic-release, please refer https://semantic-release.gitbook.io/semantic-release/recipes/release-workflow/pre-releases[here].

# Porting changes from main to develop

In some cases, there might be a requirement to make a change directly on a main branch (e.g., urgent fix for a client). In that scenario, the following should happen:

- Change is prepared on the `main` branch
- Libs are released via the `main` branch
- The `main` branch is merged into `develop` branch
- Libs pre-release is released via the `develop` branch

# Migrating to Angular 19, PrimeNG 19 and OneCX v6
Run the following commands in your project's terminal and follow the instructions:

1. `npx nx g @nx/eslint:convert-to-flat-config` (this is only necessary if you have the `.eslint.json` still) 
2. `npx nx generate @angular/core:control-flow` (https://angular.dev/reference/migrations/control-flow)
3. `npx nx generate @angular/core:inject` (https://angular.dev/reference/migrations/inject-function) 
4. run the following command in your project's terminal to run migrations: 
`m='{"migrations": []}'; p=(); f() { [ -f "migrations.json" ] && m=$(jq -s '.[0].migrations + .[1].migrations | unique_by(.name) | {migrations: .}' <(echo "$m") migrations.json) && rm migrations.json; }; for d in node_modules/@onecx/*; do [ -d "$d" ] && p+=("@onecx/$(basename "$d")"); done; dep=$(jq -r '.dependencies | keys[] | select(startswith("@onecx/"))' package.json); devDep=$(jq -r '.devDependencies | keys[] | select(startswith("@onecx/"))' package.json); for e in $dep $devDep; do [[ ! " ${p[@]} " =~ " ${e} " ]] && p+=("$e"); done; for pkg in "${p[@]}"; do npx nx migrate "$pkg"; f; done; echo "$m" > migrations.json; if ! npx nx migrate --run-migrations --if-exists; then rm -rf node_modules package-lock.json; npm install --package-lock-only; npx nx migrate --run-migrations --if-exists; npm install --package-lock-only; fi; npm install`
5. `npm run build` to check if it builds successfully after the migrations

# Update from v3 to v4 guide

[Update guide](update-guide.md)
