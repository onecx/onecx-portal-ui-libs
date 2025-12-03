import { isImportSpecifierInContent } from './is-import-in-file-content.utils'

describe('is-import-in-file-content.utils', () => {
  describe('isImportSpecifierInContent', () => {
    it('should return true when import specifier exists', () => {
      const fileContent = `import { Component, Injectable } from '@angular/core';`

      const result = isImportSpecifierInContent(fileContent, '@angular/core', 'Component')

      expect(result).toBe(true)
    })

    it('should return false when import specifier does not exist', () => {
      const fileContent = `import { Component, Injectable } from '@angular/core';`

      const result = isImportSpecifierInContent(fileContent, '@angular/core', 'NgModule')

      expect(result).toBe(false)
    })

    it('should return false when module does not exist', () => {
      const fileContent = `import { Component } from '@angular/core';`

      const result = isImportSpecifierInContent(fileContent, 'rxjs', 'Observable')

      expect(result).toBe(false)
    })

    it('should handle multiple import specifiers from same module', () => {
      const fileContent = `import { Component, Injectable, NgModule } from '@angular/core';`

      expect(isImportSpecifierInContent(fileContent, '@angular/core', 'Component')).toBe(true)
      expect(isImportSpecifierInContent(fileContent, '@angular/core', 'Injectable')).toBe(true)
      expect(isImportSpecifierInContent(fileContent, '@angular/core', 'NgModule')).toBe(true)
      expect(isImportSpecifierInContent(fileContent, '@angular/core', 'Pipe')).toBe(false)
    })

    it('should return false for namespace imports', () => {
      const fileContent = `import * as rxjs from 'rxjs'; import { Component } from '@angular/core';`

      expect(isImportSpecifierInContent(fileContent, 'rxjs', 'Observable')).toBe(false)
      expect(isImportSpecifierInContent(fileContent, '@angular/core', 'Component')).toBe(true)
    })

    it('should return false for default imports', () => {
      const fileContent = `import React from 'react'; import { Component } from '@angular/core';`

      expect(isImportSpecifierInContent(fileContent, 'react', 'React')).toBe(false)
      expect(isImportSpecifierInContent(fileContent, '@angular/core', 'Component')).toBe(true)
    })

    it('should return false for empty content', () => {
      const result = isImportSpecifierInContent('', '@angular/core', 'Component')

      expect(result).toBe(false)
    })

    it('should be case sensitive', () => {
      const fileContent = `import { Component } from '@angular/core';`

      expect(isImportSpecifierInContent(fileContent, '@angular/core', 'Component')).toBe(true)
      expect(isImportSpecifierInContent(fileContent, '@angular/core', 'component')).toBe(false)
    })

    it('should return false for invalid TypeScript syntax', () => {
      const fileContent = 'invalid typescript syntax {'

      const result = isImportSpecifierInContent(fileContent, '@angular/core', 'Component')

      expect(result).toBe(false)
    })
  })
})
