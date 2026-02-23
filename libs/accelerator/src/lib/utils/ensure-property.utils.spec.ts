import { ensureProperty } from './ensure-property.utils'

describe('ensureProperty', () => {
  describe('basic property setting', () => {
    it('should set a top-level property on an empty object', () => {
      const obj = {}
      ensureProperty(obj, ['name'], 'John')
      expect(obj).toEqual({ name: 'John' })
    })

    it('should set a top-level property on an existing object', () => {
      const obj = { existing: 'value' }
      ensureProperty(obj, ['name'], 'John')
      expect(obj).toEqual({ existing: 'value', name: 'John' })
    })

    it('should not overwrite an existing defined property', () => {
      const obj = { name: 'Jane' }
      ensureProperty(obj, ['name'], 'John')
      expect(obj).toEqual({ name: 'Jane' })
    })

    it('should set property if explicitly set to undefined', () => {
      const obj: any = { name: undefined }
      ensureProperty(obj, ['name'], 'John')
      expect(obj).toEqual({ name: 'John' })
    })
  })

  describe('nested property setting', () => {
    it('should create nested path and set value', () => {
      const obj = {}
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj).toEqual({ user: { name: 'John' } })
    })

    it('should create deeply nested path and set value', () => {
      const obj = {}
      ensureProperty(obj, ['user', 'profile', 'name'], 'John')
      expect(obj).toEqual({ user: { profile: { name: 'John' } } })
    })

    it('should preserve existing properties when creating nested path', () => {
      const obj = { existing: 'value' }
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj).toEqual({ existing: 'value', user: { name: 'John' } })
    })

    it('should preserve existing nested properties', () => {
      const obj = { user: { email: 'john@example.com' } }
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj).toEqual({ user: { email: 'john@example.com', name: 'John' } })
    })

    it('should handle multiple levels of nesting', () => {
      const obj = {}
      ensureProperty(obj, ['a', 'b', 'c', 'd'], 'value')
      expect(obj).toEqual({ a: { b: { c: { d: 'value' } } } })
    })
  })

  describe('overwriting non-object values', () => {
    it('should overwrite string with nested object', () => {
      const obj = { user: 'string' }
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj).toEqual({ user: { name: 'John' } })
    })

    it('should overwrite number with nested object', () => {
      const obj = { user: 42 }
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj).toEqual({ user: { name: 'John' } })
    })

    it('should overwrite boolean with nested object', () => {
      const obj = { user: true }
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj).toEqual({ user: { name: 'John' } })
    })

    it('should overwrite undefined with nested object', () => {
      const obj: any = { user: undefined }
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj).toEqual({ user: { name: 'John' } })
    })
  })

  describe('preserving existing object structures', () => {
    it('should replace null when creating nested path', () => {
      const obj = { user: null }
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj).toEqual({ user: { name: 'John' } })
    })

    it('should not overwrite existing objects', () => {
      const obj = { user: { email: 'test@example.com' } }
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj).toEqual({ user: { email: 'test@example.com', name: 'John' } })
    })

    it('should add property to existing arrays', () => {
      const obj = { user: [1, 2, 3] }
      ensureProperty(obj, ['user', 'name'], 'John')
      expect(obj.user).toHaveLength(3)
      expect((obj.user as any).name).toBe('John')
    })
  })

  describe('value types', () => {
    it('should set string values', () => {
      const obj = {}
      ensureProperty(obj, ['value'], 'text')
      expect(obj).toEqual({ value: 'text' })
    })

    it('should set number values', () => {
      const obj = {}
      ensureProperty(obj, ['value'], 42)
      expect(obj).toEqual({ value: 42 })
    })

    it('should set boolean values', () => {
      const obj = {}
      ensureProperty(obj, ['value'], true)
      expect(obj).toEqual({ value: true })
    })

    it('should set null values', () => {
      const obj = {}
      ensureProperty(obj, ['value'], null)
      expect(obj).toEqual({ value: null })
    })

    it('should set undefined values', () => {
      const obj = {}
      ensureProperty(obj, ['value'], undefined)
      expect(obj).toEqual({ value: undefined })
    })

    it('should set object values', () => {
      const obj = {}
      const value = { nested: 'object' }
      ensureProperty(obj, ['value'], value)
      expect(obj).toEqual({ value: { nested: 'object' } })
    })

    it('should set array values', () => {
      const obj = {}
      const value = [1, 2, 3]
      ensureProperty(obj, ['value'], value)
      expect(obj).toEqual({ value: [1, 2, 3] })
    })

    it('should replace null with initial value', () => {
      const obj = { value: null }
      ensureProperty(obj, ['value'], 'initial')
      expect(obj).toEqual({ value: 'initial' })
    })

    it('should not overwrite existing zero with initial value', () => {
      const obj = { value: 0 }
      ensureProperty(obj, ['value'], 42)
      expect(obj).toEqual({ value: 0 })
    })

    it('should not overwrite existing false with initial value', () => {
      const obj = { value: false }
      ensureProperty(obj, ['value'], true)
      expect(obj).toEqual({ value: false })
    })

    it('should not overwrite existing empty string with initial value', () => {
      const obj = { value: '' }
      ensureProperty(obj, ['value'], 'initial')
      expect(obj).toEqual({ value: '' })
    })
  })

  describe('numeric keys', () => {
    it('should handle numeric keys in path', () => {
      const obj = {}
      ensureProperty(obj, [0, 'name'], 'John')
      expect(obj).toEqual({ 0: { name: 'John' } })
    })

    it('should handle mixed string and numeric keys', () => {
      const obj = {}
      ensureProperty(obj, ['users', 0, 'name'], 'John')
      expect(obj).toEqual({ users: { 0: { name: 'John' } } })
    })
  })

  describe('edge cases', () => {
    it('should handle single element path', () => {
      const obj = {}
      ensureProperty(obj, ['key'], 'value')
      expect(obj).toEqual({ key: 'value' })
    })

    it('should handle empty path array', () => {
      const obj = { existing: 'value' }
      ensureProperty(obj, [], 'newValue')
      expect(obj).toEqual({ existing: 'value' })
    })

    it('should handle empty string as key', () => {
      const obj = {}
      ensureProperty(obj, [''], 'value')
      expect(obj).toEqual({ '': 'value' })
    })

    it('should handle empty string in nested path', () => {
      const obj = {}
      ensureProperty(obj, ['user', '', 'name'], 'John')
      expect(obj).toEqual({ user: { '': { name: 'John' } } })
    })

    it('should not mutate the path array', () => {
      const obj = {}
      const path = ['user', 'name'] as const
      ensureProperty(obj, path, 'John')
      expect(path).toEqual(['user', 'name'])
    })

    it('should handle complex nested object structures', () => {
      const obj = {
        level1: {
          existing: 'value',
          level2: {
            existing2: 'value2',
          },
        },
      }
      ensureProperty(obj, ['level1', 'level2', 'newProp'], 'newValue')
      expect(obj).toEqual({
        level1: {
          existing: 'value',
          level2: {
            existing2: 'value2',
            newProp: 'newValue',
          },
        },
      })
    })
  })

  describe('real-world usage examples', () => {
    it('should work with globalThis pattern', () => {
      const mockGlobal: any = {}
      ensureProperty(mockGlobal, ['myApp', 'config', 'debug'], false)
      expect(mockGlobal).toEqual({ myApp: { config: { debug: false } } })
    })

    it('should work with actual globalThis without type cast', () => {
      const testPropName = '__testEnsureProperty' + Date.now()
      
      ensureProperty(globalThis, [testPropName], { test: 'value' })
      
      expect((globalThis as any)[testPropName]).toEqual({ test: 'value' })
      
      // Cleanup
      delete (globalThis as any)[testPropName]
    })

    it('should work with globalThis nested properties without type cast', () => {
      const testPropName = '__testEnsurePropertyNested' + Date.now()
      
      ensureProperty(globalThis, [testPropName, 'nested', 'deep'], 'test')
      
      expect((globalThis as any)[testPropName]).toEqual({ nested: { deep: 'test' } })
      
      // Cleanup
      delete (globalThis as any)[testPropName]
    })

    it('should initialize configuration without overwriting', () => {
      const config: any = {}
      ensureProperty(config, ['database', 'host'], 'localhost')
      ensureProperty(config, ['database', 'port'], 5432)
      ensureProperty(config, ['database', 'host'], 'other-host')
      expect(config).toEqual({
        database: {
          host: 'localhost',
          port: 5432,
        },
      })
    })

    it('should safely initialize nested API response defaults', () => {
      const apiResponse: any = { data: { items: [] } }
      ensureProperty(apiResponse, ['data', 'metadata', 'total'], 0)
      ensureProperty(apiResponse, ['data', 'metadata', 'page'], 1)
      expect(apiResponse).toEqual({
        data: {
          items: [],
          metadata: {
            total: 0,
            page: 1,
          },
        },
      })
    })
  })
})