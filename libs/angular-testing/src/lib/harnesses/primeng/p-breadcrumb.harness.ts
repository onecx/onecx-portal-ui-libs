import { ComponentHarness } from '@angular/cdk/testing'
import { ListItemHarness } from '../list-item.harness'

export class PBreadcrumbHarness extends ComponentHarness {
  static hostSelector = 'p-breadcrumb'

  getBreadcrumbItems = this.locatorForAll(ListItemHarness)

  async getBreadcrumbItem(itemText: string): Promise<ListItemHarness | null> {
    return await this.locatorForOptional(ListItemHarness.with({ text: itemText }))()
  }
}
