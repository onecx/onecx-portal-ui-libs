import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { icon } from '../primitives'

// TODO: Pick relevant tokens from button usage tokens
/**
 * Schema for tabs navigation button allowing users to move through overflowed tabs in the tabs component.
 */
export class TabsNavButtonSchema {
  static readonly tabsnavButtonsIconPlaceholderSchema = icon.default({})

  static readonly schema = z.object({
    nextIcon: (TabsNavButtonSchema.tabsnavButtonsIconPlaceholderSchema as typeof TabsNavButtonSchema.tabsnavButtonsIconPlaceholderSchema).default({}),
    prevIcon: (TabsNavButtonSchema.tabsnavButtonsIconPlaceholderSchema as typeof TabsNavButtonSchema.tabsnavButtonsIconPlaceholderSchema).default({}),
  }).register(themeSchemaRegistry, { id: 'tabsNavButton' })
}