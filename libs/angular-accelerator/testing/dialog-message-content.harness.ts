import { ComponentHarness } from '@angular/cdk/testing'

export class DialogMessageContentHarness extends ComponentHarness {
  static hostSelector = '.dialogMessageContent'

  private getMessageSpan = this.locatorFor('#dialogMessage')
  private getIcon = this.locatorForOptional('i')

  async getMessageContent(): Promise<string> {
    return await (await this.getMessageSpan()).text()
  }

  async getIconValue(): Promise<string | null | undefined> {
    return await (await this.getIcon())?.getAttribute('class')
  }
}
