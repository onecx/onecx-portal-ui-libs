import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { SpanHarness } from '../span.harness'
import { PDropdownHarness } from './p-dropdown.harness'
import { ButtonHarness } from '../button.harness'

export class PPaginatorHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-paginator'
  getCurrentPageReport = this.locatorFor(SpanHarness.with({ class: 'p-paginator-current' }))
  getRowsPerPageOptions = this.locatorFor(PDropdownHarness)
  getNextPageButton = this.locatorFor(ButtonHarness.with({ class: 'p-paginator-next' }))

  async getCurrentPageReportText(): Promise<string | undefined> {
    return await (await this.getCurrentPageReport()).getText()
  }

  async clickNextPage() {
    ;(await this.getNextPageButton()).click()
  }
}
