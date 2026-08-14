import { ColumnType } from './column-type.model'
import { FilterType } from './filter.model'

/**
 * Row-grouping configuration for a single-level client-side group.
 *
 * Assign this to the column that should act as the group header.
 */
export interface DataTableRowGroupingConfig {
  /** Column id that provides the grouping column. */
  groupByColumnId: string
  /** Dot-separated field path to resolve the group key (defaults to groupByColumnId if omitted). */
  groupKeyFieldPath: string
}

/**
 * Template context provided to a custom group-cell template.
 */
export interface DataTableGroupCellTemplateContext<T> {
  /** The resolved strict-equality group key (string | number). */
  groupKey: string | number
  /** The display label rendered for the group. */
  groupLabel: string
  /** Number of rows in this group. */
  groupSize: number
  /** Zero-based index of the group among all groups. */
  groupIndex: number
  /** The first row object belonging to this group. */
  rowObject: T
  /** The grouping column definition. */
  column: DataTableColumn
}

export interface DataTableColumn {
  columnType: ColumnType
  nameKey: string
  id: string
  sortable?: boolean
  filterable?: boolean
  filterType?: FilterType
  predefinedGroupKeys?: string[]
  dateFormat?: string
  /** Optional row-grouping configuration – only one column may carry this. */
  rowGrouping?: DataTableRowGroupingConfig
  /** Optional template key (pTemplate name) for a custom group-cell template. */
  groupCellTemplateKey?: string
}
