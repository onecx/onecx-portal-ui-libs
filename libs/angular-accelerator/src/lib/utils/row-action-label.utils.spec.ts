import { DataAction } from '../model/data-action'
import { getRowLabel, warnOnActionsWithoutLabelKey } from './row-action-label.utils'

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
      warnOnActionsWithoutLabelKey(actions, 'TestComponent')
      expect(warnSpy).toHaveBeenCalledTimes(2)
      expect(warnSpy.mock.calls[0][0]).toContain('TestComponent')
      expect(warnSpy.mock.calls[0][0]).toContain('"a"')
    })

    it('should not warn if all actions have a labelKey', () => {
      warnOnActionsWithoutLabelKey([{ labelKey: 'KEY', permission: 'P' }], 'TestComponent')
      expect(warnSpy).not.toHaveBeenCalled()
    })
  })
})
