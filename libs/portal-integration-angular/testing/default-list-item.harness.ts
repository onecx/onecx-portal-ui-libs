import { ComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness } from './button.harness'
import { DivHarness } from './div.harness'

export class DefaultListItemHarness extends ComponentHarness {
  static hostSelector = '.data-list-items'

  getAllActionButtons = this.locatorForAll('button')
  getViewButton = this.locatorForOptional(ButtonHarness.with({ id: 'viewListItemButton' }))
  getEditButton = this.locatorForOptional(ButtonHarness.with({ id: 'editListItemButton' }))
  getDeleteButton = this.locatorForOptional(ButtonHarness.with({ id: 'deleteListItemButton' }))

  private getAllDivs = this.locatorForAll(DivHarness)

  async getData() {
    const isDataListItemsDiv = await Promise.all(
      (await this.getAllDivs()).map((innerDivHarness) => this.checkDivsHasClasses(innerDivHarness))
    )
    const divHarnesses = (await this.getAllDivs()).filter((_v, index) => isDataListItemsDiv[index])
    const getDivTexts = await Promise.all(divHarnesses.map((divHarness) => divHarness.getText()))
    return getDivTexts
  }

  async checkDivsHasClasses(value: DivHarness) {
    const hasClass = (await value.checkHasClass('item-name-row')) || (await value.checkHasClass('subtitleLine'))
    return hasClass
  }
}
