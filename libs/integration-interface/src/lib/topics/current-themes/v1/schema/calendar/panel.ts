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
 *
 * Exported (not just module-local) so that `calendarPanelShape` below can reference it
 * by name in tsc's declaration emit. If it were a private const, tsc would inline its
 * large inferred type into `calendarPanelShape`'s declaration and fail with TS7056.
 */
export const calendarPanelStateShape = z.object({
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
 * One state block of the calendar panel, wrapped as a prefaulted schema.
 * Named so the panel shape below can reference it by `typeof` — keeping the panel
 * shape's declared type a compact set of name references instead of inlining
 * `calendarPanelStateShape`'s large type three times.
 */
type CalendarPanelStatePrefault = z.ZodPrefault<typeof calendarPanelStateShape>

/**
 * Static shape of the calendar panel.
 *
 * Explicitly annotated (mirroring `table.ts`) so tsc emits a compact, name-referencing
 * type alias rather than inlining the fully-inferred type — which, because the panel state
 * block (nesting header, datePanel, timePicker, multiMonthDivider, footerButtonBar) is
 * repeated across the three states, would exceed TS7056's max serializable length.
 *
 * Crucially this keeps the *real* shape (not `unknown`), so the theme mapper's
 * `ThemePath` oracle can still resolve nested `usages.calendar.defaultVariant.panel.*`
 * leaf paths from `z.input<typeof calendar>`.
 */
type CalendarPanelVariantShape = {
  defaultState: CalendarPanelStatePrefault
  hover: CalendarPanelStatePrefault
  focus: CalendarPanelStatePrefault
}
type CalendarPanelShape = {
  defaultVariant: z.ZodPrefault<z.ZodObject<CalendarPanelVariantShape>>
}

export const calendarPanelShape: z.ZodObject<CalendarPanelShape> = z.object({
  defaultVariant: z.object({
    defaultState: calendarPanelStateShape.prefault({}),
    hover: calendarPanelStateShape.prefault({}),
    focus: calendarPanelStateShape.prefault({}),
  }).prefault({}),
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
