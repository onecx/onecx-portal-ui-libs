import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing'

export interface OcxFormFieldHarnessFilters extends BaseHarnessFilters {
  id?: string
  /** Accessible name of the label associated with the field */
  label?: string
}

/**
 * Harness for an input carrying the `ocxFormField` directive.
 */
export class OcxFormFieldHarness extends ComponentHarness {
  static readonly hostSelector = '[ocxFormField]'

  static with(options: OcxFormFieldHarnessFilters = {}): HarnessPredicate<OcxFormFieldHarness> {
    return new HarnessPredicate(OcxFormFieldHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('label', options.label, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabelText(), label)
      )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getValue(): Promise<string> {
    return await (await this.host()).getProperty<string>('value')
  }

  async setValue(value: string): Promise<void> {
    const host = await this.host()
    await host.clear()
    if (value) {
      await host.sendKeys(value)
    }
    await host.dispatchEvent('input')
  }

  async focus(): Promise<void> {
    await (await this.host()).focus()
  }

  async blur(): Promise<void> {
    await (await this.host()).blur()
  }

  async isFocused(): Promise<boolean> {
    return await (await this.host()).isFocused()
  }

  async isRequired(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-required')) === 'true'
  }

  async isInvalid(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-invalid')) === 'true'
  }

  /** Text of the `<label for>` that is associated with the field, or null if there is none */
  async getLabelText(): Promise<string | null> {
    const id = await this.getId()
    if (!id) return null
    const label = await this.documentRootLocatorFactory().locatorForOptional(`label[for="${id}"]`)()
    return label ? (await label.text()).trim() : null
  }

  /** Text of the elements referenced by `aria-describedby`, i.e. the error text while the field shows an error */
  async getDescription(): Promise<string> {
    const ids = ((await (await this.host()).getAttribute('aria-describedby')) ?? '').split(/\s+/).filter(Boolean)
    const texts: string[] = []
    for (const id of ids) {
      const el: TestElement | null = await this.documentRootLocatorFactory().locatorForOptional(`[id="${id}"]`)()
      if (el) texts.push((await el.text()).trim())
    }
    return texts.join(' ').trim()
  }

  /** Error text of the field, or null if no error is shown */
  async getErrorText(): Promise<string | null> {
    if (!(await this.isInvalid())) return null
    return (await this.getDescription()) || null
  }
}
