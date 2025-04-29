import { ContentContainerComponentHarness } from '@angular/cdk/testing'

export class PSelectButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-selectbutton'

  getAllButtons = this.locatorForAll('p-togglebutton')
}
