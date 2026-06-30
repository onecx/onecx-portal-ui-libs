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
  })

  describe('selectedGroupKey setter', () => {
    it('should set the selectedGroupKey model value', () => {
      fixture.componentRef.setInput('selectedGroupKey', 'custom')
      expect((component as any).stateService.activeColumnGroupKey()).toBe('custom')
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
      component.stateService.activeColumnGroupKey.set('g3')

      fixture.detectChanges()

      expect(component.allGroupKeys()).toEqual(['g1', 'g2', 'g3', 'def'])
    })

    it('should emit custom-group state when selectedGroupKey equals customGroupKey', () => {
      fixture.componentRef.setInput('customGroupKey', 'custom')
      component.selectedGroupKey = 'custom'
      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.ngOnInit()

      expect(emitSpy).toHaveBeenCalledWith({ activeColumnGroupKey: 'custom' })
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
      component.stateService.activeColumnGroupKey.set('g2')

      fixture.detectChanges()

      const cols = component.stateService.availableColumns()
      expect(cols).toEqual(testColumns)
    })

    it('should return early and update allGroupKeys when selectedGroupKey is nullish', () => {
      fixture.componentRef.setInput('defaultGroupKey', 'def')
      fixture.componentRef.setInput('customGroupKey', 'custom')
      component.stateService.activeColumnGroupKey.set(undefined)

      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['def'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
      ])

      fixture.detectChanges()

      const cols = component.stateService.availableColumns()
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
    it('should return early and not emit when selecting customGroupKey', () => {
      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.componentRef.setInput('columns', [makeColumn({ predefinedGroupKeys: ['g1'] })])
      
      const groupChangedSpy = jest.spyOn(component.groupSelectionChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')
      component.changeGroupSelection({ value: 'custom' })

      component.changeGroupSelection({ value: 'custom' })

      expect(groupChangedSpy).not.toHaveBeenCalled()
      expect(stateSpy).not.toHaveBeenCalled()
    })

    it('should emit groupSelectionChanged and componentStateChanged for non-custom value', () => {
      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
        makeColumn({ id: 'c3', predefinedGroupKeys: ['g1', 'g2'] }),
      ])

      const groupChangedSpy = jest.spyOn(component.groupSelectionChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.changeGroupSelection({ value: 'g1' })

      const cols = component.stateService.availableColumns()
      expect(groupChangedSpy).toHaveBeenCalledWith({
        activeColumns: [cols[0], cols[2]],
        groupKey: 'g1',
      })
      expect(stateSpy).toHaveBeenCalledWith({
        activeColumnGroupKey: 'g1',
        displayedColumns: [cols[0], cols[2]],
      })
    })

    it('should ignore columns with undefined predefinedGroupKeys when filtering activeColumns', () => {
      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: undefined }),
        makeColumn({ id: 'c3', predefinedGroupKeys: ['g1', 'g2'] }),
      ])

      const groupChangedSpy = jest.spyOn(component.groupSelectionChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.changeGroupSelection({ value: 'g1' })

      const cols = component.stateService.availableColumns()
      expect(groupChangedSpy).toHaveBeenCalledWith({
        activeColumns: [cols[0], cols[2]],
        groupKey: 'g1',
      })
      expect(stateSpy).toHaveBeenCalledWith({
        activeColumnGroupKey: 'g1',
        displayedColumns: [cols[0], cols[2]],
      })
    })
  })

  describe('constructor effect', () => {
    it('should emit componentStateChanged when selectedGroupKey becomes customGroupKey', () => {
      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.detectChanges()

      component.stateService.activeColumnGroupKey.set('custom')
      fixture.detectChanges()

      expect(emitSpy).toHaveBeenCalledWith({ activeColumnGroupKey: 'custom' })
    })

    it('should not emit componentStateChanged when selectedGroupKey is not customGroupKey', () => {
      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.detectChanges()

      // ignore initial emission produced during initialization
      emitSpy.mockClear()

      component.stateService.activeColumnGroupKey.set('other')
      fixture.detectChanges()

      expect(emitSpy).not.toHaveBeenCalled()
    })
  })
})
