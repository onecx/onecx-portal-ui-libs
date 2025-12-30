/* eslint-disable */
// Use require for .cjs file - works in both CommonJS and ES module contexts when using ts-node
const { createReportsConfig } = require('../../jest-config-factory.cjs')

export default {
  displayName: 'integration-interface',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  ...createReportsConfig('integration-interface'),
}
