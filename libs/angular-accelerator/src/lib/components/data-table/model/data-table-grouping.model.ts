import { Row } from '../data-table.component'
import { DataTableColumn } from '../../../model/data-table-column.model'

/**
 * Public configuration for row grouping in DataTable.
 * Allows consumers to opt into single-level row grouping.
 */
export interface DataTableGroupingConfig {
  /**
   * The column ID to group by.
   * Must match an existing column ID in the DataTable.
   */
  groupByColumnId: string

  /**
   * Optional nested field path to use as the group key.
   * If not provided, the value of `groupByColumnId` column is used directly.
   * Example: 'status.code' extracts row.status.code as the group key.
   * Uses dot-notation for nested property access.
   */
  groupKeyPath?: string

  /**
   * Optional custom function to generate the group label displayed in the group header.
   * Receives the computed group key and the array of rows in that group.
   * If not provided, the group key is used as the label.
   */
  groupLabel?: (key: string | number, rows: Row[]) => string

  /**
   * Optional custom function to extract the group key from a row.
   * If not provided, the value at `groupByColumnId` (or `groupKeyPath`) is used.
   */
  groupKeyGetter?: GroupKeyGetter
}

/**
 * Context provided to the group cell template.
 * Contains all information needed to render a group header cell.
 */
export interface GroupCellContext {
  /** The computed group key (string or number) */
  key: string | number

  /** The display label for the group (either key or custom groupLabel result) */
  label: string

  /** Array of row objects belonging to this group */
  rows: Row[]

  /** Original row indices of this group's rows in the full data array */
  rowIndices: number[]

  /** Number of rows in this group (used for rowspan) */
  rowspan: number
}

/**
 * Function type for extracting a group key from a row.
 * Receives a row, its index, and the full rows array, returns a string or number key.
 */
export type GroupKeyGetter = (row: Row, index: number, rows: readonly Row[]) => string | number

/**
 * Internal type representing a computed group plan.
 * Not part of the public API - used internally by DataTableComponent.
 */
export interface GroupPlan {
  /** The group key */
  key: string | number
  /** The display label */
  label: string
  /** Row indices in the original data array */
  rowIndices: number[]
  /** Number of rows in this group (used for rowspan) */
  rowspan: number
  /** Number of rows in this group (alias for rowspan) */
  count: number
}

/**
 * Internal result type for grouping computation.
 * Not part of the public API - used internally by DataTableComponent.
 */
export interface GroupedRowsResult {
  /** Array of group plans in display order */
  groups: GroupPlan[]
  /** Flat array of all row indices in group order */
  flatRowIndices: number[]
  /** Alias for flatRowIndices for backward compatibility */
  allRowIndices: number[]
  /** Map from original row index to group index */
  rowIndexToGroupIndex: Map<number, number>
}

/**
 * Internal type for a group with expanded rows.
 * Not part of the public API - used internally by DataTableComponent.
 */
export interface GroupedRowWithRows extends GroupPlan {
  /** The actual row objects for this group */
  rows: Row[]
}

/**
 * Internal type representing the grouped rows result with flat rows.
 * Not part of the public API - used internally by DataTableComponent.
 */
export interface GroupedRowsWithFlatRows {
  /** Array of group plans with expanded rows */
  groups: GroupedRowWithRows[]
  /** Flat array of all rows in group order */
  flatRows: (Row & { rowIndex: number; groupIndex: number })[]
}