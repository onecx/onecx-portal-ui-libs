import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PButtonDirectiveHarness } from '@onecx/angular-testing'
import { DialogMessageContentHarness } from './dialog-message-content.harness'

export class ButtonDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-button-dialog'

  getPrimaryButton = this.locatorFor(PButtonDirectiveHarness.with({ id: 'buttonDialogPrimaryButton' }))
  getSecondaryButton = this.locatorForOptional(PButtonDirectiveHarness.with({ id: 'buttonDialogSecondaryButton' }))
  getDialogMessageContent = this.locatorForOptional(DialogMessageContentHarness)

  async clickPrimaryButton() {
    await (await this.getPrimaryButton()).click()
  }

  async clickSecondaryButton() {
    await (await this.getSecondaryButton())?.click()
  }

  async getPrimaryButtonLabel(): Promise<string | null> {
    return await (await this.getPrimaryButton()).getLabel()
  }

  async getPrimaryButtonIcon(): Promise<string | null> {
    return await (await this.getPrimaryButton()).getIcon()
  }

  async getSecondaryButtonLabel(): Promise<string | null | undefined> {
    return await (await this.getSecondaryButton())?.getLabel()
  }

  async getSecondaryButtonIcon(): Promise<string | null | undefined> {
    return await (await this.getSecondaryButton())?.getIcon()
  }

  async getPrimaryButtonDisabled(): Promise<boolean> {
    return await (await this.getPrimaryButton()).getDisabled()
  }

  async getSecondaryButtonDisabled(): Promise<boolean | undefined> {
    return await (await this.getSecondaryButton())?.getDisabled()
  }
}
