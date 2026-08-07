import * as z from 'zod'
import { withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { togglebutton } from './togglebutton'

export const selectbuttonSettings = z
  .object({
    orientation: withRef(z.enum(['horizontal', 'vertical'])).default('horizontal'),
    size: withRef(z.enum(['sm', 'md', 'lg'])).default('md'),
  })
  .register(themeSchemaRegistry, { id: 'selectbuttonSettings' })

export const selectbutton = z
  .object({
    settings: (selectbuttonSettings as typeof selectbuttonSettings).optional(),
    gap: withRef(z.string()).default('{{primitives.space.xs}}'),
    borderRadius: withRef(z.string()).default('{{primitives.border.radius.md}}'),
    button: (togglebutton as typeof togglebutton).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'selectbutton' })
