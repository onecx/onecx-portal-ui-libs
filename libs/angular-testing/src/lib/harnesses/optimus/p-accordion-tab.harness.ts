import { ComponentHarness } from '@angular/cdk/testing'

export class PAccordionTabHarness extends ComponentHarness {
  static hostSelector = 'p-accordiontab'

  getButton = this.locatorFor('a.p-accordion-header-link')

  async expand() {
    await (await this.getButton()).click()
  }
}
