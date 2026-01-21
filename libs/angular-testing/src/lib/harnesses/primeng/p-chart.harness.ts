import { ComponentHarness } from '@angular/cdk/testing'

export class PChartHarness extends ComponentHarness {
  static hostSelector = 'p-chart'

  async getType(): Promise<string | null> {
    return await (await this.host()).getAttribute('data-automation-type')
  }
  async getOptions(): Promise<string | null> {
    return await (await this.host()).getAttribute('data-automation-options')
  }
}
