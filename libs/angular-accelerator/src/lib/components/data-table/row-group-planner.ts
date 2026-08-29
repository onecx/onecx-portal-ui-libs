import { ObjectUtils } from '../../utils/objectutils'

/**
 * Resolve a field path from a row that may be either flattened (dot-notation keys)
 * or nested. Tries the flat key first, then falls back to nested resolution.
 * @internal
 */
function resolveField<T extends Record<string, unknown>>(row: T, path: string): unknown {
  // Try flat key first (for flattened rows from displayedRows$)
  if (row[path] !== undefined) {
    return row[path]
  }
  // Fall back to nested resolution
  return ObjectUtils.resolveFieldData(row, path)
}

/**
 * Per-row metadata produced by the row-group planner.
 * @internal
 */
export interface RowGroupRowMeta {
  /** Whether this row is the first row of its group. */
  readonly isGroupStart: boolean
  /** Rowspan value for the group cell on the first row (1 for non-first rows). */
  readonly rowspan: number
  /** The strict-equality group key. */
  readonly groupKey: string | number
  /** The display label for the group. */
  readonly groupLabel: string
  /** Zero-based group index. */
  readonly groupIndex: number
}

/**
 * Planner output: grouped rows with per-row metadata.
 * @internal
 */
export interface RowGroupPlan<T> {
  /** Rows augmented with grouping metadata. */
  readonly rows: readonly T[]
  /** Per-row metadata mapped by original row index. */
  readonly meta: readonly RowGroupRowMeta[]
  /** Total number of groups. */
  readonly groupCount: number
}

/**
 * Pure, linear row-group planner.
 *
 * Groups rows by a strict-equality key resolved from `groupKeyFieldPath`
 * and renders labels from `groupByColumnId`. First-seen group order is
 * preserved and original row order inside groups is maintained.
 *
 * @internal
 */
export function planRowGroups<T extends Record<string, unknown>>(
  rows: readonly T[],
  groupByColumnId: string,
  groupKeyFieldPath: string
): RowGroupPlan<T> {
  if (rows.length === 0) {
    return { rows, meta: [], groupCount: 0 }
  }

  // Collect group keys and labels in first-seen order
  const keyToIndex = new Map<string | number, number>()
  let groupIndex = 0

  const meta: RowGroupRowMeta[] = new Array(rows.length)

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const key = resolveField(row, groupKeyFieldPath)

    // Coerce to string/number for strict equality
    const groupKey =
      typeof key === 'string' || typeof key === 'number' ? key : String(key)

    const label = resolveField(row, groupByColumnId)
    const groupLabel = label != null ? String(label) : ''

    let idx = keyToIndex.get(groupKey)
    if (idx === undefined) {
      idx = groupIndex
      keyToIndex.set(groupKey, idx)
      groupIndex++
    }

    meta[i] = {
      isGroupStart: false,
      rowspan: 1,
      groupKey,
      groupLabel,
      groupIndex: idx,
    }
  }

  // Second pass: compute rowspans and mark group starts
  const groupStarts = new Map<number, { count: number; label: string; key: string | number }>()

  for (let i = 0; i < rows.length; i++) {
    const m = meta[i]
    if (!groupStarts.has(m.groupIndex)) {
      groupStarts.set(m.groupIndex, { count: 0, label: m.groupLabel, key: m.groupKey })
      m.isGroupStart = true
    }
    const entry = groupStarts.get(m.groupIndex)!
    entry.count++
  }

  // Set rowspan on the first row of each group
  for (let i = 0; i < meta.length; i++) {
    const m = meta[i]
    if (m.isGroupStart) {
      m.rowspan = groupStarts.get(m.groupIndex)!.count
    }
  }

  return { rows, meta, groupCount: groupIndex }
}
