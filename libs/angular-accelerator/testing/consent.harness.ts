import { ComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness } from '@onecx/angular-testing'

export class OcxConsentHarness extends ComponentHarness {
  static hostSelector = 'ocx-consent'

  async isConsentMessageVisible(): Promise<boolean> {
    return !!(await this.locatorForOptional('.ocx-consent')())
  }

  async isContentVisible(selector: string): Promise<boolean> {
    const projected = await this.locatorForOptional(selector)()
    return !!projected
  }

  async clickAgree(): Promise<void> {
    const button = await this.locatorFor(
      ButtonHarness.with({ ancestor: '.ocx-consent', selector: 'button' })
    )()
    await button.click()
  }

  async clickWithdraw(): Promise<void> {
    const button = await this.locatorFor('a.cursor-pointer.text-primary.underline')()
    await button.click()
  }

  async isWithdrawVisible(): Promise<boolean> {
    const withdraw = await this.locatorForOptional('a.cursor-pointer.text-primary.underline')()
    return !!withdraw
  }

  async isInfoVisible(): Promise<boolean> {
    const info = await this.locatorForOptional('[ocx-consent-info]')()
    return !!info
  }
}
