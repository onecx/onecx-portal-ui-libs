export default {
  displayName: 'nx-migration-utils-migrations',
  preset: '../../../../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/nx-migration-utils/src/lib/migrations',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['../../test-setup.ts'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
}