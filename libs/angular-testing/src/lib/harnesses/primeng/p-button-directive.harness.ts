import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PButtonDirectiveHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PButtonDirectiveHarness extends ComponentHarness {
  static hostSelector = 'button[pButton]'

  static with(options: PButtonDirectiveHarnessFilters): HarnessPredicate<PButtonDirectiveHarness> {
    return new HarnessPredicate(PButtonDirectiveHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async click() {
    await (await this.host()).click()
  }

  async getLabel(): Promise<string | null> {
    return await (await this.host()).text()
  }

  async getIcon(): Promise<string | null> {
    const iconElement = await this.locatorForOptional('.p-button-icon')()
    if (!iconElement) {
      return null
    }

    const classList = await iconElement.getProperty('classList')
    if (!classList) {
      return null
    }

    const iconClass = Array.from(classList as DOMTokenList).find((c: string) => 
      (c.startsWith('pi-'))
    )
    
    return iconClass ? `pi ${iconClass}` : null
  }

  async getDisabled(): Promise<boolean> {
    return await (await this.host()).getProperty('disabled')
  }
}
