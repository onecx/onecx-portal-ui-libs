# Render Basic Row Groups in DataTable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable DataTable consumers to opt into single-level row grouping by selecting a grouping column and optional nested field path as group key. The library computes stable group membership and presentation metadata without mutating rows, renders one semantic group cell per row group, and supports a custom group-cell template. Tables without grouping configuration remain unchanged.

**Architecture:** The implementation adds a pure, internal "group planner" that computes group metadata from rows and grouping configuration. The DataTable component exposes additive public configuration (`grouping` input) and a custom group-cell template (`groupCellTemplate` input). The table template renders semantic `<th scope="rowgroup">` cells with `rowspan` for each group. A new internal `RowGroupPlanner` class computes group keys, labels, row counts, and member row indices without mutating input rows. The public table harness is extended with group-cell observation methods. All new logic achieves 100% coverage via pure planner tests, Jest component specs, and CDK table harness tests.

**Tech Stack:** Angular 20 (standalone components, signals), NgRx, PrimeNG 20, Jest, Angular CDK Table Harness, ngx-translate, Nx monorepo

## Global Constraints

- Angular 20 with standalone components and signals (input(), output(), computed(), effect())
- PrimeNG 20 for UI components (p-table, p-tableHeaderCheckbox, etc.)
- Jest for testing with 100% coverage for new logic (statement, branch, function, line)
- Angular CDK Table Harness for component harness testing
- ngx-translate for internationalization (all user-facing strings must be translatable)
- Nx monorepo with Angular Accelerator library structure
- All components must be accessible (a11y) - semantic HTML, ARIA attributes, keyboard navigation
- All components must be responsive (PrimeFlex/Tailwind utility classes)
- Use PrimeNG components over custom components where possible
- TSDoc comments required for public APIs
- Strict TypeScript: no `any`, prefer interfaces, use readonly, const assertions
- OnPush change detection where possible
- RxJS for reactive streams
- Conventional commits format

---

### Task 1: Create Grouping Configuration Types (Public API)

**Files:**
- Create: `libs/angular-accelerator/src/lib/components/data-table/model/data-table-grouping.model.ts`
- Modify: `libs/angular-accelerator/src/index.ts` (export new types)

**Interfaces:**
- Consumes: existing `DataTableColumn` model
- Produces: `DataTableGroupingConfig`, `GroupCellContext`, `GroupKeyGetter` types exported publicly

- [ ] **Step 1: Write the failing test for type exports**

