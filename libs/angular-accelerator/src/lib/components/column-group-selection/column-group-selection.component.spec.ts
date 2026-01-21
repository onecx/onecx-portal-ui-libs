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
    it('should emit componentStateChanged when value equals customGroupKey', () => {
      component.customGroupKey = 'custom'
      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.selectedGroupKey = 'custom'

      expect(component.selectedGroupKey).toBe('custom')
      expect(emitSpy).toHaveBeenCalledWith({ activeColumnGroupKey: 'custom' })
    })

    it('should not emit componentStateChanged when value does not equal customGroupKey', () => {
      component.customGroupKey = 'custom'
      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.selectedGroupKey = 'other'

      expect(component.selectedGroupKey).toBe('other')
      expect(emitSpy).not.toHaveBeenCalled()
    })
  })

  describe('ngOnInit', () => {
    it('should build allGroupKeys$ with unique, truthy values (columns, defaultGroupKey, selectedGroupKey)', (done) => {
      component.defaultGroupKey = 'def'
      component.customGroupKey = 'custom'

      component.columns = [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1', 'g2', ''] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2', 'g3'] }),
        makeColumn({ id: 'c3', predefinedGroupKeys: undefined }),
      ]
      component.selectedGroupKey = 'g3'

      component.ngOnInit()

      const allGroupKeys$ = component.allGroupKeys$
      if (!allGroupKeys$) {
        done(new Error('Expected allGroupKeys$ to be defined after ngOnInit'))
        return
      }

      const sub = allGroupKeys$.subscribe({
        next: (keys) => {
          try {
            expect(keys).toEqual(['g1', 'g2', 'g3', 'def'])
            done()
          } catch (e) {
            done(e as any)
          } finally {
            sub.unsubscribe()
          }
        },
        error: done,
      })
    })

    it('should emit custom-group state when selectedGroupKey equals customGroupKey', () => {
      component.customGroupKey = 'custom'
      component.selectedGroupKey = 'custom'
      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.ngOnInit()

      expect(emitSpy).toHaveBeenCalledWith({ activeColumnGroupKey: 'custom' })
    })

    it('should emit displayedColumns filtered by selectedGroupKey when not in custom group', () => {
      component.defaultGroupKey = 'def'
      component.customGroupKey = 'custom'
      component.selectedGroupKey = 'g2'
      component.columns = [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
        makeColumn({ id: 'c3', predefinedGroupKeys: ['g2', 'g3'] }),
        makeColumn({ id: 'c4', predefinedGroupKeys: undefined }),
      ]

      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.ngOnInit()

      expect(emitSpy).toHaveBeenCalledWith({
        activeColumnGroupKey: 'g2',
        displayedColumns: [component.columns[1], component.columns[2]],
      })
    })

    it('should include defaultGroupKey for filtering when selectedGroupKey is nullish', () => {
      component.defaultGroupKey = 'def'
      component.customGroupKey = 'custom'
      ;(component.selectedGroupKey$ as any).next(undefined)
      component.columns = [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['def'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
      ]

      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.ngOnInit()

      expect(emitSpy).toHaveBeenCalledWith({
        activeColumnGroupKey: undefined,
        displayedColumns: [component.columns[0]],
      })
    })
  })

  describe('changeGroupSelection', () => {
    it('should return early and not emit when selecting customGroupKey', () => {
      component.customGroupKey = 'custom'
      component.columns = [makeColumn({ predefinedGroupKeys: ['g1'] })]
      const groupChangedSpy = jest.spyOn(component.groupSelectionChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.changeGroupSelection({ value: 'custom' })

      expect(groupChangedSpy).not.toHaveBeenCalled()
      expect(stateSpy).not.toHaveBeenCalled()
    })

    it('should emit groupSelectionChanged and componentStateChanged for non-custom value', () => {
      component.customGroupKey = 'custom'
      component.columns = [
        makeColumn({ id: 'c1', predefinedGroupKeys: ['g1'] }),
        makeColumn({ id: 'c2', predefinedGroupKeys: ['g2'] }),
        makeColumn({ id: 'c3', predefinedGroupKeys: ['g1', 'g2'] }),
      ]

      const groupChangedSpy = jest.spyOn(component.groupSelectionChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.changeGroupSelection({ value: 'g1' })

      expect(groupChangedSpy).toHaveBeenCalledWith({
        activeColumns: [component.columns[0], component.columns[2]],
        groupKey: 'g1',
      })
      expect(stateSpy).toHaveBeenCalledWith({
        activeColumnGroupKey: 'g1',
        displayedColumns: [component.columns[0], component.columns[2]],
      })
    })
  })
})
