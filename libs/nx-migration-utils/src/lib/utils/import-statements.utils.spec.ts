import { Tree } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { ast } from '@phenomnomnominal/tsquery'
import { ImportDeclaration, factory, isStringLiteral } from 'typescript'
import {
  removeImportsByModuleSpecifier,
  replaceImportModuleSpecifier,
  replaceImportValues,
  removeImportValuesFromModule,
  findImportDeclaration,
  getNamedImports,
  buildImportDeclaration,
} from './import-statements.utils'

describe('import-statements.utils', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  describe('removeImportsByModuleSpecifier', () => {
    it('should remove ESM import statements for a given module', () => {
      const fileContent = `import { Component } from '@angular/core';
import { Observable } from 'rxjs';
export class MyComponent {}`

      tree.write('/src/test.ts', fileContent)

      removeImportsByModuleSpecifier(tree, '/src', '@angular/core')

      const updatedContent = tree.read('/src/test.ts', 'utf-8')
      expect(updatedContent).not.toContain("import { Component } from '@angular/core'")
      expect(updatedContent).toContain("import { Observable } from 'rxjs'")
      expect(updatedContent).toContain('export class MyComponent')
    })

    it('should remove CommonJS require statements for a given module', () => {
      const fileContent = `const fs = require('fs');
const lodash = require('lodash');`

      tree.write('/src/test.ts', fileContent)

      removeImportsByModuleSpecifier(tree, '/src', 'lodash')

      const updatedContent = tree.read('/src/test.ts', 'utf-8')
      expect(updatedContent).toContain("const fs = require('fs')")
      expect(updatedContent).not.toContain("const lodash = require('lodash')")
    })
  })

  describe('replaceImportModuleSpecifier', () => {
    it('should replace ESM import module specifier', () => {
      const fileContent = `import { Component } from '@angular/core';`

      tree.write('/src/test.ts', fileContent)

      replaceImportModuleSpecifier(tree, '/src', '@angular/core', '@angular/core/new')

      const updatedContent = tree.read('/src/test.ts', 'utf-8')
      expect(updatedContent).toContain("import { Component } from '@angular/core/new'")
    })
  })

  describe('replaceImportValues', () => {
    it('should replace single named import value', () => {
      const fileContent = `import { Component } from '@angular/core';`

      tree.write('/src/test.ts', fileContent)

      replaceImportValues(tree, '/src', '@angular/core', 'Component', 'NewComponent')

      const updatedContent = tree.read('/src/test.ts', 'utf-8')
      expect(updatedContent).toContain('NewComponent')
      expect(updatedContent).not.toContain('{ Component }')
    })
  })

  describe('removeImportValuesFromModule', () => {
    it('should remove single named import', () => {
      const fileContent = `import { Component, Injectable } from '@angular/core';`

      tree.write('/src/test.ts', fileContent)

      removeImportValuesFromModule(tree, '/src', '@angular/core', 'Component')

      const updatedContent = tree.read('/src/test.ts', 'utf-8')
      expect(updatedContent).not.toContain('Component')
      expect(updatedContent).toContain('Injectable')
    })
  })

  describe('findImportDeclaration', () => {
    it('should find import declaration for given module', () => {
      const sourceFile = ast(`import { Component } from '@angular/core';`)

      const importDecl = findImportDeclaration(sourceFile, '@angular/core')

      expect(importDecl).toBeDefined()
      expect(isStringLiteral(importDecl!.moduleSpecifier)).toBe(true)
      expect((importDecl!.moduleSpecifier as any).text).toBe('@angular/core')
    })

    it('should return undefined when module not found', () => {
      const sourceFile = ast(`import { Observable } from 'rxjs';`)

      const importDecl = findImportDeclaration(sourceFile, '@angular/core')

      expect(importDecl).toBeUndefined()
    })
  })

  describe('getNamedImports', () => {
    it('should extract named imports from import declaration', () => {
      const sourceFile = ast(`import { Component, Injectable } from '@angular/core';`)
      const importDecl = sourceFile.statements[0] as ImportDeclaration

      const namedImports = getNamedImports(importDecl)

      expect(namedImports).toBeDefined()
      expect(namedImports!.elements).toHaveLength(2)
      expect(namedImports!.elements[0].name.text).toBe('Component')
      expect(namedImports!.elements[1].name.text).toBe('Injectable')
    })

    it('should return undefined for namespace imports', () => {
      const sourceFile = ast(`import * as Angular from '@angular/core';`)
      const importDecl = sourceFile.statements[0] as ImportDeclaration

      const namedImports = getNamedImports(importDecl)

      expect(namedImports).toBeUndefined()
    })
  })

  describe('buildImportDeclaration', () => {
    it('should build import declaration with specifiers', () => {
      const specifiers = [factory.createImportSpecifier(false, undefined, factory.createIdentifier('Component'))]

      const importDecl = buildImportDeclaration(specifiers, '@angular/core')

      expect(importDecl).toBeDefined()
      expect(isStringLiteral(importDecl!.moduleSpecifier)).toBe(true)
      expect((importDecl!.moduleSpecifier as any).text).toBe('@angular/core')
    })

    it('should return null for empty specifiers', () => {
      const importDecl = buildImportDeclaration([], '@angular/core')

      expect(importDecl).toBeNull()
    })
  })
})
