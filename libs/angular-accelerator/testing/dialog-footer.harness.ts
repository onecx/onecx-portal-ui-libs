import { ContentContainerComponentHarness, PButtonDirectiveHarness } from '@onecx/angular-testing'

export class DialogFooterHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-dialog-footer'

  getPrimaryButton = this.locatorFor(PButtonDirectiveHarness.with({ id: 'buttonDialogPrimaryButton' }))
  getSecondaryButton = this.locatorForOptional(PButtonDirectiveHarness.with({ id: 'buttonDialogSecondaryButton' }))

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
