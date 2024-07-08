import { BaseHarnessFilters, ContentContainerComponentHarness, TestKey } from '@angular/cdk/testing'
import { DivHarness } from '../div.harness'

export interface PDialogHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-dialog'

  getHeader = this.locatorForOptional(DivHarness.with({ class: 'p-dialog-header' }))
  getFooter = this.locatorForOptional(DivHarness.with({ class: 'p-dialog-footer' }))
  getDialogMask = this.locatorForOptional(DivHarness.with({ class: 'p-dialog-mask'}))

  async getDialogTitle(): Promise<string | undefined> {
    return await (await this.getHeader())?.getText()
  }

  async close() {
    if (await this.isVisible()) {
      await (await this.host()).sendKeys(TestKey.ESCAPE)
    } else {
      console.warn('Unable to close CustomGroupColumnSelectionDialog, because it is not open.')
    }
  }

  async isVisible(): Promise<boolean> {
    return (await (await this.host()).getAttribute('ng-reflect-visible')) === 'true' ? true : false
  }
}
