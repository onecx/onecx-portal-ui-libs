import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Component, inject } from '@angular/core'
import { DynamicDialogModule } from 'primeng/dynamicdialog'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import {
  provideAppStateServiceMock,
  provideShellCapabilityServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorModule } from '../../../angular-accelerator.module'
import { PortalDialogService, providePortalDialogService } from '../../../services/portal-dialog.service'
import { AddFilterDialogComponent } from './add-filter-dialog.component'
import type { DataTableColumn } from '../../../model/data-table-column.model'
import { ColumnType } from '../../../model/column-type.model'
import { Filter, FilterType } from '../../../model/filter.model'
import { RowListGridData } from '../../../model/row-list-grid-data.model'
import { AddFilterDialogHarness, DialogFooterHarness } from '../../../../../testing'

const translations: any = {
  TITLE: 'Add filter',
  CONFIRM: 'Confirm',
  CANCEL: 'Cancel',
  CLOSE: 'Close add filter dialog',
  COL_LABEL: 'Column',
  VAL_LABEL: 'Values',
}

/** Minimal host that opens the real Add Filter dialog through the real PortalDialogService. */
@Component({
  standalone: false,
  template: `<button id="trigger">open</button>`,
})
class AddFilterDialogHost {
  portalDialogService = inject(PortalDialogService)

  open(
    columns: DataTableColumn[],
    data: RowListGridData[],
    existingFilters: Filter[] = [],
    preselectColumnId?: string,
    initiatorRef?: HTMLElement
  ): Promise<{ button?: string; result?: Filter[] } | null> {
    return this.portalDialogService
      .openDialog<Filter[]>(
        'TITLE',
        {
          type: AddFilterDialogComponent,
          inputs: { columns, data, existingFilters, preselectColumnId },
        },
        'CONFIRM',
        'CANCEL',
        { closeAriaLabel: 'CLOSE', initiatorRef, onCloseFocus: 'initiator' }
      )
      .toPromise()
  }
}

const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
  ({
    id: 'id',
    nameKey: 'nameKey',
    columnType: ColumnType.STRING,
    filterable: true,
    ...overrides,
  }) as DataTableColumn

