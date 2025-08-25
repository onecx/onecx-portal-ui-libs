import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import warnRemovePropertiesFromThemeService from './warn-removed-properties-from-theme-service'
import { printWarnings, detectMethodCallsInFiles, detectPropertyAccessInFiles } from '../../../nx-migration-utils'

// Mock the utilities from nx-migration-utils
jest.mock('@onecx/nx-migration-utils', () => ({
  printWarnings: jest.fn(),
  detectMethodCallsInFiles: jest.fn(),
  detectPropertyAccessInFiles: jest.fn(),
}))

const mockPrintWarnings = printWarnings as jest.MockedFunction<typeof printWarnings>
const mockDetectMethodCallsInFiles = detectMethodCallsInFiles as jest.MockedFunction<typeof detectMethodCallsInFiles>
const mockDetectPropertyAccessInFiles = detectPropertyAccessInFiles as jest.MockedFunction<
  typeof detectPropertyAccessInFiles
>

describe('warn-removed-properties-from-theme-service', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
    mockPrintWarnings.mockClear()
    mockDetectMethodCallsInFiles.mockClear()
    mockDetectPropertyAccessInFiles.mockClear()
  })

  describe('ThemeService property detection', () => {
    it('should detect baseUrlV1 property usage', async () => {
      const filePath = 'src/app/component.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {
            console.log(this.themeService.baseUrlV1);
          }
        }
      `
      )

      // Mock property access detected
      const mockPropertyAccess = {} as any
      mockDetectPropertyAccessInFiles.mockReturnValue(new Map([[filePath, [mockPropertyAccess]]]))
      // Mock no method calls detected
      mockDetectMethodCallsInFiles.mockReturnValue(new Map())

      await warnRemovePropertiesFromThemeService(tree)

      expect(mockDetectPropertyAccessInFiles).toHaveBeenCalledWith(tree, 'src', 'baseUrlV1', 'ThemeService')
      expect(mockPrintWarnings).toHaveBeenCalledWith(
        expect.stringContaining('ThemeService properties [baseUrlV1] have been removed'),
        [filePath]
      )
    })

    it('should not warn when no property usage is detected', async () => {
      const filePath = 'src/app/component.ts'
      tree.write(
        filePath,
        `
        export class AppComponent {
          constructor() {}
        }
      `
      )

      // Mock no property access detected
      mockDetectPropertyAccessInFiles.mockReturnValue(new Map())
      // Mock no method calls detected
      mockDetectMethodCallsInFiles.mockReturnValue(new Map())

      await warnRemovePropertiesFromThemeService(tree)

      expect(mockPrintWarnings).not.toHaveBeenCalled()
    })
  })

  describe('ThemeService method detection', () => {
    it('should detect getThemeRef method usage', async () => {
      const filePath = 'src/app/theme.component.ts'
      tree.write(
        filePath,
        `
        export class ThemeComponent {
          constructor(private themeService: ThemeService) {}
  
          loadTheme() {
            const themeRef = this.themeService.getThemeRef('dark');
            return themeRef;
          }
        }
      `
      )

      // Mock method calls detected for getThemeRef
      const mockCallExpression = {} as any // Mock CallExpression
      mockDetectMethodCallsInFiles
        .mockReturnValueOnce(new Map([[filePath, [mockCallExpression]]])) // getThemeRef
        .mockReturnValueOnce(new Map()) // loadAndApplyTheme
        .mockReturnValueOnce(new Map()) // apply
      // Mock no property access detected
      mockDetectPropertyAccessInFiles.mockReturnValue(new Map())

      await warnRemovePropertiesFromThemeService(tree)

      expect(mockDetectMethodCallsInFiles).toHaveBeenCalledWith(tree, 'src', 'getThemeRef', 'ThemeService')
      expect(mockDetectMethodCallsInFiles).toHaveBeenCalledWith(tree, 'src', 'loadAndApplyTheme', 'ThemeService')
      expect(mockDetectMethodCallsInFiles).toHaveBeenCalledWith(tree, 'src', 'apply', 'ThemeService')

      expect(mockPrintWarnings).toHaveBeenCalledWith(
        expect.stringContaining('ThemeService methods [getThemeRef, loadAndApplyTheme, apply] have been removed'),
        [filePath]
      )
    })

    it('should detect loadAndApplyTheme method usage', async () => {
      const filePath = 'src/app/theme-loader.ts'
      tree.write(
        filePath,
        `
        export class ThemeLoader {
          constructor(private themeService: ThemeService) {}
  
          async applyTheme(themeName: string) {
            await this.themeService.loadAndApplyTheme(themeName);
          }
        }
      `
      )

      const mockCallExpression = {} as any
      mockDetectMethodCallsInFiles
        .mockReturnValueOnce(new Map()) // getThemeRef
        .mockReturnValueOnce(new Map([[filePath, [mockCallExpression]]])) // loadAndApplyTheme
        .mockReturnValueOnce(new Map()) // apply
      mockDetectPropertyAccessInFiles.mockReturnValue(new Map())

      await warnRemovePropertiesFromThemeService(tree)

      expect(mockPrintWarnings).toHaveBeenCalledWith(
        expect.stringContaining('ThemeService methods [getThemeRef, loadAndApplyTheme, apply] have been removed'),
        [filePath]
      )
    })

    it('should detect apply method usage', async () => {
      const filePath = 'src/app/theme-applier.ts'
      tree.write(
        filePath,
        `
        export class ThemeApplier {
          constructor(private themeService: ThemeService) {}
  
          applyCustomTheme() {
            this.themeService.apply({ primaryColor: '#ff0000' });
          }
        }
      `
      )

      const mockCallExpression = {} as any
      mockDetectMethodCallsInFiles
        .mockReturnValueOnce(new Map()) // getThemeRef
        .mockReturnValueOnce(new Map()) // loadAndApplyTheme
        .mockReturnValueOnce(new Map([[filePath, [mockCallExpression]]])) // apply
      mockDetectPropertyAccessInFiles.mockReturnValue(new Map())

      await warnRemovePropertiesFromThemeService(tree)

      expect(mockPrintWarnings).toHaveBeenCalledWith(
        expect.stringContaining('ThemeService methods [getThemeRef, loadAndApplyTheme, apply] have been removed'),
        [filePath]
      )
    })

    it('should detect multiple method usages across different files', async () => {
      const file1 = 'src/app/file1.ts'
      const file2 = 'src/app/file2.ts'

      tree.write(
        file1,
        `
        export class File1 {
          constructor(private themeService: ThemeService) {}
  
          test() {
            this.themeService.getThemeRef('test');
          }
        }
      `
      )

      tree.write(
        file2,
        `
        export class File2 {
          constructor(private themeService: ThemeService) {}
  
          test() {
            this.themeService.apply({});
          }
        }
      `
      )

      const mockCallExpression = {} as any
      mockDetectMethodCallsInFiles
        .mockReturnValueOnce(new Map([[file1, [mockCallExpression]]])) // getThemeRef
        .mockReturnValueOnce(new Map()) // loadAndApplyTheme
        .mockReturnValueOnce(new Map([[file2, [mockCallExpression]]])) // apply
      mockDetectPropertyAccessInFiles.mockReturnValue(new Map())

      await warnRemovePropertiesFromThemeService(tree)

      expect(mockPrintWarnings).toHaveBeenCalledWith(
        expect.stringContaining('ThemeService methods [getThemeRef, loadAndApplyTheme, apply] have been removed'),
        expect.arrayContaining([file1, file2])
      )
    })
  })

  describe('Combined property and method detection', () => {
    it('should detect both property and method usages in same file', async () => {
      const filePath = 'src/app/complex-theme.service.ts'
      tree.write(
        filePath,
        `
        export class ComplexThemeService {
          constructor(private themeService: ThemeService) {}
  
          manageThemes() {
            const ref = this.themeService.getThemeRef('light');
            this.themeService.loadAndApplyTheme('dark');
            this.themeService.apply({ theme: 'custom' });
            console.log(this.themeService.baseUrlV1);
          }
        }
      `
      )

      const mockCallExpression = {} as any
      const mockPropertyAccess = {} as any

      // Mock both property and method detection
      mockDetectPropertyAccessInFiles.mockReturnValue(new Map([[filePath, [mockPropertyAccess]]]))
      mockDetectMethodCallsInFiles
        .mockReturnValueOnce(new Map([[filePath, [mockCallExpression]]])) // getThemeRef
        .mockReturnValueOnce(new Map()) // loadAndApplyTheme
        .mockReturnValueOnce(new Map()) // apply

      await warnRemovePropertiesFromThemeService(tree)

      expect(mockPrintWarnings).toHaveBeenCalledTimes(2)
      expect(mockPrintWarnings).toHaveBeenCalledWith(
        expect.stringContaining('ThemeService properties [baseUrlV1] have been removed'),
        [filePath]
      )
      expect(mockPrintWarnings).toHaveBeenCalledWith(
        expect.stringContaining('ThemeService methods [getThemeRef, loadAndApplyTheme, apply] have been removed'),
        [filePath]
      )
    })
  })

  describe('Pattern consistency with warnUserServiceHasPermission', () => {
    it('should follow the same pattern as warnUserServiceHasPermission', async () => {
      const filePath = 'src/app/test.ts'
      tree.write(filePath, 'export class Test {}')

      // Mock some detection
      const mockCallExpression = {} as any
      mockDetectMethodCallsInFiles
        .mockReturnValueOnce(new Map([[filePath, [mockCallExpression]]]))
        .mockReturnValueOnce(new Map())
        .mockReturnValueOnce(new Map())
      mockDetectPropertyAccessInFiles.mockReturnValue(new Map())

      await warnRemovePropertiesFromThemeService(tree)

      // Verify the pattern: use detectMethodCallsInFiles/detectPropertyAccessInFiles, collect affected files, print warnings
      expect(mockDetectMethodCallsInFiles).toHaveBeenCalledTimes(3) // Once for each method
      expect(mockDetectPropertyAccessInFiles).toHaveBeenCalledTimes(1) // Once for each property
      expect(mockPrintWarnings).toHaveBeenCalledTimes(1) // Once for methods (no properties detected)
    })

    it('should use the same utilities as the common migration functions', async () => {
      tree.write('src/app/test.ts', 'export class Test {}')

      mockDetectMethodCallsInFiles.mockReturnValue(new Map())
      mockDetectPropertyAccessInFiles.mockReturnValue(new Map())

      await warnRemovePropertiesFromThemeService(tree)

      // Verify we're using the same utilities as warnUserServiceHasPermission
      expect(mockDetectMethodCallsInFiles).toHaveBeenCalled()
      expect(mockDetectPropertyAccessInFiles).toHaveBeenCalled()
    })
  })
})
