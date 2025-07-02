export default {
    displayName: 'ngrx-accelerator-migrations',
    preset: '../../../jest.preset.js',
    coverageDirectory: '../../coverage/libs/ngrx-accelerator/migrations',
    testEnvironment: '@happy-dom/jest-environment',
    setupFilesAfterEnv: ['<rootDir>/test-utils/setup-jest.ts'],
    testMatch: ['**/*.spec.ts'],
    transform: {
      '^.+\\.[tj]s$': 'ts-jest',
    },
  }