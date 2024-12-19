import { ContentContainerComponentHarness } from '@onecx/angular-testing'
import { DialogMessageContentHarness } from './dialog-message-content.harness'

export class DialogContentHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-dialog-content'

  getDialogMessageContent = this.locatorForOptional(DialogMessageContentHarness)
}
