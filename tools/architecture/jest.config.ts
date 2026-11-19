export default {
  displayName: 'architecture',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/src/**/*.arch.spec.ts'],
  // Building the import graph of the whole workspace takes a few seconds, it is cached between the rules of a file.
  testTimeout: 120000,
}
