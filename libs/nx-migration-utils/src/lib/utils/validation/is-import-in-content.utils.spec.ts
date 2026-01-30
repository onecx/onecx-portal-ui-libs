import { isImportInContent } from './is-import-in-content.utils'

describe('is-import-in-content.utils', () => {
  describe('isImportInContent', () => {
    it('should return true when import from module exists', () => {
      const fileContent = `import { Component } from '@angular/core'; import { Observable } from 'rxjs';`

      expect(isImportInContent(fileContent, '@angular/core')).toBe(true)
      expect(isImportInContent(fileContent, 'rxjs')).toBe(true)
    })

    it('should return false when import from module does not exist', () => {
      const fileContent = `import { Component } from '@angular/core';`

      const result = isImportInContent(fileContent, 'lodash')

      expect(result).toBe(false)
    })

    it('should handle named imports', () => {
      const fileContent = `import { Component, Injectable } from '@angular/core';`

      const result = isImportInContent(fileContent, '@angular/core')

      expect(result).toBe(true)
    })

    it('should handle namespace imports', () => {
      const fileContent = `import * as rxjs from 'rxjs';`

      const result = isImportInContent(fileContent, 'rxjs')

      expect(result).toBe(true)
    })

    it('should handle default imports', () => {
      const fileContent = `import React from 'react';`

      const result = isImportInContent(fileContent, 'react')

      expect(result).toBe(true)
    })

    it('should handle mixed import types', () => {
      const fileContent = `import React, { useState } from 'react'; import * as rxjs from 'rxjs';`

      expect(isImportInContent(fileContent, 'react')).toBe(true)
      expect(isImportInContent(fileContent, 'rxjs')).toBe(true)
    })

    it('should handle scoped packages', () => {
      const fileContent = `import { UserService } from '@onecx/angular-integration-interface';`

      expect(isImportInContent(fileContent, '@onecx/angular-integration-interface')).toBe(true)
    })

    it('should return false for empty content', () => {
      const result = isImportInContent('', '@angular/core')

      expect(result).toBe(false)
    })

    it('should be case sensitive for module paths', () => {
      const fileContent = `import { Component } from '@angular/core';`

      expect(isImportInContent(fileContent, '@angular/core')).toBe(true)
      expect(isImportInContent(fileContent, '@Angular/Core')).toBe(false)
    })

    it('should handle exact module path matching', () => {
      const fileContent = `import { Observable } from 'rxjs'; import { map } from 'rxjs/operators';`

      expect(isImportInContent(fileContent, 'rxjs')).toBe(true)
      expect(isImportInContent(fileContent, 'rxjs/operators')).toBe(true)
      expect(isImportInContent(fileContent, 'rxjs/op')).toBe(false)
    })

    it('should return false for invalid TypeScript syntax', () => {
      const fileContent = 'invalid typescript syntax {'

      const result = isImportInContent(fileContent, '@angular/core')

      expect(result).toBe(false)
    })
  })
})
