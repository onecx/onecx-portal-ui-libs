import { isNamespaceImportInContent } from './is-namespace-import-in-content.utils'

describe('is-namespace-import-in-content.utils', () => {
  describe('isNamespaceImportInContent', () => {
    it('should return true for namespace import', () => {
      const fileContent = `import * as rxjs from 'rxjs';`

      const result = isNamespaceImportInContent(fileContent, 'rxjs')

      expect(result).toBe(true)
    })

    it('should return false for named import', () => {
      const fileContent = `import { map, filter } from 'rxjs/operators';`

      const result = isNamespaceImportInContent(fileContent, 'rxjs/operators')

      expect(result).toBe(false)
    })

    it('should return false when module is not imported', () => {
      const fileContent = `import { Component } from '@angular/core';`

      const result = isNamespaceImportInContent(fileContent, 'rxjs')

      expect(result).toBe(false)
    })

    it('should distinguish between namespace and default imports', () => {
      const fileContent = `import React from 'react'; import * as ReactDOM from 'react-dom';`

      expect(isNamespaceImportInContent(fileContent, 'react')).toBe(false)
      expect(isNamespaceImportInContent(fileContent, 'react-dom')).toBe(true)
    })

    it('should return false for empty content', () => {
      const result = isNamespaceImportInContent('', 'rxjs')

      expect(result).toBe(false)
    })

    it('should return false for invalid TypeScript syntax', () => {
      const fileContent = 'invalid typescript syntax {'

      const result = isNamespaceImportInContent(fileContent, 'rxjs')

      expect(result).toBe(false)
    })
  })
})
