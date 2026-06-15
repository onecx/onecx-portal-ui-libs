/** @jest-config-loader ts-node */
// Without jest-config-loader, jest cannot load other ts files

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

const reportsConfig = createReportsConfig('angular-utils')

export default {
  ...reportsConfig,
  displayName: 'angular-utils',
  preset: '../../jest.preset.js',
  testMatch: [
    '<rootDir>/src/lib/**/*.spec.ts',
    '<rootDir>/guards/**/*.spec.ts',
    '<rootDir>/theme/**/*.spec.ts',
  ],
  collectCoverageFrom: [
    ...reportsConfig.collectCoverageFrom,
    '<rootDir>/guards/**/*.{ts,js}',
    '!<rootDir>/guards/**/logger.utils.ts',
    '!<rootDir>/guards/**/*.stories.ts',
    '!<rootDir>/guards/**/storybook-config.ts',
    '!<rootDir>/guards/**/*.module.ts',
    '!<rootDir>/guards/**/*.spec.ts',
    '!<rootDir>/guards/**/*.harness.ts',
    '!<rootDir>/guards/**/testing/**',
    '<rootDir>/theme/**/*.{ts,js}',
    '!<rootDir>/theme/**/logger.utils.ts',
    '!<rootDir>/theme/**/*.stories.ts',
    '!<rootDir>/theme/**/storybook-config.ts',
    '!<rootDir>/theme/**/*.module.ts',
    '!<rootDir>/theme/**/*.spec.ts',
    '!<rootDir>/theme/**/*.harness.ts',
    '!<rootDir>/theme/**/testing/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '@primeng/themes': '<rootDir>/../../node_modules/@primeng/themes/index.mjs',
  },
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
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
}
