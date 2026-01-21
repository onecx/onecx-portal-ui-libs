export function createReportsConfig(projectName: string) {
  const reportsRoot = `${process.cwd()}/reports/${projectName}`
  return {
    testMatch: ['<rootDir>/src/lib/**/*.spec.ts'],
    coverageDirectory: `${reportsRoot}/coverage`,
    collectCoverageFrom: [
      '<rootDir>/src/lib/**/*.{ts,js}',
      '!<rootDir>/src/lib/**/*.stories.ts',
      '!<rootDir>/src/lib/**/storybook-config.ts',
      '!<rootDir>/src/lib/**/*.module.ts',
      '!<rootDir>/src/lib/**/*.spec.ts',
      '!<rootDir>/src/lib/**/*.harness.ts',
      '!<rootDir>/src/lib/**/testing/**',
      '!<rootDir>/src/testing/**',
      '!<rootDir>/testing/**',
      '!**/node_modules/**',
    ],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '\\.harness\\.ts$',
      '/testing/',
      '/src/testing/',
    ],
    coverageReporters: ['json', ['lcov', { projectRoot: '/' }], 'text', 'text-summary', 'html'],
    reporters: [
      'default',
      [
        'jest-sonar',
        {
          outputDirectory: reportsRoot,
          outputName: 'sonarqube_report.xml',
          reportedFilePath: 'absolute',
        },
      ],
    ],
  }
}
