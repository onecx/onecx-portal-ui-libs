import z from 'zod'
import { withRef, border } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export class CalendarTimePickerSchema {
  static readonly schema = z
    .object({
      padding: withRef(z.string()).default('{{primitives.space.md}}'),
      border: border.default({
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      }),
      gap: withRef(z.string()).default('{{primitives.space.md}}'),
      buttonGap: withRef(z.string()).default('{{primitives.space.xs}}'),
      margin: withRef(z.string()).default('{{primitives.space.md}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarTimePicker' })
}
