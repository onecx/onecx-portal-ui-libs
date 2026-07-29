import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { color, withRef } from '../primitives'

/**
 * Icon schema for dropdown icon and filter icon inside filter input field of multiselect overlay.
 */
export class MultiselectIconSchema {
  static readonly schema = z
    .object({
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      size: withRef(z.string()).default('{{primitives.icon.size}}'),
    })
    .register(themeSchemaRegistry, { id: 'multiselectIcon' })
}
