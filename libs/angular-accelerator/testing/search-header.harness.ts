import { ComponentHarness } from '@angular/cdk/testing'
import { PButtonHarness, ButtonHarness } from '@onecx/angular-testing'
import { PageHeaderHarness } from './page-header.harness'
import { SearchConfigHarness } from './search-config.harness'
import { MoreActionsMenuButtonHarness } from './more-actions-menu-button.harness'

export class SearchHeaderHarness extends ComponentHarness {
    static hostSelector = 'ocx-search-header'

    getPageHeader = this.locatorFor(PageHeaderHarness)
    getSearchConfig = this.locatorFor(SearchConfigHarness)
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
        PButtonHarness.with({
          id: 'simpleAdvancedButton',
        })
      )

      getMoreActionsMenuButton = this.locatorForOptional(MoreActionsMenuButtonHarness)

    async clickResetButton() {
        await (await this.getResetButton()).click()
    }

    async clickSearchButton() {
        await (await this.getSearchButton()).click()
    }

    async toggleSimpleAdvanced() {
        if (await this.getSimpleAdvancedButton()) {
          await (await this.getSimpleAdvancedButton())?.click()
        } else {
          console.warn('No SimpleAdvancedButton is being displayed to toggle, because no advanced form field is defined.')
        }
      }
}