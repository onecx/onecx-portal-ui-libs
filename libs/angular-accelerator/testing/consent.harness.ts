import { ComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness } from '@onecx/angular-testing'

/**
 * Matches the withdraw control: the native button (current markup) and the
 * anchor used by earlier versions (legacy markup), so the harness works with both.
 */
const WITHDRAW_SELECTOR = 'button.ocx-consent__withdraw, a.cursor-pointer.text-primary.underline'

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
    const button = await this.locatorFor(WITHDRAW_SELECTOR)()
    await button.click()
  }

  async isWithdrawVisible(): Promise<boolean> {
    const withdraw = await this.locatorForOptional(WITHDRAW_SELECTOR)()
    return !!withdraw
  }

  async isInfoVisible(): Promise<boolean> {
    const info = await this.locatorForOptional('[ocx-consent-info]')()
    return !!info
  }
}
