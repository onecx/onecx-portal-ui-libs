export default {
  displayName: 'angular-remote-component-migrations',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/angular-remote-component/migrations',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test-utils/test-setup.ts'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
}