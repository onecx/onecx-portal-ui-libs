import { DataAction } from '../model/data-action'
import {
  getRowLabel,
  getRowLabelFromFields,
  MAX_ROW_LABEL_LENGTH,
  truncateLabel,
  warnOnActionsWithoutLabelKey,
} from './row-action-label.utils'

describe('row-action-label utils', () => {
  describe('getRowLabel', () => {
    it('should prefer the first candidate field with a value', () => {
      expect(getRowLabel({ id: '1', name: 'A', title: 'B' }, ['title', 'name'])).toBe('B')
    })

    it('should skip undefined, empty and non-primitive candidates', () => {
      expect(
        getRowLabel({ id: '1', name: '  ', obj: {}, title: 'T' }, [undefined, 'missing', 'name', 'obj', 'title'])
      ).toBe('T')
    })

    it('should support nested paths and numbers', () => {
      expect(getRowLabel({ id: 1, a: { b: 42 } }, ['a.b'])).toBe('42')
    })

    it('should fall back to the id', () => {
      expect(getRowLabel({ id: 'row-7' }, ['name'])).toBe('row-7')
    })

    it('should return an empty string if nothing can be determined', () => {
      expect(getRowLabel({}, ['name'])).toBe('')
      expect(getRowLabel(undefined, ['name'])).toBe('')
    })
  })

  describe('getRowLabelFromFields', () => {
    it('should use the first candidate field with a primitive value', () => {
      expect(getRowLabelFromFields({ id: '1', obj: { a: 1 }, name: 'N' }, ['obj', 'name'])).toBe('N')
    })

    it('should not fall back to the id', () => {
      expect(getRowLabelFromFields({ id: 'row-7' }, ['name'])).toBe('')
      expect(getRowLabelFromFields(undefined, ['name'])).toBe('')
    })
  })

  describe('truncateLabel', () => {
    it('should keep short labels and collapse whitespace', () => {
      expect(truncateLabel('  a \n  b  ')).toBe('a b')
    })

    it('should shorten long labels to the maximum length with an ellipsis', () => {
      const label = truncateLabel('x'.repeat(MAX_ROW_LABEL_LENGTH + 20))
      expect(label.length).toBe(MAX_ROW_LABEL_LENGTH)
      expect(label.endsWith('\u2026')).toBe(true)
      expect(truncateLabel('abcdef', 4)).toBe('abc\u2026')
    })
  })

  describe('warnOnActionsWithoutLabelKey', () => {
    let warnSpy: jest.SpyInstance

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    })

    afterEach(() => warnSpy.mockRestore())

    it('should warn for each action without labelKey', () => {
      const actions: DataAction[] = [
        { id: 'a', permission: 'P' },
        { id: 'b', labelKey: 'KEY', permission: 'P' },
        { labelKey: '', permission: 'P' },
      ]
      warnOnActionsWithoutLabelKey(actions)
      expect(warnSpy).toHaveBeenCalledTimes(2)
      expect(warnSpy.mock.calls[0][0]).toContain('has no labelKey')
      expect(warnSpy.mock.calls[0][0]).toContain('"a"')
    })

    it('should warn without an action name if the action has no id', () => {
      warnOnActionsWithoutLabelKey([{ permission: 'P' }])
      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain('Row action has no labelKey')
    })

    it('should not warn outside of dev mode', () => {
      const globalWithDevMode = globalThis as { ngDevMode?: unknown }
      const original = globalWithDevMode.ngDevMode
      globalWithDevMode.ngDevMode = false
      try {
        warnOnActionsWithoutLabelKey([{ id: 'a', permission: 'P' }])
      } finally {
        globalWithDevMode.ngDevMode = original
      }
      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('should not warn if all actions have a labelKey', () => {
      warnOnActionsWithoutLabelKey([{ labelKey: 'KEY', permission: 'P' }])
      expect(warnSpy).not.toHaveBeenCalled()
    })
  })
})
