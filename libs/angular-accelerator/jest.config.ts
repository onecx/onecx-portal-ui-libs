/** @jest-config-loader ts-node */
// Without jest-config-loader, jest cannot load other ts files

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'angular-accelerator',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
    '^.+\\.tsx?$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { url: 'https://www.url.com' } },
            },
          ],
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|d3-(.*))'],
  moduleNameMapper: {
    '@openng/optimus-ui-themes':
      '<rootDir>/../../node_modules/@openng/optimus-ui-themes/dist/index.mjs',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testEnvironment: '@happy-dom/jest-environment',
  ...createReportsConfig('angular-accelerator'),
}
