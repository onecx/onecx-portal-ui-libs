import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { DataListGridSortingComponent } from './data-list-grid-sorting.component'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service'

describe('DataListGridSortingComponent', () => {
  let component: DataListGridSortingComponent
  let fixture: ComponentFixture<DataListGridSortingComponent>
  let stateService: InteractiveDataViewService

  const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
    ({
      id: overrides.id ?? 'id',
      nameKey: overrides.nameKey ?? 'nameKey',
      sortable: overrides.sortable ?? false,
    }) as DataTableColumn

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataListGridSortingComponent],
      imports: [AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot(), OcxTooltipDirective],
      providers: [provideTranslateTestingService({}), InteractiveDataViewService],
    }).compileComponents()

    fixture = TestBed.createComponent(DataListGridSortingComponent)
    component = fixture.componentInstance
    stateService = TestBed.inject(InteractiveDataViewService)
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
      stateService.setSortColumn('a')
      fixture.detectChanges()

      expect(component.dropdownOptions()).toEqual([{ columnId: 'a', columnName: 'A' }])
      expect(component.selectedSortingOption()).toEqual({ columnId: 'a', columnName: 'A' })
    })
  })

  describe('selectSorting', () => {
    it('should call stateService.setSortColumn with selected column id', () => {
      const setSortColumnSpy = jest.spyOn(stateService, 'setSortColumn')

      fixture.detectChanges()

      component.selectSorting({ value: { columnId: 'c', columnName: 'C' } } as any)

      expect(setSortColumnSpy).toHaveBeenCalledWith('c')
      expect(component.sortField()).toBe('c')
    })
  })

  describe('sortDirectionChanged / nextSortDirection', () => {
    it('should cycle sort direction based on sortStates and call stateService.setSortDirection', () => {
      const setSortDirectionSpy = jest.spyOn(stateService, 'setSortDirection')

      fixture.componentRef.setInput('sortStates', [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING])
      stateService.setSortDirection(DataSortDirection.ASCENDING)
      fixture.detectChanges()

      component.sortDirectionChanged()

      expect(component.sortDirection()).toBe(DataSortDirection.DESCENDING)
      expect(setSortDirectionSpy).toHaveBeenCalledWith(DataSortDirection.DESCENDING)
    })

    it('should cycle through all available sortStates', () => {
      fixture.componentRef.setInput('sortStates', [
        DataSortDirection.ASCENDING,
        DataSortDirection.DESCENDING,
        DataSortDirection.NONE,
      ])
      stateService.setSortDirection(DataSortDirection.NONE)
      fixture.detectChanges()

      const nextDirection = component.nextSortDirection()
      expect(nextDirection).toBe(DataSortDirection.ASCENDING)
    })
  })

  describe('icon + title mapping', () => {
    it('should return correct icon and title keys for all direction cases', () => {
      stateService.setSortDirection(DataSortDirection.NONE)
      fixture.detectChanges()
      expect(component.sortIcon()).toBe('pi-sort-alt')
      expect(component.sortDirectionToTitle(DataSortDirection.NONE)).toBe(
        'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DEFAULT_TOOLTIP'
      )

      stateService.setSortDirection(DataSortDirection.ASCENDING)
      fixture.detectChanges()
      expect(component.sortIcon()).toBe('pi-sort-amount-up')
      expect(component.sortDirectionToTitle(DataSortDirection.ASCENDING)).toBe(
        'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.ASCENDING_TOOLTIP'
      )

      stateService.setSortDirection(DataSortDirection.DESCENDING)
      fixture.detectChanges()
      expect(component.sortIcon()).toBe('pi-sort-amount-down')
      expect(component.sortDirectionToTitle(DataSortDirection.DESCENDING)).toBe(
        'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DESCENDING_TOOLTIP'
      )
    })
  })
})