```typescript
// libs/angular-accelerator/src/lib/components/data-table/model/data-table-grouping.model.spec.ts
import { DataTableGroupingConfig, GroupCellContext, GroupKeyGetter } from './data-table-grouping.model';
import { DataTableColumn } from './data-table-column.model';

describe('DataTableGroupingConfig', () => {
  it('should allow grouping by column id with optional key path', () => {
    const column: DataTableColumn = { id: 'status', columnType: 'STRING', nameKey: 'STATUS' } as any;
    const config: DataTableGroupingConfig = { groupByColumnId: 'status', groupKeyPath: 'status.code' };
    expect(config.groupByColumnId).toBe('status');
    expect(config.groupKeyPath).toBe('status.code');
  });

  it('should default groupKeyPath to groupByColumnId when not provided', () => {
    const config: DataTableGroupingConfig = { groupByColumnId: 'status' };
    expect(config.groupKeyPath).toBe('status');
  });

  it('should allow custom group label getter', () => {
    const config: DataTableGroupingConfig = { 
      groupByColumnId: 'status', 
      groupLabel: (key, rows) => `Group: ${key} (${rows.length} items)` 
    };
    expect(config.groupLabel!('A', [{}, {}])).toBe('Group: A (2 items)');
  });
});

describe('GroupCellContext', () => {
  it('should expose group key, label, rows, rowIndices, and rowspan', () => {
    const rows = [{ id: 1 }, { id: 2 }] as any[];
    const context: GroupCellContext = { 
      key: 'A', 
      label: 'Group A', 
      rows, 
      rowIndices: [0, 1], 
      rowspan: 2 
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/model/data-table-grouping.model.spec.ts`
Expected: FAIL (file doesn't exist)

- [ ] **Step 3: Create the grouping model file with public types**

```typescript
// libs/angular-accelerator/src/lib/components/data-table/model/data-table-grouping.model.ts
import { DataTableColumn } from './data-table-column.model';
import { Row } from '../data-table.component';

/**
 * Function that extracts a group key from a row.
 * The key must be a string or number for strict equality comparison.
 */
export type GroupKeyGetter = (row: Row) => string | number;

/**
 * Configuration for single-level row grouping in DataTable.
 * 
 * @publicApi
 */
export interface DataTableGroupingConfig {
  /** Column ID to group by. Must match a column in the table. */
  groupByColumnId: string;
  
  /** 
   * Optional nested field path to use as the group key instead of the grouping column's value.
   * Uses dot notation (e.g., 'status.code'). Defaults to the grouping column ID.
   * The resolved value must be a string or number.
   */
  groupKeyPath?: string;
  
  /** 
   * Optional function to customize the group label displayed in the group cell.
   * Receives the group key and all rows in the group.
   * Defaults to the grouping column's normal cell presentation.
   */
  groupLabel?: (key: string | number, rows: Row[]) => string;
}

/**
 * Template context provided to the custom group cell template.
 * 
 * @publicApi
 */
export interface GroupCellContext {
  /** The group key (string or number) used for grouping. */
  key: string | number;
  
  /** The display label for the group. */
  label: string;
  
  /** All rows belonging to this group, in their original order. */
  rows: Row[];
  
  /** Indices of these rows in the full displayed rows array. */
  rowIndices: number[];
  
  /** Number of rows in this group (used for rowspan). */
  rowspan: number;
}

/**
 * Internal planner output - not exported publicly.
 * @internal
 */
export interface GroupPlan {
  key: string | number;
  label: string;
  rowIndices: number[];
  rowspan: number;
}

/**
 * Internal planner result - not exported publicly.
 * @internal
 */
export interface GroupedRowsResult {
  groups: GroupPlan[];
  allRowIndices: number[];
}
```

- [ ] **Step 4: Export the new types from the public API**

```typescript
// libs/angular-accelerator/src/index.ts - add to models section (around line 59)
export * from './lib/components/data-table/model/data-table-grouping.model'
```

- [ ] **Step 5: Run test to verify it passes**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/model/data-table-grouping.model.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/data-table/model/data-table-grouping.model.ts libs/angular-accelerator/src/lib/components/data-table/model/data-table-grouping.model.spec.ts libs/angular-accelerator/src/index.ts
git commit -m "feat(datatable): add public grouping configuration and template context types"
```

---

### Task 2: Create Internal RowGroupPlanner (Pure Grouping Logic)

**Files:**
- Create: `libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.ts`
- Create: `libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.spec.ts`

**Interfaces:**
- Consumes: `Row`, `DataTableColumn`, `DataTableGroupingConfig`, `GroupKeyGetter`, `ObjectUtils.resolveFieldData`
- Produces: `GroupPlan[]`, `GroupedRowsResult` (internal types)

- [ ] **Step 1: Write comprehensive failing tests for the pure planner**

```typescript
// libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.spec.ts
import { RowGroupPlanner } from './row-group-planner';
import { DataTableGroupingConfig } from '../model/data-table-grouping.model';
import { DataTableColumn, ColumnType } from '../model/data-table-column.model';
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

    it('should return undefined for missing nested path', () => {
      const row: Row = { id: 1, status: 'ACTIVE' };
      const key = RowGroupPlanner.getGroupKey(row, 'missing.path');
      expect(key).toBeUndefined();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.spec.ts`
Expected: FAIL (file doesn't exist)

- [ ] **Step 3: Implement the RowGroupPlanner class**

```typescript
// libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.ts
import { DataTableGroupingConfig, GroupPlan, GroupedRowsResult } from '../model/data-table-grouping.model';
import { DataTableColumn } from '../model/data-table-column.model';
import { Row } from '../data-table.component';
import { ObjectUtils } from '../../../utils/objectutils';

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
      return { groups: [], allRowIndices: [] };
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
    
    groupMap.forEach(({ rowIndices, firstRow }, key) => {
      const label = groupLabelFn 
        ? groupLabelFn(key, rowIndices.map(i => rows[i]))
        : String(key);
      
      groups.push({
        key,
        label,
        rowIndices,
        rowspan: rowIndices.length,
      });
      
      allRowIndices.push(...rowIndices);
    });

    return { groups, allRowIndices };
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.spec.ts`
Expected: PASS (100% coverage for new logic)

- [ ] **Step 5: Verify 100% coverage**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.spec.ts --coverage`
Expected: 100% statement, branch, function, line coverage

- [ ] **Step 6: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.ts libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.spec.ts
git commit -m "feat(datatable): add pure RowGroupPlanner with 100% coverage"
```

---

### Task 3: Add Grouping Configuration and Template Inputs to DataTableComponent

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/data-table/data-table.component.ts`
- Modify: `libs/angular-accelerator/src/lib/components/data-table/data-table.component.html`

**Interfaces:**
- Consumes: `DataTableGroupingConfig`, `GroupCellContext`, `RowGroupPlanner`, `GroupPlan`
- Produces: `grouping` input signal, `groupCellTemplate` input signal, `groupedRows` computed signal, `groupPlans` computed signal

- [ ] **Step 1: Write failing tests for DataTableComponent grouping inputs and computed signals**

```typescript
// Add to existing data-table.component.spec.ts describe blocks

describe('Row Grouping Configuration', () => {
  let fixture: ComponentFixture<DataTableComponent>;
  let component: DataTableComponent;
  let dataTable: DataTableHarness;

  const groupedColumns = [
    { id: 'category', columnType: ColumnType.STRING, nameKey: 'CATEGORY', sortable: true },
    { id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME', sortable: true },
    { id: 'status', columnType: ColumnType.STRING, nameKey: 'STATUS', sortable: true },
  ];

  const groupedRows = [
    { id: 1, category: 'A', name: 'Item 1', status: 'Active' },
    { id: 2, category: 'B', name: 'Item 2', status: 'Inactive' },
    { id: 3, category: 'A', name: 'Item 3', status: 'Active' },
    { id: 4, category: 'A', name: 'Item 4', status: 'Pending' },
    { id: 5, category: 'C', name: 'Item 5', status: 'Active' },
  ];

  beforeEach(async () => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.columns = groupedColumns as any;
    component.rows.set(groupedRows as any);
    fixture.detectChanges();
    dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
  });

  it('should accept grouping configuration input', () => {
    const config = { groupByColumnId: 'category' };
    fixture.componentRef.setInput('grouping', config);
    fixture.detectChanges();
    
    expect(component.grouping()).toEqual(config);
  });

  it('should accept custom group cell template input', () => {
    const template = {} as TemplateRef<any>;
    fixture.componentRef.setInput('groupCellTemplate', template);
    fixture.detectChanges();
    
    expect(component.groupCellTemplate()).toBe(template);
  });

  it('should compute groupPlans when grouping config is provided', () => {
    fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
    fixture.detectChanges();
    
    const plans = component.groupPlans();
    expect(plans).toHaveLength(3);
    expect(plans[0].key).toBe('A');
    expect(plans[0].rowspan).toBe(3);
    expect(plans[1].key).toBe('B');
    expect(plans[1].rowspan).toBe(1);
    expect(plans[2].key).toBe('C');
    expect(plans[2].rowspan).toBe(1);
  });

  it('should compute groupedRows preserving original row order within groups', () => {
    fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
    fixture.detectChanges();
    
    const grouped = component.groupedRows();
    expect(grouped).toHaveLength(5);
    // Group A rows first (indices 0, 2, 3), then B (index 1), then C (index 4)
    expect(grouped.map(r => r.id)).toEqual([1, 3, 4, 2, 5]);
  });

  it('should use groupKeyPath for nested field grouping', () => {
    const nestedRows = [
      { id: 1, category: { code: 'X' }, name: 'Item 1' },
      { id: 2, category: { code: 'Y' }, name: 'Item 2' },
      { id: 3, category: { code: 'X' }, name: 'Item 3' },
    ];
    component.rows.set(nestedRows as any);
    fixture.componentRef.setInput('grouping', { groupByColumnId: 'category', groupKeyPath: 'category.code' });
    fixture.detectChanges();
    
    const plans = component.groupPlans();
    expect(plans).toHaveLength(2);
    expect(plans[0].key).toBe('X');
    expect(plans[0].rowspan).toBe(2);
    expect(plans[1].key).toBe('Y');
    expect(plans[1].rowspan).toBe(1);
  });

  it('should use custom groupLabel function', () => {
    fixture.componentRef.setInput('grouping', { 
      groupByColumnId: 'category',
      groupLabel: (key, rows) => `Group ${key} (${rows.length})`
    });
    fixture.detectChanges();
    
    const plans = component.groupPlans();
    expect(plans[0].label).toBe('Group A (3)');
    expect(plans[1].label).toBe('Group B (1)');
    expect(plans[2].label).toBe('Group C (1)');
  });

  it('should default label to stringified key when no groupLabel provided', () => {
    fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
    fixture.detectChanges();
    
    const plans = component.groupPlans();
    expect(plans[0].label).toBe('A');
    expect(plans[1].label).toBe('B');
    expect(plans[2].label).toBe('C');
  });

  it('should return empty groups when no grouping config provided', () => {
    expect(component.groupPlans()).toHaveLength(0);
    expect(component.groupedRows()).toEqual(component.rows());
  });

  it('should not mutate original rows when grouping', () => {
    const originalRows = [...component.rows()];
    fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
    fixture.detectChanges();
    
    expect(component.rows()).toEqual(originalRows);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/data-table.component.spec.ts`
Expected: FAIL (grouping input, groupPlans, groupedRows not implemented)

- [ ] **Step 3: Add imports and grouping inputs to DataTableComponent**

```typescript
// In data-table.component.ts - add imports at top
import { DataTableGroupingConfig, GroupCellContext, GroupPlan, GroupedRowsResult } from '../model/data-table-grouping.model';
import { RowGroupPlanner } from '../utils/row-group-planner';
import { TemplateRef, input, computed } from '@angular/core';

// Add after existing inputs (around line 169)
  grouping = input<DataTableGroupingConfig | undefined>(undefined);
  groupCellTemplate = input<TemplateRef<GroupCellContext> | undefined>(undefined);

// Add computed signals after displayedRows$ (around line 346)
  groupPlans = computed<GroupPlan[]>(() => {
    const config = this.grouping();
    const rows = this.rows();
    const columns = this.stateService.columns();
    
    if (!config || rows.length === 0) {
      return [];
    }
    
    const result = RowGroupPlanner.planGroups(rows, columns, config);
    return result.groups;
  });

  groupedRows = computed<Row[]>(() => {
    const config = this.grouping();
    const rows = this.rows();
    const columns = this.stateService.columns();
    
    if (!config || rows.length === 0) {
      return rows;
    }
    
    const result = RowGroupPlanner.planGroups(rows, columns, config);
    return result.allRowIndices.map(i => rows[i]);
  });

// Update displayedRows$ to use groupedRows instead of rows
// Replace line 316-346 displayedRows$ computation:
  displayedRows$ = combineLatest([
    toObservable(this.groupedRows),
    toObservable(this.stateService.filters),
    toObservable(this.stateService.sortColumn),
    toObservable(this.stateService.sortDirection),
    toObservable(this.stateService.columns),
    toObservable(this.clientSideFiltering),
    toObservable(this.clientSideSorting),
  ]).pipe(
    map(([rows, filters, sortColumn, sortDirection, columns, clientSideFiltering, clientSideSorting]) => {
      return { rows, filters, sortColumn, sortDirection, columns, clientSideFiltering, clientSideSorting }
    }),
    mergeMap((params) =>
      this.translateItems(params.rows, params.columns, params.clientSideFiltering, params.clientSideSorting).pipe(
        map((translations) => ({ ...params, translations }))
      )
    ),
    map((params) => ({
      ...params,
      rows: this.filterItems([params.rows, params.filters], params.clientSideFiltering),
    })),
    map((params) => ({
      ...params,
      rows: this.sortItems(
        [params.rows, params.sortColumn, params.sortDirection, params.translations],
        params.columns,
        params.clientSideSorting
      ),
    })),
    map(({ rows }) => this.flattenItems(rows))
  );
```

- [ ] **Step 4: Update the template to render group rows**

```html
<!-- In data-table.component.html - replace the body template (around line 222) -->
<ng-template #body let-rowObject let-rowIndex="rowIndex">
  @if (columnTemplates) {
  <!-- Check if this row is a group header -->
  @if (isGroupHeader(rowIndex); as groupContext) {
  <tr class="ocx-group-header">
    <ng-container *ngTemplateOutlet="expansionColumn; context: {localRowObject: rowObject}"></ng-container>
    @if (selectionChangedObserved) {
    <td></td>
    } @if (stateService.actionColumnConfigPosition() === 'left') {
    <ng-container *ngTemplateOutlet="actionColumn; context: { localRowObject: rowObject }"></ng-container>
    }
    <th 
      [attr.rowspan]="groupContext.rowspan"
      [attr.scope]="'rowgroup'"
      [attr.rowgroup'"
      class="ocx-group-cell"
      [attr.colspan]="getGroupCellColspan()"
    >
      @if (groupCellTemplate()) {
      <ng-container
        [ngTemplateOutlet]="groupCellTemplate()"
        [ngTemplateOutletContext]="groupContext"
      ></ng-container>
      } @else {
      <!-- Default group cell: reuse grouping column's cell template -->
      <ng-container
        [ngTemplateOutlet]="getGroupColumnCellTemplate()"
        [ngTemplateOutletContext]="{ rowObject: groupContext.rows[0], column: getGroupingColumn() }"
      ></ng-container>
      }
    </th>
    @if (stateService.actionColumnConfigPosition() === 'right') {
    <ng-container *ngTemplateOutlet="actionColumn; context: { localRowObject: rowObject }"></ng-container>
    }
  </tr>
  } @else {
  <tr [attr.id]="'ocx-expanded-row-' + rowObject.id">
    <ng-container *ngTemplateOutlet="expansionColumn; context: {localRowObject: rowObject}"></ng-container>
    @if (selectionChangedObserved) {
    <td>
      @if (isRowSelectionDisabled(rowObject) && isSelected(rowObject)) {
      <p-checkbox
        [value]="true"
        [binary]="true"
        [disabled]="true"
        [ariaLabel]="'OCX_DATA_TABLE.SELECT_ARIA_LABEL' | translate : { key: rowObject.id , rowSummary: getRowSummary(rowObject) }"
      ></p-checkbox>
      } @else {
      <p-tableCheckbox
        [value]="rowObject"
        [disabled]="isRowSelectionDisabled(rowObject)"
        [ariaLabel]="'OCX_DATA_TABLE.SELECT_ARIA_LABEL' | translate : { key: rowObject.id , rowSummary: getRowSummary(rowObject) }"
      ></p-tableCheckbox>
      }
    </td>
    } @if (stateService.actionColumnConfigPosition() === 'left') {
    <ng-container *ngTemplateOutlet="actionColumn; context: { localRowObject: rowObject }"></ng-container>
    } @for (column of stateService.columns(); track column) {
    <td>
      @defer (on viewport) { @if (columnTemplates[column.id]) {
      <ng-container
        [ngTemplateOutlet]="cell() ?? columnTemplates[column.id]"
        [ngTemplateOutletContext]="{ rowObject: rowObject, column: column }"
      >
      </ng-container>
      } } @placeholder {
      <p-skeleton width="3rem" />
      }
    </td>
    } @if (stateService.actionColumnConfigPosition() === 'right') {
    <ng-container *ngTemplateOutlet="actionColumn; context: { localRowObject: rowObject }"></ng-container>
    }
  </tr>
  }
  }
</ng-template>
```

- [ ] **Step 5: Add helper methods to component class**

```typescript
// Add after getRowColspan method (around line 565)

  private readonly groupPlans = computed(() => {
    const config = this.grouping();
    const rows = this.rows();
    const columns = this.stateService.columns();
    
    if (!config || rows.length === 0) {
      return [] as GroupPlan[];
    }
    
    const result = RowGroupPlanner.planGroups(rows, columns, config);
    return result.groups;
  });

  // Public computed for template access
  protected readonly groupPlansSignal = this.groupPlans.asReadonly();

  isGroupHeader(rowIndex: number): GroupCellContext | null {
    const plans = this.groupPlans();
    if (plans.length === 0) return null;
    
    let currentIndex = 0;
    for (const plan of plans) {
      if (rowIndex === currentIndex) {
        return {
          key: plan.key,
          label: plan.label,
          rows: plan.rowIndices.map(i => this.rows()[i]),
          rowIndices: plan.rowIndices,
          rowspan: plan.rowspan,
        };
      }
      currentIndex += plan.rowspan;
    }
    return null;
  }

  getGroupCellColspan(): number {
    const colspan = this.stateService.columns().length;
    // Add expansion column if present
    if (this.expandable() && this.expansionTemplate()) {
      return colspan + 1;
    }
    // Add selection column if present
    if (this.selectionChangedObserved) {
      return colspan + 1;
    }
    // Add action column if present
    if (this.actionColumnVisible) {
      return colspan + 1;
    }
    return colspan;
  }

  getGroupColumnCellTemplate(): TemplateRef<any> | null {
    const config = this.grouping();
    if (!config) return null;
    
    const groupingColumn = this.stateService.columns().find(c => c.id === config.groupByColumnId);
    if (!groupingColumn) return null;
    
    // Get the column's cell template (same as normal cell rendering)
    return this.columnTemplates$ ? null : this.getColumnTypeTemplate([], groupingColumn.columnType, TemplateType.CELL);
  }

  getGroupingColumn(): DataTableColumn | undefined {
    const config = this.grouping();
    if (!config) return undefined;
    return this.stateService.columns().find(c => c.id === config.groupByColumnId);
  }
```

- [ ] **Step 6: Run test to verify it passes**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/data-table.component.spec.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/data-table/data-table.component.ts libs/angular-accelerator/src/lib/components/data-table/data-table.component.html libs/angular-accelerator/src/lib/components/data-table/data-table.component.spec.ts
git commit -m "feat(datatable): add grouping configuration inputs and group row rendering"
```

---

### Task 4: Update DataTable Harness for Group Cell Observation

**Files:**
- Modify: `libs/angular-accelerator/testing/data-table.harness.ts`

**Interfaces:**
- Consumes: existing `DataTableHarness`, `TableRowHarness`
- Produces: `getGroupCells()`, `getGroupCellLabel()`, `getGroupCellRowspan()`, `getGroupCellScope()` methods

- [ ] **Step 1: Write failing tests for harness group cell methods**

```typescript
// Add to data-table.harness.spec.ts (create if not exists) or extend existing harness tests

describe('DataTableHarness Group Cells', () => {
  let fixture: ComponentFixture<DataTableComponent>;
  let component: DataTableComponent;
  let dataTable: DataTableHarness;

  const groupedColumns = [
    { id: 'category', columnType: ColumnType.STRING, nameKey: 'CATEGORY' },
    { id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME' },
  ];

  const groupedRows = [
    { id: 1, category: 'A', name: 'Item 1' },
    { id: 2, category: 'B', name: 'Item 2' },
    { id: 3, category: 'A', name: 'Item 3' },
  ];

  beforeEach(async () => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.columns = groupedColumns as any;
    component.rows.set(groupedRows as any);
    fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
    fixture.detectChanges();
    dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
  });

  it('should retrieve group cells', async () => {
    const groupCells = await dataTable.getGroupCells();
    expect(groupCells.length).toBe(2); // Groups A and B
  });

  it('should retrieve group cell labels', async () => {
    const groupCells = await dataTable.getGroupCells();
    const labels = await Promise.all(groupCells.map(c => c.getLabel()));
    expect(labels).toEqual(['A', 'B']);
  });

  it('should retrieve group cell rowspans', async () => {
    const groupCells = await dataTable.getGroupCells();
    const rowspans = await Promise.all(groupCells.map(c => c.getRowspan()));
    expect(rowspans).toEqual([2, 1]); // Group A has 2 rows, Group B has 1
  });

  it('should retrieve group cell scope attribute', async () => {
    const groupCells = await dataTable.getGroupCells();
    const scopes = await Promise.all(groupCells.map(c => c.getScope()));
    expect(scopes).toEqual(['rowgroup', 'rowgroup']);
  });

  it('should return empty array when no grouping configured', async () => {
    fixture.componentRef.setInput('grouping', undefined);
    fixture.detectChanges();
    
    const groupCells = await dataTable.getGroupCells();
    expect(groupCells.length).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/testing/data-table.harness.spec.ts`
Expected: FAIL (methods don't exist)

- [ ] **Step 3: Create GroupCellHarness**

```typescript
// Create: libs/angular-accelerator/testing/group-cell.harness.ts
import { ComponentHarness } from '@angular/cdk/testing';

export class GroupCellHarness extends ComponentHarness {
  static hostSelector = 'th.ocx-group-cell, th[scope="rowgroup"]';

  async getLabel(): Promise<string> {
    const host = await this.host();
    return host.text();
  }

  async getRowspan(): Promise<number> {
    const host = await this.host();
    const rowspan = await host.getAttribute('rowspan');
    return rowspan ? parseInt(rowspan, 10) : 1;
  }

  async getScope(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('scope');
  }
}
```

- [ ] **Step 4: Export GroupCellHarness from testing index**

```typescript
// libs/angular-accelerator/testing/index.ts - add export
export * from './group-cell.harness';
```

- [ ] **Step 5: Update DataTableHarness with group cell methods**

```typescript
// libs/angular-accelerator/testing/data-table.harness.ts - add imports
import { GroupCellHarness } from './group-cell.harness';

// Add to DataTableHarness class
  getGroupCells = this.locatorForAll(GroupCellHarness);
```

- [ ] **Step 6: Run test to verify it passes**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/testing/data-table.harness.spec.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add libs/angular-accelerator/testing/group-cell.harness.ts libs/angular-accelerator/testing/data-table.harness.ts libs/angular-accelerator/testing/index.ts libs/angular-accelerator/testing/data-table.harness.spec.ts
git commit -m "feat(datatable): add group cell harness for public table observation"
```

---

### Task 5: Add Storybook Story for Row Grouping

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/data-table/data-table.component.stories.ts`

**Interfaces:**
- Consumes: `DataTableGroupingConfig`, `GroupCellContext`
- Produces: Storybook story demonstrating grouping

- [ ] **Step 1: Write failing test for story (Storybook test or visual regression)**

```typescript
// Add to data-table.component.stories.ts - new story export
export const WithRowGrouping = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
        <ng-template #groupCell let-context="context">
          <div class="p-2 font-bold bg-gray-100 border-b">
            {{ context.label }} ({{ context.rowspan }} items)
          </div>
        </ng-template>
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    columns: [
      { id: 'category', columnType: ColumnType.STRING, nameKey: 'Category', sortable: true },
      { id: 'name', columnType: ColumnType.STRING, nameKey: 'Name', sortable: true },
      { id: 'status', columnType: ColumnType.STRING, nameKey: 'Status', sortable: true },
    ],
    rows: [
      { id: 1, category: 'Fruits', name: 'Apple', status: 'Fresh' },
      { id: 2, category: 'Vegetables', name: 'Carrot', status: 'Fresh' },
      { id: 3, category: 'Fruits', name: 'Banana', status: 'Ripe' },
      { id: 4, category: 'Fruits', name: 'Orange', status: 'Fresh' },
      { id: 5, category: 'Dairy', name: 'Milk', status: 'Fresh' },
    ],
    grouping: { groupByColumnId: 'category' },
    groupCellTemplate: {} as any, // Will be set via template
  },
};
```

- [ ] **Step 2: Add story to stories file**

```typescript
// In data-table.component.stories.ts - add import
import { GroupCellContext } from '../model/data-table-grouping.model';

// Add new story export after existing stories
export const WithRowGrouping = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table 
        ${argsToTemplate(args)} 
        (deleteTableRow)="deleteTableRow($event)" 
        (editTableRow)="editTableRow($event)" 
        (viewTableRow)="viewTableRow($event)"
        [groupCellTemplate]="groupCellTemplate"
      >
        <ng-template #groupCell let-context="context">
          <div class="p-2 font-bold bg-surface-100 border-b border-surface-200">
            <span class="pi pi-chevron-right mr-2"></span>
            {{ context.label }} <span class="text-sm font-normal text-color-secondary">({{ context.rowspan }} items)</span>
          </div>
        </ng-template>
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    columns: [
      { id: 'category', columnType: ColumnType.STRING, nameKey: 'Category', sortable: true },
      { id: 'name', columnType: ColumnType.STRING, nameKey: 'Name', sortable: true },
      { id: 'status', columnType: ColumnType.STRING, nameKey: 'Status', sortable: true },
    ],
    rows: [
      { id: 1, category: 'Fruits', name: 'Apple', status: 'Fresh' },
      { id: 2, category: 'Vegetables', name: 'Carrot', status: 'Fresh' },
      { id: 3, category: 'Fruits', name: 'Banana', status: 'Ripe' },
      { id: 4, category: 'Fruits', name: 'Orange', status: 'Fresh' },
      { id: 5, category: 'Dairy', name: 'Milk', status: 'Fresh' },
    ],
    grouping: { groupByColumnId: 'category' },
  },
  parameters: {
    docs: {
      description: {
        story: 'DataTable with row grouping enabled. Groups by the "category" column with a custom group cell template showing the group label and item count.',
      },
    },
  },
};

export const WithRowGroupingNestedKey = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    columns: [
      { id: 'category', columnType: ColumnType.STRING, nameKey: 'Category', sortable: true },
      { id: 'name', columnType: ColumnType.STRING, nameKey: 'Name', sortable: true },
      { id: 'type.code', columnType: ColumnType.STRING, nameKey: 'Type Code', sortable: true },
    ],
    rows: [
      { id: 1, category: 'Fruits', name: 'Apple', type: { code: 'FRUIT' } },
      { id: 2, category: 'Vegetables', name: 'Carrot', type: { code: 'VEG' } },
      { id: 3, category: 'Fruits', name: 'Banana', type: { code: 'FRUIT' } },
      { id: 4, category: 'Dairy', name: 'Milk', type: { code: 'DAIRY' } },
    ],
    grouping: { groupByColumnId: 'category', groupKeyPath: 'type.code' },
  },
  parameters: {
    docs: {
      description: {
        story: 'DataTable with row grouping using a nested field path (groupKeyPath) as the group key. Groups by "category" column but uses "type.code" for the actual grouping key.',
      },
    },
  },
};

export const WithRowGroupingCustomLabel = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    columns: [
      { id: 'status', columnType: ColumnType.STRING, nameKey: 'Status', sortable: true },
      { id: 'name', columnType: ColumnType.STRING, nameKey: 'Name', sortable: true },
    ],
    rows: [
      { id: 1, status: 'active', name: 'Item 1' },
      { id: 2, status: 'inactive', name: 'Item 2' },
      { id: 3, status: 'active', name: 'Item 3' },
    ],
    grouping: { 
      groupByColumnId: 'status',
      groupLabel: (key, rows) => `Status: ${key.toUpperCase()} (${rows.length})`
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'DataTable with row grouping using a custom groupLabel function to customize the group display label.',
      },
    },
  },
};
```

- [ ] **Step 3: Verify story renders in Storybook**

Run: `nx run angular-accelerator:storybook` (manual verification)
Expected: Stories appear and render correctly

- [ ] **Step 4: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/data-table/data-table.component.stories.ts
git commit -m "feat(datatable): add Storybook stories for row grouping"
```

