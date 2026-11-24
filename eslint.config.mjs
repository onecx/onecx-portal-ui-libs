import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import nx from '@nx/eslint-plugin'
import jsoncEslintParser from 'jsonc-eslint-parser'
import { createJiti } from 'jiti'

// The OneCX linter rule plugins are loaded from source so the workspace is linted
// with its own rules without having to build the plugins first.
const jiti = createJiti(import.meta.url)
const { plugin: angularLinterRules } = await jiti.import('./libs/angular-linter-rules/src/index.ts')
const { plugin: ngrxLinterRules } = await jiti.import('./libs/ngrx-linter-rules/src/index.ts')

// Spread into the eslint.config.mjs of libs that use NgRx.
export const ngrxLinterRulesConfig = {
  files: ['**/*.ts'],
  plugins: { '@onecx/ngrx-linter-rules': ngrxLinterRules },
  rules: ngrxLinterRules.configs.recommended.rules,
}

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
})

export default [
  ...nx.configs['flat/base'],
  {
    files: ['**/*.json'],
    // Override or add rules here
    rules: {},
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...nx.configs['flat/typescript'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    plugins: { '@onecx/angular-linter-rules': angularLinterRules },
    rules: angularLinterRules.configs.recommended.rules,
  },
  ...nx.configs['flat/javascript'],
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
  {
    files: ['./package.json', './executors.json'],
    rules: {
      '@nx/nx-plugin-checks': 'error',
    },
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
]
