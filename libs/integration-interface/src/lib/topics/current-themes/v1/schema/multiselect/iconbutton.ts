import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { color, withRef } from '../primitives'

/**
 * Icon schema for dropdown icon and filter icon inside filter input field of multiselect overlay.
 */
export class MultiselectIconButtonSchema {
  static readonly schema = z
    .object({
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      size: withRef(z.string()).default('{{primitives.icon.size}}'),
      paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
      paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    })
    .register(themeSchemaRegistry, { id: 'multiselectIconButton' })
}
