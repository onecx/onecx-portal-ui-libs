import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { of } from 'rxjs'
import { ButtonModule } from '@openng/optimus-ui/button'
import { By } from '@angular/platform-browser'
import { Popover, PopoverModule } from '@openng/optimus-ui/popover'
import { TooltipModule } from '@openng/optimus-ui/tooltip'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { FilterViewComponent } from './filter-view.component'
import { ColumnType } from '../../model/column-type.model'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { DataViewStateService } from '../../services/data-view-state.service'
import { PortalDialogService } from '../../services/portal-dialog.service'

jest.setTimeout(60000)

describe('FilterViewComponent popup trigger semantics', () => {
  let fixture: ComponentFixture<FilterViewComponent>
  let host: HTMLElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterViewComponent],
      imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forRoot(),
        ButtonModule,
        PopoverModule,
        TooltipModule,
        OcxTooltipDirective,
      ],
      providers: [
        provideTranslateTestingService({}),
        DataViewStateService,
        { provide: PortalDialogService, useValue: { openDialog: jest.fn().mockReturnValue(of(null)) } },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(FilterViewComponent)
    fixture.componentRef.setInput('columns', [
      { id: 'c1', nameKey: 'c1', columnType: ColumnType.STRING, filterable: true } as DataTableColumn,
    ])
    fixture.componentRef.setInput('filters', [])
    fixture.componentRef.setInput('templates', undefined)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    host = fixture.nativeElement as HTMLElement
  })

  const innerButton = () => host.querySelector('#ocxFilterViewManage button') as HTMLButtonElement

  it('has exactly one tab stop on the manage button: the inner button, not the p-button host', () => {
    const pButton = host.querySelector('#ocxFilterViewManage') as HTMLElement
    expect(pButton).toBeTruthy()
    expect(pButton.hasAttribute('tabindex')).toBe(false)
    expect(innerButton()).toBeTruthy()
    expect(innerButton().tabIndex).toBe(0)
    const tabbables = Array.from(pButton.querySelectorAll('[tabindex],button')).filter(
      (el) => (el as HTMLElement).tabIndex >= 0
    )
    expect(tabbables).toEqual([innerButton()])
  })

  it('puts the popup state attributes on the inner button only, never on the p-button host', () => {
    const pButton = host.querySelector('#ocxFilterViewManage') as HTMLElement
    // aria-describedby is a global attribute added by ocxTooltip and is out of scope here
    const hostAria = pButton.getAttributeNames().filter((n) => n.startsWith('aria-') && n !== 'aria-describedby')
    expect(hostAria).toEqual([])
    expect(innerButton().getAttribute('aria-haspopup')).toBe('dialog')
  })

  it('toggles aria-expanded false/true/false and sets aria-controls only while open', () => {
    expect(innerButton().getAttribute('aria-expanded')).toBe('false')
    expect(innerButton().hasAttribute('aria-controls')).toBe(false)

    const popover = fixture.debugElement.query(By.directive(Popover)).componentInstance
    popover.onShow.emit({})
    fixture.detectChanges()
    expect(innerButton().getAttribute('aria-expanded')).toBe('true')
    expect(innerButton().getAttribute('aria-controls')).toBe(fixture.componentInstance.panelId)

    popover.onHide.emit({})
    fixture.detectChanges()
    expect(innerButton().getAttribute('aria-expanded')).toBe('false')
    expect(innerButton().hasAttribute('aria-controls')).toBe(false)
  })

  it('gives the p-popover an accessible name from the panel title', () => {
    const popover = fixture.debugElement.query(By.directive(Popover)).componentInstance
    expect(popover.ariaLabel).toBe('OCX_FILTER_VIEW.PANEL_TITLE')
  })
})
