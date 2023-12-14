import { PDropdownHarness } from './primeng/p-dropdown.harness'
import { ContentContainerComponentHarness } from '@angular/cdk/testing'

export class SearchConfigHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-search-config'

  getSearchConfigDropdown = this.locatorForOptional(PDropdownHarness.with({ id: 'searchConfig' }))
}
