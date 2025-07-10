export default {
  displayName: 'angular-accelerator-migrations',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/test-utils/test-setup.ts'],
  coverageDirectory: '../../coverage/libs/angular-accelerator/migrations',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
}
