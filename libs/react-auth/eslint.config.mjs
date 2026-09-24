import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    // Faithful flat-config conversion (Angular 21->22 bump, issue #707).
    // Before the convert-to-flat-config migration this project had no per-project
    // .eslintrc and relied on the root .eslintrc.json, whose
    // ignorePatterns: ["**/*"] (carried through the old FlatCompat .cjs shim, which
    // never re-included the source) meant the React source was NOT actively linted --
    // only package.json was checked. (The Angular per-project configs re-included
    // their source via ignorePatterns: ["!**/*"]; this project never had that.)
    // Preserve that scope: still lint the package.json (dependency checks via
    // baseConfig) but keep the source ignored, rather than start linting unrelated
    // React micro-frontend source whose pre-existing debt (e.g.
    // enforce-module-boundaries "lazy-loaded libraries") is out of scope for this
    // dependency bump.
    ignores: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  },
]
