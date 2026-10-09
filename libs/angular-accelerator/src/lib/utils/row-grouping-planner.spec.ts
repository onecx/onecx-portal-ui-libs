import { planRowGroups, RowGroupPlan } from './row-grouping-planner'
import type { Row } from '../components/data-table/data-table.component'

describe('planRowGroups', () => {
  it('groups by the configured path and counts members', () => {
    const rows: Row[] = [
      { id: 'r1', dept: 'eng' },
      { id: 'r2', dept: 'eng' },
      { id: 'r3', dept: 'sales' },
      { id: 'r4', dept: 'eng' },
    ]

    const plan = planRowGroups(rows, 'dept')

    expect(plan.groups).toHaveLength(2)
    const eng = plan.groups.find((g) => g.key === 'eng')
    const sales = plan.groups.find((g) => g.key === 'sales')
    expect(eng?.memberCount).toBe(3)
    expect(sales?.memberCount).toBe(1)
  })

  it('uses strict equality so numeric 1 and string "1" are separate groups', () => {
    const rows: Row[] = [{ id: 'a', v: 1 }, { id: 'b', v: '1' }]

    const plan = planRowGroups(rows, 'v')

    expect(plan.groups).toHaveLength(2)
    expect(plan.groups[0].key).toBe(1)
    expect(plan.groups[1].key).toBe('1')
    expect(plan.groups[0].label).toBe('1')
    expect(plan.groups[1].label).toBe('1')
  })

  it('resolves a nested (flattened) field path via direct key access', () => {
    const rows: Row[] = [{ id: '1', 'category.sub': 'X' }, { id: '2', 'category.sub': 'X' }]

    const plan = planRowGroups(rows, 'category.sub')

    expect(plan.groups).toHaveLength(1)
    expect(plan.groups[0].key).toBe('X')
    expect(plan.groups[0].memberCount).toBe(2)
  })

  it('orders groups by first occurrence regardless of later ordering', () => {
    const rows: Row[] = [
      { id: '1', k: 'b' },
      { id: '2', k: 'a' },
      { id: '3', k: 'a' },
      { id: '4', k: 'b' },
      { id: '5', k: 'a' },
    ]

    const plan = planRowGroups(rows, 'k')

    expect(plan.groups.map((g) => g.key)).toEqual(['b', 'a'])
    expect(plan.groups[0].memberCount).toBe(2)
    expect(plan.groups[1].memberCount).toBe(3)
  })

  it('keeps rows in original order within a group and only marks the first occurrence as a start', () => {
    const rows: Row[] = [
      { id: 1, k: 'A' },
      { id: 2, k: 'B' },
      { id: 3, k: 'A' },
      { id: 4, k: 'B' },
    ]

    const plan = planRowGroups(rows, 'k')

    expect(plan.groupStartIds).toEqual(new Set([1, 2]))
    const groupA = plan.groups.find((g) => g.key === 'A')
    expect(groupA?.firstRowId).toBe(1)
    expect(groupA?.memberCount).toBe(2)
    expect(groupA?.firstRow).toBe(rows[0])
  })

  it('does not form a group for null, undefined, or object keys', () => {
    const rows: Row[] = [
      { id: 'null-row', k: null },
      { id: 'undef-row' },
      { id: 'obj-row', k: { nested: true } },
      { id: 'ok-row', k: 'valid' },
    ]

    const plan = planRowGroups(rows, 'k')

    expect(plan.groups).toHaveLength(1)
    expect(plan.groups[0].key).toBe('valid')
    expect(plan.groups[0].firstRowId).toBe('ok-row')
    expect(plan.groupStartIds.has('null-row')).toBe(false)
    expect(plan.groupStartIds.has('undef-row')).toBe(false)
    expect(plan.groupStartIds.has('obj-row')).toBe(false)
    expect(plan.groupStartIds.has('ok-row')).toBe(true)
  })

  it('excludes NaN as a key', () => {
    const rows: Row[] = [{ id: 'nan-row', k: NaN }]

    const plan = planRowGroups(rows, 'k')

    expect(plan.groups).toHaveLength(0)
    expect(plan.groupStartIds.size).toBe(0)
  })

  it('returns empty structures for empty input and for all-invalid input', () => {
    const emptyPlan = planRowGroups([], 'x')
    expect(emptyPlan.groups).toHaveLength(0)
    expect(emptyPlan.groupStartIds.size).toBe(0)

    const allInvalidPlan = planRowGroups([{ id: '1' } as Row, { id: '2', x: {} } as Row], 'x')
    expect(allInvalidPlan.groups).toHaveLength(0)
    expect(allInvalidPlan.groupStartIds.size).toBe(0)
  })

  it('produces a single-member group for a unique key', () => {
    const rows: Row[] = [{ id: 'only', k: 'solo' }]

    const plan = planRowGroups(rows, 'k')

    expect(plan.groups).toHaveLength(1)
    expect(plan.groups[0].key).toBe('solo')
    expect(plan.groups[0].memberCount).toBe(1)
    expect(plan.groupStartIds).toEqual(new Set(['only']))
  })

  it('is pure and does not mutate inputs', () => {
    const rows: Row[] = [
      { id: '1', k: 'A' },
      { id: '2', k: 'B' },
      { id: '3', k: 'A' },
    ]
    const snapshot = JSON.parse(JSON.stringify(rows)) as Row[]

    const first = planRowGroups(rows, 'k')
    const second = planRowGroups(rows, 'k')

    expect(second).toEqual(first)
    expect(rows).toEqual(snapshot)
  })

  it('keeps the returned groups array fresh and row references stable', () => {
    const rows: Row[] = [
      { id: '1', k: 'A' },
      { id: '2', k: 'A' },
    ]

    const plan: RowGroupPlan = planRowGroups(rows, 'k')

    expect(plan.groups[0].firstRow).toBe(rows[0])
    expect(plan.groups[0].firstRowId).toBe('1')
    expect(plan.groups[0].label).toBe('A')
  })
})
