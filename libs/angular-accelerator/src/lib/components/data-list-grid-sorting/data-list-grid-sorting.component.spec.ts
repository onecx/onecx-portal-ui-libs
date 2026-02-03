import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { DataListGridSortingComponent } from './data-list-grid-sorting.component'

describe('DataListGridSortingComponent', () => {
  let component: DataListGridSortingComponent
  let fixture: ComponentFixture<DataListGridSortingComponent>

  const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
    ({
      id: overrides.id ?? 'id',
      nameKey: overrides.nameKey ?? 'nameKey',
      sortable: overrides.sortable ?? false,
    }) as DataTableColumn

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataListGridSortingComponent],
      imports: [AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot()],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(DataListGridSortingComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  describe('dropdownOptions + selectedSortingOption', () => {
    it('should derive dropdownOptions from sortable columns only and derive selectedSortingOption from sortField', () => {
      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'a', nameKey: 'A', sortable: true }),
        makeColumn({ id: 'b', nameKey: 'B', sortable: false }),
      ])
      fixture.componentRef.setInput('sortField', 'a')
      fixture.detectChanges()

      expect(component.dropdownOptions()).toEqual([{ columnId: 'a', columnName: 'A' }])
      expect(component.selectedSortingOption()).toEqual({ columnId: 'a', columnName: 'A' })
    })
  })

  describe('constructor effect (componentStateChanged)', () => {
    it('should emit componentStateChanged whenever sortField/sortDirection changes', () => {
      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      fixture.componentRef.setInput('sortField', 'x')
      fixture.componentRef.setInput('sortDirection', DataSortDirection.NONE)
      fixture.detectChanges()

      expect(emitSpy).toHaveBeenCalledWith({
        sorting: { sortColumn: 'x', sortDirection: DataSortDirection.NONE },
      })

      emitSpy.mockClear()

      component.sortDirection.set(DataSortDirection.ASCENDING)
      fixture.detectChanges()

      expect(emitSpy).toHaveBeenCalledWith({
        sorting: { sortColumn: 'x', sortDirection: DataSortDirection.ASCENDING },
      })
    })
  })

  describe('selectSorting', () => {
    it('should set sortField and emit sortChange', () => {
      const sortChangeSpy = jest.spyOn(component.sortChange, 'emit')

      fixture.detectChanges()

      component.selectSorting({ value: { columnId: 'c', columnName: 'C' } } as any)

      expect(component.sortField()).toBe('c')
      expect(sortChangeSpy).toHaveBeenCalledWith('c')
    })
  })

  describe('sortDirectionChanged / nextSortDirection', () => {
    it('should cycle sort direction based on sortStates and emit sortDirectionChange', () => {
      const sortDirectionChangeSpy = jest.spyOn(component.sortDirectionChange, 'emit')

      fixture.componentRef.setInput('sortStates', [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING])
      fixture.componentRef.setInput('sortDirection', DataSortDirection.ASCENDING)
      fixture.detectChanges()

      component.sortDirectionChanged()

      expect(component.sortDirection()).toBe(DataSortDirection.DESCENDING)
      expect(sortDirectionChangeSpy).toHaveBeenCalledWith(DataSortDirection.DESCENDING)
    })
  })

  describe('icon + title mapping', () => {
    it('should return correct icon and title keys for all direction cases', () => {
      fixture.componentRef.setInput('sortDirection', DataSortDirection.NONE)
      fixture.detectChanges()
      expect(component.sortIcon()).toBe('pi-sort-alt')
      expect(component.sortDirectionToTitle(DataSortDirection.NONE)).toBe(
        'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DEFAULT_TOOLTIP'
      )

      fixture.componentRef.setInput('sortDirection', DataSortDirection.ASCENDING)
      fixture.detectChanges()
      expect(component.sortIcon()).toBe('pi-sort-amount-up')
      expect(component.sortDirectionToTitle(DataSortDirection.ASCENDING)).toBe(
        'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.ASCENDING_TOOLTIP'
      )

      fixture.componentRef.setInput('sortDirection', DataSortDirection.DESCENDING)
      fixture.detectChanges()
      expect(component.sortIcon()).toBe('pi-sort-amount-down')
      expect(component.sortDirectionToTitle(DataSortDirection.DESCENDING)).toBe(
        'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DESCENDING_TOOLTIP'
      )
    })
  })
})
