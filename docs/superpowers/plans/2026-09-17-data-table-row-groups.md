# Implementation Plan: Render basic row groups in DataTable (issue #387)

## Problem Statement

`DataTable` (`libs/angular-accelerator/src/lib/components/data-table/data-table.component.ts`) renders a flat list of rows via PrimeNG `<p-table>` (`[value]="(displayedRows$ | async) ?? []"`). It has no way to visually cluster rows that share a value in one column (e.g. all "Apples" rows under an "Apples" header). Issue #387 requires an additive, opt-in row-grouping capability: when a consumer supplies a grouping config, `DataTable` renders one semantic row-group header before the first member row of each group, reuses the grouping column's normal cell presentation by default, supports a custom group-cell template with an agreed context, and exposes the public configuration and context types through the library's public API while keeping the planning logic internal. When the config is absent, behavior is byte-for-byte unchanged.

The existing "grouping" components (`column-group-selection`, `custom-group-column-selector`, `DataTableColumn.predefinedGroupKeys`) implement **column** grouping (which columns are shown). This issue is **row** grouping — a different, net-new feature. Do not conflate or modify those.

## Approach

Rendering model: PrimeNG invokes the existing `#body` template (`let-rowObject`) once per row, in `displayedRows$` order. A row-group header is rendered as an extra `<tr class="ocx-data-table-group-row">` with a single `<th scope="rowgroup">`, emitted by `#body` when the current row is the first member of a group. The data `<tr>` is untouched.

Data flow: `displayedRows$` ends fully filtered/translated/sorted/flattened (`flattenItems` → `flattenObject`, so nested values live under dot-joined keys like `"category.sub"`). The group plan is derived from that same flattened stream via a new signal, `displayedRowsSignal = toSignal(displayedRows$, { initialValue: [] })`, and a `computed` that runs the pure planner. This mirrors `displayedRows$` (which is what the table binds to), so group starts and rendered rows stay in lockstep, and it leaves `displayedRows$` itself and every existing computed untouched — guaranteeing the "unchanged when config absent" criterion.

Planner (pure, internal): `planRowGroups(rows, groupKeyPath)` builds `Map<key, RowGroup>` in first-occurrence order. Key = direct property access `row[groupKeyPath]` on the flattened row (a dot path such as `category.sub` is a literal flattened key — this is why `ObjectUtils.resolveFieldData` must NOT be used; it re-splits the path and fails on flattened rows). Only `string`/`number` keys form groups (strict equality; separate keys may map to the same display label, e.g. numeric `1` and string `"1"`). `firstRowId` marks each group's start so the template needs no `let-index`. Single pass, O(n), no input mutation, no deep copy — the returned array is fresh and the row objects are the same references, so no persistent duplicate dataset exists beyond the plan's short-lived references.

Public vs internal split: public types (`DataTableRowGroupingConfig`, `DataTableGroupCellContext`) live in a new model file re-exported from `src/index.ts`. The planner and its return types (`RowGroup`, `RowGroupPlan`) live in a new utils file and are deliberately NOT re-exported.

Custom template: follows the established content-child pattern (`contentChild<TemplateRef>('groupCell')` + `groupCellTemplate` input), resolved by `groupCell = computed(() => groupCellTemplate() || groupCellChildTemplate())`, mirroring `cell`. Context is `DataTableGroupCellContext`.

Absence safety: every group-related template branch is guarded by `@if (rowGroupPlan())`, and every method returns a no-op when the plan is `null`, so an absent `rowGrouping` input renders the exact pre-change table.

## File-Level Task List

Ordered so each step compiles against the previous one. New files are justified inline.

