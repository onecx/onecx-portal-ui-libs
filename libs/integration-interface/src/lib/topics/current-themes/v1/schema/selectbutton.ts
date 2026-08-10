import * as z from 'zod'
import { withRef, border } from './primitives'
import { themeSchemaRegistry } from './registry'
import { togglebutton } from './togglebutton'

export const selectbuttonSettings = z
  .object({
    orientation: withRef(z.enum(['horizontal', 'vertical'])).default('horizontal'),
    size: withRef(z.enum(['sm', 'md', 'lg'])).default('md'),
    multiple: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'selectbuttonSettings' })

export const selectbutton = z
  .object({
    settings: (selectbuttonSettings as typeof selectbuttonSettings).optional(),
    gap: withRef(z.string()).default('{{primitives.space.xs}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.sm}}',
      radius: '{{primitives.border.radius.md}}',
    }),
    button: (togglebutton as typeof togglebutton).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'selectbutton' })
