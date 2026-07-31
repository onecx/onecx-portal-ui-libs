import z from 'zod'
import { withRef, border } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 *  Calendar schema for the time picker.
 */
export class CalendarTimePickerSchema {
  static readonly schema = z
    .object({
      padding: withRef(z.string()).default('{{primitives.space.md}}'),
      border: border.default({
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.md}}',
        radius: '{{primitives.border.radius.md}}',
        offset: '{{primitives.border.offset.none}}',
      }),
      gap: withRef(z.string()).default('{{primitives.space.md}}'),
      buttonGap: withRef(z.string()).default('{{primitives.space.xs}}'),
      margin: withRef(z.string()).default('{{primitives.space.md}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarTimePicker' })
}
