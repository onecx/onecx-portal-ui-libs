# @onecx/angular-standalone-shell

`@onecx/angular-standalone-shell` provides a wrapper module that can be used to run apps designed to run in the OneCX Shell in a standalone mode, without the need to be hosted within the Shell itself. The library is only intended to be used for local development purposes.
More information about OneCX libraries can be found in the [OneCX documentation](https://onecx.github.io/docs/documentation/current/onecx-portal-ui-libs/index.html).

## Installation

```bash
npm install @onecx/angular-standalone-shell
```

## Document language and fallback language

In standalone mode `provideStandaloneProviders()` sets `<html lang>` to the user language (WCAG 3.1.1) and updates it whenever the language changes. If the app has not configured an ngx-translate fallback language, `en` is used (`STANDALONE_FALLBACK_LANGUAGE`; `en` is the proposed default, pending product-owner confirmation), so missing translations do not mix languages or show raw keys. Inside the OneCX Shell the shell owns `<html lang>`; the libraries never write it there.

## Additional Commands

- `npx nx run angular-standalone-shell:build` - Builds the library and outputs the result to the `dist` folder.
- `npx nx run angular-standalone-shell:test` - Runs the unit tests for the library.
- `npx nx run angular-standalone-shell:lint` - Lints the library's codebase.
- `npx nx run angular-standalone-shell:release` - Releases a new version of the library to npm, following semantic versioning guidelines.
