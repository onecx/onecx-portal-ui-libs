import baseConfig from '../../eslint.config.mjs'
import jsoncEslintParser from 'jsonc-eslint-parser'

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          // `@tailwindcss/postcss` is a peer dependency (installed by the consuming app) that is only
          // `require`d lazily inside the tailwind-postcss.cjs plugin, so the static scanner can't see it.
          ignoredDependencies: ['@tailwindcss/postcss'],
        },
      ],
    },
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
]
