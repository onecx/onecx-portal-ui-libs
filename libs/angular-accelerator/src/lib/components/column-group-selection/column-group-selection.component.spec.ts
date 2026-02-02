import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SelectModule } from 'primeng/select'
import { FloatLabelModule } from 'primeng/floatlabel'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'

import { ColumnGroupSelectionComponent } from './column-group-selection.component'
import type { DataTableColumn } from '../../model/data-table-column.model'

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
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(ColumnGroupSelectionComponent)
    component = fixture.componentInstance
  })

  describe('selectedGroupKey setter', () => {
    it('should set the selectedGroupKey model value', () => {
      component.selectedGroupKey.set('custom')
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
      component.selectedGroupKey.set('g3')

      component.ngOnInit()

      expect(component.allGroupKeys()).toEqual(['g1', 'g2', 'g3', 'def'])
    })

    it('should emit custom-group state when selectedGroupKey equals customGroupKey', () => {
      fixture.componentRef.setInput('customGroupKey', 'custom')
      component.selectedGroupKey.set('custom')
      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.ngOnInit()

      expect(emitSpy).toHaveBeenCalledWith({ activeColumnGroupKey: 'custom' })
    })

    it('should emit displayedColumns filtered by selectedGroupKey when not in custom group', () => {
      fixture.componentRef.setInput('defaultGroupKey', 'def')
      fixture.componentRef.setInput('customGroupKey', 'custom')
      component.selectedGroupKey.set('g2')

      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
        makeColumn({ id: 'c3', predefinedGroupKeys: ['g2', 'g3'] }),
        makeColumn({ id: 'c4', predefinedGroupKeys: undefined }),
      ])

      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.ngOnInit()

      const cols = component.columns()
      expect(emitSpy).toHaveBeenCalledWith({
        activeColumnGroupKey: 'g2',
        displayedColumns: [cols[1], cols[2]],
      })
    })

    it('should include defaultGroupKey for filtering when selectedGroupKey is nullish', () => {
      fixture.componentRef.setInput('defaultGroupKey', 'def')
      fixture.componentRef.setInput('customGroupKey', 'custom')
      ;(component.selectedGroupKey as any).set(undefined)

      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['def'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
      ])

      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.ngOnInit()

      const cols = component.columns()
      expect(emitSpy).toHaveBeenCalledWith({
        activeColumnGroupKey: undefined,
        displayedColumns: [cols[0]],
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

      const cols = component.columns()
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

      const cols = component.columns()
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

      component.selectedGroupKey.set('custom')
      fixture.detectChanges()

      expect(emitSpy).toHaveBeenCalledWith({ activeColumnGroupKey: 'custom' })
    })

    it('should not emit componentStateChanged when selectedGroupKey is not customGroupKey', () => {
      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.detectChanges()

      // ignore initial emission produced during initialization
      emitSpy.mockClear()

      component.selectedGroupKey.set('other')
      fixture.detectChanges()

      expect(emitSpy).not.toHaveBeenCalled()
    })
  })
})
