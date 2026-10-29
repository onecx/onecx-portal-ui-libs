/** @jest-config-loader ts-node */
// Without jest-config-loader, jest cannot load other ts files

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

const reportsConfig = createReportsConfig('react-webcomponents')

export default {
  displayName: 'react-webcomponents',
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
  ...reportsConfig,
  testMatch: ['<rootDir>/src/lib/**/*.test.tsx', '<rootDir>/src/lib/**/*.spec.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/lib/**/*.{ts,tsx,js,jsx}',
    '!<rootDir>/src/lib/**/logger.utils.ts',
    '!<rootDir>/src/lib/**/*.stories.ts',
    '!<rootDir>/src/lib/**/storybook-config.ts',
    '!<rootDir>/src/lib/**/*.module.ts',
    '!<rootDir>/src/lib/**/*.spec.ts',
    '!<rootDir>/src/lib/**/*.test.tsx',
    '!<rootDir>/src/lib/**/*.harness.ts',
    '!<rootDir>/src/lib/**/testing/**',
    '!<rootDir>/src/testing/**',
    '!<rootDir>/testing/**',
    '!**/node_modules/**',
  ],
}
