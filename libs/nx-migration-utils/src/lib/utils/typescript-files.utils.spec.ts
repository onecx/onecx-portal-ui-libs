import { fileMatchesQuery, removeEmptySlotsFromArrays, isFilePath } from './typescript-files.utils'

describe('typescript-files.utils', () => {
  describe('fileMatchesQuery', () => {
    it('should return true when file content matches query', () => {
      const fileContent = `
        import { Component } from '@angular/core';
        
        @Component({
          selector: 'app-test'
        })
        export class TestComponent {}
      `
      const query = 'Identifier[name="Component"]'

      const result = fileMatchesQuery(fileContent, query)

      expect(result).toBe(true)
    })

    it('should return false when file content does not match query', () => {
      const fileContent = `
        export class TestService {}
      `
      const query = 'Identifier[name="Component"]'

      const result = fileMatchesQuery(fileContent, query)

      expect(result).toBe(false)
    })

    it('should return true for complex tsquery selector', () => {
      const fileContent = `
        @NgModule({
          imports: [CommonModule],
          declarations: [TestComponent]
        })
        export class TestModule {}
      `
      const query = 'Decorator:has(Identifier[name="NgModule"])'

      const result = fileMatchesQuery(fileContent, query)

      expect(result).toBe(true)
    })

    it('should return false for invalid TypeScript syntax', () => {
      const fileContent = 'invalid typescript syntax {'
      const query = 'Identifier[name="Component"]'

      const result = fileMatchesQuery(fileContent, query)

      expect(result).toBe(false)
    })

    it('should return false for empty content', () => {
      const fileContent = ''
      const query = 'Identifier[name="Component"]'

      const result = fileMatchesQuery(fileContent, query)

      expect(result).toBe(false)
    })

    it('should handle import statements with specific module', () => {
      const fileContent = `
        import { TestService } from './test.service';
        import { Component } from '@angular/core';
      `
      const query = 'ImportDeclaration:has(StringLiteral[value="@angular/core"])'

      const result = fileMatchesQuery(fileContent, query)

      expect(result).toBe(true)
    })
  })

  describe('removeEmptySlotsFromArrays', () => {
    it('should remove empty slots from array literals', () => {
      const code = 'const arr = [1, , 2, , 3];'

      const result = removeEmptySlotsFromArrays(code)

      expect(result).toContain('[1, 2, 3]')
      expect(result).not.toContain(',,')
    })

    it('should handle multiple arrays with empty slots', () => {
      const code = `
        const arr1 = [1, , 2];
        const arr2 = [, 'a', , 'b', ];
      `

      const result = removeEmptySlotsFromArrays(code)

      expect(result).toContain('[1, 2]')
      expect(result).toContain("['a', 'b']")
    })

    it('should not modify arrays without empty slots', () => {
      const code = 'const arr = [1, 2, 3];'

      const result = removeEmptySlotsFromArrays(code)

      expect(result).toBe(code)
    })

    it('should handle empty arrays', () => {
      const code = 'const arr = [];'

      const result = removeEmptySlotsFromArrays(code)

      expect(result).toBe(code)
    })

    it('should handle arrays with only empty slots', () => {
      const code = 'const arr = [, , ,];'

      const result = removeEmptySlotsFromArrays(code)

      expect(result).toContain('[]')
    })

    it('should handle nested arrays with empty slots', () => {
      const code = 'const arr = [[1, , 2], [, 3, ]];'

      const result = removeEmptySlotsFromArrays(code)

      expect(result).toContain('[1, 2]')
      expect(result).toContain('[3]')
    })

    it('should handle complex TypeScript constructs with arrays', () => {
      const code = `
        class TestClass {
          items = [1, , 2];
          method() {
            return [, 'a', , 'b'];
          }
        }
      `

      const result = removeEmptySlotsFromArrays(code)

      expect(result).toContain('[1, 2]')
      expect(result).toContain("['a', 'b']")
    })
  })

  describe('isFilePath', () => {
    it('should return true for absolute paths with extension', () => {
      expect(isFilePath('/home/user/file.ts')).toBe(true)
    })

    it('should return true for relative paths with extension', () => {
      expect(isFilePath('./src/file.ts')).toBe(true)
      expect(isFilePath('../lib/utils.js')).toBe(true)
      expect(isFilePath('src/components/test.component.ts')).toBe(true)
    })

    it('should return false for paths without extension', () => {
      expect(isFilePath('/home/user/directory')).toBe(false)
      expect(isFilePath('./src/components')).toBe(false)
      expect(isFilePath('src/lib')).toBe(false)
    })

    it('should return false for simple strings without path separators', () => {
      expect(isFilePath('filename.ts')).toBe(false)
      expect(isFilePath('component')).toBe(false)
      expect(isFilePath('test')).toBe(false)
    })

    it('should return true for various file extensions', () => {
      expect(isFilePath('./file.html')).toBe(true)
      expect(isFilePath('src/style.css')).toBe(true)
      expect(isFilePath('/config/app.json')).toBe(true)
      expect(isFilePath('../docs/readme.md')).toBe(true)
    })

    it('should return false for empty string', () => {
      expect(isFilePath('')).toBe(false)
    })

    it('should return false for strings with extension but no path separators', () => {
      expect(isFilePath('file.ts')).toBe(false)
      expect(isFilePath('component.html')).toBe(false)
    })
  })
})