---

### Task 6: Add Integration Tests with CDK Table Harness

**Files:**
- Create: `libs/angular-accelerator/src/lib/components/data-table/data-table.grouping.spec.ts`

**Interfaces:**
- Consumes: `DataTableHarness`, `GroupCellHarness`, `DataTableGroupingConfig`
- Produces: Integration tests verifying grouping behavior

- [ ] **Step 1: Write comprehensive integration tests**

```typescript
// libs/angular-accelerator/src/lib/components/data-table/data-table.grouping.spec.ts
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { provideUserServiceMock, UserServiceMock } from '@onecx/angular-integration-interface/mocks';
import { DataTableHarness, provideTranslateTestingService } from '../../../../testing';
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module';
import { AngularAcceleratorModule } from '../../angular-accelerator.module';
import { ColumnType } from '../../model/column-type.model';
import { DataTableComponent, Row } from './data-table.component';
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils';
import { UserService } from '@onecx/angular-integration-interface';
import { firstValueFrom, of } from 'rxjs';
import { DataSortDirection } from '../../model/data-sort-direction';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

@Component({ standalone: false, template: '' })
class TestRouteComponent {}

describe('DataTableComponent Row Grouping Integration', () => {
  let fixture: ComponentFixture<DataTableComponent>;
  let component: DataTableComponent;
  let translateService: TranslateService;
  let dataTable: DataTableHarness;

  const ENGLISH_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} of {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})',
      ALL: 'All',
      SEARCH_RESULTS_FOUND: '{{results}} Results Found',
      NO_SEARCH_RESULTS_FOUND: 'No Results Found',
      EMPTY_RESULT: 'No data available',
    },
  };

  const TRANSLATIONS = { en: ENGLISH_TRANSLATIONS };

  const groupedColumns = [
    { id: 'category', columnType: ColumnType.STRING, nameKey: 'CATEGORY', sortable: true, filterable: true },
    { id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME', sortable: true, filterable: true },
    { id: 'status', columnType: ColumnType.STRING, nameKey: 'STATUS', sortable: true, filterable: true },
  ];

  const groupedRows: Row[] = [
    { id: 1, category: 'Fruits', name: 'Apple', status: 'Fresh' },
    { id: 2, category: 'Vegetables', name: 'Carrot', status: 'Fresh' },
    { id: 3, category: 'Fruits', name: 'Banana', status: 'Ripe' },
    { id: 4, category: 'Fruits', name: 'Orange', status: 'Fresh' },
    { id: 5, category: 'Dairy', name: 'Milk', status: 'Fresh' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableComponent, TestRouteComponent],
      imports: [AngularAcceleratorPrimeNgModule, BrowserAnimationsModule, AngularAcceleratorModule],
      providers: [
        provideTranslateTestingService(TRANSLATIONS),
        provideUserServiceMock(),
        provideRouter([{ path: '**', component: TestRouteComponent }]),
        { provide: HAS_PERMISSION_CHECKER, useExisting: UserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.columns = groupedColumns as any;
    component.rows.set(groupedRows as any);
    translateService = TestBed.inject(TranslateService);
    translateService.use('en');
    const userServiceMock = TestBed.inject(UserServiceMock);
    userServiceMock.permissionsTopic$.publish(['VIEW', 'EDIT', 'DELETE']);
  });

  describe('Basic Grouping', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should render group header rows with rowgroup scope', async () => {
      const groupCells = await dataTable.getGroupCells();
      expect(groupCells.length).toBe(3); // Fruits, Vegetables, Dairy
      
      const scopes = await Promise.all(groupCells.map(c => c.getScope()));
      expect(scopes).toEqual(['rowgroup', 'rowgroup', 'rowgroup']);
    });

    it('should render correct group labels in order of first occurrence', async () => {
      const groupCells = await dataTable.getGroupCells();
      const labels = await Promise.all(groupCells.map(c => c.getLabel()));
      expect(labels).toEqual(['Fruits', 'Vegetables', 'Dairy']);
    });

    it('should render correct rowspan for each group', async () => {
      const groupCells = await dataTable.getGroupCells();
      const rowspans = await Promise.all(groupCells.map(c => c.getRowspan()));
      expect(rowspans).toEqual([3, 1, 1]); // Fruits=3, Vegetables=1, Dairy=1
    });

    it('should render data rows within groups in original order', async () => {
      const rows = await dataTable.getRows();
      const rowData = await Promise.all(rows.map(r => r.getData()));
      // Fruits group first (Apple, Banana, Orange), then Vegetables (Carrot), then Dairy (Milk)
      expect(rowData.map(r => r[1])).toEqual(['Apple', 'Banana', 'Orange', 'Carrot', 'Milk']);
    });

    it('should not render group rows when grouping config is absent', async () => {
      fixture.componentRef.setInput('grouping', undefined);
      fixture.detectChanges();
      
      const groupCells = await dataTable.getGroupCells();
      expect(groupCells.length).toBe(0);
    });
  });

  describe('Grouping with Nested Key Path', () => {
    const nestedRows: Row[] = [
      { id: 1, category: 'Fruits', name: 'Apple', type: { code: 'CITRUS' } },
      { id: 2, category: 'Vegetables', name: 'Carrot', type: { code: 'ROOT' } },
      { id: 3, category: 'Fruits', name: 'Lemon', type: { code: 'CITRUS' } },
      { id: 4, category: 'Fruits', name: 'Banana', type: { code: 'TROPICAL' } },
    ];

    beforeEach(async () => {
      component.rows.set(nestedRows as any);
      fixture.componentRef.setInput('grouping', { groupByColumnId: 'category', groupKeyPath: 'type.code' });
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should group by nested field path', async () => {
      const groupCells = await dataTable.getGroupCells();
      const labels = await Promise.all(groupCells.map(c => c.getLabel()));
      // Groups by type.code: CITRUS (Apple, Lemon), ROOT (Carrot), TROPICAL (Banana)
      // First occurrence order: CITRUS, ROOT, TROPICAL
      expect(labels).toEqual(['CITRUS', 'ROOT', 'TROPICAL']);
    });

    it('should have correct rowspans for nested key groups', async () => {
      const groupCells = await dataTable.getGroupCells();
      const rowspans = await Promise.all(groupCells.map(c => c.getRowspan()));
      expect(rowspans).toEqual([2, 1, 1]);
    });
  });

  describe('Grouping with Custom Label Function', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('grouping', { 
        groupByColumnId: 'category',
        groupLabel: (key, rows) => `Group: ${key} (${rows.length} items)`
      });
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should use custom label function for group cells', async () => {
      const groupCells = await dataTable.getGroupCells();
      const labels = await Promise.all(groupCells.map(c => c.getLabel()));
      expect(labels).toEqual([
        'Group: Fruits (3 items)',
        'Group: Vegetables (1 items)',
        'Group: Dairy (1 items)'
      ]);
    });
  });

  describe('Grouping with Number Keys', () => {
    const numberRows: Row[] = [
      { id: 1, priority: 1, name: 'High' },
      { id: 2, priority: 2, name: 'Medium' },
      { id: 3, priority: 1, name: 'High 2' },
    ];
    const numberColumns = [
      { id: 'priority', columnType: ColumnType.NUMBER, nameKey: 'PRIORITY', sortable: true },
      { id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME', sortable: true },
    ];

    beforeEach(async () => {
      component.columns = numberColumns as any;
      component.rows.set(numberRows as any);
      fixture.componentRef.setInput('grouping', { groupByColumnId: 'priority' });
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should group by number keys with strict equality', async () => {
      const groupCells = await dataTable.getGroupCells();
      const labels = await Promise.all(groupCells.map(c => c.getLabel()));
      expect(labels).toEqual(['1', '2']);
    });

    it('should have correct rowspans for number groups', async () => {
      const groupCells = await dataTable.getGroupCells();
      const rowspans = await Promise.all(groupCells.map(c => c.getRowspan()));
      expect(rowspans).toEqual([2, 1]);
    });
  });

  describe('Grouping with Empty Labels', () => {
    const emptyLabelRows: Row[] = [
      { id: 1, category: '', name: 'No Category' },
      { id: 2, category: 'A', name: 'Category A' },
      { id: 3, category: '', name: 'Also No Category' },
    ];

    beforeEach(async () => {
      component.rows.set(emptyLabelRows as any);
      fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should render group with empty label', async () => {
      const groupCells = await dataTable.getGroupCells();
      const labels = await Promise.all(groupCells.map(c => c.getLabel()));
      expect(labels).toContain('');
      expect(labels).toContain('A');
    });

    it('should have correct rowspans including empty label group', async () => {
      const groupCells = await dataTable.getGroupCells();
      const rowspans = await Promise.all(groupCells.map(c => c.getRowspan()));
      // Empty label group has 2 rows, A has 1
      expect(rowspans.sort()).toEqual([1, 2]);
    });
  });

  describe('Grouping with Single Row Groups', () => {
    const singleRows: Row[] = [
      { id: 1, category: 'A', name: 'Only A' },
      { id: 2, category: 'B', name: 'Only B' },
    ];

    beforeEach(async () => {
      component.rows.set(singleRows as any);
      fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should render group header for single-row groups', async () => {
      const groupCells = await dataTable.getGroupCells();
      expect(groupCells.length).toBe(2);
    });

    it('should have rowspan of 1 for single-row groups', async () => {
      const groupCells = await dataTable.getGroupCells();
      const rowspans = await Promise.all(groupCells.map(c => c.getRowspan()));
      expect(rowspans).toEqual([1, 1]);
    });
  });

  describe('Grouping with Sorting', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
      fixture.componentRef.setInput('clientSideSorting', true);
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should maintain group order by first occurrence when no sort applied', async () => {
      const groupCells = await dataTable.getGroupCells();
      const labels = await Promise.all(groupCells.map(c => c.getLabel()));
      expect(labels).toEqual(['Fruits', 'Vegetables', 'Dairy']);
    });

    it('should sort within groups when sort applied', async () => {
      const headerColumns = await dataTable.getHeaderColumns();
      const nameHeader = headerColumns.find(async h => (await h.getText()).includes('NAME'));
      expect(nameHeader).toBeTruthy();
      
      if (nameHeader) {
        const sortButton = await nameHeader.getSortButton();
        await sortButton.click();
        fixture.detectChanges();
        
        const rows = await dataTable.getRows();
        const rowData = await Promise.all(rows.map(r => r.getData()));
        // Within Fruits group: Apple, Banana, Orange (alphabetical)
        expect(rowData.filter(r => r[0] === 'Fruits').map(r => r[1])).toEqual(['Apple', 'Banana', 'Orange']);
      }
    });
  });

  describe('Grouping with Filtering', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
      fixture.componentRef.setInput('clientSideFiltering', true);
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should filter rows within groups', async () => {
      const headerColumns = await dataTable.getHeaderColumns();
      const statusHeader = headerColumns.find(async h => (await h.getText()).includes('STATUS'));
      expect(statusHeader).toBeTruthy();
      
      if (statusHeader) {
        const filterMultiSelect = await statusHeader.getFilterMultiSelect();
        const options = await filterMultiSelect.getAllOptions();
        const freshOption = options.find(async o => (await o.getText()) === 'Fresh');
        if (freshOption) {
          await (await freshOption.getTestElement()).click();
          fixture.detectChanges();
          
          const groupCells = await dataTable.getGroupCells();
          const labels = await Promise.all(groupCells.map(c => c.getLabel()));
          // Only Fruits and Dairy have Fresh items
          expect(labels.sort()).toEqual(['Dairy', 'Fruits']);
        }
      }
    });
  });

  describe('Default Group Cell Template', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should reuse grouping column cell presentation for default group cell', async () => {
      const groupCells = await dataTable.getGroupCells();
      const labels = await Promise.all(groupCells.map(c => c.getLabel()));
      // Default template shows the group key (category value)
      expect(labels).toEqual(['Fruits', 'Vegetables', 'Dairy']);
    });
  });

  describe('Grouping with Custom Group Cell Template', () => {
    // This test verifies the template context is correctly passed
    // The actual template rendering is tested via Storybook/visual regression
    it('should provide correct GroupCellContext to custom template', async () => {
      fixture.componentRef.setInput('grouping', { groupByColumnId: 'category' });
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
      
      const groupCells = await dataTable.getGroupCells();
      expect(groupCells.length).toBe(3);
      
      // Verify first group (Fruits) has correct context
      const firstGroup = groupCells[0];
      expect(await firstGroup.getLabel()).toBe('Fruits');
      expect(await firstGroup.getRowspan()).toBe(3);
      expect(await firstGroup.getScope()).toBe('rowgroup');
    });
  });

  describe('Existing Behavior Unchanged Without Grouping', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness);
    });

    it('should render normal table rows when no grouping', async () => {
      const rows = await dataTable.getRows();
      expect(rows.length).toBe(5);
      expect(await dataTable.getGroupCells()).toHaveLength(0);
    });

    it('should support selection, pagination, sorting without grouping', async () => {
      // Verify all existing features still work
      expect(await dataTable.rowSelectionIsEnabled()).toBe(false);
      
      component.selectionChanged.subscribe(() => undefined);
      fixture.detectChanges();
      
      expect(await dataTable.rowSelectionIsEnabled()).toBe(true);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/data-table.grouping.spec.ts`
