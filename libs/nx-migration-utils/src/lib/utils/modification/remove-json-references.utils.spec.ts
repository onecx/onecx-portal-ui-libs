import { removeReferences } from './remove-json-references.utils'

describe('removeReferences', () => {
  it('removes string values containing reference', () => {
    const result = removeReferences('test-reference-string', 'reference')
    expect(result).toBeUndefined()
  })

  it('keeps string values not containing reference', () => {
    const result = removeReferences('clean-string', 'reference')
    expect(result).toBe('clean-string')
  })

  it('filters array elements containing reference', () => {
    const input = ['keep-this', 'remove-reference-this', 'also-keep']
    const result = removeReferences(input, 'reference')
    expect(result).toEqual(['keep-this', 'also-keep'])
  })

  it('recursively processes nested arrays', () => {
    const input = ['clean', ['nested-clean', 'nested-reference-remove'], 'reference-toplevel']
    const result = removeReferences(input, 'reference')
    expect(result).toEqual(['clean', ['nested-clean']])
  })

  it('removes object properties with reference values', () => {
    const input = {
      keep: 'clean-value',
      remove: 'has-reference-remove',
      alsoKeep: 'another-clean',
    }
    const result = removeReferences(input, 'reference')
    expect(result).toEqual({
      keep: 'clean-value',
      alsoKeep: 'another-clean',
    })
  })

  it('recursively processes nested objects', () => {
    const input = {
      level1: {
        keep: 'clean',
        remove: 'reference-remove',
        nested: {
          deep: 'clean-deep',
          deepRemove: 'deep-reference',
        },
      },
      topLevel: 'reference-top',
    }
    const result = removeReferences(input, 'reference')
    expect(result).toEqual({
      level1: {
        keep: 'clean',
        nested: {
          deep: 'clean-deep',
        },
      },
    })
  })

  it('handles primitive values correctly', () => {
    expect(removeReferences(42, 'reference')).toBe(42)
    expect(removeReferences(true, 'reference')).toBe(true)
    expect(removeReferences(null, 'reference')).toBe(null)
  })

  it('handles empty objects and arrays', () => {
    expect(removeReferences({}, 'reference')).toEqual({})
    expect(removeReferences([], 'reference')).toEqual([])
  })
})
