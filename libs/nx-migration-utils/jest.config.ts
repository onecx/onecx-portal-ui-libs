/* eslint-disable */
// Use require for .cjs file - works in both CommonJS and ES module contexts when using ts-node
const { createReportsConfig } = require('../../jest-config-factory.cjs')

export default {
  displayName: 'nx-migration-utils',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  ...createReportsConfig('nx-migration-utils'),
}
