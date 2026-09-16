import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from '../primitives'
import { calendarDatePanelShape, calendarDatePanelDefaults } from './datepanel'
import { calendarFooterButtonBarShape, calendarFooterButtonBarDefaults } from './footerbuttonbar'
import { calendarMultiMonthDividerShape, calendarMultiMonthDividerDefaults } from './multimonthdivider'
import { calendarPanelHeaderShape, calendarPanelHeaderDefaults } from './panelheader'
import { calendarTimePickerShape, calendarTimePickerDefaults } from './timepicker'

/**
 * Shape of a single state block of the calendar panel.
 * The panel's children (header, date panel, etc.) sit inside the state block. No named
 * severities exist for this node, so tokens sit directly here instead of behind a
 * `defaultSeverity` wrapper.
 */
const calendarPanelStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: borderWithShadow.optional(),
  padding: withRef(z.string()).optional(),
  headerGap: withRef(z.string()).optional(),

  header: calendarPanelHeaderShape.prefault({}),
  datePanel: calendarDatePanelShape.prefault({}),
  multiMonthDivider: calendarMultiMonthDividerShape.prefault({}),
  timePicker: calendarTimePickerShape.prefault({}),
  footerButtonBar: calendarFooterButtonBarShape.prefault({}),
})

/**
 * Input type for {@link calendarPanelShape}.
 *
 * Explicit so the inferred type of the nested `prefault`ed shape stays within the
 * compiler's serialization limit (avoids TS7056) while preserving the panel's input
 * type. Used as *both* the Output and Input type arguments of the schema's
 * `z.ZodType` annotation — supplying only the Output argument would default Input
 * to `unknown`, which would make `z.input<typeof calendarPanelShape>` (the type
 * `Usages['calendar'].defaultVariant.panel` resolves through) collapse to `unknown`
 * and drop every `panel.*` leaf from `ThemePath`.
 */
type CalendarPanelShapeInput = {
  defaultVariant?: {
    defaultState?: z.input<typeof calendarPanelStateShape>
    hover?: z.input<typeof calendarPanelStateShape>
    focus?: z.input<typeof calendarPanelStateShape>
  }
}

/**
 * Shape for the calendar panel including header and date panel.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarPanelShape: z.ZodType<CalendarPanelShapeInput, CalendarPanelShapeInput> = z.object({
  defaultVariant: z
    .object({
      defaultState: calendarPanelStateShape.prefault({}),
      hover: calendarPanelStateShape.prefault({}),
      focus: calendarPanelStateShape.prefault({}),
    })
    .prefault({}),
})

/**
 * Default tokens for the calendar panel.
 */
export const calendarPanelDefaults = {
  defaultVariant: {
    defaultState: {
      background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.sm}}',
        offset: '{{primitives.border.offset.none}}',
        radius: '{{primitives.border.radius.sm}}',
        shadow: '{{primitives.shadow.sm}}',
      },
      padding: '{{primitives.space.md}}',
      headerGap: '{{primitives.space.sm}}',

      header: calendarPanelHeaderDefaults,
      datePanel: calendarDatePanelDefaults,
      multiMonthDivider: calendarMultiMonthDividerDefaults,
      timePicker: calendarTimePickerDefaults,
      footerButtonBar: calendarFooterButtonBarDefaults,
    },
  },
}
