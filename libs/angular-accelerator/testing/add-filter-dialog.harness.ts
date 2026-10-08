import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import {
  PButtonDirectiveHarness,
  PMultiSelectHarness,
  PSelectHarness,
} from '@onecx/angular-testing'

/**
 * Harness for the Filter View "Add Filter" dialog ({@link AddFilterDialogComponent}).
 *
 * The column/value selectors live inside the dialog's content (the host component's
 * scope), while the confirm/primary button lives in the {@link DialogFooter} that the
 * PortalDialogService appends to the document body - hence it is reached through the
 * document root locator rather than the host scope.
 */
export class AddFilterDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-add-filter-dialog'

  // Located by the p-select's host id. PrimeNG binds `inputId` to the inner native
  // `<input id>`, so the label's `for` resolves to the actual focusable input (not the
  // p-select host); the inputId association itself is verified in the integration spec
  // via a direct DOM query.
  getColumnSelect = this.locatorForOptional(PSelectHarness.with({ id: 'ocxAddFilterColumnSelect' }))

  getValueSelect = this.locatorForOptional(PMultiSelectHarness.with({ id: 'ocxAddFilterValueSelect' }))

  // The dialog footer (and thus the confirm button) is appended to <body>.
  private getConfirmButton = this.documentRootLocatorFactory().locatorForOptional(
    PButtonDirectiveHarness.with({ id: 'buttonDialogPrimaryButton' })
  )

  /** Opens the column select and selects the option with the given label. */
  async selectColumn(label: string): Promise<void> {
    const select = await this.getColumnSelect()
    if (!select) {
      throw new Error('Column select not found')
    }
    await select.open()
    const item = await select.getSelectItem(label)
    if (!item) {
      throw new Error(`Column option "${label}" not found`)
    }
    await item.selectItem()
  }

  /** Opens the value multi-select and toggles on every option whose label matches. */
  async selectValues(labels: string[]): Promise<void> {
    const select = await this.getValueSelect()
    if (!select) {
      throw new Error('Value multi-select not found')
    }
    await select.open()
    const options = await select.getAllOptions()
    for (const option of options) {
      if (labels.includes(await option.getText())) {
        await option.click()
      }
    }
    await select.close()
  }

  /** Whether the dialog's confirm (primary) button is currently disabled. */
  async getConfirmDisabled(): Promise<boolean> {
    const button = await this.getConfirmButton()
    if (!button) {
      throw new Error('Confirm button not found (is the dialog footer rendered?)')
    }
    return await button.getDisabled()
  }

  /** Clicks the dialog's confirm (primary) button. */
  async clickConfirm(): Promise<void> {
    const button = await this.getConfirmButton()
    if (!button) {
      throw new Error('Confirm button not found (is the dialog footer rendered?)')
    }
    await button.click()
  }
}
