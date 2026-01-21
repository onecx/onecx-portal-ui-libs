import { ComponentHarness } from '@angular/cdk/testing'
import { PButtonHarness } from '@onecx/angular-testing'
import { PageHeaderHarness } from './page-header.harness'
import { MoreActionsMenuButtonHarness } from './more-actions-menu-button.harness'

export class SearchHeaderHarness extends ComponentHarness {
  static readonly hostSelector = 'ocx-search-header'

  getPageHeader = this.locatorFor(PageHeaderHarness)
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

  private readonly getBasicContent = this.locatorForOptional('#basic-content')
  private readonly getAdvancedContent = this.locatorForOptional('#advanced-content')

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
      // In some tests the toggle button is not rendered (no advanced field defined).
      // Consumers can fall back to directly setting `viewMode` via `setViewMode`.
    }
  }

  async isBasicContentVisible(): Promise<boolean> {
    return !!(await this.getBasicContent())
  }

  async isAdvancedContentVisible(): Promise<boolean> {
    return !!(await this.getAdvancedContent())
  }

  async setViewMode(mode: 'basic' | 'advanced'): Promise<void> {
    const toggleButton = await this.getSimpleAdvancedButton()

    if (!toggleButton) {
      return
    }

    const desiredAdvancedVisible = mode === 'advanced'
    for (let i = 0; i < 2; i++) {
      const isAdvancedVisible = await this.isAdvancedContentVisible()
      if (isAdvancedVisible === desiredAdvancedVisible) {
        return
      }
      await this.toggleSimpleAdvanced()
    }
  }
}
