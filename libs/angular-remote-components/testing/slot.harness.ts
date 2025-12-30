import {
  BaseHarnessFilters,
  ContentContainerComponentHarness,
  HarnessPredicate,
  TestElement,
} from '@angular/cdk/testing'

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
   * Gets a child element within the slot by its tag name.
   * @param tagName - The tag name of the child element to retrieve.
   * @returns A promise that resolves to the child element or null if not found.
   */
  async getElement(tagName: string): Promise<TestElement | null> {
    return await this.documentRootLocatorFactory().locatorForOptional(tagName)()
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
   * Gets a specific CSS property value from a child element within the slot by its tag name.
   * @param tagName - The tag name of the child element.
   * @param property - The CSS property name to retrieve.
   * @returns Promise that resolves to the CSS property value or empty string if element not found.
   */
  async getComponentCssProperty(tagName: string, property: string): Promise<string> {
    const element = await this.getElement(tagName)
    if (!element) {
      return ''
    }
    return await element.getCssValue(property)
  }

  /**
   * Gets the list of CSS classes applied to a child element within the slot by its tag name.
   * @param tagName - The tag name of the child element.
   * @returns Promise that resolves to an array of CSS class names or empty array if element not found.
   */
  async getComponentClasses(tagName: string): Promise<string[]> {
    const element = await this.getElement(tagName)
    if (!element) {
      return []
    }
    const attributeString = await element.getAttribute('class')
    if (attributeString) {
      return attributeString.trim().split(' ')
    }
    return []
  }
}
