import { DataTableGroupingConfig, GroupPlan, GroupedRowsResult } from '../model/data-table-grouping.model';
import { DataTableColumn } from '../../../model/data-table-column.model';
import { Row } from '../data-table.component';
import { ObjectUtils } from 'primeng/utils';

/**
 * Internal pure planner for row grouping.
 * Computes group membership and presentation metadata without mutating input rows.
 *
 * @internal
 */
export class RowGroupPlanner {
  /**
   * Plans row groups from the given rows and configuration.
   * Pure function: no side effects, no mutation of inputs, no persistent state.
   * Time complexity: O(n) where n = rows.length
   * Space complexity: O(g + n) where g = number of groups
   *
   * @param rows - Input rows (not mutated)
   * @param columns - Table columns for column lookup
   * @param config - Grouping configuration
   * @returns Group plans and flattened row indices
   */
  static planGroups(
    rows: readonly Row[],
    columns: readonly DataTableColumn[],
    config: DataTableGroupingConfig
  ): GroupedRowsResult {
    if (rows.length === 0) {
      return { groups: [], flatRowIndices: [], allRowIndices: [], rowIndexToGroupIndex: new Map() };
    }

    const groupByColumnId = config.groupByColumnId;
    const groupKeyPath = config.groupKeyPath ?? groupByColumnId;
    const groupLabelFn = config.groupLabel;
    const groupKeyGetter = config.groupKeyGetter;

    // First pass: compute group key for each row and build group map
    // Using Map to preserve insertion order (first occurrence order)
    const groupMap = new Map<string | number | symbol, { rowIndices: number[]; firstRow: Row }>();

    rows.forEach((row, index) => {
      const key = groupKeyGetter
        ? groupKeyGetter(row, index, rows as readonly Row[])
        : this.getGroupKey(row, groupKeyPath);
      // Use a unique symbol for null/undefined keys to avoid unintended grouping
      const normalizedKey = key ?? RowGroupPlanner.NULL_KEY;

      if (!groupMap.has(normalizedKey)) {
        groupMap.set(normalizedKey, { rowIndices: [], firstRow: row });
      }
      const group = groupMap.get(normalizedKey);
      if (group) {
        group.rowIndices.push(index);
      }
    });

    // Second pass: build group plans in insertion order (first occurrence)
    const groups: GroupPlan[] = [];
    const allRowIndices: number[] = [];
    const rowIndexToGroupIndex = new Map<number, number>();

    groupMap.forEach(({ rowIndices }, key) => {
      // Convert symbol back to null for group key storage
      const isNullKey = key === RowGroupPlanner.NULL_KEY;
      const actualKey = isNullKey ? null : (key as string | number);
      // Keep null as-is for label generation so String(null) = 'null'
      const labelKey = actualKey;
      const label = groupLabelFn
        ? groupLabelFn(labelKey as string | number, rowIndices.map(i => rows[i]))
        : String(labelKey);

      const groupIndex = groups.length;
      groups.push({
        key: actualKey,
        label,
        rowIndices,
        rowspan: rowIndices.length,
        count: rowIndices.length,
      });

      rowIndices.forEach(i => rowIndexToGroupIndex.set(i, groupIndex));
      allRowIndices.push(...rowIndices);
    });

    return { groups, flatRowIndices: allRowIndices, allRowIndices, rowIndexToGroupIndex };
  }

  /** Unique symbol to represent null/undefined group keys internally */
  private static readonly NULL_KEY = Symbol('null-group-key');

  /**
   * Extracts a group key from a row using a dot-notation path.
   * Uses PrimeNG's ObjectUtils.resolveFieldData for nested property access.
   * Returns null for missing paths (consistent with nullish coalescing).
   *
   * @param row - Row object
   * @param path - Dot-notation path (e.g., 'status.code')
   * @returns The resolved value (string, number) or null if not found
   */
  static getGroupKey(row: Row, path: string): string | number | null {
    const value = ObjectUtils.resolveFieldData(row, path);
    return value ?? null;
  }
}