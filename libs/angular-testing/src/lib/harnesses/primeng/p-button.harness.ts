import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { SpanHarness } from '../span.harness'

export interface PButtonHarnessFilters extends BaseHarnessFilters {
  id?: string
  name?: string
  label?: string
  icon?: string
}

export class PButtonHarness extends ComponentHarness {
  static hostSelector = 'p-button'

  getLabelSpan = this.locatorForOptional(SpanHarness.with({ class: 'p-button-label' }))
  getIconSpan = this.locatorForOptional(SpanHarness.with({ class: 'p-button-icon' }))
  getBadge = this.locatorForOptional('p-badge')

  static with(options: PButtonHarnessFilters): HarnessPredicate<PButtonHarness> {
    return new HarnessPredicate(PButtonHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('name', options.name, (harness, name) => HarnessPredicate.stringMatches(harness.getName(), name))
      .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
      .addOption('icon', options.icon, (harness, icon) => HarnessPredicate.stringMatches(harness.getIcon(), icon))
  }
  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getName(): Promise<string | null> {
    return await (await this.host()).getAttribute('name')
  }

  async getLabel(): Promise<string | null> {
    return (await (await this.getLabelSpan())?.getText()) ?? null
  }

  async getIcon(): Promise<string | null> {
    const iconAttribute = await (await this.host()).getAttribute('icon')
    const classAttr = await (await (await this.getIconSpan())?.host())?.getAttribute('class')

    return iconAttribute ?? classAttr?.split(" ").slice(-2).join(' ') ?? null
  }

  async click() {
    await (await this.locatorFor('button')()).click()
  }

  async getBadgeValue(): Promise<string | null> {
    const badgeAttribute = await (await this.host()).getAttribute('badge')
    const badgeText = await (await this.getBadge())?.text()

    return badgeAttribute ?? badgeText?.trim() ?? null
  }

  async getLoadingIcon() {
    return await this.locatorForOptional('.p-button-loading-icon')()
  }
}
