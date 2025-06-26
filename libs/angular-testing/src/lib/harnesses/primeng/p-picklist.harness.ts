import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { ButtonHarness } from '../button.harness'
import { DivHarness } from '../div.harness'
import { ListItemHarness } from '../list-item.harness'

export interface PPicklistControlsButtonsFilters extends BaseHarnessFilters {
  class?: string
}

export interface PPicklistListWrapperFilters extends BaseHarnessFilters {
  class?: string
}

export class PPicklistControlsButtonsHarness extends ContentContainerComponentHarness {
  static hostSelector = '.p-picklist-controls'

  getButtons = this.locatorForAll(ButtonHarness)

  static with(options: PPicklistControlsButtonsFilters): HarnessPredicate<PPicklistControlsButtonsHarness> {
    return new HarnessPredicate(PPicklistControlsButtonsHarness, options).addOption(
      'class',
      options.class,
      (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c)
    )
  }

  async getByClass(c: string) {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }
}

export class PPicklistListWrapperHarness extends ContentContainerComponentHarness {
  static hostSelector = '.p-picklist-list-container'

  getHeader = this.locatorFor(DivHarness.with({ class: 'p-picklist-header' }))
  getAllListItems = this.locatorForAll(ListItemHarness)

  static with(options: PPicklistListWrapperFilters): HarnessPredicate<PPicklistListWrapperHarness> {
    return new HarnessPredicate(PPicklistListWrapperHarness, options).addOption('class', options.class, (harness, c) =>
      HarnessPredicate.stringMatches(harness.getByClass(c), c)
    )
  }

  async getByClass(c: string) {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }
}

export class PPicklistHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-picklist'

  private getPicklistSourceControls = this.locatorFor(
    PPicklistControlsButtonsHarness.with({ class: 'p-picklist-source-controls' })
  )
  private getPicklistTransferControls = this.locatorFor(
    PPicklistControlsButtonsHarness.with({ class: 'p-picklist-transfer-controls' })
  )
  private getPicklistTargetControls = this.locatorFor(
    PPicklistControlsButtonsHarness.with({ class: 'p-picklist-target-controls' })
  )

  private getPicklistSource = this.locatorFor(PPicklistListWrapperHarness.with({ class: 'p-picklist-source-list-container' }))
  private getPicklistTarget = this.locatorFor(PPicklistListWrapperHarness.with({ class: 'p-picklist-target-list-container' }))

  async getSourceControlsButtons(): Promise<ButtonHarness[]> {
    return await (await this.getPicklistSourceControls()).getButtons()
  }

  async getTransferControlsButtons(): Promise<ButtonHarness[]> {
    return await (await this.getPicklistTransferControls()).getButtons()
  }

  async getTargetControlsButtons(): Promise<ButtonHarness[]> {
    return await (await this.getPicklistTargetControls()).getButtons()
  }

  async getSourceHeader(): Promise<string> {
    return await (await (await this.getPicklistSource()).getHeader()).getText()
  }

  async getTargetHeader(): Promise<string> {
    return await (await (await this.getPicklistTarget()).getHeader()).getText()
  }

  async getSourceListItems(): Promise<ListItemHarness[]> {
    return await (await this.getPicklistSource()).getAllListItems()
  }

  async getTargetListItems(): Promise<ListItemHarness[]> {
    return await (await this.getPicklistTarget()).getAllListItems()
  }
}
