import { planRowGroups } from './row-group-planner'

describe('planRowGroups', () => {
  describe('basic grouping', () => {
    it('should return empty plan for empty rows', () => {
      const result = planRowGroups([], 'name', 'name')
      expect(result.rows).toEqual([])
      expect(result.meta).toEqual([])
      expect(result.groupCount).toBe(0)
    })

    it('should group rows by groupKeyFieldPath', () => {
      const rows = [
        { id: '1', category: 'A', name: 'x' },
        { id: '2', category: 'B', name: 'y' },
        { id: '3', category: 'A', name: 'z' },
      ]
      const result = planRowGroups(rows, 'category', 'category')

      expect(result.groupCount).toBe(2)
      expect(result.rows).toBe(rows) // same reference

      // Row 0: first of group 0 (A), rowspan 2
      expect(result.meta[0]).toMatchObject({
        isGroupStart: true,
        rowspan: 2,
        groupKey: 'A',
        groupLabel: 'A',
        groupIndex: 0,
      })
      // Row 1: first of group 1 (B), rowspan 1
      expect(result.meta[1]).toMatchObject({
        isGroupStart: true,
        rowspan: 1,
        groupKey: 'B',
        groupLabel: 'B',
        groupIndex: 1,
      })
      // Row 2: second of group 0 (A), not a start
      expect(result.meta[2]).toMatchObject({
        isGroupStart: false,
        rowspan: 1,
        groupKey: 'A',
        groupLabel: 'A',
        groupIndex: 0,
      })
    })
  })

  describe('grouping column vs key field path', () => {
    it('should use groupKeyFieldPath for key resolution and groupByColumnId for label', () => {
      const rows = [
        { id: '1', displayLabel: 'Alpha', sortKey: 'k1' },
        { id: '2', displayLabel: 'Beta', sortKey: 'k2' },
        { id: '3', displayLabel: 'Alpha', sortKey: 'k1' },
      ]
      const result = planRowGroups(rows, 'displayLabel', 'sortKey')

      expect(result.groupCount).toBe(2)
      expect(result.meta[0].groupKey).toBe('k1')
      expect(result.meta[0].groupLabel).toBe('Alpha')
      expect(result.meta[0].isGroupStart).toBe(true)
      expect(result.meta[0].rowspan).toBe(2)

      expect(result.meta[1].groupKey).toBe('k2')
      expect(result.meta[1].groupLabel).toBe('Beta')
      expect(result.meta[1].isGroupStart).toBe(true)
      expect(result.meta[1].rowspan).toBe(1)

      expect(result.meta[2].groupKey).toBe('k1')
      expect(result.meta[2].groupLabel).toBe('Alpha')
      expect(result.meta[2].isGroupStart).toBe(false)
    })
  })

  describe('nested field path resolution', () => {
    it('should resolve nested paths for both key and label', () => {
      const rows = [
        { id: '1', nested: { key: 'x', label: 'One' } },
        { id: '2', nested: { key: 'y', label: 'Two' } },
        { id: '3', nested: { key: 'x', label: 'One' } },
      ]
      const result = planRowGroups(rows, 'nested.label', 'nested.key')

      expect(result.groupCount).toBe(2)
      expect(result.meta[0].groupKey).toBe('x')
      expect(result.meta[0].groupLabel).toBe('One')
      expect(result.meta[0].isGroupStart).toBe(true)
      expect(result.meta[0].rowspan).toBe(2)

      expect(result.meta[1].groupKey).toBe('y')
      expect(result.meta[1].groupLabel).toBe('Two')

      expect(result.meta[2].groupKey).toBe('x')
      expect(result.meta[2].isGroupStart).toBe(false)
    })
  })

  describe('strict equality with string and number keys', () => {
    it('should treat string "1" and number 1 as different keys', () => {
      const rows = [
        { id: '1', key: '1', label: 'str-1' },
        { id: '2', key: 1, label: 'num-1' },
        { id: '3', key: '1', label: 'str-1-again' },
      ]
      const result = planRowGroups(rows, 'label', 'key')

      expect(result.groupCount).toBe(2)

      expect(result.meta[0].groupKey).toBe('1')
      expect(result.meta[0].isGroupStart).toBe(true)
      expect(result.meta[0].rowspan).toBe(2)

      expect(result.meta[1].groupKey).toBe(1)
      expect(result.meta[1].isGroupStart).toBe(true)
      expect(result.meta[1].rowspan).toBe(1)

      expect(result.meta[2].groupKey).toBe('1')
      expect(result.meta[2].isGroupStart).toBe(false)
    })

    it('should group by number keys with strict equality', () => {
      const rows = [
        { id: '1', key: 10, label: 'A' },
        { id: '2', key: 20, label: 'B' },
        { id: '3', key: 10, label: 'C' },
      ]
      const result = planRowGroups(rows, 'label', 'key')

      expect(result.groupCount).toBe(2)
      expect(result.meta[0].groupKey).toBe(10)
      expect(result.meta[0].rowspan).toBe(2)
      expect(result.meta[2].isGroupStart).toBe(false)
    })
  })

  describe('first-occurrence group order', () => {
    it('should preserve first-seen group order', () => {
      const rows = [
        { id: '1', g: 'C', label: 'C' },
        { id: '2', g: 'A', label: 'A' },
        { id: '3', g: 'B', label: 'B' },
        { id: '4', g: 'A', label: 'A' },
      ]
      const result = planRowGroups(rows, 'label', 'g')

      expect(result.groupCount).toBe(3)

      // First group in first-seen order is 'C'
      expect(result.meta[0].groupKey).toBe('C')
      expect(result.meta[0].groupIndex).toBe(0)

      // Second group is 'A'
      expect(result.meta[1].groupKey).toBe('A')
      expect(result.meta[1].groupIndex).toBe(1)

      // Third group is 'B'
      expect(result.meta[2].groupKey).toBe('B')
      expect(result.meta[2].groupIndex).toBe(2)

      // Fourth row belongs to 'A' group (index 1)
      expect(result.meta[3].groupKey).toBe('A')
      expect(result.meta[3].groupIndex).toBe(1)
      expect(result.meta[3].isGroupStart).toBe(false)
    })
  })

  describe('original row order preservation', () => {
    it('should keep original row order within groups', () => {
      const rows = [
        { id: 'c', g: 'A', label: 'c' },
        { id: 'a', g: 'B', label: 'a' },
        { id: 'b', g: 'A', label: 'b' },
      ]
      const result = planRowGroups(rows, 'label', 'g')

      expect(result.rows[0].id).toBe('c')
      expect(result.rows[1].id).toBe('a')
      expect(result.rows[2].id).toBe('b')

      expect(result.meta[0].isGroupStart).toBe(true)
      expect(result.meta[0].rowspan).toBe(2)
      expect(result.meta[2].isGroupStart).toBe(false)
    })
  })

  describe('singleton groups', () => {
    it('should produce singleton groups for unique keys', () => {
      const rows = [
        { id: '1', g: 'A', label: 'A' },
        { id: '2', g: 'B', label: 'B' },
        { id: '3', g: 'C', label: 'C' },
      ]
      const result = planRowGroups(rows, 'label', 'g')

      expect(result.groupCount).toBe(3)
      for (let i = 0; i < 3; i++) {
        expect(result.meta[i].isGroupStart).toBe(true)
        expect(result.meta[i].rowspan).toBe(1)
      }
    })
  })

  describe('empty string labels', () => {
    it('should handle empty string labels', () => {
      const rows = [
        { id: '1', g: '', label: '' },
        { id: '2', g: '', label: '' },
        { id: '3', g: 'X', label: 'X' },
      ]
      const result = planRowGroups(rows, 'label', 'g')

      expect(result.groupCount).toBe(2)
      expect(result.meta[0].groupLabel).toBe('')
      expect(result.meta[0].groupKey).toBe('')
      expect(result.meta[0].isGroupStart).toBe(true)
      expect(result.meta[0].rowspan).toBe(2)
      expect(result.meta[1].isGroupStart).toBe(false)
    })
  })

  describe('null/undefined key coercion', () => {
    it('should coerce null keys to "null" string', () => {
      const rows = [
        { id: '1', g: null, label: 'n' },
        { id: '2', g: null, label: 'n' },
      ]
      const result = planRowGroups(rows, 'label', 'g')

      expect(result.groupCount).toBe(1)
      expect(result.meta[0].groupKey).toBe('null')
      expect(result.meta[0].rowspan).toBe(2)
    })

    it('should coerce undefined keys to "undefined" string', () => {
      const rows = [
        { id: '1', g: undefined, label: 'u' },
        { id: '2', g: undefined, label: 'u' },
      ]
      const result = planRowGroups(rows, 'label', 'g')

      expect(result.groupCount).toBe(1)
      expect(result.meta[0].groupKey).toBe('undefined')
    })

    it('should produce empty string label when groupByColumnId resolves to null', () => {
      const rows = [
        { id: '1', g: 'A', displayLabel: null },
        { id: '2', g: 'A', displayLabel: undefined },
      ]
      const result = planRowGroups(rows, 'displayLabel', 'g')

      expect(result.groupCount).toBe(1)
      expect(result.meta[0].groupLabel).toBe('')
      expect(result.meta[1].groupLabel).toBe('')
    })
  })

  describe('immutability guarantees', () => {
    it('should not mutate input rows', () => {
      const rows = [
        { id: '1', g: 'A', label: 'A' },
        { id: '2', g: 'B', label: 'B' },
        { id: '3', g: 'A', label: 'A' },
      ]
      const snapshot = JSON.parse(JSON.stringify(rows))

      planRowGroups(rows, 'label', 'g')

      expect(rows).toEqual(snapshot)
    })

    it('should not mutate the input row array order', () => {
      const rows = [
        { id: '3', g: 'B', label: 'B' },
        { id: '1', g: 'A', label: 'A' },
        { id: '2', g: 'B', label: 'B' },
      ]
      const result = planRowGroups(rows, 'label', 'g')

      expect(result.rows[0]).toBe(rows[0])
      expect(result.rows[1]).toBe(rows[1])
      expect(result.rows[2]).toBe(rows[2])
    })

    it('should return the same rows reference', () => {
      const rows = [{ id: '1', g: 'A', label: 'A' }]
      const result = planRowGroups(rows, 'label', 'g')
      expect(result.rows).toBe(rows)
    })
  })
})
