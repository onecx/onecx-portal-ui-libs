# @onecx/ngrx-linter-rules

`@onecx/ngrx-linter-rules` is an ESLint plugin that provides opinionated NGRX rules to ensure code quality and consistency across NGRX projects within the OneCX ecosystem.
More information about the library can be found [here](https://onecx.github.io/docs/documentation/current/onecx-portal-ui-libs/libraries/ngrx-linter-rules.html)

## Installation

```bash
npm install @onecx/ngrx-linter-rules
```

## Rules

- `http-calls-only-in-effects` - reports HTTP calls made in Angular components instead of NgRx effects. An injected property counts as an HTTP client when its type is `HttpClient` or a generated OpenAPI client (a class name ending in `ApiService`, `ControllerService` or `Api`, or imported from a `generated/` folder). Hand-written services (e.g. `ProductService`) are not reported, because they cannot be told apart from services that do no HTTP calls (`TranslateService`, `UserService`, ...). Test files are skipped.
- `no-store-dispatch-in-effect` - reports `Store.dispatch()` calls inside effect classes. Test files are skipped.

## Additional Commands

- `npx nx run ngrx-linter-rules:build` - Builds the library and outputs the result to the `dist` folder.
- `npx nx run ngrx-linter-rules:test` - Runs the unit tests for the library.
- `npx nx run ngrx-linter-rules:lint` - Lints the library's codebase.
- `npx nx run ngrx-linter-rules:release` - Releases a new version of the library to npm, following semantic versioning guidelines.
