import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface OcxFormFieldErrorHarnessFilters extends BaseHarnessFilters {
  text?: string | RegExp
}

/**
 * Harness for `<ocx-form-field-error>`, the error text next to a form field.
 */
export class OcxFormFieldErrorHarness extends ComponentHarness {
  static readonly hostSelector = 'ocx-form-field-error'

  static with(options: OcxFormFieldErrorHarnessFilters = {}): HarnessPredicate<OcxFormFieldErrorHarness> {
    return new HarnessPredicate(OcxFormFieldErrorHarness, options).addOption('text', options.text, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getText(), text)
    )
  }

  private readonly region = this.locatorFor('.ocx-form-field-error')

  async getId(): Promise<string | null> {
    return await (await this.region()).getAttribute('id')
  }

  /** Error text, empty if the field shows no error */
  async getText(): Promise<string> {
    return (await (await this.region()).text()).trim()
  }

  async hasError(): Promise<boolean> {
    return (await this.getText()) !== ''
  }

  /** The error text is exposed as a polite live region */
  async isLiveRegion(): Promise<boolean> {
    return (await (await this.region()).getAttribute('aria-live')) === 'polite'
  }
}
