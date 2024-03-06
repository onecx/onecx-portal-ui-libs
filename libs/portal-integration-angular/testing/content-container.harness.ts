import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from './div.harness'

export class OcxContentContainerHarness extends ComponentHarness {
  static hostSelector = 'ocx-content-container'

  async getLayoutClasses() {
    const div = await this.locatorFor(DivHarness)()
    const actualClassList = await div.getClassList()

    return actualClassList
  }

  async getLayout(): Promise<'horizontal' | 'vertical'> {
    const layoutClassses = await this.getLayoutClasses()
    return layoutClassses.find((c) => c.endsWith(':flex-row')) ? 'horizontal' : 'vertical'
  }

  async getBreakpoint(): Promise<'sm' | 'md' | 'lg' | 'xl' | undefined> {
    const layoutClassses = await this.getLayoutClasses()
    const layoutClass = layoutClassses.find((c) => c.endsWith(':flex-row'))
    return layoutClass?.split(':')[0] as 'sm' | 'md' | 'lg' | 'xl' | undefined
  }
}
