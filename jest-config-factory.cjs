function createReportsConfig(projectName) {
  const reportsRoot = `${process.cwd()}/reports/${projectName}`
  return {
    testMatch: ['<rootDir>/src/lib/**/*.spec.ts'],
    coverageDirectory: `${reportsRoot}/coverage`,
    collectCoverage: true,
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

module.exports = { createReportsConfig }
