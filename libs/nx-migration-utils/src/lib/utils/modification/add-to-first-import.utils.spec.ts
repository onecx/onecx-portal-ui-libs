import { addToFirstImport } from './add-to-first-import.utils'

describe('addToFirstImport', () => {
  it('adds new specifier to existing named import', () => {
    const fileContent = `import { existingImport } from 'test-module';
export class Test {}`

    const result = addToFirstImport(fileContent, 'test-module', 'newImport')

    expect(result).toContain('existingImport')
    expect(result).toContain('newImport')
    expect(result).toContain("from 'test-module'")
  })

  it('does not duplicate existing import specifiers', () => {
    const fileContent = `import { existingImport, anotherImport } from 'test-module';`

    const result = addToFirstImport(fileContent, 'test-module', 'existingImport')

    // Should not duplicate existingImport
    const importMatches = result.match(/existingImport/g)
    expect(importMatches?.length).toBe(1)
  })

  it('handles single import specifier', () => {
    const fileContent = `import { singleImport } from 'single-module';`

    const result = addToFirstImport(fileContent, 'single-module', 'additionalImport')

    expect(result).toContain('singleImport')
    expect(result).toContain('additionalImport')
  })

  it('returns unchanged content if import path does not match', () => {
    const fileContent = `import { someImport } from 'other-module';`

    const result = addToFirstImport(fileContent, 'different-module', 'newImport')

    expect(result).toBe(fileContent)
  })

  it('works with complex import statements', () => {
    const fileContent = `import { ComponentA, ComponentB, ServiceX } from '@angular/core';
import { Observable } from 'rxjs';`

    const result = addToFirstImport(fileContent, '@angular/core', 'Injectable')

    expect(result).toContain('ComponentA')
    expect(result).toContain('ComponentB')
    expect(result).toContain('ServiceX')
    expect(result).toContain('Injectable')
    expect(result).toContain("from '@angular/core'")
  })
})
