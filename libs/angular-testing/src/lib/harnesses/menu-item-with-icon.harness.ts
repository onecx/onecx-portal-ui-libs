import { MenuItemHarness } from './menu-item.harness'

export class MenuItemWithIconHarness extends MenuItemHarness {
  async hasIcon(icon: string): Promise<boolean | undefined> {
    const classList = await (await this.locatorForOptional('i')())?.getAttribute('class')
    return classList?.includes(icon)
  }

  async isExternal(): Promise<boolean | undefined> {
    return (await (await this.host()).getAttribute('ng-reflect-router-link')) === null
  }
}
