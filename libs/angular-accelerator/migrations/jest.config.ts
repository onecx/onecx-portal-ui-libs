export default {
  displayName: 'angular-accelerator-migrations',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/angular-accelerator/migrations',
  testEnvironment: '@happy-dom/jest-environment',
  setupFilesAfterEnv: ['<rootDir>/test-utils/setup-jest.ts'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
}
