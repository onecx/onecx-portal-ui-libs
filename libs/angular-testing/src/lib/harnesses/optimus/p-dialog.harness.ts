import { BaseHarnessFilters, ContentContainerComponentHarness, TestKey } from '@angular/cdk/testing'
import { DivHarness } from '../div.harness'

export interface PDialogHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-dialog'

  getMaskElement = this.locatorForOptional(DivHarness.with({ class: 'p-dialog-mask' }))
  getHeader = this.locatorForOptional(DivHarness.with({ class: 'p-dialog-header' }))
  getFooter = this.locatorForOptional(DivHarness.with({ class: 'p-dialog-footer' }))

  async getDialogTitle(): Promise<string | undefined> {
    return await (await this.getHeader())?.getText()
  }

  /**
   * Accessible name of the dialog: `aria-label`, or the text of the element referenced by `aria-labelledby`
   */
  async getAccessibleName(): Promise<string | undefined> {
    const dialog = await this.locatorForOptional('[role="dialog"]')()
    if (!dialog) return undefined
    const label = await dialog.getAttribute('aria-label')
    if (label) return label
    const labelledBy = await dialog.getAttribute('aria-labelledby')
    if (!labelledBy) return undefined
    const texts = await Promise.all(
      labelledBy.split(/\s+/).map(async (id) => {
        const element = await this.documentRootLocatorFactory().locatorForOptional(`[id="${id}"]`)()
        return (await element?.text()) ?? ''
      })
    )
    return texts.join(' ').trim()
  }

  async getAriaDescribedByText(): Promise<string | undefined> {
    const dialog = await this.locatorForOptional('[role="dialog"]')()
    const describedBy = await dialog?.getAttribute('aria-describedby')
    if (!describedBy) return undefined
    const element = await this.documentRootLocatorFactory().locatorForOptional(`[id="${describedBy}"]`)()
    return await element?.text()
  }

  async close() {
    if (await this.isVisible()) {
      await (await this.host()).sendKeys(TestKey.ESCAPE)
    } else {
      console.warn('Unable to close CustomGroupColumnSelectionDialog, because it is not open.')
    }
  }

  async isVisible(): Promise<boolean> {
    return (await this.getMaskElement()) !== null
  }
}
