import { ComponentHarness } from '@angular/cdk/testing'

/**
 * Harness for `<ocx-form-error-summary>`, the alert region reporting form-level failures.
 */
export class OcxFormErrorSummaryHarness extends ComponentHarness {
  static readonly hostSelector = 'ocx-form-error-summary'

  private readonly alert = this.locatorFor('[role="alert"]')
  private readonly items = this.locatorForAll('li')

  /** The summary is exposed as an alert, so that screen readers announce added errors */
  async isAlert(): Promise<boolean> {
    return (await (await this.alert()).getAttribute('role')) === 'alert'
  }

  async getErrors(): Promise<string[]> {
    return await Promise.all((await this.items()).map(async (item) => (await item.text()).trim()))
  }

  async hasErrors(): Promise<boolean> {
    return (await this.getErrors()).length > 0
  }

  async isFocused(): Promise<boolean> {
    return await (await this.alert()).isFocused()
  }

  /** Clicks the entry of the given error text, which moves focus to the invalid field */
  async clickError(text: string | RegExp): Promise<void> {
    const links = await this.locatorForAll('li a')()
    for (const link of links) {
      const t = (await link.text()).trim()
      if (typeof text === 'string' ? t === text : text.test(t)) {
        await link.click()
        return
      }
    }
    throw new Error(`No linked error matching ${text}`)
  }
}
