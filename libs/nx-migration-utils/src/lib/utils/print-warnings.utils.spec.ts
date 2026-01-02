import { logger } from '@nx/devkit'
import { printWarnings } from './print-warnings.utils'

// Mock the logger
jest.mock('@nx/devkit', () => ({
  logger: {
    warn: jest.fn(),
  },
}))

describe('print-warnings.utils', () => {
  let mockLoggerWarn: jest.MockedFunction<typeof logger.warn>

  beforeEach(() => {
    mockLoggerWarn = logger.warn as jest.MockedFunction<typeof logger.warn>
    mockLoggerWarn.mockClear()
  })

  describe('printWarnings', () => {
    it('should print warning when there are affected files', () => {
      const warning = 'This feature is deprecated'
      const affectedFiles = ['src/app/component.ts', 'src/lib/service.ts']

      printWarnings(warning, affectedFiles)

      expect(mockLoggerWarn).toHaveBeenCalledTimes(1)
      expect(mockLoggerWarn).toHaveBeenCalledWith(
        'This feature is deprecated Found in: src/app/component.ts,src/lib/service.ts'
      )
    })

    it('should not print warning when there are no affected files', () => {
      const warning = 'This feature is deprecated'
      const affectedFiles: string[] = []

      printWarnings(warning, affectedFiles)

      expect(mockLoggerWarn).not.toHaveBeenCalled()
    })

    it('should handle single affected file', () => {
      const warning = 'Single file issue'
      const affectedFiles = ['src/app/single.ts']

      printWarnings(warning, affectedFiles)

      expect(mockLoggerWarn).toHaveBeenCalledWith('Single file issue Found in: src/app/single.ts')
    })

    it('should handle multiple affected files with correct comma separation', () => {
      const warning = 'Multiple files affected'
      const affectedFiles = ['src/app/file1.ts', 'src/lib/file2.ts', 'src/components/file3.ts', 'src/services/file4.ts']

      printWarnings(warning, affectedFiles)

      expect(mockLoggerWarn).toHaveBeenCalledWith(
        'Multiple files affected Found in: src/app/file1.ts,src/lib/file2.ts,src/components/file3.ts,src/services/file4.ts'
      )
    })

    it('should handle empty warning message', () => {
      const warning = ''
      const affectedFiles = ['src/app/test.ts']

      printWarnings(warning, affectedFiles)

      expect(mockLoggerWarn).toHaveBeenCalledWith(' Found in: src/app/test.ts')
    })

    it('should handle files with special characters in paths', () => {
      const warning = 'Special characters test'
      const affectedFiles = [
        'src/app/file-with-dashes.ts',
        'src/lib/file_with_underscores.ts',
        'src/components/file with spaces.ts',
        'src/services/file.with.dots.ts',
      ]

      printWarnings(warning, affectedFiles)

      expect(mockLoggerWarn).toHaveBeenCalledWith(
        'Special characters test Found in: src/app/file-with-dashes.ts,src/lib/file_with_underscores.ts,src/components/file with spaces.ts,src/services/file.with.dots.ts'
      )
    })

    it('should handle long warning messages', () => {
      const warning =
        'This is a very long warning message that explains in detail what the issue is and what needs to be done to fix it'
      const affectedFiles = ['src/app/component.ts']

      printWarnings(warning, affectedFiles)

      expect(mockLoggerWarn).toHaveBeenCalledWith(
        'This is a very long warning message that explains in detail what the issue is and what needs to be done to fix it Found in: src/app/component.ts'
      )
    })

    it('should handle many affected files', () => {
      const warning = 'Mass deprecation warning'
      const affectedFiles = Array.from({ length: 50 }, (_, i) => `src/file${i}.ts`)

      printWarnings(warning, affectedFiles)

      expect(mockLoggerWarn).toHaveBeenCalledTimes(1)
      expect(mockLoggerWarn).toHaveBeenCalledWith(expect.stringContaining('Mass deprecation warning Found in:'))
      expect(mockLoggerWarn).toHaveBeenCalledWith(expect.stringContaining('src/file0.ts,src/file1.ts'))
      expect(mockLoggerWarn).toHaveBeenCalledWith(expect.stringContaining('src/file49.ts'))
    })

    it('should handle absolute file paths', () => {
      const warning = 'Absolute paths warning'
      const affectedFiles = ['/home/user/project/src/app/component.ts']

      printWarnings(warning, affectedFiles)

      expect(mockLoggerWarn).toHaveBeenCalledWith(
        'Absolute paths warning Found in: /home/user/project/src/app/component.ts'
      )
    })
  })
})
