import { ComponentHarness } from '@angular/cdk/testing'
import { SpanHarness } from '../span.harness'

export class PMenuItemHarness extends ComponentHarness {
  static hostSelector = 'li.p-menuitem'

  getAnchor = this.locatorFor('a')
  getChildren = this.locatorForAll(PMenuItemHarness)
  getIconSpan = this.locatorForOptional(SpanHarness.with({ class: 'p-menuitem-icon' }))

  async getText(): Promise<string> {
    return await (await this.getAnchor()).text()
  }

  async hasIcon(icon: string): Promise<boolean | undefined> {
    const classList = await (await (await this.getIconSpan())?.host())?.getAttribute('class')
    return classList?.includes(icon)
  }

  async click() {
    return await (await this.getAnchor()).click()
  }

  async getLink(): Promise<string | null> {
    return await (await this.getAnchor()).getAttribute('href')
  }
}
