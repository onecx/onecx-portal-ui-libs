# @onecx/angular-linter-rules

`@onecx/angular-linter-rules` is an ESLint plugin that provides opinionated Angular rules to ensure code quality and consistency across Angular projects within the OneCX ecosystem.
More information about the library can be found [here](https://onecx.github.io/docs/documentation/current/onecx-portal-ui-libs/libraries/angular-linter-rules.html)

## Installation

```bash
npm install @onecx/angular-linter-rules
```

## Rules

- `no-subscribe-assignment` - reports assignments inside a `subscribe` callback to variables declared outside of it (including class members). Test files are skipped.
- `no-translate-instant` - reports `TranslateService.instant(...)` outside of tests.
- `prefer-translate-params` - reports translated strings that are concatenated instead of using translation parameters. Test files are skipped.

## Additional Commands

- `npx nx run angular-linter-rules:build` - Builds the library and outputs the result to the `dist` folder.
- `npx nx run angular-linter-rules:test` - Runs the unit tests for the library.
- `npx nx run angular-linter-rules:lint` - Lints the library's codebase.
- `npx nx run angular-linter-rules:release` - Releases a new version of the library to npm, following semantic versioning guidelines.
