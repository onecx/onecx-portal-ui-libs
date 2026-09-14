import { withRef } from '../primitives'
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'

// TODO: Pick relevant tokens from button usage tokens
/**
 * Schema for tabs navigation button allowing users to move through overflowed tabs in the tabs component.
 */
export class TabsNavButtonSchema {

  static readonly schema = z.object({
    nextIcon: withRef(z.string()).default('{{primitives.icon.arrowRight}}'),
    prevIcon: withRef(z.string()).default('{{primitives.icon.arrowLeft}}'),
  }).register(themeSchemaRegistry, { id: 'tabsNavButton' })
}