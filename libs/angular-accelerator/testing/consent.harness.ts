import { ComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness, DivHarness } from '@onecx/angular-testing'

export class OcxConsentHarness extends ComponentHarness {
  static hostSelector = 'ocx-consent'

  async isConsentMessageVisible(): Promise<boolean> {
    const message = await this.locatorForOptional(DivHarness.with({ class: 'ocx-consent' }))()
    return !!message
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
    const button = await this.locatorFor(
      ButtonHarness.with({ ancestor: '.ocx-consent', selector: 'button.p-button-secondary' })
    )()
    await button.click()
  }

  async isInfoVisible(): Promise<boolean> {
    const info = await this.locatorForOptional('[ocx-consent-info]')()
    return !!info
  }
}
