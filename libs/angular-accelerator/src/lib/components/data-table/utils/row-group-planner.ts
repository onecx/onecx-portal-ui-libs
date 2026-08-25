import { DataTableGroupingConfig } from '../model/data-table-grouping.model';
import { DataTableColumn } from '../../../model/data-table-column.model';
import { Row } from '../data-table.component';
import { ObjectUtils } from '../../../utils/objectutils';
import { GroupPlan, GroupedRowsResult } from '../model/data-table-grouping.model';

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

    // First pass: compute group key for each row and build group map
    // Using Map to preserve insertion order (first occurrence order)
    const groupMap = new Map<string | number, { rowIndices: number[]; firstRow: Row }>();

    rows.forEach((row, index) => {
      const key = this.getGroupKey(row, groupKeyPath);
      const normalizedKey = key ?? ''; // Normalize undefined/null to empty string for grouping

      if (!groupMap.has(normalizedKey)) {
        groupMap.set(normalizedKey, { rowIndices: [], firstRow: row });
      }
      groupMap.get(normalizedKey)!.rowIndices.push(index);
    });

    // Second pass: build group plans in insertion order (first occurrence)
    const groups: GroupPlan[] = [];
    const allRowIndices: number[] = [];
    const rowIndexToGroupIndex = new Map<number, number>();

    groupMap.forEach(({ rowIndices, firstRow }, key) => {
      const label = groupLabelFn
        ? groupLabelFn(key, rowIndices.map(i => rows[i]))
        : String(key);

      const groupIndex = groups.length;
      groups.push({
        key,
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

  /**
   * Extracts a group key from a row using a dot-notation path.
   * Uses ObjectUtils.resolveFieldData for nested property access.
   *
   * @param row - Row object
   * @param path - Dot-notation path (e.g., 'status.code')
   * @returns The resolved value (string, number, or undefined)
   */
  static getGroupKey(row: Row, path: string): string | number | undefined {
    return ObjectUtils.resolveFieldData(row, path) as string | number | undefined;
  }
}