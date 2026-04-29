import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SelectModule } from 'primeng/select'
import { FloatLabelModule } from 'primeng/floatlabel'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { ColumnGroupSelectionComponent } from './column-group-selection.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { DataViewStateService } from '../../services/data-view-state.service'

describe('ColumnGroupSelectionComponent', () => {
  let fixture: ComponentFixture<ColumnGroupSelectionComponent>
  let component: ColumnGroupSelectionComponent
  let stateService: DataViewStateService

  const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
    ({
      id: overrides.id ?? 'id',
      nameKey: overrides.nameKey ?? 'nameKey',
      predefinedGroupKeys: overrides.predefinedGroupKeys,
    }) as DataTableColumn

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnGroupSelectionComponent],
      imports: [CommonModule, FormsModule, SelectModule, FloatLabelModule, TranslateModule.forRoot()],
      providers: [provideTranslateTestingService({}), DataViewStateService],
    }).compileComponents()

    fixture = TestBed.createComponent(ColumnGroupSelectionComponent)
    component = fixture.componentInstance
    stateService = TestBed.inject(DataViewStateService)
  })

  describe('selectedGroupKey setter', () => {
    it('should set the selectedGroupKey model value', () => {
      fixture.componentRef.setInput('selectedGroupKey', 'custom')
      expect(component.selectedGroupKey()).toBe('custom')
    })
  })

  describe('ngOnInit', () => {
    it('should build allGroupKeys with unique, truthy values (columns, defaultGroupKey, selectedGroupKey)', () => {
      fixture.componentRef.setInput('defaultGroupKey', 'def')
      fixture.componentRef.setInput('customGroupKey', 'custom')

      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1', 'g2', ''] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2', 'g3'] }),
        makeColumn({ id: 'c3', predefinedGroupKeys: undefined }),
      ])
      component.stateService.setActiveColumnGroupKey('g3')

      fixture.detectChanges()

      expect(component.allGroupKeys()).toEqual(['g1', 'g2', 'g3', 'def'])
    })

    it('should include customGroupKey in allGroupKeys when service signal is set to it', () => {
      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.componentRef.setInput('defaultGroupKey', 'def')

      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
      ])
      component.stateService.setActiveColumnGroupKey('custom')

      fixture.detectChanges()

      expect(component.allGroupKeys()).toContain('custom')
    })

    it('should filter displayedColumns by selectedGroupKey when not in custom group', () => {
      fixture.componentRef.setInput('defaultGroupKey', 'def')
      fixture.componentRef.setInput('customGroupKey', 'custom')

      const testColumns = [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
        makeColumn({ id: 'c3', predefinedGroupKeys: ['g2', 'g3'] }),
        makeColumn({ id: 'c4', predefinedGroupKeys: undefined }),
      ]
      fixture.componentRef.setInput('columns', testColumns)
      component.stateService.setActiveColumnGroupKey('g2')

      fixture.detectChanges()

      const cols = component.columns()
      expect(cols).toEqual(testColumns)
    })

    it('should return early and update allGroupKeys when selectedGroupKey is nullish', () => {
      fixture.componentRef.setInput('defaultGroupKey', 'def')
      fixture.componentRef.setInput('customGroupKey', 'custom')
      component.stateService.setActiveColumnGroupKey(undefined)

      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['def'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
      ])

      fixture.detectChanges()

      const cols = component.columns()
      expect(cols).toEqual([
        makeColumn({ id: 'c1', predefinedGroupKeys: ['def'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
      ])
    })

    it('should filter displayedColumns by input selectedGroupKey when specified', () => {
      const componentStateChangedSpy = jest.spyOn(component.componentStateChanged, 'emit')
      
      fixture.componentRef.setInput('defaultGroupKey', 'def')
      fixture.componentRef.setInput('customGroupKey', 'custom')

      const testColumns = [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
        makeColumn({ id: 'c3', predefinedGroupKeys: ['g1', 'g2'] }),
        makeColumn({ id: 'c4', predefinedGroupKeys: undefined }),
      ]
      fixture.componentRef.setInput('columns', testColumns)
      fixture.componentRef.setInput('selectedGroupKey', 'g1')
      
      fixture.detectChanges()

      expect(componentStateChangedSpy).toHaveBeenCalledWith({
        activeColumnGroupKey: 'g1',
        displayedColumns: [testColumns[0], testColumns[2]],
      })
    })
  })

  describe('changeGroupSelection', () => {
    it('should return early and not call service methods when selecting customGroupKey', () => {
      const setGroupKeySpy = jest.spyOn(stateService, 'setActiveColumnGroupKey')
      const setColumnsSpy = jest.spyOn(stateService, 'setDisplayedColumns')

      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.componentRef.setInput('columns', [makeColumn({ predefinedGroupKeys: ['g1'] })])
      fixture.detectChanges()

      component.changeGroupSelection({ value: 'custom' })

      expect(setGroupKeySpy).not.toHaveBeenCalled()
      expect(setColumnsSpy).not.toHaveBeenCalled()
    })

    it('should call service methods for non-custom value with filtered columns', () => {
      const setGroupKeySpy = jest.spyOn(stateService, 'setActiveColumnGroupKey')
      const setColumnsSpy = jest.spyOn(stateService, 'setDisplayedColumns')

      fixture.componentRef.setInput('customGroupKey', 'custom')
      const testColumns = [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
        makeColumn({ id: 'c3', predefinedGroupKeys: ['g1', 'g2'] }),
      ]
      fixture.componentRef.setInput('columns', testColumns)
      fixture.detectChanges()

      component.changeGroupSelection({ value: 'g1' })

      expect(setGroupKeySpy).toHaveBeenCalledWith('g1')
      expect(setColumnsSpy).toHaveBeenCalledWith([testColumns[0], testColumns[2]])
    })

    it('should ignore columns with undefined predefinedGroupKeys when filtering activeColumns', () => {
      const setColumnsSpy = jest.spyOn(stateService, 'setDisplayedColumns')

      fixture.componentRef.setInput('customGroupKey', 'custom')
      const testColumns = [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: undefined }),
        makeColumn({ id: 'c3', predefinedGroupKeys: ['g1', 'g2'] }),
      ]
      fixture.componentRef.setInput('columns', testColumns)
      fixture.detectChanges()

      component.changeGroupSelection({ value: 'g1' })

      expect(setColumnsSpy).toHaveBeenCalledWith([testColumns[0], testColumns[2]])
    })
  })

  describe('constructor effect', () => {
    it('should have selectedGroupKey sourced from service signal', () => {
      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.detectChanges()

      fixture.componentRef.setInput('selectedGroupKey', 'custom')
      fixture.detectChanges()

      expect(component.selectedGroupKey()).toBe('custom')
    })

    it('should update selectedGroupKey from service when set', () => {
      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.detectChanges()

      const newValue = 'other'
      fixture.componentRef.setInput('selectedGroupKey', newValue)
      fixture.detectChanges()

      expect(component.selectedGroupKey()).toBe(newValue)
    })
  })
})
