import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness } from './button.harness'
import { MoreActionsMenuButtonHarness } from './more-actions-menu-button.harness'
import { PButtonHarness } from './primeng/p-button.harness'

export class SearchHeaderHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-search-header'

  getSearchButton = this.locatorFor(
    PButtonHarness.with({
      id: 'searchButton',
    })
  )

  getResetButton = this.locatorFor(
    PButtonHarness.with({
      id: 'resetButton',
    })
  )

  getSimpleAdvancedButton = this.locatorForOptional(
    ButtonHarness.with({
      id: 'simpleAdvancedButton',
    })
  )

  getMoreActionsMenuButton = this.locatorForOptional(MoreActionsMenuButtonHarness)

  async search() {
    await (await this.getSearchButton()).click()
  }

  async reset() {
    await (await this.getResetButton()).click()
  }

  async toggleSimpleAdvanced() {
    if (await this.getSimpleAdvancedButton()) {
      await (await this.getSimpleAdvancedButton())?.click()
    } else {
      console.warn('No SimpleAdvancedButton is being displayed to toggle, because no advanced form field is defined.')
    }
  }
}
