import {
  BaseHarnessFilters,
  ContentContainerComponentHarness,
  HarnessLoader,
  HarnessPredicate,
  TestKey,
} from '@angular/cdk/testing'
import { InputHarness } from '../input.harness'

export interface PCalendarHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PCalendarHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-calendar'

  getCalendarInput = this.locatorFor(InputHarness)

  static with(options: PCalendarHarnessFilters): HarnessPredicate<PCalendarHarness> {
    return new HarnessPredicate(PCalendarHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getHarnessLoaderForPDatepicker(): Promise<HarnessLoader | null> {
    return this.documentRootLocatorFactory().harnessLoaderForOptional('.p-datepicker')
  }

  async isOpen(): Promise<boolean> {
    return !!(await this.getHarnessLoaderForPDatepicker())
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await (await this.getCalendarInput()).click()
    } else {
      console.warn('Unable to open calendar, because it is already open.')
    }
  }

  async close(): Promise<void> {
    if (await this.isOpen()) {
      await (await (await this.getCalendarInput()).getTestElement()).sendKeys(TestKey.ESCAPE)
    } else {
      console.warn('Unable to close calendar, because it is not open.')
    }
  }

  async setValue(value: string | Date) {
    await (await this.getCalendarInput()).setValue(value)
  }

  async getValue(): Promise<string | null> {
    return await (await this.getCalendarInput()).getValue()
  }
}
