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
  groupsByFirstRowId: Map<string | number, RowGroup>
  orderedRows: Row[]
}

export function planRowGroups(rows: Row[], groupKeyPath: string): RowGroupPlan {
  const groups: RowGroup[] = []
  const byKey = new Map<string | number, { group: RowGroup; rows: Row[] }>()
  const groupStartIds = new Set<string | number>()
  const groupsByFirstRowId = new Map<string | number, RowGroup>()
  const ungroupedRows: Row[] = []

  for (const row of rows) {
    const raw = row[groupKeyPath]
    const key: unknown = raw
    const valid = typeof key === 'string' || (typeof key === 'number' && !Number.isNaN(key))
    if (!valid) {
      ungroupedRows.push(row)
      continue
    }
    const existing = byKey.get(key)
    if (existing) {
      existing.group.memberCount += 1
      existing.rows.push(row)
      continue
    }
    const group: RowGroup = {
      key: key,
      label: String(key),
      firstRow: row,
      firstRowId: row.id,
      memberCount: 1,
    }
    byKey.set(key, { group, rows: [row] })
    groups.push(group)
    groupStartIds.add(row.id)
    groupsByFirstRowId.set(row.id, group)
  }

  const orderedRows = ungroupedRows.concat(Array.from(byKey.values()).flatMap((entry) => entry.rows))
  return { groups, groupStartIds, groupsByFirstRowId, orderedRows }
}
