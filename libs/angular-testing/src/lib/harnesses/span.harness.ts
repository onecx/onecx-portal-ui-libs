import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface SpanHarnessFilters extends BaseHarnessFilters {
  id?: string
  class?: string
  classes?: Array<string>
}

export class SpanHarness extends ComponentHarness {
  static hostSelector = 'span'

  static with(options: SpanHarnessFilters): HarnessPredicate<SpanHarness> {
    return new HarnessPredicate(SpanHarness, options)
      .addOption('class', options.class, (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c))
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
  }

  static without(options: SpanHarnessFilters): HarnessPredicate<SpanHarness> {
    return new HarnessPredicate(SpanHarness, options).addOption(
      'classes',
      options.classes,
      (harness, classes: Array<string>) => {
        return Promise.all(classes.map((c) => harness.checkHasClass(c))).then((classContainedArr) =>
          classContainedArr.every((classContained) => !classContained)
        )
      }
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getByClass(c: string): Promise<string> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async checkHasClass(value: string) {
    return await (await this.host()).hasClass(value)
  }

  async hasAnyClass(classes: Array<string>) {
    const ret: Promise<boolean>[] = []
    classes.forEach((c) => ret.push(this.checkHasClass(c)))
    const res = await Promise.all(ret)
    return res.some((res) => res) ? 'true' : 'false'
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }
}
