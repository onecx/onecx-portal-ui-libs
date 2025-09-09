export function createReportsConfig(projectName: string) {
  const reportsRoot = `${process.cwd()}/reports/${projectName}`

  // Explizit als Jest-Konfiguration deklarieren
  const config = {
    testMatch: ['<rootDir>/src/lib/**/*.spec.ts'],
    coverageDirectory: `${reportsRoot}/coverage`,
    collectCoverage: true,
    coverageReporters: ['json', ['lcov', { projectRoot: '/' }], 'text', 'text-summary', 'html'],
    reporters: [
      'default',
      [
        require.resolve('jest-sonar'),
        {
          outputDirectory: reportsRoot,
          outputName: 'sonarqube_report.xml',
          reportedFilePath: 'absolute',
        },
      ],
    ],
  }

  return config
}
