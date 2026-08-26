import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PButtonDirectiveHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export type PButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'help'
  | 'danger'
  | 'contrast'
  | undefined

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

  /**
   * Gets the PrimeNG button severity by reading the host element's CSS classes.
   * PrimeNG applies severity as CSS classes in the format 'p-button-{severity}'.
   * Returns undefined when no severity class is present (backward compatible with default appearance).
   */
  async getSeverity(): Promise<PButtonSeverity> {
    const host = await this.host()
    const classList = await host.getProperty('classList')
    if (!classList) {
      return undefined
    }

    const classes = Array.from(classList as DOMTokenList)
    const severityMap: Record<string, Exclude<PButtonSeverity, undefined>> = {
      'p-button-primary': 'primary',
      'p-button-secondary': 'secondary',
      'p-button-success': 'success',
      'p-button-info': 'info',
      'p-button-warning': 'warning',
      'p-button-help': 'help',
      'p-button-danger': 'danger',
      'p-button-contrast': 'contrast',
    }

    for (const cls of classes) {
      if (cls in severityMap) {
        return severityMap[cls]
      }
    }
    return undefined
  }
}
