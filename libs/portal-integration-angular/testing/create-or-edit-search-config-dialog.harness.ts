import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PCheckboxHarness } from './primeng/p-checkbox.harness'
import { InputHarness } from './input.harness'

export class CreateOrEditSearchConfigDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-create-or-edit-search-config-dialog'

  getSaveInputValuesCheckboxHarness() {
    return this.getHarness(PCheckboxHarness.with({ inputid: 'saveInputValuesId' }))
  }

  getSaveColumnsCheckboxHarness() {
    return this.getHarness(PCheckboxHarness.with({ inputid: 'saveColumnsId' }))
  }

  getSearchConfigInputHarness(inputId: string) {
    return this.getHarness(InputHarness.with({ id: 'searchConfigName' }))
  }
}
