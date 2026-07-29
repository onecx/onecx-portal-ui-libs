import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, color, borderWithShadow, withRef } from '../primitives'
import { CalendarPanelHeaderSchema } from './panelheader'
import { CalendarDatePanelSchema } from './datepanel'

/**
 * Calendar panel schema including header and date panel.
 */
export class CalendarPanelSchema {
  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.sm}}',
      shadow: '{{primitives.shadow.sm}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    headerGap: withRef(z.string()).default('{{primitives.space.sm}}'),
  }

  static readonly schema = z
    .object({
      header: (CalendarPanelHeaderSchema.schema as typeof CalendarPanelHeaderSchema.schema).prefault({}),
      datePanel: (CalendarDatePanelSchema.schema as typeof CalendarDatePanelSchema.schema).prefault({}),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'calendarPanel' })
}