describe('AddFilterDialogComponent (integration / harness)', () => {
  let fixture: ComponentFixture<AddFilterDialogHost>
  let host: AddFilterDialogHost

  const columns: DataTableColumn[] = [
    makeColumn({ id: 'product', nameKey: 'product', columnType: ColumnType.STRING }),
    makeColumn({ id: 'amount', nameKey: 'amount', columnType: ColumnType.NUMBER }),
  ]
  const data = [
    { id: 1, product: 'Apples', amount: 2 },
    { id: 2, product: 'Bananas', amount: 10 },
  ] as unknown as RowListGridData[]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFilterDialogHost],
      imports: [DynamicDialogModule, NoopAnimationsModule, AngularAcceleratorModule],
      providers: [
        providePortalDialogService(),
        provideShellCapabilityServiceMock(),
        provideAppStateServiceMock(),
        provideTranslateTestingService({ en: translations }),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(AddFilterDialogHost)
    host = fixture.componentInstance
    fixture.detectChanges()
  })

  // DynamicDialog appends to <body> and persists between tests.
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  // Subscribe to `openDialog`, which opens the dialog as a side effect. The returned
  // promise resolves only when the dialog closes, so it must NOT be awaited for
  // open-then-inspect tests - capture it and await it only when the test closes the
  // dialog.
  function openDialog(
    extra?: { existingFilters?: Filter[]; preselectColumnId?: string; initiatorRef?: HTMLElement }
  ): Promise<{ button?: string; result?: Filter[] } | null> {
    return host.open(
      columns,
      data,
      extra?.existingFilters ?? [],
      extra?.preselectColumnId,
      extra?.initiatorRef
    )
  }

  // Poll for an element DynamicDialog appends to <body>. `whenStable()` cannot be used
  // here: once the modal dialog is open the PrimeNG focus-trap/animation work keeps a
  // pending zone task, so `whenStable()` would never resolve.
  async function waitForElement(selector: string, timeoutMs = 4000): Promise<boolean> {
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      if (document.querySelector(selector)) {
        return true
      }
      await new Promise((r) => setTimeout(r, 10))
    }
    return !!document.querySelector(selector)
  }

  // A few macrotask ticks + change-detection passes so the async title/column-label
  // translation and the value-option signals settle after the dialog host has appeared.
  async function settle(): Promise<void> {
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 0))
      fixture.detectChanges()
    }
  }

  // Wait for the dialog to be open and settled before the test inspects it.
  async function flushDialog(): Promise<void> {
    expect(await waitForElement('ocx-add-filter-dialog')).toBe(true)
    await settle()
  }

  it('should offer only the filterable columns in the column select', async () => {
    openDialog()
    await flushDialog()

    const addFilterHarness = await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(AddFilterDialogHarness)
    const columnSelect = await addFilterHarness.getColumnSelect()
    expect(columnSelect).toBeTruthy()
    await columnSelect?.open()
    const items = await Promise.all((await columnSelect?.getSelectItems()).map((item) => item.getText()))
    expect(items).toEqual(['product', 'amount'])
  })

  it('should switch the value options when a column is selected', async () => {
    openDialog()
    await flushDialog()

    const addFilterHarness = await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(AddFilterDialogHarness)

    // Default selection is the first column (`product`) -> its distinct values.
    const firstOptions = await Promise.all(
      (await (await addFilterHarness.getValueSelect())?.getAllOptions()).map((o) => o.getText())
    )
    expect([...firstOptions].sort()).toEqual(['Apples', 'Bananas'])

    await addFilterHarness.selectColumn('amount')
    const numericOptions = await Promise.all(
      (await (await addFilterHarness.getValueSelect())?.getAllOptions()).map((o) => o.getText())
    )
    expect([...numericOptions].sort()).toEqual(['10', '2'])
  })

  it('should keep the confirm button disabled until a value is selected, then capture the filters', async () => {
    const statePromise = openDialog()
    await flushDialog()

    const addFilterHarness = await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(AddFilterDialogHarness)

    // No value selected yet -> confirm disabled.
    expect(await addFilterHarness.getConfirmDisabled()).toBe(true)

    await addFilterHarness.selectValues(['Apples'])
    expect(await addFilterHarness.getConfirmDisabled()).toBe(false)

    await addFilterHarness.clickConfirm()
    const state = await statePromise
    expect(state?.button).toBe('primary')
    expect(state?.result).toEqual([{ columnId: 'product', value: 'Apples', filterType: FilterType.EQUALS }])
  }, 20000)

  it('should associate the field labels with a focusable control via inputId', async () => {
    openDialog()
    await flushDialog()

    // Guards that the dialog rendered before asserting on its label association.
    await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(AddFilterDialogHarness)

    // A `<label for>` is only useful when its `for` id resolves to a focusable element:
    // clicking the label then moves focus to the control and screen readers announce the
    // relationship. PrimeNG binds `inputId` to a focusable element (a native `<input>` for
    // the p-multiSelect value control, a focusable combobox for the p-select column control).
    const isFocusableTarget = (el: Element | null): boolean =>
      !!el &&
      (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(el.tagName) ||
        el.hasAttribute('tabindex') ||
        el.getAttribute('role') === 'combobox')

    for (const id of ['ocxAddFilterColumnInput', 'ocxAddFilterValueInput']) {
      const label = document.querySelector(`label[for="${id}"]`)
      expect(label).toBeTruthy()
      const target = document.getElementById(id)
      expect(target).toBeTruthy()
      expect(isFocusableTarget(target)).toBe(true)
    }
  })

  it('should return focus to the triggering control when the dialog closes', async () => {
    const trigger = fixture.debugElement.nativeElement.querySelector('#trigger') as HTMLElement
    trigger.focus()

    const statePromise = openDialog({ initiatorRef: trigger })
    await flushDialog()

    // Close via the secondary (Cancel) button: with no value selected the primary
    // (Confirm) button is disabled, so it would not close the dialog.
    const footer = await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(DialogFooterHarness)
    await footer.clickSecondaryButton()

    const state = await statePromise
    expect(state?.button).toBe('secondary')
    expect(document.activeElement).toBe(trigger)
  }, 20000)
})
