import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { DivHarness } from '@onecx/angular-testing'

export interface SlotHarnessFilters extends BaseHarnessFilters {
  name?: string
}

/**
 * Harness for interacting with an OCX slot component in tests.
 *
 * Provides methods to inspect slot div containers, their styles, classes,
 * and content when multiple components are assigned to a slot.
 */
export class SlotHarness extends ContentContainerComponentHarness {
  static readonly hostSelector = 'ocx-slot'

  static with(options: SlotHarnessFilters = {}): HarnessPredicate<SlotHarness> {
    return new HarnessPredicate(SlotHarness, options).addOption('name', options.name, (harness, name) =>
      HarnessPredicate.stringMatches(harness.getName(), name)
    )
  }

  /**
   * Gets the first slot div container, or null if no containers exist.
   * Useful for slots with a single component or when you only need to check the first container.
   * @returns Promise that resolves to the first div container or null.
   */
  async getSlotDivContainer(): Promise<DivHarness | null> {
    return await this.locatorForOptional(DivHarness)()
  }

  /**
   * Gets all slot div containers.
   * When multiple components are assigned to a slot, this returns all div containers.
   * @returns Promise that resolves to an array of all div containers.
   */
  async getSlotDivContainers(): Promise<DivHarness[]> {
    return await this.locatorForAll(DivHarness)()
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
   * Checks if the slot has any content (i.e., any div containers).
   * @returns Promise that resolves to true if the slot has content, false otherwise.
   */
  async hasContent(): Promise<boolean> {
    const containers = await this.getSlotDivContainers()
    return containers.length > 0
  }

  /**
   * Gets a specific CSS property value from the first slot div container.
   * @param property The CSS property name to retrieve.
   * @returns Promise that resolves to the CSS property value, or empty string if no container exists.
   */
  async getSlotCssProperty(property: string): Promise<string> {
    const container = await this.getSlotDivContainer()
    if (!container) {
      return ''
    }
    const element = await container.host()
    return await element.getCssValue(property)
  }

  /**
   * Gets a specific CSS property value from all slot div containers.
   * Useful when multiple components are assigned to a slot.
   * @param property The CSS property name to retrieve.
   * @returns Promise that resolves to an array of CSS property values, one for each container.
   */
  async getAllSlotStyles(property: string): Promise<string[]> {
    const containers = await this.getSlotDivContainers()
    const styleValues: string[] = []
    for (const container of containers) {
      const element = await container.host()
      styleValues.push(await element.getCssValue(property))
    }
    return styleValues
  }

  /**
   * Gets multiple CSS property values from all slot div containers.
   * @param properties Array of CSS property names to retrieve.
   * @returns Promise that resolves to an array of style objects, one for each container.
   */
  async getAllSlotStylesForProperties(properties: string[]): Promise<Record<string, string>[]> {
    const containers = await this.getSlotDivContainers()
    const allStyles: Record<string, string>[] = []

    for (const container of containers) {
      const element = await container.host()
      const styles: Record<string, string> = {}

      for (const property of properties) {
        styles[property] = await element.getCssValue(property)
      }
      allStyles.push(styles)
    }
    return allStyles
  }

  /**
   * Gets the CSS classes from the first slot div container.
   * @returns Promise that resolves to an array of CSS class names, or empty array if no container exists.
   */
  async getSlotClasses(): Promise<string[]> {
    const container = await this.getSlotDivContainer()
    if (!container) {
      return []
    }
    return await container.getClassList()
  }

  /**
   * Gets the CSS classes from all slot div containers.
   * Useful when multiple components are assigned to a slot.
   * @returns Promise that resolves to a two-dimensional array where each inner array contains the CSS classes for one container.
   */
  async getAllSlotClasses(): Promise<string[][]> {
    const containers = await this.getSlotDivContainers()
    const classLists: string[][] = []
    for (const container of containers) {
      classLists.push(await container.getClassList())
    }
    return classLists
  }
}
