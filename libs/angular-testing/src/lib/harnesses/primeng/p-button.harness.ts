import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { SpanHarness } from '../span.harness'

/**
 * Matches a PrimeIcons class pair in one class attribute string, e.g. `pi pi-check`.
 *
 * - `\bpi\s+`: the base PrimeIcons class.
 * - `pi-[a-z0-9-]+\b`: the specific icon class.
 */
const ICON_CLASS_PATTERN = /\bpi\s+pi-[a-z0-9-]+\b/i

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

  /**
   * Returns the icon class string (e.g. `"pi pi-check"`) or `null` if no icon is present.
   *
   * Reads the `icon` attribute first (static bindings). Falls back to a regex match on the icon
   * `<span>` classes for dynamic bindings (e.g. `class="p-button-icon pi pi-check"` → `"pi pi-check"`).
   */
  async getIcon(): Promise<string | null> {
    const iconAttribute = await (await this.host()).getAttribute('icon')
    const classAttr = await (await (await this.getIconSpan())?.host())?.getAttribute('class')
    const iconClassMatch = classAttr?.match(ICON_CLASS_PATTERN)

    return iconAttribute ?? iconClassMatch?.[0] ?? null
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
