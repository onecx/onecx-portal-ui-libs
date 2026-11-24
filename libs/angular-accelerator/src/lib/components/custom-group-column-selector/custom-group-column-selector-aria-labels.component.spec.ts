import { CommonModule } from '@angular/common'
import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import type { ComponentFixture } from '@angular/core/testing'
import { AngularAcceleratorOptimusModule } from '../../angular-accelerator-optimus.module'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { DataViewStateService } from '../../services/data-view-state.service'
import { ColumnType } from '../../model/column-type.model'
import type { DataTableColumn } from '../../model/data-table-column.model'

describe('CustomGroupColumnSelectorComponent aria labels', () => {
  let fixture: ComponentFixture<CustomGroupColumnSelectorComponent>
  let component: CustomGroupColumnSelectorComponent
  let translateService: TranslateService

  const TRANSLATIONS = {
    en: {
      SAVE_KEY: 'Saved columns key label',
      CANCEL_KEY: 'Discard key label',
      OCX_CUSTOM_GROUP_COLUMN_SELECTOR: {
        SAVE_BUTTON_ARIA_LABEL: 'Default save aria label',
        CANCEL_BUTTON_ARIA_LABEL: 'Default cancel aria label',
        CANCEL_BUTTON_LABEL: 'Default cancel label',
      },
    },
  }

  const makeColumn = (id: string): DataTableColumn => ({
    id,
    nameKey: id,
    columnType: ColumnType.STRING,
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [
        CommonModule,
        AngularAcceleratorOptimusModule,
        FormsModule,
        TranslateModule.forRoot(),
        OcxTooltipDirective,
      ],
      providers: [provideTranslateTestingService(TRANSLATIONS), DataViewStateService],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomGroupColumnSelectorComponent)
    component = fixture.componentInstance
    translateService = TestBed.inject(TranslateService)
    translateService.use('en')
  })

  function openDialog() {
    fixture.componentRef.setInput('columns', [makeColumn('A'), makeColumn('B')])
    fixture.componentRef.setInput('displayedColumns', [makeColumn('A')])
    component.onOpenCustomGroupColumnSelectionDialogClick()
    fixture.detectChanges()
  }

  const saveAriaLabel = (): string =>
    fixture.nativeElement.querySelector('p-button#saveButton button').getAttribute('aria-label')
  const cancelAriaLabel = (): string =>
    fixture.nativeElement.querySelector('p-button#cancelButton button').getAttribute('aria-label')
  const cancelLabel = (): string =>
    fixture.nativeElement.querySelector('p-button#cancelButton .p-button-label').textContent

  describe('save button aria-label precedence', () => {
    it('given the aria text and a key are set when the dialog is open then the aria-label uses the text', () => {
      fixture.componentRef.setInput('saveButtonAriaLabel', 'Save columns')
      fixture.componentRef.setInput('saveButtonAriaLabelKey', 'SAVE_KEY')

      openDialog()

      expect(saveAriaLabel()).toBe('Save columns')
    })

    it('given only the aria key is set when the dialog is open then the aria-label is the translation of the key', () => {
      fixture.componentRef.setInput('saveButtonAriaLabelKey', 'SAVE_KEY')

      openDialog()

      expect(saveAriaLabel()).toBe('Saved columns key label')
    })

    it('given no aria input is set when the dialog is open then the aria-label is the translated default', () => {
      openDialog()

      expect(saveAriaLabel()).toBe('Default save aria label')
    })
  })

  describe('cancel button aria-label precedence', () => {
    it('given the aria text is set when the dialog is open then the aria-label uses the text', () => {
      fixture.componentRef.setInput('cancelButtonAriaLabel', 'Discard')

      openDialog()

      expect(cancelAriaLabel()).toBe('Discard')
    })

    it('given only the aria key is set when the dialog is open then the aria-label is the translation of the key', () => {
      fixture.componentRef.setInput('cancelButtonAriaLabelKey', 'CANCEL_KEY')

      openDialog()

      expect(cancelAriaLabel()).toBe('Discard key label')
    })

    it('given no aria input is set when the dialog is open then the aria-label is the translated default', () => {
      openDialog()

      expect(cancelAriaLabel()).toBe('Default cancel aria label')
    })

    it('given both the aria text and the label are set when the dialog is open then the label is shown and the aria-label is the text', () => {
      fixture.componentRef.setInput('cancelButtonAriaLabel', 'Discard')
      fixture.componentRef.setInput('cancelButtonLabel', 'Abort')

      openDialog()

      expect(cancelLabel()).toBe('Abort')
      expect(cancelAriaLabel()).toBe('Discard')
    })
  })
})
