import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    // React was NOT a target of this PR -- the @nx/eslint convert-to-flat-config
    // migration (part of the Angular 21->22 bump, issue #707) is workspace-wide and
    // converted every project's config. This file must now exist because that migration
    // deleted the root .eslintrc.json and the old FlatCompat .cjs shim (which
    // `require`d it), so a per-project config is required for `nx lint` to resolve.
    // Its only job is to preserve main's lint scope as a faithful no-op: the old root
    // .eslintrc.json had ignorePatterns: ["**/*"], so React source was never actively
    // linted -- only package.json was checked. Keep the source ignored rather than
    // start newly surfacing unrelated pre-existing React debt.
    ignores: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  },
]
