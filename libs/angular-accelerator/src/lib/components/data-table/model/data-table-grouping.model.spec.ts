import { DataTableGroupingConfig, GroupCellContext, GroupKeyGetter } from './data-table-grouping.model';
import { DataTableColumn } from '../../../model/data-table-column.model';
import { ColumnType } from '../../../model/column-type.model';
import { Row } from '../data-table.component';

describe('DataTableGroupingConfig', () => {
  it('should allow grouping by column id with optional key path', () => {
    const column: DataTableColumn = { id: 'status', columnType: ColumnType.STRING, nameKey: 'STATUS' } as any;
    const config: DataTableGroupingConfig = { groupByColumnId: 'status', groupKeyPath: 'status.code' };
    expect(config.groupByColumnId).toBe('status');
    expect(config.groupKeyPath).toBe('status.code');
  });

  it('should default groupKeyPath to groupByColumnId when not provided', () => {
    const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
    expect(config.groupKeyPath).toBeUndefined();
  });

  it('should allow custom group label getter', () => {
    const config: DataTableGroupingConfig = {
      groupByColumnId: 'status',
      groupLabel: (key, rows) => `Group: ${key} (${rows.length} items)`,
    };
    expect(config.groupLabel!('A', [{}, {}])).toBe('Group: A (2 items)');
  });
});

describe('GroupCellContext', () => {
  it('should expose group key, label, rows, rowIndices, and rowspan', () => {
    const rows = [{ id: 1 }, { id: 2 }] as Row[];
    const context: GroupCellContext = {
      key: 'A',
      label: 'Group A',
      rows,
      rowIndices: [0, 1],
      rowspan: 2,
    };
    expect(context.key).toBe('A');
    expect(context.label).toBe('Group A');
    expect(context.rows).toBe(rows);
    expect(context.rowIndices).toEqual([0, 1]);
    expect(context.rowspan).toBe(2);
  });
});

describe('GroupKeyGetter', () => {
  it('should be a function type accepting row and returning string|number', () => {
    const getter: GroupKeyGetter = (row: any) => row.status?.code ?? row.status;
    expect(getter({ status: { code: 'A' } })).toBe('A');
    expect(getter({ status: 'B' })).toBe('B');
  });
});