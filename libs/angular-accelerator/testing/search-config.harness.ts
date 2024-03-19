import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PDropdownHarness } from '@onecx/angular-testing'

export class SearchConfigHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-search-config'

  getSearchConfigDropdown = this.locatorForOptional(PDropdownHarness.with({ id: 'searchConfig' }))
}
