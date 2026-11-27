# @onecx/react-webcomponents

`@onecx/react-webcomponents` manages React webcomponents in OneCX applications, enabling component sharing.
More information about OneCX libraries can be found in the [OneCX documentation](https://onecx.github.io/docs/documentation/current/onecx-portal-ui-libs/index.html).

## Installation

```bash
npm install @onecx/react-webcomponents @r2wc/react-to-web-component
```

`@r2wc/react-to-web-component` is provided by the consuming application and is not bundled into `@onecx/react-webcomponents`.

## Synced routing

`SyncedRouterProvider` keeps the React Router location in step with the OneCX shell. `useSyncedLocation().url` is the router **pathname only**: query and hash are not included. Read the full URL from `useLocation()` when you need them.

## Additional Commands

- `npx nx run react-webcomponents:build` - Builds the library and outputs the result to the `dist` folder.
- `npx nx run react-webcomponents:test` - Runs the unit tests for the library.
- `npx nx run react-webcomponents:lint` - Lints the library's codebase.
- `npx nx run react-webcomponents:release` - Releases a new version of the library to npm, following semantic versioning guidelines.