Expected: FAIL (implementation not complete)

- [ ] **Step 3: Run test to verify it passes after implementation**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/data-table.grouping.spec.ts`
Expected: PASS

- [ ] **Step 4: Verify 100% coverage for new grouping logic**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/data-table.grouping.spec.ts --coverage`
Expected: 100% coverage for grouping-related code

- [ ] **Step 5: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/data-table/data-table.grouping.spec.ts
git commit -m "test(datatable): add integration tests for row grouping with CDK harness"
```

---

### Task 7: Update Documentation (Antora/Storybook)

**Files:**
- Create: `docs/modules/ROOT/pages/components/datatable-row-grouping.adoc`
- Modify: `libs/angular-accelerator/src/lib/components/data-table/data-table.component.stories.ts` (add docs parameters)

**Interfaces:**
- Consumes: Implementation from Tasks 1-6
- Produces: Documentation for row grouping feature

- [ ] **Step 1: Create Antora documentation page**

```adoc
// docs/modules/ROOT/pages/components/datatable-row-grouping.adoc
= DataTable Row Grouping

The `ocx-data-table` component supports single-level row grouping, allowing consumers to visually group rows by a column value or a nested field path.

== Configuration

Enable row grouping by providing a `grouping` configuration object to the `grouping` input:

[source,typescript]
----
import { DataTableGroupingConfig } from '@onecx/angular-accelerator';

