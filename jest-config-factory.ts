/**
 * Keeps the heap of Angular/jsdom-style test runs bounded: with a single CPU jest would run all suites in-band in one
 * process (default ~1GB heap) and memory grows per suite. Always use workers and recycle them once they hold on to memory.
 * Note: --runInBand / --maxWorkers=1 on the CLI disables workerIdleMemoryLimit.
 */
export function createWorkerMemoryConfig() {
  return {
    maxWorkers: 2,
    workerIdleMemoryLimit: '400MB',
  }
}

export function createReportsConfig(projectName: string) {
  const reportsRoot = `${process.cwd()}/reports/${projectName}`
  return {
    ...createWorkerMemoryConfig(),
    testMatch: ['<rootDir>/src/lib/**/*.spec.ts'],
    coverageDirectory: `${reportsRoot}/coverage`,
    collectCoverageFrom: [
      '<rootDir>/src/lib/**/*.{ts,js}',
      '!<rootDir>/src/lib/**/logger.utils.ts',
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
      'logger\\.utils\\.ts$',
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
