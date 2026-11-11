import * as z from 'zod'
import { bg, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Shape for the today cell in the calendar date panel.
 */
export const calendarTodayShape = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
  })
  .register(themeSchemaRegistry, { id: 'calendarTodayShape', child: true })

/**
 * Default tokens for the today cell.
 */
export const calendarTodayDefaults = {
  background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
}
