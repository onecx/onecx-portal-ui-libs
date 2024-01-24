import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DefaultGridItemHarness } from './default-grid-item.harness'
import { DefaultListItemHarness } from './default-list-item.harness'
import { PPaginatorHarness } from './primeng/p-paginator.harness'

export class DataListGridHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-list-grid'

  getDefaultGridItems = this.locatorForAll(DefaultGridItemHarness)
  getDefaultListItems = this.locatorForAll(DefaultListItemHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
}
