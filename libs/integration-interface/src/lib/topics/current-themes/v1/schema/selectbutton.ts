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
  .register(themeSchemaRegistry, { id: 'selectbuttonSettings', axis: 'setting' })

export const selectbutton = z
  .object({
    settings: (selectbuttonSettings as typeof selectbuttonSettings).optional(),
    gap: withRef(z.string().register(themeSchemaRegistry, { id: 'selectbuttonGap', axis: 'none' })).default('{{primitives.space.xs}}'),
    border: border
      .extend({})
      .register(themeSchemaRegistry, { id: 'selectbuttonBorder', axis: 'none' })
      .default({
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.sm}}',
        offset: '{{primitives.border.offset.sm}}',
        radius: '{{primitives.border.radius.md}}',
      }),
    // The button is an embedded togglebutton component. It is a child boundary (`child: true`)
    // that re-roots the fallback, but it is a flat static container (no `defaultVariant`/
    // `defaultState`/`defaultSeverity` wrapper), so it carries no axis of its own and opens no
    // relaxed-axis scope — exactly like a standalone togglebutton.
    button: togglebutton
      .extend({})
      .register(themeSchemaRegistry, { id: 'selectbuttonButton', child: true })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'selectbutton' })