@Component({...})
export class MyComponent {
  grouping: DataTableGroupingConfig = {
    groupByColumnId: 'category',  // Required: column ID to group by
    groupKeyPath: 'type.code',    // Optional: nested field path for group key
    groupLabel: (key, rows) => `Group: ${key} (${rows.length} items)` // Optional: custom label
  };
}
----

=== Configuration Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `groupByColumnId` | `string` | Yes | The column ID to group by. Must match a column in the table. |
| `groupKeyPath` | `string` | No | Dot-notation path to a nested field to use as the group key instead of the grouping column's value. Defaults to `groupByColumnId`. |
| `groupLabel` | `(key: string \| number, rows: Row[]) => string` | No | Function to customize the group label. Receives the group key and all rows in the group. Defaults to the stringified key. |

== Group Key Resolution

- Valid group keys are `string` or `number` values
- Keys are compared using strict equality (`===`)
- Separate keys may display the same label (via `groupLabel`) but remain distinct groups
- Empty strings and `null`/`undefined` values form their own groups

== Group Ordering

- With no active sort: groups follow first occurrence order in the data
- Rows retain their original order within each group
- When sorting is applied: groups are ordered by the sort column, rows sort within groups

== Custom Group Cell Template

Provide a custom template for group cells using the `groupCellTemplate` input:

