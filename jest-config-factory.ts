export function createReportsConfig(projectName: string) {
  return {
    testMatch: ['<rootDir>/src/lib/**/*.spec.ts'],
    coverageDirectory: `../../reports/${projectName}/coverage`,
    collectCoverage: true,
    coverageReporters: ['json', ['lcov', { projectRoot: '/' }], 'text', 'text-summary', 'html'],
    testResultsProcessor: 'jest-sonar-reporter',
    reporters: [
      'default',
      [
        'jest-sonar',
        {
          outputDirectory: `./reports/${projectName}`,
          outputName: 'sonarqube_report.xml',
          reportedFilePath: 'absolute',
        },
      ],
    ],
  }
}
