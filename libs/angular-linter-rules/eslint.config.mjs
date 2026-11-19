import baseConfig from '../../eslint.config.mjs'
import jsoncEslintParser from 'jsonc-eslint-parser'

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncEslintParser,
    },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['libs/angular-linter-rules/src/types/rule-tester.d.ts'],
        },
      ],
    },
  },
]
