import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { DivHarness } from '@onecx/angular-testing'
import { SlotHarness } from './slot.harness'

export interface SlotGroupHarnessFilters extends BaseHarnessFilters {
  name?: string
}

/**
 * Harness for interacting with an OCX slot group component in tests.
 *
 * Provides methods to inspect the container and individual slots (start, center, end)
 * within a slot group, including their styles, classes, and content.
 */
export class SlotGroupHarness extends ContentContainerComponentHarness {
  static readonly hostSelector = 'ocx-slot-group'

  static with(options: SlotGroupHarnessFilters = {}): HarnessPredicate<SlotGroupHarness> {
    return new HarnessPredicate(SlotGroupHarness, options).addOption('name', options.name, (harness, name) =>
      HarnessPredicate.stringMatches(harness.getName(), name)
    )
  }

  /**
   * Gets the name of the slot from either the 'name' attribute or 'ng-reflect-name' attribute.
   * Checks both for robust detection during different Angular compilation modes.
   * @returns Promise that resolves to the slot name or null if not found.
   */
  async getName(): Promise<string | null> {
    const host = await this.host()

    const nameAttr = await host.getAttribute('name')
    if (nameAttr !== null) {
      return nameAttr
    }

    const reflectName = await host.getAttribute('ng-reflect-name')
    if (reflectName !== null) {
      return reflectName
    }

    return null
  }

  /**
   * Gets the main div container of the slot group.
   * @returns Promise that resolves to the main div container.
   */
  async getDivContainer(): Promise<DivHarness> {
    return await this.locatorFor(DivHarness)()
  }

  /**
   * Gets specific CSS property values from the slot group's main container.
   * @param properties Array of CSS property names to retrieve.
   * @returns Promise that resolves to an object mapping property names to their CSS values.
   */
  async getContainerStyles(properties: string[]): Promise<Record<string, string>> {
    const container = await this.getDivContainer()
    const element = await container.host()
    const result: Record<string, string> = {}

    for (const property of properties) {
      result[property] = await element.getCssValue(property)
    }
    return result
  }

  /**
   * Gets the CSS classes from the slot group's main container.
   * @returns Promise that resolves to an array of CSS class names.
   */
  async getContainerGroupClasses(): Promise<string[]> {
    const container = await this.getDivContainer()
    return await container.getClassList()
  }

  /**
   * Gets all slot harnesses within the slot group.
   * @returns Promise that resolves to an array of all slot harnesses.
   */
  async getAllSlots(): Promise<SlotHarness[]> {
    return await this.locatorForAll(SlotHarness)()
  }

  /**
   * Gets the start slot harness (slot with name ending in '-start').
   * @returns Promise that resolves to the start slot harness or null if not found.
   */
  async getStartSlot(): Promise<SlotHarness | null> {
    const slots = await this.getAllSlots()
    for (const slot of slots) {
      const name = await slot.getName()
      if (name?.endsWith('-start')) {
        return slot
      }
    }
    return null
  }

  /**
   * Gets the center slot harness (slot with name ending in '-center').
   * @returns Promise that resolves to the center slot harness or null if not found.
   */
  async getCenterSlot(): Promise<SlotHarness | null> {
    const slots = await this.getAllSlots()
    for (const slot of slots) {
      const name = await slot.getName()
      if (name?.endsWith('-center')) {
        return slot
      }
    }
    return null
  }

  /**
   * Gets the end slot harness (slot with name ending in '-end').
   * @returns Promise that resolves to the end slot harness or null if not found.
   */
  async getEndSlot(): Promise<SlotHarness | null> {
    const slots = await this.getAllSlots()
    for (const slot of slots) {
      const name = await slot.getName()
      if (name?.endsWith('-end')) {
        return slot
      }
    }
    return null
  }

