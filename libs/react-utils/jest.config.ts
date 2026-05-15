/** @jest-config-loader ts-node */
// Without jest-config-loader, jest cannot load other ts files

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'react-utils',
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
  ...createReportsConfig('react-utils'),
  testMatch: ['<rootDir>/src/lib/**/*.spec.ts', '<rootDir>/src/lib/**/*.spec.tsx'],
  collectCoverageFrom: [
    '<rootDir>/src/lib/**/*.{ts,tsx,js,jsx}',
    '!<rootDir>/src/lib/**/index.ts',
    '!<rootDir>/src/lib/**/logger.utils.ts',
    '!<rootDir>/src/lib/**/*.spec.ts',
    '!<rootDir>/src/lib/**/*.spec.tsx',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '\\.spec\\.(ts|tsx)$', 'index\\.ts$', 'logger\\.utils\\.ts$'],
}
