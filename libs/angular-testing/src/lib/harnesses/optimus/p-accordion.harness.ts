import { ComponentHarness } from '@angular/cdk/testing'
import { PAccordionTabHarness } from './p-accordion-tab.harness'

export class PAccordionHarness extends ComponentHarness {
  static hostSelector = 'p-accordion'

  getAllAccordionTabs = this.locatorForAll(PAccordionTabHarness)
}
