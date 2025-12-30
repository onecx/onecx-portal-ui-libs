/* eslint-disable */
const { createReportsConfig } = require('../../jest-config-factory')

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
