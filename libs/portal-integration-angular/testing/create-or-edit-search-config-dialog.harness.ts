import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PCheckboxHarness, InputHarness } from '@onecx/angular-testing'

export class CreateOrEditSearchConfigDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-create-or-edit-search-config-dialog'

  getSaveInputValuesCheckboxHarness() {
    return this.getHarness(PCheckboxHarness.with({ inputid: 'saveInputValuesId' }))
  }

  getSaveColumnsCheckboxHarness() {
    return this.getHarness(PCheckboxHarness.with({ inputid: 'saveColumnsId' }))
  }

  getSearchConfigInputHarness() {
    return this.getHarness(InputHarness.with({ id: 'searchConfigName' }))
  }
}
