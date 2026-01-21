import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing'

export interface OcxSrcHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class OcxSrcHarness extends ComponentHarness {
  static readonly hostSelector = 'img'

  static with(options: OcxSrcHarnessFilters = {}): HarnessPredicate<OcxSrcHarness> {
    return new HarnessPredicate(OcxSrcHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getSrcAttribute(): Promise<string | null> {
    return await (await this.host()).getAttribute('src')
  }

  async getSrcProperty(): Promise<string | null> {
    return await (await this.host()).getProperty<string>('src')
  }

  async getVisibility(): Promise<string | null> {
    const style = await (await this.host()).getAttribute('style')
    if (!style) return null
    const match = /visibility\s*:\s*([^;]+)/i.exec(style)
    return match?.[1]?.trim() ?? null
  }

  async dispatchLoad(): Promise<void> {
    const host = await this.host()
    await host.dispatchEvent('load')
  }

  async getTestElement(): Promise<TestElement> {
    return await this.host()
  }
}
