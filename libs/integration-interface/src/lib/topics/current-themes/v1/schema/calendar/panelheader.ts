import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, color, withRef } from '../primitives'
import { CalendarNavigationSelectorSchema } from './navigationselector'
import { CalendarPanelButtonSchema } from './panelbutton'

/**
 * Header of the calendar panel schema including year/month navigation selector and panel buttons.
 */
export class CalendarPanelHeaderSchema {
  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultVariant.bg}}'),
    color: color.default('{{primitives.area.overlay.defaultState.defaultVariant.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    margin: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.sm}}'),
  }

  static readonly schema = z
    .object({
      // navigation selector buttons in header panel (including e.g. selectMonth, selectYear)
      selectMonth: (CalendarNavigationSelectorSchema.schema as typeof CalendarNavigationSelectorSchema.schema).prefault(
        {}
      ),
      selectYear: (CalendarNavigationSelectorSchema.schema as typeof CalendarNavigationSelectorSchema.schema).prefault(
        {}
      ),
      navButton: (CalendarPanelButtonSchema.schema as typeof CalendarPanelButtonSchema.schema).prefault({}),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'calendarPanelHeader' })
}
