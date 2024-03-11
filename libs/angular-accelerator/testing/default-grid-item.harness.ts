import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from '@onecx/angular-testing'
import { MoreActionsMenuButtonHarness } from './more-actions-menu-button.harness'

export class DefaultGridItemHarness extends ComponentHarness {
  static hostSelector = '.data-grid-item'

  getMoreActionsButton = this.locatorFor(MoreActionsMenuButtonHarness)
  private getAllDivs = this.locatorForAll(DivHarness)
  private getGridImg = this.locatorFor('img')

  async getData() {
    const isDataGridItemsDiv = await Promise.all(
      (await this.getAllDivs()).map((divHarness) => this.checkDivsHasClasses(divHarness))
    )
    const divHarnesses = (await this.getAllDivs()).filter((_v, index) => isDataGridItemsDiv[index])
    const getDivTexts: (string | null)[] = await Promise.all(divHarnesses.map((divHarness) => divHarness.getText()))
    getDivTexts.unshift(await (await this.getGridImg()).getAttribute('src'))
    return getDivTexts
  }

  async checkDivsHasClasses(value: DivHarness) {
    const hasClass = (await value.checkHasClass('item-name')) || (await value.checkHasClass('subtitleLine'))
    return hasClass
  }
}
