/** @jest-config-loader ts-node */
// Without jest-config-loader, jest cannot load other ts files

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  ...createReportsConfig('angular-utils'),
  displayName: 'angular-utils',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/lib/**/*.spec.ts', '<rootDir>/guards/**/*.spec.ts','<rootDir>/theme/**/*.spec.ts'],
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
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)','node_modules/(?!(@?primeng|@?primeuix)/)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
}
