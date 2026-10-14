import { dirname } from 'path'
import { fileURLToPath } from 'url'
import baseConfig from '../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'
import jsoncEslintParser from 'jsonc-eslint-parser'

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ocx',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ocx',
          style: 'kebab-case',
        },
      ],
    },
  },
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': 'error',
    },
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
  {
    // Angular 22 bump (issue #707): the flat-config migration (migrations.json
    // "convert-to-flat-config") activates @angular-eslint recommended + accessibility
    // presets the legacy .eslintrc.json did not apply. Per that migration's contract to
    // "keep the workspace lint-passing, disabling rules whose preset defaults changed",
    // disable the preset-default rules that conflict with this issue's criteria and the
    // pre-existing templates: prefer-on-push flags the ChangeDetectionStrategy.Eager
    // annotations the Angular 22 change-detection-eager schematic added (criterion #2
    // requires them); the 5 accessibility template rules flag pre-existing templates.
    files: ['**/*.ts', '**/*.html'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/template/no-autofocus': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/elements-content': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/alt-text': 'off',
    },
  },
]