  /**
   * Checks if a specific slot position has any content.
   * @param position The slot position to check ('start', 'center', or 'end').
   * @returns Promise that resolves to true if the slot has content, false otherwise.
   */
  async slotHasContent(position: 'start' | 'center' | 'end'): Promise<boolean> {
    let slot: SlotHarness | null = null

    switch (position) {
      case 'start':
        slot = await this.getStartSlot()
        break
      case 'center':
        slot = await this.getCenterSlot()
        break
      case 'end':
        slot = await this.getEndSlot()
        break
    }

    if (!slot) return false
    return await slot.hasContent()
  }

  /**
   * Gets all div containers from all slots (start, center, and end).
   * @returns Promise that resolves to an array of all div containers from all slots.
   */
  async getAllSlotDivContainers(): Promise<DivHarness[]> {
    const startSlotDivs = await this.getStartSlotDivContainers()
    const centerSlotDivs = await this.getCenterSlotDivContainers()
    const endSlotDivs = await this.getEndSlotDivContainers()
    return [...startSlotDivs, ...centerSlotDivs, ...endSlotDivs]
  }

  /**
   * Gets all div containers from the start slot.
   * @returns Promise that resolves to an array of div containers from the start slot.
   */
  async getStartSlotDivContainers(): Promise<DivHarness[]> {
    const slot = await this.getStartSlot()
    return slot ? slot.getSlotDivContainers() : []
  }

  /**
   * Gets all div containers from the center slot.
   * @returns Promise that resolves to an array of div containers from the center slot.
   */
  async getCenterSlotDivContainers(): Promise<DivHarness[]> {
    const slot = await this.getCenterSlot()
    return slot ? slot.getSlotDivContainers() : []
  }

  /**
   * Gets all div containers from the end slot.
   * @returns Promise that resolves to an array of div containers from the end slot.
   */
  async getEndSlotDivContainers(): Promise<DivHarness[]> {
    const slot = await this.getEndSlot()
    return slot ? slot.getSlotDivContainers() : []
  }

  /**
   * Gets multiple CSS property values from all div containers in the start slot.
   * @param properties Array of CSS property names to retrieve.
   * @returns Promise that resolves to an array of style objects, one for each container in the start slot.
   */
  async getStartSlotStyles(properties: string[]): Promise<Record<string, string>[]> {
    const slot = await this.getStartSlot()
    return slot ? slot.getAllSlotStylesForProperties(properties) : []
  }

  /**
   * Gets multiple CSS property values from all div containers in the center slot.
   * @param properties Array of CSS property names to retrieve.
   * @returns Promise that resolves to an array of style objects, one for each container in the center slot.
   */
  async getCenterSlotStyles(properties: string[]): Promise<Record<string, string>[]> {
    const slot = await this.getCenterSlot()
    return slot ? slot.getAllSlotStylesForProperties(properties) : []
  }

  /**
   * Gets multiple CSS property values from all div containers in the end slot.
   * @param properties Array of CSS property names to retrieve.
   * @returns Promise that resolves to an array of style objects, one for each container in the end slot.
   */
  async getEndSlotStyles(properties: string[]): Promise<Record<string, string>[]> {
    const slot = await this.getEndSlot()
    return slot ? slot.getAllSlotStylesForProperties(properties) : []
  }

  /**
   * Gets CSS classes from all div containers in the start slot.
   * @returns Promise that resolves to a two-dimensional array where each inner array contains the CSS classes for one container.
   */
  async getStartSlotClasses(): Promise<string[][]> {
    const slot = await this.getStartSlot()
    return slot ? slot.getAllSlotClasses() : []
  }

  /**
   * Gets CSS classes from all div containers in the center slot.
   * @returns Promise that resolves to a two-dimensional array where each inner array contains the CSS classes for one container.
   */
  async getCenterSlotClasses(): Promise<string[][]> {
    const slot = await this.getCenterSlot()
    return slot ? slot.getAllSlotClasses() : []
  }

  /**
   * Gets CSS classes from all div containers in the end slot.
   * @returns Promise that resolves to a two-dimensional array where each inner array contains the CSS classes for one container.
   */
  async getEndSlotClasses(): Promise<string[][]> {
    const slot = await this.getEndSlot()
    return slot ? slot.getAllSlotClasses() : []
  }
}
