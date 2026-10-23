import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { of } from 'rxjs'
import { ButtonModule } from '@openng/optimus-ui/button'
import { ChipModule } from '@openng/optimus-ui/chip'
import { Popover, PopoverModule } from '@openng/optimus-ui/popover'
import { TooltipModule } from '@openng/optimus-ui/tooltip'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { IfBreakpointDirective } from '../../directives/if-breakpoint.directive'
import { FilterViewComponent } from './filter-view.component'
import { ColumnType } from '../../model/column-type.model'
import type { DataTableColumn } from '../../model/data-table-column.model'
import type { Filter } from '../../model/filter.model'
import { DataViewStateService } from '../../services/data-view-state.service'
import { PortalDialogService } from '../../services/portal-dialog.service'
import { FilterViewHarness } from '../../../../testing/filter-view.harness'

const columns: DataTableColumn[] = [
  { id: 'status', nameKey: 'STATUS', columnType: ColumnType.STRING, filterable: true } as DataTableColumn,
]
const filters: Filter[] = ['a', 'b', 'c', 'd', 'e'].map((value) => ({ columnId: 'status', value }))

/** Accessible name from aria-labelledby, aria-label or the text content, enough for the buttons used here. */
function accessibleName(el: Element): string {
  const labelledBy = el.getAttribute('aria-labelledby')
  if (labelledBy) {
    return labelledBy
      .split(' ')
      .map((id) => el.ownerDocument.getElementById(id)?.textContent?.trim() ?? '')
      .join(' ')
  }
  return (el.getAttribute('aria-label') ?? el.textContent ?? '').replaceAll(/\s+/g, ' ').trim()
}

