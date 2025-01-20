import { ContentContainerComponentHarness } from '@onecx/angular-testing'
import { DialogContentHarness } from './dialog-content.harness'
import { DialogFooterHarness } from './dialog-footer.harness'

export class DialogInlineHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-dialog-inline'

  getDialogContent = this.locatorFor(DialogContentHarness)
  getDialogFooter = this.locatorFor(DialogFooterHarness)
}
