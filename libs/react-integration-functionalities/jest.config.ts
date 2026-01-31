/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'react-integration-functionalities',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  ...createReportsConfig('react-integration-functionalities'),
}
