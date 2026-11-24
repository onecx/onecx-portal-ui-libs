/** @jest-config-loader ts-node */
// Without jest-config-loader, jest cannot load other ts files

/* eslint-disable */
import { createWorkerMemoryConfig } from '../../jest-config-factory'

export default {
  displayName: 'angular-standalone-shell',
  preset: '../../jest.preset.js',
  ...createWorkerMemoryConfig(),
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/libs/angular-standalone-shell',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
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
