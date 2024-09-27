import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PDialogHarness, PPicklistHarness, PButtonHarness } from '@onecx/angular-testing'

export class CustomGroupColumnSelectorHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-custom-group-column-selector'

  getCustomGroupColumnSelectorButton = this.locatorFor(
    PButtonHarness.with({
      id: 'customGroupColumnSelectorButton',
    })
  )

  getDialog = this.locatorFor(PDialogHarness)
  getCancelButton = this.locatorFor(PButtonHarness.with({ id: 'cancelButton' }))
  getSaveButton = this.locatorFor(PButtonHarness.with({ id: 'saveButton' }))
  getPicklist = this.locatorFor(PPicklistHarness)
  getSelectButtons = this.locatorForOptional('[name]')

  async getFrozenActionColumnSelectButton() {
    return await this.locatorForAll(`[name="frozen-action-column-select-button"] .p-button`)()
  }

  async getActionColumnPositionSelectButtons() {
    return await this.locatorForAll(`[name="action-column-position-select-button"] .p-button`)()
  }

  async openCustomGroupColumnSelectorDialog() {
    if (!(await (await this.getDialog()).isVisible())) {
      await (await this.getCustomGroupColumnSelectorButton()).click()
    } else {
      console.warn('Unable to open CustomGroupColumnSelectionDialog, because it is already open.')
    }
  }
}
