import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { MultiSelectModule } from 'primeng/multiselect'
import { SelectModule } from 'primeng/select'
import { AddFilterDialogComponent } from './add-filter-dialog.component'
import type { DataTableColumn } from '../../../model/data-table-column.model'
import { ColumnType } from '../../../model/column-type.model'
import type { Filter } from '../../../model/filter.model'
import { FilterType } from '../../../model/filter.model'

const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
  ({
    id: overrides.id ?? 'id',
    nameKey: overrides.nameKey ?? 'nameKey',
    columnType: overrides.columnType ?? ColumnType.STRING,
  }) as DataTableColumn

describe('AddFilterDialogComponent (class logic)', () => {
  let fixture: ComponentFixture<AddFilterDialogComponent>
  let component: AddFilterDialogComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddFilterDialogComponent,
        CommonModule,
        FormsModule,
        TranslateModule.forRoot(),
        ButtonModule,
        DialogModule,
        MultiSelectModule,
        SelectModule,
      ],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(AddFilterDialogComponent)
    component = fixture.componentInstance
  })

  it('should initialise the first column and derive string value options', async () => {
    fixture.componentRef.setInput('columns', [
      makeColumn({ id: 'c1', nameKey: 'C1' }),
      makeColumn({ id: 'c2', nameKey: 'C2' }),
    ])
    fixture.componentRef.setInput('data', [
      { c1: 'a' },
      { c1: 'b' },
      { c1: 'a' },
    ])
    fixture.detectChanges()
    await fixture.whenStable()

    expect(component.selectedColumnId()).toBe('c1')
    expect(component.column()?.id).toBe('c1')
    const options = component.valueOptions() ?? []
    expect(options.map((o) => o.value)).toEqual(['a', 'b'])
    expect(options.map((o) => o.label)).toEqual(['a', 'b'])
  })

  it('should respect preselectColumnId', async () => {
    fixture.componentRef.setInput('columns', [
      makeColumn({ id: 'c1', nameKey: 'C1' }),
      makeColumn({ id: 'c2', nameKey: 'C2' }),
    ])
    fixture.componentRef.setInput('preselectColumnId', 'c2')
    fixture.componentRef.setInput('data', [{ c2: 'x' }, { c2: 'y' }])
    fixture.detectChanges()
    await fixture.whenStable()

    expect(component.selectedColumnId()).toBe('c2')
    expect((component.valueOptions() ?? []).map((o) => o.value)).toEqual(['x', 'y'])
  })

  it('should pre-select values already filtered on the current column', async () => {
    fixture.componentRef.setInput('columns', [makeColumn({ id: 'c1', nameKey: 'C1' })])
    fixture.componentRef.setInput('data', [
      { c1: 'a' },
      { c1: 'b' },
      { c1: 'c' },
    ])
    fixture.componentRef.setInput('existingFilters', [
      { columnId: 'c1', value: 'b', filterType: FilterType.EQUALS },
      { columnId: 'c1', value: 'c', filterType: FilterType.EQUALS },
      { columnId: 'other', value: 'zzz', filterType: FilterType.EQUALS },
    ])
    fixture.detectChanges()
    await fixture.whenStable()

    expect(component.selectedValues()).toEqual(['b', 'c'])
  })

  it('should de-duplicate and keep order for number columns', async () => {
    fixture.componentRef.setInput('columns', [makeColumn({ id: 'n', nameKey: 'N', columnType: ColumnType.NUMBER })])
    fixture.componentRef.setInput('data', [
      { n: 1 },
      { n: 2 },
      { n: 1 },
      { n: 3 },
    ])
    fixture.detectChanges()
    await fixture.whenStable()

    const options = component.valueOptions() ?? []
    expect(options.map((o) => o.value)).toEqual([1, 2, 3])
    expect(options.map((o) => o.label)).toEqual(['1', '2', '3'])
  })

  it('should format date column option labels while keeping the raw value', async () => {
    fixture.componentRef.setInput('columns', [
      makeColumn({ id: 'd', nameKey: 'D', columnType: ColumnType.DATE, dateFormat: 'yyyy-MM-dd' }),
    ])
    fixture.componentRef.setInput('data', [
      { d: '2024-05-06T12:00:00.000Z' },
      { d: '2024-05-07T12:00:00.000Z' },
    ])
    fixture.detectChanges()
    await fixture.whenStable()

    const options = component.valueOptions() ?? []
    // Raw values are kept so filters still match the client-side string comparison.
    expect(options.map((o) => o.value)).toEqual(['2024-05-06T12:00:00.000Z', '2024-05-07T12:00:00.000Z'])
    // Labels are the formatted (locale dependent) date and differ from the raw value.
    expect(options.length).toBe(2)
    options.forEach((o) => {
      expect(typeof o.label).toBe('string')
      expect(o.label).not.toEqual(o.value)
      expect(o.label).toMatch(/\d{4}/)
    })
  })

  it('should switch options and preselection when the column changes', async () => {
    fixture.componentRef.setInput('columns', [
      makeColumn({ id: 'c1', nameKey: 'C1' }),
      makeColumn({ id: 'c2', nameKey: 'C2' }),
    ])
    fixture.componentRef.setInput('data', [
      { c1: 'a', c2: '1' },
      { c1: 'b', c2: '2' },
    ])
    fixture.componentRef.setInput('existingFilters', [{ columnId: 'c2', value: '2', filterType: FilterType.EQUALS }])
    fixture.detectChanges()
    await fixture.whenStable()

    component.onColumnChange('c2')
    fixture.detectChanges() // flush the column-change effect
    await fixture.whenStable()

    expect(component.column()?.id).toBe('c2')
    expect((component.valueOptions() ?? []).map((o) => o.value)).toEqual(['1', '2'])
    expect(component.selectedValues()).toEqual(['2'])
  })

  it('should emit filters for the selected column and values on confirm', async () => {
    fixture.componentRef.setInput('columns', [
      makeColumn({ id: 'c1', nameKey: 'C1' }),
      makeColumn({ id: 'c2', nameKey: 'C2' }),
    ])
    fixture.componentRef.setInput('data', [{ c1: 'a' }, { c1: 'b' }])
    fixture.detectChanges()
    await fixture.whenStable()

    let emitted: Filter[] | undefined
    fixture.componentRef.setInput('visible', true)
    component.added.subscribe((f) => (emitted = f))

    component.selectedValues.set(['a', 'b'])
    component.onConfirm()

    expect(emitted).toEqual([
      { columnId: 'c1', value: 'a', filterType: FilterType.EQUALS },
      { columnId: 'c1', value: 'b', filterType: FilterType.EQUALS },
    ])
  })

  it('should not emit when no values are selected on confirm', async () => {
    fixture.componentRef.setInput('columns', [makeColumn({ id: 'c1', nameKey: 'C1' })])
    fixture.componentRef.setInput('data', [{ c1: 'a' }])
    fixture.detectChanges()
    await fixture.whenStable()

    let emitted = false
    component.added.subscribe(() => (emitted = true))

    component.selectedValues.set([])
    component.onConfirm()

    expect(emitted).toBe(false)
  })
})
