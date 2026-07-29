import z from 'zod'
import { withRef, border } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { CalendarPanelButtonSchema } from './panelbutton'

export class CalendarFooterButtonBarSchema {
  private static readonly tokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      todayButton: (CalendarPanelButtonSchema.schema as typeof CalendarPanelButtonSchema.schema).prefault({}),
      clearButton: (CalendarPanelButtonSchema.schema as typeof CalendarPanelButtonSchema.schema).prefault({}),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'calendarFooterButtonBar' })
}
