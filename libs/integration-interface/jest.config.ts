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
  testEnvironment: '@happy-dom/jest-environment',
  ...createReportsConfig('integration-interface'),
}
