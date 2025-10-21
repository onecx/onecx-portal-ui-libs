import { BaseHarnessFilters, ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from '@onecx/angular-testing'
import { SlotHarness } from './slot.harness'
import { ClassInput, normalizeClasses } from './slot.utils'

export interface SlotGroupHarnessFilters extends BaseHarnessFilters {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
}

/**
 * Harness for interacting with an OCX slot group component in tests.
 *
 * Provides methods to inspect the container and individual slots (start, center, end)
 * within a slot group, including their styles, classes, and content.
 */
export class SlotGroupHarness extends ContentContainerComponentHarness {
  static readonly hostSelector = 'ocx-slot-group'

  /**
   * Gets the main div container of the slot group.
   * @returns Promise that resolves to the main div container.
   */
  async getDivContainer(): Promise<DivHarness> {
    return await this.locatorFor(DivHarness)()
  }

  /**
   * Gets a specific CSS property value from the slot group's main container.
   * @param property The CSS property name to retrieve.
   * @returns Promise that resolves to the CSS property value.
   */
  async getContainerStyle(property: string): Promise<string> {
    const container = await this.getDivContainer()
    const element = await container.host()
    return await element.getCssValue(property)
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
   * Verifies that expected styles are applied to the slot group's main container.
   * @param expectedStyles Object mapping CSS property names to expected values.
   * @returns Promise that resolves to true if all expected styles match, false otherwise.
   */
  async verifyContainerStylesApplied(expectedStyles: Record<string, string>): Promise<boolean> {
    for (const [property, expectedValue] of Object.entries(expectedStyles)) {
      const actualValue = await this.getContainerStyle(property)

      if (actualValue !== expectedValue) {
        return false
      }
    }
    return true
  }

  /**
   * Verifies that expected CSS classes are applied to the slot group's main container.
   * @param expectedClasses Array of CSS class names that should be present.
   * @returns Promise that resolves to true if all expected classes are present, false otherwise.
   */
  async verifyContainerClassesApplied(expectedClasses: string[]): Promise<boolean> {
    const classList = await this.getContainerGroupClasses()
    return expectedClasses.every((expectedClass) => classList.includes(expectedClass))
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
   * Verifies that expected styles are applied to the first div container in the start slot.
   * @param expectedStyles Object mapping CSS property names to expected values.
   * @returns Promise that resolves to true if all expected styles match, false otherwise.
   */
  async verifyStartSlotStyles(expectedStyles: Record<string, string>): Promise<boolean> {
    const slot = await this.getStartSlot()
    return slot ? slot.verifySlotStylesApplied(expectedStyles) : false
  }

  /**
   * Verifies that expected styles are applied to the first div container in the center slot.
   * @param expectedStyles Object mapping CSS property names to expected values.
   * @returns Promise that resolves to true if all expected styles match, false otherwise.
   */
  async verifyCenterSlotStyles(expectedStyles: Record<string, string>): Promise<boolean> {
    const slot = await this.getCenterSlot()
    return slot ? slot.verifySlotStylesApplied(expectedStyles) : false
  }

  /**
   * Verifies that expected styles are applied to the first div container in the end slot.
   * @param expectedStyles Object mapping CSS property names to expected values.
   * @returns Promise that resolves to true if all expected styles match, false otherwise.
   */
  async verifyEndSlotStyles(expectedStyles: Record<string, string>): Promise<boolean> {
    const slot = await this.getEndSlot()
    return slot ? slot.verifySlotStylesApplied(expectedStyles) : false
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

  /**
   * Verifies that expected CSS classes are applied to the first div container in the start slot.
   * @param expectedClasses Array of CSS class names that should be present.
   * @returns Promise that resolves to true if all expected classes are present, false otherwise.
   */
  async verifyStartSlotClasses(expectedClasses: string[]): Promise<boolean> {
    const slot = await this.getStartSlot()
    return slot ? slot.verifySlotClassesApplied(expectedClasses) : false
  }

  /**
   * Verifies that expected CSS classes are applied to the first div container in the center slot.
   * @param expectedClasses Array of CSS class names that should be present.
   * @returns Promise that resolves to true if all expected classes are present, false otherwise.
   */
  async verifyCenterSlotClasses(expectedClasses: string[]): Promise<boolean> {
    const slot = await this.getCenterSlot()
    return slot ? slot.verifySlotClassesApplied(expectedClasses) : false
  }

  /**
   * Verifies that expected CSS classes are applied to the first div container in the end slot.
   * @param expectedClasses Array of CSS class names that should be present.
   * @returns Promise that resolves to true if all expected classes are present, false otherwise.
   */
  async verifyEndSlotClasses(expectedClasses: string[]): Promise<boolean> {
    const slot = await this.getEndSlot()
    return slot ? slot.verifySlotClassesApplied(expectedClasses) : false
  }

  /**
   * Verifies that expected CSS classes are applied to the slot group's main container.
   * Automatically handles different class input formats (string, array, Set, object).
   * @param expectedClasses Classes in any supported format that should be present.
   * @returns Promise that resolves to true if all expected classes are present, false otherwise.
   */
  async verifyContainerClasses(expectedClasses: ClassInput): Promise<boolean> {
    const normalizedClasses = normalizeClasses(expectedClasses)
    return this.verifyContainerClassesApplied(normalizedClasses)
  }

  /**
   * Verifies that expected CSS classes are applied to all div containers in the start slot.
   * Automatically handles different class input formats (string, array, Set, object).
   * @param expectedClasses Classes in any supported format that should be present.
   * @returns Promise that resolves to true if all expected classes are present, false otherwise.
   */
  async verifyStartSlotClassesForAllDivs(expectedClasses: ClassInput): Promise<boolean> {
    const slot = await this.getStartSlot()
    return slot ? slot.verifyAllSlotDivsHaveClasses(expectedClasses) : false
  }

  /**
   * Verifies that expected CSS classes are applied to all div containers in the center slot.
   * Automatically handles different class input formats (string, array, Set, object).
   * @param expectedClasses Classes in any supported format that should be present.
   * @returns Promise that resolves to true if all expected classes are present, false otherwise.
   */
  async verifyCenterSlotClassesForAllDivs(expectedClasses: ClassInput): Promise<boolean> {
    const slot = await this.getCenterSlot()
    return slot ? slot.verifyAllSlotDivsHaveClasses(expectedClasses) : false
  }

  /**
   * Verifies that expected CSS classes are applied to all div containers in the end slot.
   * Automatically handles different class input formats (string, array, Set, object).
   * @param expectedClasses Classes in any supported format that should be present.
   * @returns Promise that resolves to true if all expected classes are present, false otherwise.
   */
  async verifyEndSlotClassesForAllDivs(expectedClasses: ClassInput): Promise<boolean> {
    const slot = await this.getEndSlot()
    return slot ? slot.verifyAllSlotDivsHaveClasses(expectedClasses) : false
  }
}
