export default {
  displayName: 'angular-integration-interface-migrations',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/angular-integration-interface/migrations',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test-utils/test-setup.ts'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
}