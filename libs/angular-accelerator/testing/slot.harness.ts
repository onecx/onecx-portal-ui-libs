import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface SlotHarnessFilters extends BaseHarnessFilters {
  name?: string
}

export class SlotHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-slot'
}
