import { ComponentHarness } from '@angular/cdk/testing'

export class GroupByCountDiagramHarness extends ComponentHarness {
  static hostSelector = 'ocx-group-by-count-diagram'

  async getSumKey(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-sum-key')
  }

  async getData(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-data')
  }

  async getColumn(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-column')
  }
}
