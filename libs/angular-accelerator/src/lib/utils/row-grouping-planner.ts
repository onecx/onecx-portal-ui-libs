import type { Row } from '../components/data-table/data-table.component'

export interface RowGroup {
  key: string | number
  label: string
  firstRow: Row
  firstRowId: string | number
  memberCount: number
}

export interface RowGroupPlan {
  groups: RowGroup[]
  groupStartIds: Set<string | number>
}

export function planRowGroups(rows: Row[], groupKeyPath: string): RowGroupPlan {
  const groups: RowGroup[] = []
  const byKey = new Map<string | number, RowGroup>()
  const groupStartIds = new Set<string | number>()

  for (const row of rows) {
    const raw = row[groupKeyPath]
    const key: unknown = raw
    const valid = (typeof key === 'string' || typeof key === 'number') && key === key
    if (!valid) {
      continue
    }
    const existing = byKey.get(key)
    if (existing) {
      existing.memberCount += 1
      continue
    }
    const group: RowGroup = {
      key: key,
      label: String(key),
      firstRow: row,
      firstRowId: row.id,
      memberCount: 1,
    }
    byKey.set(key, group)
    groups.push(group)
    groupStartIds.add(row.id)
  }

  return { groups, groupStartIds }
}