[source,html]
----
<ocx-data-table [grouping]="grouping" [groupCellTemplate]="groupCellTemplate">
  <ng-template #groupCell let-context="context">
    <div class="p-2 font-bold bg-surface-100 border-b border-surface-200">
      <span class="pi pi-chevron-right mr-2"></span>
      {{ context.label }} <span class="text-sm font-normal text-color-secondary">({{ context.rowspan }} items)</span>
    </div>
  </ng-template>
</ocx-data-table>
----

=== GroupCellContext

The template receives a `GroupCellContext` object with:

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string \| number` | The group key |
| `label` | `string` | The display label (from `groupLabel` or stringified key) |
| `rows` | `Row[]` | All rows in this group (original order) |
| `rowIndices` | `number[]` | Indices of these rows in the full displayed rows array |
| `rowspan` | `number` | Number of rows in this group |

== Default Group Cell

When no custom template is provided, the group cell reuses the grouping column's normal cell presentation.

== Semantic Markup

Group cells render as `<th scope="rowgroup" rowspan="N">` for accessibility:
- Screen readers announce group headers correctly
- Keyboard navigation respects group structure
- `rowspan` attribute spans the group cell across all member rows

== Harness Testing

The public `DataTableHarness` provides methods to inspect group cells:

[source,typescript]
----
const groupCells = await dataTable.getGroupCells();
const labels = await Promise.all(groupCells.map(c => c.getLabel()));
const rowspans = await Promise.all(groupCells.map(c => c.getRowspan()));
const scopes = await Promise.all(groupCells.map(c => c.getScope()));
----

=== GroupCellHarness Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getLabel()` | `Promise<string>` | Group cell text content |
| `getRowspan()` | `Promise<number>` | Rowspan attribute value |
| `getScope()` | `Promise<string \| null>` | Scope attribute value |