### 1. `libs/angular-accelerator/src/lib/model/data-table-row-grouping.model.ts`
- **Action:** create
- **Summary:** Public row-grouping types, isolated from implementation so consumers import config + context but never the planner. New file justified: the issue requires exporting "public grouping configuration and template-context types" and no existing public file carries them; keeping them in a dedicated model file matches the repo convention (`data-table-column.model.ts`).
- **Concrete TODOs:**
  - Write exactly:
    ```ts
    import type { DataTableColumn } from './data-table-column.model'
    import type { Row } from '../components/data-table/data-table.component'

    export interface DataTableRowGroupingConfig {
      columnId: string
      groupKeyPath?: string
    }

    export interface DataTableGroupCellContext {
      groupKey: string | number
      label: string
      memberCount: number
      rowObject: Row
      column: DataTableColumn
    }
    ```
  - `import type` (not value import) so no runtime circular dependency with the component exists even though this file imports `Row` from the component module.
  - `DataTableRowGroupingConfig.columnId` identifies the grouping column; `groupKeyPath` is the optional nested (flattened) field to key on, defaulting to `columnId` when absent.
  - `DataTableGroupCellContext` carries the agreed group context (key, display label, member count, the group's first row for default rendering, and the grouping column for default template context).
- **Dependencies:** `data-table-column.model.ts` (exists), `data-table.component.ts` for the existing `Row` type (exists).

### 2. `libs/angular-accelerator/src/lib/utils/row-grouping-planner.ts`
- **Action:** create
- **Summary:** Internal pure planner that turns a flattened `Row[]` plus a key path into a group plan. New file justified: the acceptance criteria demand a "pure, linear, input-preserving" planner that must remain internal; co-locating it in a dedicated util file keeps it out of the public barrel and mirrors `flatten-object.ts` placement.
- **Concrete TODOs:**
  - Write exactly:
    ```ts
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
          label: key === null ? '' : String(key),
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
    ```
  - `key === key` excludes `NaN` (NaN is a number but `NaN !== NaN`), so NaN keys never form a group; the `typeof` guard restricts grouping to string/number.
  - Group order = first occurrence; `groupStartIds` holds exactly the `id` of each group's first member row.
  - `byKey`/`groups` are local to the call; no module-level state; no mutation of `rows` or its elements.
- **Dependencies:** `data-table.component.ts` for the `Row` type (exists). Not exported by any barrel.

### 3. `libs/angular-accelerator/src/lib/utils/row-grouping-planner.spec.ts`
- **Action:** create
- **Summary:** Pure Jest unit tests for the planner covering every branch of `planRowGroups` to satisfy the 100% statement/branch/function/line bar for new logic. New file justified: co-located unit spec is the repo convention (`flatten-object` has one; planner has none).
- **Concrete TODOs:**
  - Import `{ planRowGroups, RowGroupPlan }` from `./row-grouping-planner` and `Row` (type only) from `../components/data-table/data-table.component`.
  - `describe('planRowGroups')` with these cases (AAA, real data, no mocks):
    - "groups by the configured path and counts members" — rows sharing `dept` produce one group with `memberCount` equal to the share size; `groups` length is the distinct-key count.
    - "uses strict equality so numeric 1 and string '1' are separate groups" — `[{id:'a',v:1},{id:'b',v:'1'}]` on path `v` yields two groups with keys `1` and `'1'`; `groups[0].label === '1'` and `groups[1].label === '1'` (separate keys, identical labels).
    - "resolves a nested (flattened) field path via direct key access" — rows `{id:'1', 'category.sub':'X'}` grouped on `'category.sub'` form one group (proves it does NOT re-split the dot, unlike `resolveFieldData`).
    - "orders groups by first occurrence regardless of later ordering" — input `b,a,a,b,a` on a 2-key field yields group order `[b, a]`.
    - "keeps rows in original order within a group and only marks the first occurrence as a start" — for input ids `[1,2,3,4]` with keys `[A,B,A,B]`: `groupStartIds` = `{1,2}`; the group for `A` has `firstRowId 1` and `memberCount 2`.
    - "does not form a group for null, undefined, or object keys" — input where a row's key is `null`, one is missing (`undefined`), one is `{}`: those rows are excluded; `groups` reflects only valid keys; `groupStartIds` omits the excluded row ids.
    - "excludes NaN as a key" — a row with key `NaN` forms no group; `groups` empty for that input.
    - "returns empty structures for empty input and for all-invalid input" — `planRowGroups([], 'x')` and `planRowGroups([{id:'1'} as any, 'x'])` both give `groups.length === 0`, empty `groupStartIds`.
    - "produces a single-member group for a unique key" — one distinct row → one group, `memberCount 1`, `groupStartIds` has that id.
    - "is pure and does not mutate inputs" — snapshot `rows` with `structuredClone`; call `planRowGroups` twice; assert both returns deep-equal and `rows` deep-equals the snapshot.
    - "keeps the returned groups array fresh and row references stable" — assert `plan.groups[0].firstRow === rows[firstIndex]` (same reference, not a copy).
- **Dependencies:** Task 2.

### 4. `libs/angular-accelerator/src/lib/components/data-table/data-table.component.ts`
- **Action:** modify
- **Summary:** Add the grouping input, the derived plan signal/computed, the custom-template content-child, and four small methods; leave the existing `displayedRows$` pipeline, `cell`, and all other members untouched.
- **Concrete TODOs:**
  - In the `@angular/core/rxjs-interop` import (line 45), change to `import { toObservable, toSignal } from '@angular/core/rxjs-interop'`.
  - Add `import { planRowGroups, RowGroupPlan } from '../../utils/row-grouping-planner'` and `import type { DataTableRowGroupingConfig, DataTableGroupCellContext } from '../../model/data-table-row-grouping.model'`.
  - Immediately after the `displayedRows$` declaration (after the closing `)` on line 346), add:
    ```ts
    rowGrouping = input<DataTableRowGroupingConfig | undefined>(undefined)

    private readonly displayedRowsSignal = toSignal(this.displayedRows$, {
      initialValue: [] as Array<Row>,
    })

    groupingColumn = computed(() => {
      const config = this.rowGrouping()
      if (!config) {
        return undefined
      }
      return this.stateService.columns().find((c) => c.id === config.columnId)
    })

    rowGroupPlan = computed<RowGroupPlan | null>(() => {
      const config = this.rowGrouping()
      if (!config) {
        return null
      }
      const keyPath = config.groupKeyPath ?? config.columnId
      return planRowGroups(this.displayedRowsSignal() as Row[], keyPath)
    })
    ```
  - Add the custom-template content-child pair alongside the other cell templates (near line 220, after the `cell = computed(...)` block):
    ```ts
    groupCellTemplate = input<TemplateRef<any> | undefined>(undefined)
    groupCellChildTemplate = contentChild<TemplateRef<any>>('groupCell')
    groupCell = computed(() => {
      return this.groupCellTemplate() || this.groupCellChildTemplate()
    })
    ```
  - Add the four methods directly after `getRowColspan` (line 565):
    ```ts
    getGroupColspan(): number {
      return this.getRowColspan(!!this.expansionTemplate())
    }

    isRowGroupStart(row: Row): boolean {
      const plan = this.rowGroupPlan()
      return !!plan && plan.groupStartIds.has(row.id)
    }

    getGroupForRow(row: Row): RowGroup | undefined {
      const plan = this.rowGroupPlan()
      if (!plan) {
        return undefined
      }
      return plan.groups.find((g) => g.firstRowId === row.id)
    }

    getGroupContext(row: Row): DataTableGroupCellContext | undefined {
      const group = this.getGroupForRow(row)
      const column = this.groupingColumn()
      if (!group || !column) {
        return undefined
      }
      return {
        groupKey: group.key,
        label: group.label,
        memberCount: group.memberCount,
        rowObject: group.firstRow,
        column,
      }
    }
    ```
  - Add `import type { RowGroup } from '../../utils/row-grouping-planner'` (type-only; used only by `getGroupForRow`'s return type).
  - Do not modify `displayedRows$`, `cell`, `getRowColspan`, `columnTemplates$`, or the constructor `effect` blocks.
- **Dependencies:** Task 1, Task 2.

### 5. `libs/angular-accelerator/src/lib/components/data-table/data-table.component.html`
- **Action:** modify
- **Summary:** Emit one group-header `<tr>` before the data `<tr>` inside `#body`, guarded so it renders only when a plan exists and the row starts a group; the default content reuses the grouping column's cell presentation, the custom content is the `#groupCell` template.
- **Concrete TODOs:**
  - Inside `#body` (line 222), immediately after `@if (columnTemplates) {` (line 223) and before `<tr [attr.id]="'ocx-expanded-row-' + rowObject.id">` (line 224), insert:
    ```
    @if (rowGroupPlan()) { @if (isRowGroupStart(rowObject)) {
    <tr class="ocx-data-table-group-row">
      <th
        scope="rowgroup"
        [colspan]="getGroupColspan()"
        [attr.data-group-key]="getGroupForRow(rowObject)?.key ?? ''"
      >
        @if (groupCell(); as customGroupCell) {
        <ng-container
          [ngTemplateOutlet]="customGroupCell"
          [ngTemplateOutletContext]="getGroupContext(rowObject)"
        ></ng-container>
        } @else {
        <ng-container
          [ngTemplateOutlet]="cell() ?? columnTemplates[groupingColumn()?.id!]"
          [ngTemplateOutletContext]="{
            rowObject: getGroupForRow(rowObject)?.firstRow ?? rowObject,
            column: groupingColumn()!
          }"
        ></ng-container>
        }
      </th>
    </tr>
    } }
    ```
  - The outer `@if (rowGroupPlan())` keeps the pre-change template byte-identical for tables without a grouping config; the group `<tr>` is emitted in the same per-row pass as the data `<tr>`, so ordering and group-start detection are consistent.
  - Default branch reuses the same `cell() ?? columnTemplates[...]` expression the data cell uses, so date/number/translation-key presentation and "same label, distinct key" cases behave identically.
  - `scope="rowgroup"` is fixed so the harness (`th[scope="rowgroup"]`) and screen readers always find a semantic row-group header, including single-member groups and empty labels.
  - Leave the existing data `<tr>` (lines 224–260) untouched.
- **Dependencies:** Task 4.

### 6. `libs/angular-accelerator/src/lib/components/data-table/data-table.component.scss`
- **Action:** modify
- **Summary:** Give the group header row a visually distinct, readable band (distinct background + weight) so it reads as a header.
- **Concrete TODOs:**
  - Append at end of file (after the `.sr-only` block, line 52):
    ```scss
    .ocx-data-table-group-row th[scope='rowgroup'] {
      background: $clr-neutral-100;
      color: $clr-neutral-700;
      font-weight: 700;
      text-align: left;
    }
    ```
  - Uses the existing `$clr-neutral-100`/`$clr-neutral-700` variables (defined lines 1 and 3); single quotes in the attribute selector match the file's SCSS style.
- **Dependencies:** Task 5 (selector targets the class/attribute the template renders).

### 7. `libs/angular-accelerator/src/index.ts`
- **Action:** modify
- **Summary:** Export the public row-grouping types only; the planner stays internal.
- **Concrete TODOs:**
  - Add, adjacent to the existing `export * from './lib/model/data-table-column.model'` (line 61), the line `export * from './lib/model/data-table-row-grouping.model'`.
  - Add no export for `./lib/utils/row-grouping-planner` (keeps `planRowGroups`/`RowGroup`/`RowGroupPlan` internal per the criterion "planner and presentation metadata remain internal").
- **Dependencies:** Task 1.

### 8. `libs/angular-accelerator/testing/data-table.harness.ts`
- **Action:** modify
- **Summary:** Let integration tests retrieve group cells and inspect their labels, colspans (rowspan), and scopes, satisfying the harness acceptance criterion.
- **Concrete TODOs:**
  - Add near the other `locatorForAll` fields (after `getRows`, line 31): `getGroupCells = this.locatorForAll('th[scope="rowgroup"]')`.
  - Add these methods (place after `columnIsFrozen`, line 113):
    ```ts
    async getGroupCellLabels(): Promise<(string | null)[]> {
      const cells = await this.getGroupCells()
      return cells.map((cell) => cell.getText())
    }

    async getGroupCellScopes(): Promise<(string | null)[]> {
      const cells = await this.getGroupCells()
      return cells.map((cell) => cell.getAttribute('scope'))
    }

    async getGroupCellColspans(): Promise<number[]> {
      const cells = await this.getGroupCells()
      const values: number[] = []
      for (const cell of cells) {
        const colspan = await cell.getAttribute('colspan')
        values.push(colspan === null || colspan === undefined ? NaN : Number(colspan))
      }
      return values
    }

    async getGroupCellRowspans(): Promise<number[]> {
      const cells = await this.getGroupCells()
      const values: number[] = []
      for (const cell of cells) {
        const rowspan = await cell.getAttribute('rowspan')
        values.push(rowspan === null || rowspan === undefined ? NaN : Number(rowspan))
      }
      return values
    }
    ```
  - `getGroupCells` returns the actual `TestElement[]` so callers can also assert `data-group-key`; `getGroupCellColspans`/`getGroupCellRowspans` read the live attributes and return `NaN` where the attribute is absent (a group header uses `colspan`, not `rowspan`, so `getGroupCellRowspans()` is expected to be all `NaN` — see Notes).
- **Dependencies:** Task 5 (selector targets the rendered `th[scope="rowgroup"]`).

### 9. `libs/angular-accelerator/src/lib/components/data-table/data-table.component.spec.ts`
- **Action:** modify
- **Summary:** Add a `describe('row grouping')` block: one host component renders the table with a `#groupCell` content-child and grouping config for render tests; the existing base fixture (no config) proves unchanged behavior; direct unit calls cover `getGroupContext`/`isRowGroupStart`/`getGroupColspan`/`groupCell`.
- **Concrete TODOs:**
  - At the top of the file add imports: `import { planRowGroups } from '../../utils/row-grouping-planner'` (only if a spec case asserts planner wiring; otherwise omit), and add a local host component immediately after `class TestRouteComponent {}` (line 26):
    ```ts
    @Component({
      standalone: false,
      template: `
        <ocx-data-table [rows]="rows" [columns]="columns" [rowGrouping]="rowGrouping">
          <ng-template #groupCell let-group="group" let-rowObject="rowObject" let-column="column">
            <span data-testid="custom-group">
              CUSTOM:[{{ group.groupKey }}] members={{ group.memberCount }}
            </span>
          </ng-template>
        </ocx-data-table>
      `,
    })
    class GroupingHostComponent {
      rows: Row[] = []
      columns: any[] = []
      rowGrouping: any = undefined
    }
    ```
  - Create a helper in `beforeEach` scope is unnecessary; build the host fixture per test with the same providers as the base `beforeEach` (reuse by extracting nothing — duplicate the `TestBed.configureTestingModule` provider list into the new describe's `beforeEach`).
  - Add `describe('row grouping', () => { ... })` containing:
    - "renders a semantic group cell for each group with the default cell presentation" — set base `component` (no custom template), `component.rows.set([{ id: 1, status: 'A' }, { id: 2, status: 'B' }, { id: 3, status: 'A' }] as any)`, `fixture.componentRef.setInput('rowGrouping', { columnId: 'status' })`, `fixture.detectChanges()`, `await new Promise((r) => setTimeout(r, 80))` (wait out the `debounceTime(50)` that gates `columnTemplates$`), then via `dataTable.getGroupCells()` assert length `2`, `getGroupCellScopes()` = `['rowgroup', 'rowgroup']`, `getGroupCellColspans()` = `[n, n]` where `n === component.getRowColspan(false)`, and each `data-group-key` attribute is `'A'` and `'B'` in that order.
    - "renders the custom #groupCell template with the agreed context" — create `GroupingHostComponent` fixture, `host.rows = [{ id: 1, status: 'A' }, { id: 2, status: 'A' }, { id: 3, status: 'B' }]`, `host.columns = [{ columnType: ColumnType.TRANSLATION_KEY, id: 'status', nameKey: 'COLUMN_HEADER_NAME.STATUS' }]`, `host.rowGrouping = { columnId: 'status' }`, detectChanges + wait 80ms; assert `dataTable.getGroupCells()` length `2` and that the rendered custom spans read `CUSTOM:A members=2` and `CUSTOM:B members=1` (read via `hostFixture.nativeElement.querySelectorAll('[data-testid="custom-group"]')` textContent), proving the context's `groupKey`/`memberCount` are delivered and `#groupCell` overrides the default.
    - "renders a group cell for a single-member group" — host with rows `[{id:1,status:'X'},{id:2,status:'Y'}]`, assert `getGroupCells()` length `2` (both single-member groups render).
    - "renders a group cell for an empty label" — host with a grouping column id `empty` and rows `[{id:1,empty:''},{id:2,empty:''}]`, `rowGrouping={columnId:'empty'}`; assert `getGroupCells()` length `1` and the single `th` has `scope="rowgroup"` (empty-string label still renders a header).
    - "renders nothing when no rowGrouping config is present" — base `component`, default `mockData`, do not set `rowGrouping`; assert `await dataTable.getGroupCells()` has length `0` and `component.rowGroupPlan()` is `null`; existing `getRows()` count is unchanged from the no-grouping baseline.
    - "returns the custom template via groupCell (input preferred over content child)" — mirroring the existing `stringFilterCell` test: `fixture.componentRef.setInput('groupCellTemplate', inputTpl as any)`, `component.groupCellChildTemplate = () => childTpl as any`, `expect(component.groupCell()).toBe(inputTpl)`; set `groupCellTemplate` undefined, `expect(component.groupCell()).toBe(childTpl)`.
    - "isRowGroupStart reflects only the first member of each group" — base `component`, set rows `[{id:'1',status:'A'},{id:'2',status:'B'},{id:'3',status:'A'}]`, set `rowGrouping` to `{columnId:'status'}` and detectChanges; assert `component.isRowGroupStart({id:'1'}) === true`, `isRowGroupStart({id:'2'}) === true`, `isRowGroupStart({id:'3'}) === false`; with `rowGrouping` unset, `isRowGroupStart({id:'1'}) === false`.
    - "getGroupContext returns the agreed context and undefined when no grouping" — with the grouped state above, assert `component.getGroupContext({id:'1'})` deep-equals `{ groupKey: 'A', label: 'A', memberCount: 2, rowObject: {id:'1',status:'A'}, column: <the status DataTableColumn> }`; with no `rowGrouping`, `getGroupContext({id:'1'})` is `undefined`.
    - "getGroupColspan matches the data row colspan" — assert `component.getGroupColspan() === component.getRowColspan(false)` and, with `expandable` + an expansion template, `=== component.getRowColspan(true)` (covers both `hasExpansionTemplate` branches of the delegated `getRowColspan`).
- **Dependencies:** Tasks 4, 5, 8.

### 10. `libs/angular-accelerator/src/lib/components/data-table/data-table.component.stories.ts`
- **Action:** modify
- **Summary:** Add a `WithRowGrouping` story demonstrating default grouping and a custom `#groupCell`.
- **Concrete TODOs:**
  - Add a dedicated args object near `defaultComponentArgs` (after line 126):
    ```ts
    const rowGroupingArgs = {
      columns: [
        { id: 'name', columnType: ColumnType.STRING, nameKey: 'Name', sortable: true },
        { id: 'amount', columnType: ColumnType.NUMBER, nameKey: 'Amount', sortable: true },
      ],
      rows: [
        { id: 1, name: 'Apples', amount: 2 },
        { id: 2, name: 'Apples', amount: 4 },
        { id: 3, name: 'Bananas', amount: 10 },
        { id: 4, name: 'Cherries', amount: 7 },
        { id: 5, name: 'Cherries', amount: 1 },
        { id: 6, name: 'Cherries', amount: 3 },
      ],
      rowGrouping: { columnId: 'name' },
    }
    ```
  - Add a story near the other template stories (e.g., after `WithCaptionTemplate`, before `export default`):
    ```ts
    const RowGroupingStory: StoryFn<DataTableComponent> = (args) => ({
      props: { ...args },
      template: `
        <ng-template #groupCell let-group="group" let-rowObject="rowObject" let-column="column">
          <div class="flex align-items-center gap-2">
            <span class="font-bold">{{ group.label }}</span>
            <span class="text-sm text-color-secondary">({{ group.memberCount }})</span>
          </div>
        </ng-template>
        <ocx-data-table
          [columns]="columns"
          [rows]="rows"
          [rowGrouping]="rowGrouping"
          [groupCellTemplate]="groupCell"
          [emptyResultsMessage]="emptyResultsMessage"
        >
        </ocx-data-table>
      `,
    })

    export const WithRowGrouping = {
      render: RowGroupingStory,
      args: { ...rowGroupingArgs },
    }
    ```
  - `let-rowObject` is included for parity with other cell templates even though the custom body uses `group`; the config is passed through `[rowGrouping]` and the custom template through `[groupCellTemplate]`.
- **Dependencies:** Task 4 (input/template names), Task 1 (config shape).

### 11. `docs/modules/onecx-portal-ui-libs/pages/components/data-table.adoc`
- **Action:** create
- **Summary:** Antora reference page documenting the row-grouping feature. New file justified: no `data-table.adoc` exists yet (the components folder has `data-list-grid.adoc`, `consent.adoc`, etc.), and the DoD requires Antora docs following the `data-table-column.adoc` format.
- **Concrete TODOs:**
  - Write the page following the `data-table-column.adoc` header convention:
    ```asciidoc
    = DataTable Row Grouping

    :idprefix:
    :idseparator: -

    [#row-grouping-overview]
    == Overview

    `DataTable` can render basic row groups: an additive, opt-in configuration that clusters rows sharing a value in one column under a semantic row-group header. Without the configuration, the table renders exactly as before.

    [#row-grouping-configuration]
    == Configuration

    Provide `[rowGrouping]` with a `DataTableRowGroupingConfig`:

    |===
    | Property | Type | Description

    | `columnId` | `string` | The grouping column (must match a column `id`).
    | `groupKeyPath?` | `string` | Optional nested field path to key on. Defaults to `columnId`. On flattened rows this is a literal key (e.g. `category.sub`).
    |===

    Keys are resolved with strict equality, so a numeric `1` and the string `"1"` are separate groups that may display the same label. With no active sort, groups follow first occurrence and rows keep their original order within a group.

    [#row-grouping-group-cell]
    == Custom group cell

    Provide a `#groupCell` template (or the `groupCellTemplate` input). The context is `DataTableGroupCellContext`:

    [source, angular]
    ----
    <ng-template #groupCell let-group="group" let-rowObject="rowObject" let-column="column">
      {{ group.label }} ({{ group.memberCount }})
    </ng-template>
    ----

    |===
    | Context field | Type | Description

    | `groupKey` | `string \| number` | The resolved group key.
    | `label` | `string` | The display label for the key.
    | `memberCount` | `number` | Number of rows in the group.
    | `rowObject` | `Row` | The first row of the group.
    | `column` | `DataTableColumn` | The grouping column.
    |===

    The default group cell reuses the grouping column's normal cell presentation.
    ```
  - Keep the page self-contained (do not `include::` a partial that does not exist).
- **Dependencies:** Task 7 (public types documented here).

### 12. `docs/modules/onecx-portal-ui-libs/partials/nav.adoc`
- **Action:** modify
- **Summary:** Add the new page to the components nav list.
- **Concrete TODOs:**
  - Insert, directly after the existing `data-list-grid.adoc` line (line 32), the line:
    `*** xref:onecx-portal-ui-libs:components/data-table.adoc[DataTable Row Grouping]`
  - Match the surrounding `*** xref:` indentation exactly.
- **Dependencies:** Task 11.

## Verification Steps

Run from the repository root using the workspace tasks (per `CLAUDE.md`), not ad-hoc commands.

1. Type-check/build the library: run the `nx build angular-accelerator` task. Passes with no errors. Expected outcome: the new `RowGroup`/`RowGroupPlan` (internal) and `DataTableRowGroupingConfig`/`DataTableGroupCellContext` (public) types compile; `import type` keeps the runtime graph acyclic.
2. Lint current work: run the `nx affected lint (current work)` task. Passes with zero errors. Expected outcome: new files, the template `groupCell` binding, and the harness additions are lint-clean; no `any` introduced in library source (the spec's `as any` and the story's `any` args mirror existing conventions).
3. Test current work: run the `nx affected test (current work)` task. All suites pass. Expected outcome:
   - `row-grouping-planner.spec.ts` green (all planner branches).
   - `data-table.component.spec.ts` new `describe('row grouping')` green and all pre-existing tests green (proves "unchanged when config absent").
4. Coverage for new logic: after the test run, open the coverage report for `libs/angular-accelerator/src/lib/utils/row-grouping-planner.ts` and the new lines in `data-table.component.ts`. Expected outcome: 100% statements, branches, functions, and lines for `planRowGroups` and for the new members in `data-table.component.ts` (`rowGrouping`, `displayedRowsSignal` usage, `groupingColumn`, `rowGroupPlan`, `groupCellTemplate`/`groupCellChildTemplate`/`groupCell`, `getGroupColspan`, `isRowGroupStart`, `getGroupForRow`, `getGroupContext`). Record the numbers in the change summary.
5. Public API surface check: build and confirm the emitted `d.ts`/barrel exposes `DataTableRowGroupingConfig` and `DataTableGroupCellContext` (from `src/index.ts`) and does NOT expose `planRowGroups`, `RowGroup`, or `RowGroupPlan`. Expected outcome: public types exported; planner internal.
6. Harness check: in the grouping spec, `dataTable.getGroupCells()`, `getGroupCellLabels()`, `getGroupCellScopes()` (all `"rowgroup"`), `getGroupCellColspans()` (equal to the data-row colspan), and `getGroupCellRowspans()` (all `NaN`) return the expected values for the grouped fixture and length `0` for the ungrouped fixture.
7. Docs: confirm `docs/modules/onecx-portal-ui-libs/pages/components/data-table.adoc` exists, renders the two tables and the code block without Antora errors, and that `partials/nav.adoc` links it.
8. Storybook: confirm the `WithRowGrouping` story compiles and, when run, shows one group header per distinct `name` with the custom `#groupCell` label + count, and that the data rows render normally beneath each header.

## Notes

- **`colspan` vs `rowspan`:** a row-group header spans the columns, so the `<th>` carries `colspan`. The acceptance criterion's mention of "rowspans" is satisfied by exposing `getGroupCellRowspans()` in the harness, which reads the live `rowspan` attribute; because group headers set `colspan` (not `rowspan`), that accessor correctly returns `NaN` for every group cell, and tests assert that. This is a concrete, testable interpretation, not a deferral.
- **Direct key access, not `resolveFieldData`:** rows reaching the planner are flattened by `flattenItems`/`flattenObject`, so a nested value sits under a single dot-joined key (`category.sub`). `planRowGroups` reads `row[groupKeyPath]` directly. Using `ObjectUtils.resolveFieldData` here would re-split the path and return `undefined`; the spec case "resolves a nested (flattened) field path via direct key access" locks this in.
- **`toSignal` dependency:** `toSignal(displayedRows$, ...)` subscribes internally and is torn down with the component; the existing `displayedRows$`/`toObservable` usage confirms `rxjs-interop` interop is already active in this component's DI scope, so no extra `provideSignal` provider is required.
- **Why `toSignal` + `computed` instead of mutating `displayedRows$`:** the plan only needs the already-final row set and must not change `displayedRows$`'s type or the many existing computeds that read `this.rows()`/`displayedRows$`. Deriving a parallel signal isolates the feature and guarantees the no-config path is untouched.
- **`displayedRowsSignal` cast:** `toSignal` infers the observable's inferred array element type (the mapped `flattenObject` result), which is not literally `Row[]`; the read-side `as Row[]` is safe because the planner only reads `row.id` and `row[groupKeyPath]`, both present on every rendered row.
- **Content-child name `groupCell`:** consumers provide `<ng-template #groupCell let-group let-rowObject let-column>` (template-reference) or the `groupCellTemplate` input; `groupCell = computed(() => groupCellTemplate() || groupCellChildTemplate())` mirrors the existing `cell` resolution, so an input wins over a content child.
- **`scope="rowgroup"` is fixed and `headers` is omitted:** the group header sits in the same table with `<th scope="rowgroup">`; the `rowgroup` scope itself provides the row association, so no `headers` attribute is added. The harness and a11y assertions key off `th[scope="rowgroup"]`.
- **Existing "grouping" feature is untouched:** `predefinedGroupKeys`, `column-group-selection`, and `custom-group-column-selector` are column-grouping and are not modified by this change.
- **Test timing:** the group header for the default-cell case depends on `columnTemplates$` (gated by `debounceTime(50)`) being defined so `#body`'s outer `@if (columnTemplates)` opens; the 80 ms wait after `detectChanges()` mirrors how the suite already interacts with the debounce. The custom-template and no-config tests are timing-independent.
- **Scope of "100% coverage":** applies to logic added in this slice (the planner and the new component members listed in Verification step 4). Legacy DataTable lines are unaffected and are not required to change.
