import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing'

export interface InputHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class InputHarness extends ComponentHarness {
  static hostSelector = 'input'

  static with(options: InputHarnessFilters): HarnessPredicate<InputHarness> {
    return new HarnessPredicate(InputHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getValue(): Promise<string | null> {
    return await (await this.host()).getProperty<string>('value')
  }
  async getChecked(): Promise<boolean> {
    return await (await this.host()).getProperty<boolean>('checked')
  }

  async setValue(value: string | Date): Promise<void> {
    if (value instanceof Date) {
      await (
        await this.host()
      ).setInputValue(
        `${value.toLocaleDateString([], {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })} ${value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      )
    } else {
      await (await this.host()).clear()
      if (value) {
        await (await this.host()).sendKeys(value)
      }
      await (await this.host()).setInputValue(value)
    }
  }

  async getTestElement(): Promise<TestElement> {
    return await this.host()
  }

  async click() {
    await (await this.host()).click()
  }
}