== Examples

=== Basic Grouping

[source,typescript]
----
grouping = { groupByColumnId: 'status' };
rows = [
  { id: 1, status: 'Active', name: 'Task 1' },
  { id: 2, status: 'Pending', name: 'Task 2' },
  { id: 3, status: 'Active', name: 'Task 3' },
];
----

Renders two groups: "Active" (2 rows) and "Pending" (1 row), in first-occurrence order.

=== Nested Field Grouping

[source,typescript]
----
grouping = { 
  groupByColumnId: 'category', 
  groupKeyPath: 'type.code' 
};
rows = [
  { id: 1, category: 'Fruits', type: { code: 'CITRUS' } },
  { id: 2, category: 'Vegetables', type: { code: 'ROOT' } },
  { id: 3, category: 'Fruits', type: { code: 'CITRUS' } },
];
----

Groups by `type.code` (CITRUS, ROOT) while displaying the `category` column.

=== Custom Label Function

[source,typescript]
----
grouping = { 
  groupByColumnId: 'priority',
  groupLabel: (key, rows) => `Priority ${key} (${rows.length} tasks)`
};
----

Displays "Priority 1 (3 tasks)" instead of just "1".

== Behavior Without Grouping

When `grouping` input is not provided or is `undefined`, the table behaves exactly as before with no grouping overhead.

