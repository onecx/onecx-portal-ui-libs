import { addNewImport } from './add-new-import.utils'

describe('addNewImport', () => {
  it('adds a new import statement at the beginning of file', () => {
    const fileContent = `export class TestClass {}`
    const result = addNewImport(fileContent, 'my-module', ['myFunction'])

    expect(result).toBe(`import {myFunction} from 'my-module'\nexport class TestClass {}`)
  })

  it('adds multiple import specifiers', () => {
    const fileContent = `const x = 1;`
    const result = addNewImport(fileContent, 'utilities', ['func1', 'func2', 'func3'])

    expect(result).toBe(`import {func1,func2,func3} from 'utilities'\nconst x = 1;`)
  })

  it('handles empty import specifiers array', () => {
    const fileContent = `// some comment`
    const result = addNewImport(fileContent, 'empty-module', [])

    expect(result).toBe(`import {} from 'empty-module'\n// some comment`)
  })

  it('works with empty file content', () => {
    const fileContent = ''
    const result = addNewImport(fileContent, 'test-module', ['testFunction'])

    expect(result).toBe(`import {testFunction} from 'test-module'\n`)
  })

  it('preserves existing content with newlines', () => {
    const fileContent = `line1\nline2\nline3`
    const result = addNewImport(fileContent, '@angular/core', ['Component'])

    expect(result).toBe(`import {Component} from '@angular/core'\nline1\nline2\nline3`)
  })
})
