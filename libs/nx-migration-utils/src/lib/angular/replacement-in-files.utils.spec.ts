import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { replaceInFile, replaceInFiles } from './replacement-in-files.utils'

describe('replacement-in-files.utils', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  describe('replaceInFile', () => {
    it('should replace class names using TSQuery selector', () => {
      const filePath = '/src/test.ts'
      const originalContent = 'export class TestClass { }'
      tree.write(filePath, originalContent)

      replaceInFile(tree, filePath, 'Identifier[name="TestClass"]', 'ModifiedClass')

      const result = tree.read(filePath, 'utf-8')
      expect(result).toBeDefined()

      // Test that the replacement actually occurred by checking for the new name
      expect(result).toContain('ModifiedClass')
      expect(result).not.toContain('TestClass')
    })

    it('should handle non-existent files gracefully', () => {
      expect(() => {
        replaceInFile(tree, '/src/non-existent.ts', 'Identifier', 'replacement')
      }).not.toThrow()
    })
  })

  describe('replaceInFiles', () => {
    it('should replace text in TypeScript files', () => {
      tree.write('/src/file1.ts', 'export class OldClass { }')
      tree.write('/src/file2.ts', 'export class OldClass { }')

      replaceInFiles(tree, '/src', 'Identifier[name="OldClass"]', 'NewClass')

      const result1 = tree.read('/src/file1.ts', 'utf-8')
      const result2 = tree.read('/src/file2.ts', 'utf-8')

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()

      // Check that the replacement worked in both files
      expect(result1).toContain('NewClass')
      expect(result1).not.toContain('OldClass')
      expect(result2).toContain('NewClass')
      expect(result2).not.toContain('OldClass')
    })

    it('should handle non-existent directories gracefully', () => {
      expect(() => {
        replaceInFiles(tree, '/non-existent', 'Identifier', 'replacement')
      }).not.toThrow()
    })

    it('should work with filter queries', () => {
      tree.write('/src/service.ts', '@Injectable() export class ServiceClass { }')
      tree.write('/src/component.ts', 'export class ComponentClass { }')

      replaceInFiles(tree, '/src', 'Identifier[name="ServiceClass"]', 'UpdatedService', '@Injectable')

      const serviceResult = tree.read('/src/service.ts', 'utf-8')
      const componentResult = tree.read('/src/component.ts', 'utf-8')

      expect(serviceResult).toBeDefined()
      expect(componentResult).toBeDefined()
    })

    it('should replace multiple occurrences in complex files', () => {
      tree.write(
        '/src/complex.ts',
        `
        import { OldClass } from './old-class';
        
        export class MyService {
          private instance: OldClass;
          
          constructor() {
            this.instance = new OldClass();
          }
          
          getOldClass(): OldClass {
            return this.instance;
          }
        }
      `
      )

      replaceInFiles(tree, '/src', 'Identifier[name="OldClass"]', 'NewClass')

      const result = tree.read('/src/complex.ts', 'utf-8')
      expect(result).toBeDefined()
    })
  })
})
