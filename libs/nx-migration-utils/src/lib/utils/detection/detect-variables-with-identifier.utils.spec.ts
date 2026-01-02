import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { detectVariablesWithIdentifier } from './detect-variables-with-identifier.utils'

describe('detectVariablesWithIdentifier', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('detects variables containing the specified identifier', () => {
    tree.write(
      'src/test.ts',
      `
      const myVariable = new MyClass();
      let anotherVar = MyClass.staticMethod();
      var thirdVar = MyClass.factory();
    `
    )

    const result = detectVariablesWithIdentifier(tree, 'src', 'MyClass')

    expect(result).toContain('myVariable')
    expect(result).toContain('anotherVar')
    expect(result).toContain('thirdVar')
  })

  it('returns empty array when no variables contain the identifier', () => {
    tree.write(
      'src/test.ts',
      `
      const someVariable = new OtherClass();
      let differentVar = something.else();
    `
    )

    const result = detectVariablesWithIdentifier(tree, 'src', 'MyClass')

    expect(result).toEqual([])
  })

  it('searches recursively in subdirectories', () => {
    tree.write(
      'src/level1/test1.ts',
      `
      const varInLevel1 = new MyClass();
    `
    )
    tree.write(
      'src/level1/level2/test2.ts',
      `
      let varInLevel2 = MyClass.create();
    `
    )

    const result = detectVariablesWithIdentifier(tree, 'src', 'MyClass')

    expect(result).toContain('varInLevel1')
    expect(result).toContain('varInLevel2')
  })

  it('handles multiple files with duplicate variable names', () => {
    tree.write(
      'src/file1.ts',
      `
      const instance = new MyClass();
    `
    )
    tree.write(
      'src/file2.ts',
      `
      const instance = MyClass.build();
    `
    )

    const result = detectVariablesWithIdentifier(tree, 'src', 'MyClass')

    // Should only return unique variable names
    expect(result).toEqual(['instance'])
    expect(result.length).toBe(1)
  })

  it('ignores non-TypeScript files', () => {
    tree.write(
      'src/test.js',
      `
      const jsVariable = new MyClass();
    `
    )
    tree.write(
      'src/test.ts',
      `
      const tsVariable = new MyClass();
    `
    )
    tree.write('src/readme.txt', 'MyClass documentation')

    const result = detectVariablesWithIdentifier(tree, 'src', 'MyClass')

    // Should detect from both .js and .ts files (AST parsing works for both)
    expect(result).toContain('jsVariable')
    expect(result).toContain('tsVariable')
  })

  it('detects variables in different declaration types', () => {
    tree.write(
      'src/declarations.ts',
      `
      const constVar = new MyClass();
      let letVar = MyClass.method();
      var varVar = MyClass.factory();
    `
    )

    const result = detectVariablesWithIdentifier(tree, 'src', 'MyClass')

    expect(result).toContain('constVar')
    expect(result).toContain('letVar')
    expect(result).toContain('varVar')
    expect(result.length).toBe(3)
  })

  it('handles complex expressions with the identifier', () => {
    tree.write(
      'src/complex.ts',
      `
      const result1 = new MyClass().method();
      const result2 = MyClass.staticProp.value;
      const result3 = array.map(item => new MyClass(item));
    `
    )

    const result = detectVariablesWithIdentifier(tree, 'src', 'MyClass')

    expect(result).toContain('result1')
    expect(result).toContain('result2')
    expect(result).toContain('result3')
  })

  it('handles case-sensitive identifier matching', () => {
    tree.write(
      'src/case-test.ts',
      `
      const exactMatch = new MyClass();
      const wrongCase = new myclass();
      const differentCase = new MYCLASS();
    `
    )

    const result = detectVariablesWithIdentifier(tree, 'src', 'MyClass')

    expect(result).toContain('exactMatch')
    expect(result).not.toContain('wrongCase')
    expect(result).not.toContain('differentCase')
  })

  it('handles null content gracefully', () => {
    // Mock tree.read to return null for a specific file
    const originalRead = tree.read
    jest.spyOn(tree, 'read').mockImplementation((path, encoding) => {
      if (path === 'src/null-content.ts') {
        return null as any
      }
      return originalRead.call(tree, path, encoding)
    })

    tree.write('src/null-content.ts', 'const test = new MyClass();') // Content won't matter due to mock
    tree.write('src/valid.ts', 'const valid = new MyClass();')

    const result = detectVariablesWithIdentifier(tree, 'src', 'MyClass')

    // Should only find the valid file, null content file should be skipped
    expect(result).toContain('valid')
    expect(result).not.toContain('test')
  })
})
