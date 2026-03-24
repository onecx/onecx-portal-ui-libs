import { ComponentHarness, HarnessPredicate, BaseHarnessFilters } from '@angular/cdk/testing';

export interface OcxTooltipHarnessFilters extends BaseHarnessFilters {
  text?: string;
  hostSelector?: string;
}

export class OcxTooltipHarness extends ComponentHarness {
  private static readonly defaultHostSelector = '.ocx-tooltip-host';
  private static configuredHostSelector = OcxTooltipHarness.defaultHostSelector;

  static get hostSelector(): string {
    return OcxTooltipHarness.configuredHostSelector;
  } 

  static with(options: OcxTooltipHarnessFilters = {}) {
    const { hostSelector, selector, ...rest } = options;
    return new HarnessPredicate(OcxTooltipHarness, {
      ...rest,
      selector: hostSelector ?? selector ?? OcxTooltipHarness.hostSelector
    })
      .addOption('text', options.text, async (harness, text) =>
        (await harness.getTooltipText()) === text
      );
  }

  static withHostSelector(hostSelector: string) {
    return OcxTooltipHarness.with({ hostSelector });
  }

  async hover(): Promise<void> {
    const host = await this.host();
    await host.dispatchEvent('mouseenter');
  }

  async unhover(): Promise<void> {
    const host = await this.host();
    await host.dispatchEvent('mouseleave');
  }

  async getTooltipText(): Promise<string | null> {
    const tooltip = await this.documentRootLocatorFactory()
      .locatorForOptional('.p-tooltip-text')();

    return tooltip ? await tooltip.text() : null;
  }

  async getTooltipId(): Promise<string | null> {
    const tooltip = await this.documentRootLocatorFactory()
      .locatorForOptional('.p-tooltip')();

    return tooltip ? await tooltip.getAttribute('id') : null;
  }

  async isVisible(): Promise<boolean> {
    const tooltip = await this.documentRootLocatorFactory()
      .locatorForOptional('.p-tooltip')();

    return !!tooltip;
  }
}