describe('FilterViewComponent chip controls', () => {
  let fixture: ComponentFixture<FilterViewComponent>
  let host: HTMLElement
  let openDialog: jest.Mock

  async function render(cols: DataTableColumn[], activeFilters: Filter[]) {
    fixture.componentRef.setInput('columns', cols)
    fixture.componentRef.setInput('filters', activeFilters)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }

  beforeEach(async () => {
    openDialog = jest.fn().mockReturnValue(of(null))
    await TestBed.configureTestingModule({
      declarations: [FilterViewComponent, IfBreakpointDirective],
      imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forRoot(),
        ButtonModule,
        ChipModule,
        PopoverModule,
        TooltipModule,
        OcxTooltipDirective,
      ],
      providers: [
        provideTranslateTestingService({}),
        DataViewStateService,
        { provide: PortalDialogService, useValue: { openDialog } },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(FilterViewComponent)
    fixture.componentRef.setInput('displayMode', 'chips')
    fixture.componentRef.setInput('templates', undefined)
    host = fixture.nativeElement as HTMLElement
    await render(columns, filters)
  }, 30000)

  const addChip = () => host.querySelector('#ocxFilterViewAddFilterChip') as HTMLButtonElement
  const showMore = () => host.querySelector('#ocxFilterViewShowMore') as HTMLButtonElement
  const removeButtons = () => Array.from(host.querySelectorAll<HTMLButtonElement>('.ocx-filter-view-chip-remove'))

  it('renders add, remove and more as native buttons in the tab order add, removes, more', () => {
    const tabbable = Array.from(host.querySelectorAll<HTMLElement>('button, [tabindex]')).filter(
      (el) => el.tabIndex >= 0 && !(el as HTMLButtonElement).disabled
    )
    // the first tab stop is the (inner button of the) reset button
    expect(tabbable.slice(1)).toEqual([addChip(), ...removeButtons(), showMore()])
    expect(removeButtons()).toHaveLength(3)
    for (const button of [addChip(), ...removeButtons(), showMore()]) {
      expect(button.tagName).toBe('BUTTON')
      expect(button.type).toBe('button')
      expect(button.hasAttribute('role')).toBe(false)
      expect(button.hasAttribute('tabindex')).toBe(false)
    }
  })

  it('keeps chip hosts out of the tab order and the accessibility roles', () => {
    for (const chip of Array.from(host.querySelectorAll('p-chip'))) {
      expect(chip.hasAttribute('role')).toBe(false)
      expect(chip.hasAttribute('tabindex')).toBe(false)
      expect(chip.hasAttribute('aria-label')).toBe(false)
      // the PrimeNG remove icon (role="button" on an svg with a generic name) is not used
      expect(chip.querySelector('[role="button"]')).toBeNull()
    }
  })

  it('names every button by its visible text (button-name, label-content-name-mismatch)', () => {
    expect(addChip().hasAttribute('aria-label')).toBe(false)
    expect(accessibleName(addChip())).toBe('OCX_FILTER_VIEW.ADD_FILTER.BUTTON')

    expect(showMore().hasAttribute('aria-label')).toBe(false)
    expect(accessibleName(showMore())).toBe('+2 OCX_FILTER_VIEW.SHOW_MORE.SR_TEXT')

    const names = removeButtons().map((b) => accessibleName(b))
    expect(names).toHaveLength(3)
    for (const name of names) {
      expect(name).toMatch(/^OCX_FILTER_VIEW\.TABLE\.REMOVE_FILTER_ARIA_LABEL STATUS:\s*[a-e]$/)
    }
    expect(new Set(names).size).toBe(3)
  })

  it('uses only ids that exist once in aria-labelledby of the remove buttons', () => {
    for (const button of removeButtons()) {
      for (const id of (button.getAttribute('aria-labelledby') ?? '').split(' ')) {
        expect(host.querySelectorAll(`[id="${id}"]`)).toHaveLength(1)
      }
    }
  })

  it('removes the filter of a chip and moves focus to the add chip', () => {
    const button = removeButtons()[0]
    const removedValue = accessibleName(button).slice(-1)
    button.focus()
    button.click()
    fixture.detectChanges()

    expect(fixture.componentInstance.stateService.filters().map((f) => f.value)).not.toContain(removedValue)
    expect(document.activeElement).toBe(addChip())
  })

  it('opens the add filter dialog with the chip as initiator, so focus returns to it on close', async () => {
    addChip().click()
    await fixture.whenStable()

    expect(openDialog).toHaveBeenCalledTimes(1)
    const options = openDialog.mock.calls[0][4]
    expect(options.initiatorRef).toBe(addChip())
    expect(options.onCloseFocus).toBe('initiator')
  })

  it('announces a disabled add chip as unavailable with the reason and does not open the dialog', async () => {
    await render([{ ...columns[0], filterable: false } as DataTableColumn], [])

    expect(addChip().getAttribute('aria-disabled')).toBe('true')
    expect(addChip().disabled).toBe(false)
    expect(addChip().classList).toContain('ocx-filter-view-add-filter-chip-disabled')
    expect(accessibleName(addChip())).toBe(
      'OCX_FILTER_VIEW.ADD_FILTER.BUTTON OCX_FILTER_VIEW.ADD_FILTER.NO_FILTERABLE_COLUMNS'
    )

    addChip().click()
    await fixture.whenStable()
    expect(openDialog).not.toHaveBeenCalled()
  })

  it('opens the panel from the more chip and returns focus to it when the panel closes (Esc)', () => {
    const popover = fixture.debugElement.query(By.directive(Popover)).componentInstance as Popover
    const toggle = jest.spyOn(popover, 'toggle').mockImplementation(() => undefined)
    expect(showMore().contains(fixture.debugElement.query(By.directive(Popover)).nativeElement)).toBe(false)

    // click on the inner text: the trigger is still the button
    ;(showMore().querySelector('span') as HTMLElement).click()
    expect(toggle).toHaveBeenCalledTimes(1)
    expect(fixture.componentInstance.trigger()).toBe(showMore())

    popover.onShow.emit({})
    fixture.detectChanges()
    expect(showMore().getAttribute('aria-expanded')).toBe('true')
    expect(showMore().getAttribute('aria-controls')).toBe(fixture.componentInstance.panelId)

    // Esc hides the popover, which emits onHide
    popover.onHide.emit({})
    fixture.detectChanges()
    expect(showMore().getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(showMore())
  })

  it('lets the harness find the removable chips, the add chip and the more chip', async () => {
    const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, FilterViewHarness)

    expect(await harness.getChips()).toHaveLength(3)
    expect(await harness.getAddFilterChip()).toBeTruthy()
    expect(await harness.getShowMoreChip()).toBeTruthy()
    expect(await harness.isAddFilterChipDisabled()).toBe(false)

    const [firstChip] = await harness.getChips()
    await firstChip.clickRemove()
    expect(fixture.componentInstance.stateService.filters()).toHaveLength(4)

    await render([{ ...columns[0], filterable: false } as DataTableColumn], [])
    expect(await harness.isAddFilterChipDisabled()).toBe(true)

    fixture.componentRef.setInput('displayMode', 'button')
    await render(columns, filters)
    expect(await harness.getAddFilterChip()).toBeNull()
    expect(await harness.isAddFilterChipDisabled()).toBe(false)
  })
})
