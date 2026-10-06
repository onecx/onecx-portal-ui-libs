import * as z from 'zod'
import { color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export const toggleSwitchHandleShape = z
  .object({
    borderRadius: withRef(z.string()).optional(),
    size: withRef(z.string()).optional(),
    width: withRef(z.string()).optional(),
    height: withRef(z.string()).optional(),
    background: color.optional(),
    color: color.optional(),
  })
  .register(themeSchemaRegistry, { id: 'toggleSwitchHandleShape' })

export const toggleSwitchHandleDefaults = {
  borderRadius: '{{primitives.radius.full}}',
  size: '1.25rem',
  width: '1.25rem',
  height: '1.25rem',
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
}