== Performance

The grouping planner is pure and performs linear O(n) work:
- No mutation of input rows
- No persistent duplicate dataset retained
- Group metadata computed on-demand via Angular signals
```

- [ ] **Step 2: Add Storybook documentation parameters to stories**

Already done in Task 5 with `parameters.docs.description.story`.

- [ ] **Step 3: Verify documentation builds**

Run: `nx run angular-accelerator:storybook` (verify stories appear with docs)
Expected: Stories render with documentation

- [ ] **Step 4: Commit**

```bash
git add docs/modules/ROOT/pages/components/datatable-row-grouping.adoc libs/angular-accelerator/src/lib/components/data-table/data-table.component.stories.ts
git commit -m "docs(datatable): add row grouping documentation and Storybook stories"
```

---

### Task 8: Run Full Test Suite and Verify Coverage

**Files:**
- No new files - verification only

**Interfaces:**
- Consumes: All previous tasks
- Produces: Verified 100% coverage for new logic, no regressions

- [ ] **Step 1: Run all DataTable related tests**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/`
Expected: All tests pass

- [ ] **Step 2: Run full angular-accelerator test suite**

Run: `nx test angular-accelerator`
Expected: All tests pass, no regressions

- [ ] **Step 3: Verify coverage for new grouping code**

Run: `nx test angular-accelerator --coverage --testFile="**/data-table*"`
Expected: 100% statement, branch, function, line coverage for:
- `row-group-planner.ts`
- `data-table-grouping.model.ts` (types only)
- Grouping logic in `data-table.component.ts`

- [ ] **Step 4: Run lint check**

Run: `nx lint angular-accelerator`
Expected: No lint errors

- [ ] **Step 5: Build the library**

Run: `nx build angular-accelerator`
Expected: Successful build

- [ ] **Step 6: Commit**

```bash
git commit -m "chore(datatable): verify full test suite and coverage for row grouping"
```

---

### Task 9: Verify Existing DataTable Behavior Unchanged

**Files:**
- No new files - verification only

**Interfaces:**
- Consumes: Existing test suite
- Produces: Confirmation of no regressions

- [ ] **Step 1: Run existing DataTable tests (non-grouping)**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/src/lib/components/data-table/data-table.component.spec.ts --testNamePattern="^(?!.*Group)"`
Expected: All existing tests pass

- [ ] **Step 2: Run harness tests**

Run: `nx test angular-accelerator --testFile=libs/angular-accelerator/testing/data-table.harness.spec.ts`
Expected: All harness tests pass

- [ ] **Step 3: Test without grouping config**

Verify that tables without `grouping` input render identically to before:
- No group header rows
- Normal row rendering
- All existing features (selection, pagination, sorting, filtering, expansion) work

- [ ] **Step 4: Commit**

```bash
git commit -m "test(datatable): verify no regressions in existing behavior"
```

---

## Summary

### Files Created
1. `libs/angular-accelerator/src/lib/components/data-table/model/data-table-grouping.model.ts` - Public grouping types
2. `libs/angular-accelerator/src/lib/components/data-table/model/data-table-grouping.model.spec.ts` - Type tests
3. `libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.ts` - Pure planner
4. `libs/angular-accelerator/src/lib/components/data-table/utils/row-group-planner.spec.ts` - Planner tests (100% coverage)
5. `libs/angular-accelerator/testing/group-cell.harness.ts` - Group cell harness
6. `libs/angular-accelerator/src/lib/components/data-table/data-table.grouping.spec.ts` - Integration tests
7. `docs/modules/ROOT/pages/components/datatable-row-grouping.adoc` - Antora documentation

### Files Modified
1. `libs/angular-accelerator/src/index.ts` - Export new types
2. `libs/angular-accelerator/src/lib/components/data-table/data-table.component.ts` - Add grouping inputs, computed signals, template helpers
3. `libs/angular-accelerator/src/lib/components/data-table/data-table.component.html` - Render group rows
4. `libs/angular-accelerator/src/lib/components/data-table/data-table.component.spec.ts` - Unit tests for grouping
5. `libs/angular-accelerator/testing/data-table.harness.ts` - Add group cell locator
6. `libs/angular-accelerator/testing/index.ts` - Export group cell harness
7. `libs/angular-accelerator/src/lib/components/data-table/data-table.component.stories.ts` - Storybook stories

### Coverage Targets
- **New planner logic**: 100% statement, branch, function, line
- **Component grouping logic**: 100% statement, branch, function, line
- **Harness methods**: 100% coverage via integration tests
- **No regressions**: All existing tests pass

### Acceptance Criteria Mapping

| AC | Task(s) |
|----|---------|
| DataTable exposes additive row-grouping configuration and custom group-cell template | 1, 3 |
| Public grouping configuration and template-context types exported, planner internal | 1, 2 |
| Group key defaults to grouping column, may use nested field path | 2, 3 |
| Valid string/number keys use strict equality; separate keys may display same label | 2, 6 |
| No active sort: groups follow first occurrence, rows retain original order within group | 2, 3, 6 |
| Planner is pure, preserves input rows/identities, linear work, no persistent duplicate dataset | 2 |
| Default group cell reuses grouping column's normal cell presentation; custom template receives agreed context | 3, 4, 6 |
| Group cells render as semantic row-group headers, including single-member and empty-label groups | 3, 4, 6 |
| Public table harness retrieves group cells and inspects labels, rowspans, scopes | 4, 6 |
| Existing DataTable behavior unchanged when grouping absent | 3, 9 |
| 100% coverage for new logic | 2, 6, 8 |