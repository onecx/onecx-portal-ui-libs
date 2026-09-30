import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SelectModule } from 'primeng/select'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { of } from 'rxjs'
import { FilterViewAddFilterDialogComponent, AddFilterDialogResult } from './filter-view-add-filter-dialog.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { ColumnType } from '../../model/column-type.model'
import { FilterType } from '../../model/filter.model'
import { Row } from '../data-table/data-table.component'
import type { SelectItem } from 'primeng/api'

const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
  ({
    id: overrides.id ?? 'id',
    nameKey: overrides.nameKey ?? 'nameKey',
    columnType: overrides.columnType ?? ColumnType.STRING,
    filterable: overrides.filterable ?? true,
    filterType: overrides.filterType,
  }) as DataTableColumn

/** firstValueFrom(...).then(...) resolves on a microtask; flush those before asserting. */
const flushMicrotasks = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('FilterViewAddFilterDialogComponent', () => {
  let fixture: ComponentFixture<FilterViewAddFilterDialogComponent>
  let component: FilterViewAddFilterDialogComponent
  let primaryEvents: boolean[]

  const columns = [
    makeColumn({ id: 'c1', nameKey: 'C1', columnType: ColumnType.STRING }),
    makeColumn({ id: 'c2', nameKey: 'C2', columnType: ColumnType.STRING, filterType: FilterType.IS_NOT_EMPTY }),
  ]
  const rows: Row[] = [{ id: 1, c1: 'a', c2: true }, { id: 2, c1: 'b', c2: false }, { id: 3, c1: 'a', c2: true }]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterViewAddFilterDialogComponent],
      imports: [CommonModule, FormsModule, SelectModule, TranslateModule.forRoot()],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(FilterViewAddFilterDialogComponent)
    component = fixture.componentInstance

    primaryEvents = []
    component.primaryButtonEnabled.subscribe((v) => primaryEvents.push(v))

    component.columns = columns
    component.rows = rows
    component.existingFilters = []
  })

  it('should build the column options from the provided columns on init', () => {
    component.ngOnInit()

    expect(component.columnOptions().map((o) => o.value)).toEqual(['c1', 'c2'])
  })

  it('should leave the primary button disabled until a column and a value are chosen', () => {
    component.ngOnInit()
    expect(primaryEvents).toEqual([])

    component.onColumnChange('c1')
    expect(primaryEvents.at(-1)).toBe(false)
    expect(component.dialogResult).toBeUndefined()

    component.onValueChange('a')
    expect(primaryEvents.at(-1)).toBe(true)
    expect(component.dialogResult).toEqual({ columnId: 'c1', value: 'a', filterType: undefined })
  })

  it('should offer the distinct values present in the data for a chosen EQUALS column', async () => {
    component.ngOnInit()

    component.onColumnChange('c1')
    await flushMicrotasks()

    expect(component.valueOptions().map((o) => o.value).sort()).toEqual(['a', 'b'])
  })

  it('should reset the chosen value and value options when the column changes', async () => {
    component.ngOnInit()

    component.onColumnChange('c1')
    await flushMicrotasks()
    component.onValueChange('a')
    expect(component.selectedValue()).toBe('a')

    component.onColumnChange('c2')
    await flushMicrotasks()

    expect(component.selectedValue()).toBeNull()
    // c2 is IS_NOT_EMPTY, so its options are the fixed Yes/No values.
    expect(component.valueOptions().map((o) => o.value)).toEqual([true, false])
  })

  it('should offer the fixed Yes/No options for an IS_NOT_EMPTY column', async () => {
    const translateService = TestBed.inject(TranslateService)
    jest.spyOn(translateService, 'get').mockReturnValue(
      of({ 'OCX_FILTER_VIEW.FILTER_YES': 'Yes', 'OCX_FILTER_VIEW.FILTER_NO': 'No' })
    )

    component.ngOnInit()

    component.onColumnChange('c2')
    await flushMicrotasks()

    expect(component.valueOptions()).toEqual([
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ] as SelectItem[])
    expect(component.dialogResult).toBeUndefined()
  })

  it('should keep an already-selected value visible even when it is no longer present in the data', async () => {
    component.existingFilters = [{ columnId: 'c1', value: 'gone' } as (typeof component.existingFilters)[number]]
    component.ngOnInit()

    component.onColumnChange('c1')
    await flushMicrotasks()

    expect(component.valueOptions().map((o) => o.value).sort()).toEqual(['a', 'b', 'gone'])
  })

  it('should report the filterType of the chosen column in the dialog result', async () => {
    component.ngOnInit()

    component.onColumnChange('c2')
    await flushMicrotasks()
    component.onValueChange(true)

    expect(component.dialogResult).toEqual<AddFilterDialogResult>({ columnId: 'c2', value: true, filterType: FilterType.IS_NOT_EMPTY })
  })
})
