import { RowGroupPlanner } from './row-group-planner';
import { DataTableGroupingConfig } from '../model/data-table-grouping.model';
import { DataTableColumn } from '../../../model/data-table-column.model';
import { ColumnType } from '../../../model/column-type.model';
import { Row } from '../data-table.component';

describe('RowGroupPlanner', () => {
  const columns: DataTableColumn[] = [
    { id: 'status', columnType: ColumnType.STRING, nameKey: 'STATUS' },
    { id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME' },
    { id: 'category.code', columnType: ColumnType.STRING, nameKey: 'CATEGORY_CODE' },
  ];

  const rows: Row[] = [
    { id: 1, status: 'A', name: 'Item 1', category: { code: 'CAT1' } },
    { id: 2, status: 'B', name: 'Item 2', category: { code: 'CAT1' } },
    { id: 3, status: 'A', name: 'Item 3', category: { code: 'CAT2' } },
    { id: 4, status: 'A', name: 'Item 4', category: { code: 'CAT2' } },
    { id: 5, status: 'C', name: 'Item 5', category: { code: 'CAT3' } },
  ];

  describe('planGroups', () => {
    it('should group by column id using first occurrence order when no sort', () => {
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result = RowGroupPlanner.planGroups(rows, columns, config);

      expect(result.groups).toHaveLength(3);
      expect(result.groups[0].key).toBe('A');
      expect(result.groups[0].rowIndices).toEqual([0, 2, 3]);
      expect(result.groups[0].rowspan).toBe(3);
      expect(result.groups[1].key).toBe('B');
      expect(result.groups[1].rowIndices).toEqual([1]);
      expect(result.groups[1].rowspan).toBe(1);
      expect(result.groups[2].key).toBe('C');
      expect(result.groups[2].rowIndices).toEqual([4]);
      expect(result.groups[2].rowspan).toBe(1);
    });

    it('should use groupKeyPath for nested field when provided', () => {
      const config: DataTableGroupingConfig = { groupByColumnId: 'status', groupKeyPath: 'category.code' };
      const result = RowGroupPlanner.planGroups(rows, columns, config);

      expect(result.groups).toHaveLength(3);
      expect(result.groups[0].key).toBe('CAT1');
      expect(result.groups[0].rowIndices).toEqual([0, 1]);
      expect(result.groups[1].key).toBe('CAT2');
      expect(result.groups[1].rowIndices).toEqual([2, 3]);
      expect(result.groups[2].key).toBe('CAT3');
      expect(result.groups[2].rowIndices).toEqual([4]);
    });

    it('should default groupKeyPath to groupByColumnId when not provided', () => {
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result = RowGroupPlanner.planGroups(rows, columns, config);
      expect(result.groups[0].key).toBe('A');
    });

    it('should use custom groupLabel function when provided', () => {
      const config: DataTableGroupingConfig = {
        groupByColumnId: 'status',
        groupLabel: (key, groupRows) => `Status ${key} (${groupRows.length})`
      };
      const result = RowGroupPlanner.planGroups(rows, columns, config);

      expect(result.groups[0].label).toBe('Status A (3)');
      expect(result.groups[1].label).toBe('Status B (1)');
      expect(result.groups[2].label).toBe('Status C (1)');
    });

    it('should default label to stringified key when no groupLabel provided', () => {
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result = RowGroupPlanner.planGroups(rows, columns, config);

      expect(result.groups[0].label).toBe('A');
      expect(result.groups[1].label).toBe('B');
      expect(result.groups[2].label).toBe('C');
    });

    it('should handle number keys with strict equality', () => {
      const numRows: Row[] = [
        { id: 1, status: 1, name: 'Item 1' },
        { id: 2, status: 2, name: 'Item 2' },
        { id: 3, status: 1, name: 'Item 3' },
      ];
      const numColumns: DataTableColumn[] = [
        { id: 'status', columnType: ColumnType.NUMBER, nameKey: 'STATUS' },
      ];
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result = RowGroupPlanner.planGroups(numRows, numColumns, config);

      expect(result.groups).toHaveLength(2);
      expect(result.groups[0].key).toBe(1);
      expect(result.groups[1].key).toBe(2);
    });

    it('should treat separate keys with same label as distinct groups', () => {
      const labelRows: Row[] = [
        { id: 1, status: 'A', name: 'Item 1' },
        { id: 2, status: 'B', name: 'Item 2' },
      ];
      const config: DataTableGroupingConfig = {
        groupByColumnId: 'status',
        groupLabel: () => 'Same Label'
      };
      const result = RowGroupPlanner.planGroups(labelRows, columns, config);

      expect(result.groups).toHaveLength(2);
      expect(result.groups[0].key).toBe('A');
      expect(result.groups[1].key).toBe('B');
      expect(result.groups[0].label).toBe('Same Label');
      expect(result.groups[1].label).toBe('Same Label');
    });

    it('should handle empty label (empty string key)', () => {
      const emptyLabelRows: Row[] = [
        { id: 1, status: '', name: 'Item 1' },
        { id: 2, status: 'B', name: 'Item 2' },
      ];
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result = RowGroupPlanner.planGroups(emptyLabelRows, columns, config);

      expect(result.groups).toHaveLength(2);
      expect(result.groups[0].key).toBe('');
      expect(result.groups[0].label).toBe('');
      expect(result.groups[0].rowspan).toBe(1);
    });

    it('should handle null/undefined group keys by grouping them together', () => {
      const nullKeyRows: Row[] = [
        { id: 1, status: 'A', name: 'Item 1' },
        { id: 2, name: 'Item 2' }, // missing status
        { id: 3, status: null, name: 'Item 3' }, // explicit null
        { id: 4, status: 'B', name: 'Item 4' },
      ];
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result = RowGroupPlanner.planGroups(nullKeyRows, columns, config);

      expect(result.groups).toHaveLength(3);
      // Groups follow first occurrence order: 'A' (index 0), null/undefined (indices 1,2), 'B' (index 3)
      expect(result.groups[0].key).toBe('A');
      expect(result.groups[0].rowIndices).toEqual([0]);
      expect(result.groups[1].key).toBeNull();
      expect(result.groups[1].rowIndices).toEqual([1, 2]); // indices of rows with missing/null status
      expect(result.groups[1].label).toBe('null'); // String(null) = 'null'
      expect(result.groups[1].rowspan).toBe(2);
      expect(result.groups[2].key).toBe('B');
      expect(result.groups[2].rowIndices).toEqual([3]);
    });

    it('should handle single row group (rowspan = 1)', () => {
      const singleRow: Row[] = [{ id: 1, status: 'A', name: 'Item 1' }];
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result = RowGroupPlanner.planGroups(singleRow, columns, config);

      expect(result.groups).toHaveLength(1);
      expect(result.groups[0].rowspan).toBe(1);
      expect(result.groups[0].rowIndices).toEqual([0]);
    });

    it('should return empty groups for empty rows', () => {
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result = RowGroupPlanner.planGroups([], columns, config);

      expect(result.groups).toHaveLength(0);
      expect(result.allRowIndices).toEqual([]);
    });

    it('should preserve original row order within each group', () => {
      const reorderedRows: Row[] = [
        { id: 3, status: 'A', name: 'Item 3' },
        { id: 1, status: 'A', name: 'Item 1' },
        { id: 2, status: 'B', name: 'Item 2' },
      ];
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result = RowGroupPlanner.planGroups(reorderedRows, columns, config);

      expect(result.groups[0].rowIndices).toEqual([0, 1]);
      expect(result.groups[1].rowIndices).toEqual([2]);
    });

    it('should not mutate input rows array', () => {
      const originalRows = [...rows];
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      RowGroupPlanner.planGroups(rows, columns, config);

      expect(rows).toEqual(originalRows);
    });

    it('should not retain persistent duplicate dataset', () => {
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
      const result1 = RowGroupPlanner.planGroups(rows, columns, config);
      const result2 = RowGroupPlanner.planGroups(rows, columns, config);

      // Results should be independent (no shared mutable state)
      expect(result1).not.toBe(result2);
      expect(result1.groups).not.toBe(result2.groups);
    });

    it('should perform linear grouping work (O(n))', () => {
      const largeRows: Row[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        status: String.fromCharCode(65 + (i % 5)),
        name: `Item ${i}`,
      }));
      const config: DataTableGroupingConfig = { groupByColumnId: 'status' };

      const start = performance.now();
      RowGroupPlanner.planGroups(largeRows, columns, config);
      const elapsed = performance.now() - start;

      // Should complete in well under 100ms for 1000 rows (linear time)
      expect(elapsed).toBeLessThan(100);
    });
  });

  describe('getGroupKey', () => {
    it('should resolve nested path using ObjectUtils.resolveFieldData', () => {
      const row: Row = { id: 1, category: { code: 'CAT1', name: 'Category 1' } };
      const key = RowGroupPlanner.getGroupKey(row, 'category.code');
      expect(key).toBe('CAT1');
    });

    it('should return value directly when path is simple property', () => {
      const row: Row = { id: 1, status: 'ACTIVE' };
      const key = RowGroupPlanner.getGroupKey(row, 'status');
      expect(key).toBe('ACTIVE');
    });

    it('should return null for missing nested path', () => {
      const row: Row = { id: 1, status: 'ACTIVE' };
      const key = RowGroupPlanner.getGroupKey(row, 'missing.path');
      expect(key).toBeNull();
    });

    it('should use custom groupKeyGetter when provided', () => {
      const config: DataTableGroupingConfig = {
        groupByColumnId: 'status',
        groupKeyGetter: (row, index, rows) => `custom-${row.status}-${index}`
      };
      const result = RowGroupPlanner.planGroups(rows, columns, config);

      expect(result.groups).toHaveLength(5); // Each row gets unique key
      expect(result.groups[0].key).toBe('custom-A-0');
      expect(result.groups[1].key).toBe('custom-B-1');
      expect(result.groups[2].key).toBe('custom-A-2');
      expect(result.groups[3].key).toBe('custom-A-3');
      expect(result.groups[4].key).toBe('custom-C-4');
    });

    it('should use groupKeyGetter with row, index, and rows parameters', () => {
      const config: DataTableGroupingConfig = {
        groupByColumnId: 'status',
        groupKeyGetter: (row, index, rows) => {
          expect(index).toBeLessThan(rows.length);
          expect(rows).toBeDefined();
          return row.status + '-idx' + index;
        }
      };
      const result = RowGroupPlanner.planGroups(rows, columns, config);

      expect(result.groups).toHaveLength(5);
      expect(result.groups[0].key).toBe('A-idx0');
    });
  });
});