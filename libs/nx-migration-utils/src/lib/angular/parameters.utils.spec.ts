import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { removeParameters } from './parameters.utils'

describe('removeParameters', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should remove specified parameters from constructors', () => {
    tree.write(
      '/src/component.ts',
      `
      export class MyComponent {
        constructor(private http: HttpClient) {}
      }
      `
    )

    removeParameters(tree, '/src', ['HttpClient'])

    const result = tree.read('/src/component.ts', 'utf-8')
    expect(result).toBeDefined()
    expect(result).not.toContain('HttpClient')
    expect(result).not.toContain('private http')
    expect(result).toContain('constructor')
  })

  it('should handle multiple parameters', () => {
    tree.write(
      '/src/multi-service.ts',
      `
      export class MultiService {
        constructor(
          private client1: HttpClient,
          private client2: HttpClient,
          private logger: Logger
        ) {}
      }
      `
    )

    removeParameters(tree, '/src', ['HttpClient'])

    const result = tree.read('/src/multi-service.ts', 'utf-8')
    expect(result).toBeDefined()
    // HttpClient parameters should be removed
    expect(result).not.toContain('HttpClient')
    expect(result).not.toContain('client1')
    expect(result).not.toContain('client2')
    // Logger should remain
    expect(result).toContain('Logger')
    expect(result).toContain('logger')
  })

  it('should handle classes without constructors', () => {
    tree.write(
      '/src/no-constructor.ts',
      `
      export class NoConstructorClass {
        method() {}
      }
      `
    )

    removeParameters(tree, '/src', ['HttpClient'])

    const result = tree.read('/src/no-constructor.ts', 'utf-8')
    expect(result).toBeDefined()
    // File should remain unchanged
    expect(result).toContain('NoConstructorClass')
    expect(result).toContain('method() {}')
    expect(result).not.toContain('constructor')
  })

  it('should handle empty constructors', () => {
    tree.write(
      '/src/empty-constructor.ts',
      `
      export class EmptyConstructorClass {
        constructor() {}
      }
      `
    )

    removeParameters(tree, '/src', ['HttpClient'])

    const result = tree.read('/src/empty-constructor.ts', 'utf-8')
    expect(result).toBeDefined()
    // Should remain unchanged since no parameters to remove
    expect(result).toContain('constructor() {}')
    expect(result).toContain('EmptyConstructorClass')
  })

  it('should work with filter query', () => {
    tree.write(
      '/src/service.ts',
      `
      @Injectable()
      export class ServiceClass {
        constructor(private http: HttpClient) {}
      }
      `
    )

    expect(() => {
      removeParameters(tree, '/src', ['HttpClient'], '@Injectable')
    }).not.toThrow()
  })

  it('should handle complex generic types', () => {
    tree.write(
      '/src/generic-service.ts',
      `
      export class GenericService {
        constructor(
          private observable: Observable<string>,
          private client: HttpClient,
          private subject: Subject<number>
        ) {}
      }
      `
    )

    expect(() => {
      removeParameters(tree, '/src', ['HttpClient'])
    }).not.toThrow()
  })
})
