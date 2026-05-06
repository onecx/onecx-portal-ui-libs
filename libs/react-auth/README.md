# @onecx/react-auth

`@onecx/react-auth` contains authentication utilities for React applications, providing integration with OneCX authentication services.
More information about OneCX libraries can be found in the [OneCX documentation](https://onecx.github.io/docs/documentation/current/onecx-portal-ui-libs/index.html).

## Installation

```bash
npm install @onecx/react-auth
```

## Auth proxy service

Use `AuthServiceProxy` (or the `authServiceProxy` singleton) to access the OneCX auth service proxy exposed by the shell.
It provides a stable API to update tokens and to retrieve header values needed for backend calls.

```ts
import { authServiceProxy } from '@onecx/react-auth'

await authServiceProxy.updateTokenIfNeeded()
const headers = authServiceProxy.getHeaderValues()
```

## Axios helper

Use `axiosFactory` to get an axios instance wired to the auth proxy. It updates the token and injects auth headers
for every request (except whitelisted URLs).

```ts
import { axiosFactory } from '@onecx/react-auth'

const api = axiosFactory('/bff')
const response = await api.get('/profile')
```

## Additional Commands
- `npx nx run react-auth:build` - Builds the library and outputs the result to the `dist` folder.
- `npx nx run react-auth:test` - Runs the unit tests for the library.
- `npx nx run react-auth:lint` - Lints the library's codebase.
- `npx nx run react-auth:release` - Releases a new version of the library to npm, following semantic versioning guidelines.
