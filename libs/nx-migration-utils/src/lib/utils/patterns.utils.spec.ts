import {
  variableContainingIdentifierPattern,
  importPattern,
  importNamespacePattern,
  importNamedImportsPattern,
  importSpecifierPattern,
} from './patterns.utils'

describe('patterns.utils', () => {
  describe('variableContainingIdentifierPattern', () => {
    it('should create pattern for variable containing identifier', () => {
      const pattern = variableContainingIdentifierPattern('myVariable')

      expect(pattern).toBe('VariableDeclaration:has(Identifier[name=myVariable])')
    })

    it('should handle different identifier names', () => {
      expect(variableContainingIdentifierPattern('testId')).toBe('VariableDeclaration:has(Identifier[name=testId])')
      expect(variableContainingIdentifierPattern('ComponentRef')).toBe(
        'VariableDeclaration:has(Identifier[name=ComponentRef])'
      )
      expect(variableContainingIdentifierPattern('MY_CONSTANT')).toBe(
        'VariableDeclaration:has(Identifier[name=MY_CONSTANT])'
      )
    })

    it('should handle empty string', () => {
      const pattern = variableContainingIdentifierPattern('')

      expect(pattern).toBe('VariableDeclaration:has(Identifier[name=])')
    })
  })

  describe('importPattern', () => {
    it('should create pattern for import path', () => {
      const pattern = importPattern('@angular/core')

      expect(pattern).toBe('ImportDeclaration:has(StringLiteral[value=@angular/core])')
    })

    it('should handle relative import paths', () => {
      expect(importPattern('./my-service')).toBe('ImportDeclaration:has(StringLiteral[value=./my-service])')
      expect(importPattern('../utils/helper')).toBe('ImportDeclaration:has(StringLiteral[value=../utils/helper])')
    })

    it('should handle absolute import paths', () => {
      expect(importPattern('@onecx/angular-integration-interface')).toBe(
        'ImportDeclaration:has(StringLiteral[value=@onecx/angular-integration-interface])'
      )
      expect(importPattern('rxjs/operators')).toBe('ImportDeclaration:has(StringLiteral[value=rxjs/operators])')
    })

    it('should handle empty import path', () => {
      const pattern = importPattern('')

      expect(pattern).toBe('ImportDeclaration:has(StringLiteral[value=])')
    })
  })

  describe('importNamespacePattern', () => {
    it('should create pattern for namespace import', () => {
      const pattern = importNamespacePattern('rxjs')

      expect(pattern).toBe('ImportDeclaration:has(StringLiteral[value=rxjs]):has(NamespaceImport)')
    })

    it('should handle different module paths for namespace imports', () => {
      expect(importNamespacePattern('@angular/core')).toBe(
        'ImportDeclaration:has(StringLiteral[value=@angular/core]):has(NamespaceImport)'
      )
      expect(importNamespacePattern('./utils')).toBe(
        'ImportDeclaration:has(StringLiteral[value=./utils]):has(NamespaceImport)'
      )
    })
  })

  describe('importNamedImportsPattern', () => {
    it('should create pattern for named imports', () => {
      const pattern = importNamedImportsPattern('@angular/core')

      expect(pattern).toBe('ImportDeclaration:has(StringLiteral[value=@angular/core]) NamedImports')
    })

    it('should reuse importPattern logic', () => {
      const modulePath = '@onecx/test-module'
      const namedImportsPattern = importNamedImportsPattern(modulePath)
      const expectedImportPart = importPattern(modulePath)

      expect(namedImportsPattern).toBe(`${expectedImportPart} NamedImports`)
    })

    it('should handle various module paths', () => {
      expect(importNamedImportsPattern('lodash')).toBe(
        'ImportDeclaration:has(StringLiteral[value=lodash]) NamedImports'
      )
      expect(importNamedImportsPattern('./service')).toBe(
        'ImportDeclaration:has(StringLiteral[value=./service]) NamedImports'
      )
    })
  })

  describe('importSpecifierPattern', () => {
    it('should create pattern for specific import specifier', () => {
      const pattern = importSpecifierPattern('@angular/core', 'Component')

      expect(pattern).toBe(
        'ImportDeclaration:has(StringLiteral[value=@angular/core]):has(ImportSpecifier:has(Identifier[name=Component]))'
      )
    })

    it('should handle different specifiers from same module', () => {
      const modulePath = '@angular/core'

      expect(importSpecifierPattern(modulePath, 'Injectable')).toBe(
        'ImportDeclaration:has(StringLiteral[value=@angular/core]):has(ImportSpecifier:has(Identifier[name=Injectable]))'
      )
      expect(importSpecifierPattern(modulePath, 'NgModule')).toBe(
        'ImportDeclaration:has(StringLiteral[value=@angular/core]):has(ImportSpecifier:has(Identifier[name=NgModule]))'
      )
    })

    it('should handle relative imports with specifiers', () => {
      const pattern = importSpecifierPattern('./my-service', 'MyService')

      expect(pattern).toBe(
        'ImportDeclaration:has(StringLiteral[value=./my-service]):has(ImportSpecifier:has(Identifier[name=MyService]))'
      )
    })

    it('should handle custom module specifiers', () => {
      const pattern = importSpecifierPattern('@onecx/angular-integration-interface', 'UserService')

      expect(pattern).toBe(
        'ImportDeclaration:has(StringLiteral[value=@onecx/angular-integration-interface]):has(ImportSpecifier:has(Identifier[name=UserService]))'
      )
    })

    it('should handle empty specifier', () => {
      const pattern = importSpecifierPattern('@angular/core', '')

      expect(pattern).toBe(
        'ImportDeclaration:has(StringLiteral[value=@angular/core]):has(ImportSpecifier:has(Identifier[name=]))'
      )
    })

    it('should handle empty module path', () => {
      const pattern = importSpecifierPattern('', 'Component')

      expect(pattern).toBe(
        'ImportDeclaration:has(StringLiteral[value=]):has(ImportSpecifier:has(Identifier[name=Component]))'
      )
    })
  })

  describe('pattern integration', () => {
    it('should create consistent patterns that can be combined', () => {
      const modulePath = '@angular/core'
      const basicImport = importPattern(modulePath)
      const namedImports = importNamedImportsPattern(modulePath)
      const specificImport = importSpecifierPattern(modulePath, 'Component')

      expect(namedImports).toContain(basicImport)
      expect(specificImport).toContain('ImportDeclaration:has(StringLiteral[value=@angular/core])')
    })

    it('should handle special characters in module paths', () => {
      const modulePaths = ['@scope/package-name', '@namespace/sub-package/deep', 'package.name', 'package_name']

      modulePaths.forEach((path) => {
        expect(importPattern(path)).toBe(`ImportDeclaration:has(StringLiteral[value=${path}])`)
        expect(importSpecifierPattern(path, 'Test')).toContain(`StringLiteral[value=${path}]`)
      })
    })
  })
})
