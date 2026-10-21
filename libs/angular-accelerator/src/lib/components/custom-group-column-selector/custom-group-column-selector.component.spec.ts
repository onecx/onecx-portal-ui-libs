import { CommonModule } from '@angular/common'
import { By } from '@angular/platform-browser'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import { TooltipModule } from 'primeng/tooltip'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'

describe('CustomGroupColumnSelectorComponent', () => {
  let component: CustomGroupColumnSelectorComponent
  let fixture: ComponentFixture<CustomGroupColumnSelectorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [
        CommonModule,
        AngularAcceleratorPrimeNgModule,
        FormsModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        TooltipModule,
        OcxTooltipDirective,
      ],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomGroupColumnSelectorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  const makeColumn = (id: string) => ({ id, nameKey: id }) as any

  describe('save state', () => {
    it('should enable save only when an active-column or action setting has changed', () => {
      const first = makeColumn('first')
      const second = makeColumn('second')
      component.columns = [first, second]
      component.displayedColumns = [first]
      component.onOpenCustomGroupColumnSelectionDialogClick()
      fixture.detectChanges()

      const saveButton = fixture.debugElement.query(By.css('#saveButton'))
      expect(saveButton.componentInstance.disabled).toBe(true)

      component.displayedColumnsModel = [first, second]
      fixture.detectChanges()
      expect(saveButton.componentInstance.disabled).toBe(false)

      component.displayedColumnsModel = [first]
      fixture.detectChanges()
      expect(saveButton.componentInstance.disabled).toBe(true)
    })

    it('should not close or emit when the configuration is unchanged', () => {
      const first = makeColumn('first')
      component.columns = [first]
      component.displayedColumns = [first]
      component.onOpenCustomGroupColumnSelectionDialogClick()
      const columnsChanged = jest.spyOn(component.columnSelectionChanged, 'emit')
      const actionChanged = jest.spyOn(component.actionColumnConfigChanged, 'emit')

      component.onSaveClick()

      expect(component.visible).toBe(true)
      expect(columnsChanged).not.toHaveBeenCalled()
      expect(actionChanged).not.toHaveBeenCalled()
    })

    it('should emit both changes even if the first listener synchronously commits the columns', () => {
      const first = makeColumn('first')
      const second = makeColumn('second')
      component.columns = [first, second]
      component.displayedColumns = [first]
      component.displayedColumnsModel = [first, second]
      component.frozenActionColumnModel = true
      component.visible = true
      component.columnSelectionChanged.subscribe(({ activeColumns }) => {
        component.displayedColumns = activeColumns
      })
      const actionChanged = jest.spyOn(component.actionColumnConfigChanged, 'emit')

      component.onSaveClick()

      expect(component.visible).toBe(false)
      expect(actionChanged).toHaveBeenCalledWith({ frozenActionColumn: true, actionColumnPosition: 'right' })
    })
  })

  describe('column order restoration', () => {
    it('should retain PickList order by default and restore configured order when enabled', () => {
      const first = makeColumn('first')
      const second = makeColumn('second')
      const third = makeColumn('third')
      component.columns = [first, second, third]
      component.displayedColumnsModel = [first, third, second]

      component.syncColumnModels()
      expect(component.displayedColumnsModel.map((column) => column.id)).toEqual(['first', 'third', 'second'])

      component.syncColumnModels(true)
      expect(component.displayedColumnsModel.map((column) => column.id)).toEqual(['first', 'second', 'third'])
    })

    it('should keep unknown columns in their existing order after known columns', () => {
      const first = makeColumn('first')
      const second = makeColumn('second')
      const unknown = makeColumn('unknown')
      component.columns = [first, second]
      component.displayedColumnsModel = [unknown, first]
      component.hiddenColumnsModel = [second]

      component.syncColumnModels(true)

      expect(component.displayedColumnsModel.map((column) => column.id)).toEqual(['first', 'unknown'])
      expect(component.hiddenColumnsModel.map((column) => column.id)).toEqual(['second'])
    })
  })

  describe('PickList selection reset', () => {
    it('should clear stale selections on the same PickList instance when reopening', () => {
      const first = makeColumn('first')
      const second = makeColumn('second')
      component.columns = [first, second]
      component.displayedColumns = [first]
      component.onOpenCustomGroupColumnSelectionDialogClick()
      fixture.detectChanges()

      const pickList = component.pickList
      expect(pickList).toBeDefined()
      pickList?.setSelectionList(pickList.SOURCE_LIST, [first])
      pickList?.setSelectionList(pickList.TARGET_LIST, [second])
      expect(pickList?.selectedItemsSource).toEqual([first])
      expect(pickList?.selectedItemsTarget).toEqual([second])

      component.onCancelClick()
      fixture.detectChanges()
      expect(component.pickList).toBe(pickList)

      component.onOpenCustomGroupColumnSelectionDialogClick()

      expect(component.pickList).toBe(pickList)
      expect(pickList?.selectedItemsSource).toEqual([])
      expect(pickList?.selectedItemsTarget).toEqual([])
    })
  })

  it('should default the new dialog and order options to false', () => {
    expect(component.resizableColumnGroupSelectorDialog).toBe(false)
    expect(component.restoreColumnGroupSelectorOrder).toBe(false)
  })

  it('should configure dialog resizing independently from dragging', () => {
    component.resizableColumnGroupSelectorDialog = true
    component.draggableColumnGroupSelectorDialog = false
    component.visible = true
    fixture.detectChanges()

    const dialog = fixture.debugElement.query(By.css('p-dialog')).componentInstance
    expect(dialog.resizable).toBe(true)
    expect(dialog.draggable).toBe(false)
  })
})
