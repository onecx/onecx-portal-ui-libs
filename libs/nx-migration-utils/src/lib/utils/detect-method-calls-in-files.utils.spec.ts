import { Tree } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { ast } from '@phenomnomnominal/tsquery'
import { detectMethodCallsInFiles, getParameterNames } from './detect-method-calls-in-files.utils'

describe('detect-method-calls-in-files.utils', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  describe('detectMethodCallsInFiles', () => {
    it('should handle files without matching method calls', () => {
      const fileContent = `
        import { MyService } from './my-service';
        
        export class Component {
          private service = new MyService();
          
          init() {
            this.service.differentMethod();
          }
        }
      `

      tree.write('/src/component.ts', fileContent)

      const result = detectMethodCallsInFiles(tree, '/src', 'doSomething', 'MyService')

      expect(result.size).toBe(0)
    })

    it('should handle files without the specified class', () => {
      const fileContent = `
        import { DifferentService } from './different-service';
        
        export class Component {
          private service = new DifferentService();
          
          init() {
            this.service.doSomething();
          }
        }
      `

      tree.write('/src/component.ts', fileContent)

      const result = detectMethodCallsInFiles(tree, '/src', 'doSomething', 'MyService')

      expect(result.size).toBe(0)
    })

    it('should handle empty directory', () => {
      const result = detectMethodCallsInFiles(tree, '/empty', 'doSomething', 'MyService')

      expect(result.size).toBe(0)
    })

    it('should handle files with no content', () => {
      tree.write('/src/empty.ts', '')

      const result = detectMethodCallsInFiles(tree, '/src', 'doSomething', 'MyService')

      expect(result.size).toBe(0)
    })

    it('should ignore non-TypeScript files', () => {
      tree.write('/src/test.js', 'console.log("Hello");')
      tree.write('/src/test.html', '<div>Hello</div>')

      const result = detectMethodCallsInFiles(tree, '/src', 'doSomething', 'MyService')

      expect(result.size).toBe(0)
    })

    it('should handle invalid TypeScript syntax gracefully', () => {
      tree.write('/src/invalid.ts', 'invalid typescript syntax {')

      expect(() => {
        detectMethodCallsInFiles(tree, '/src', 'doSomething', 'MyService')
      }).not.toThrow()
    })
  })

  describe('getParameterNames', () => {
    it('should extract parameter names with type reference', () => {
      const sourceFile = ast(`
        export class Component {
          constructor(private myService: MyService, public anotherService: MyService) {}
        }
      `)

      const parameterNames = getParameterNames(sourceFile, 'MyService')

      expect(parameterNames).toContain('myService')
      expect(parameterNames).toContain('anotherService')
      expect(parameterNames).toHaveLength(2)
    })

    it('should return empty array when no parameters with type found', () => {
      const sourceFile = ast(`
        export class Component {
          constructor(private otherService: OtherService) {}
        }
      `)

      const parameterNames = getParameterNames(sourceFile, 'MyService')

      expect(parameterNames).toHaveLength(0)
    })

    it('should handle functions with typed parameters', () => {
      const sourceFile = ast(`
        function processService(service: MyService, data: string) {
          return service.process(data);
        }
      `)

      const parameterNames = getParameterNames(sourceFile, 'MyService')

      expect(parameterNames).toContain('service')
      expect(parameterNames).toHaveLength(1)
    })

    it('should handle empty source file', () => {
      const sourceFile = ast('')

      const parameterNames = getParameterNames(sourceFile, 'MyService')

      expect(parameterNames).toHaveLength(0)
    })

    it('should handle source file without functions or constructors', () => {
      const sourceFile = ast(`
        export const value = 'test';
        export interface MyInterface {}
      `)

      const parameterNames = getParameterNames(sourceFile, 'MyService')

      expect(parameterNames).toHaveLength(0)
    })
  })
})
