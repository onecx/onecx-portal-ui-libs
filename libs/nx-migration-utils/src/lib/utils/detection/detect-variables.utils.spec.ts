import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { detectVariables } from './detect-variables.utils'

describe('detectVariables', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should detect variables assigned to a string literal', () => {
    tree.write(
      'src/app/example.ts',
      `const myVar = 'myString';
       const anotherVar = 'anotherString';`
    )

    const result = detectVariables(tree, 'src/app', `VariableDeclaration:has(StringLiteral[value='myString'])`)

    expect(result).toHaveLength(1)
    expect(result[0].variableDeclaration.name.getText()).toBe('myVar')
  })

  it('should detect variables assigned to an object containing a specific value', () => {
    tree.write(
      'src/app/example.ts',
      `const myObject = { key: 'myString' };
       const anotherObject = { key: 'anotherString' };`
    )

    const result = detectVariables(
      tree,
      'src/app',
      `VariableDeclaration:has(ObjectLiteralExpression):has(StringLiteral[value='myString'])`
    )

    expect(result).toHaveLength(1)
    expect(result[0].variableDeclaration.name.getText()).toBe('myObject')
  })

  it('should detect variables assigned to an array containing a specific value', () => {
    tree.write(
      'src/app/example.ts',
      `const myArray = ['myString', 'anotherString'];
       const anotherArray = ['differentString'];`
    )

    const result = detectVariables(
      tree,
      'src/app',
      `VariableDeclaration:has(ArrayLiteralExpression):has(StringLiteral[value='myString'])`
    )

    expect(result).toHaveLength(1)
    expect(result[0].variableDeclaration.name.getText()).toBe('myArray')
  })

  it('should return an empty array if no variables match the specified value', () => {
    tree.write('src/app/example.ts', `const unrelatedVar = 'unrelatedString';`)

    const result = detectVariables(tree, 'src/app', `VariableDeclaration:has(StringLiteral[value='myString'])`)

    expect(result).toHaveLength(0)
  })

  it('should apply the filterQuery before detecting variables', () => {
    tree.write(
      'src/app/example.ts',
      `const myVar = 'myString';
       const anotherVar = 'anotherString';`
    )

    // filterQuery excludes files without a specific comment
    const result = detectVariables(
      tree,
      'src/app',
      `VariableDeclaration:has(StringLiteral[value='myString'])`,
      `VariableDeclaration:has(Identifier[name='nonExistent'])`
    )

    expect(result).toHaveLength(0)
  })
})
