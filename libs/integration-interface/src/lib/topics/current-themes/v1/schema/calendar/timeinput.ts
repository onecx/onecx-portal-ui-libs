import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Shape of a single state block for the calendar time input (the hour/minute/second number
 * display in the time picker, distinct from `timeSeparator` and `timePickerButton`). No named
 * severities exist for this node, so its tokens sit directly on the state block instead of
 * behind a `defaultSeverity` wrapper.
 */
const calendarTimeInputStateShape = z.object({
  color: color.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  border: border.optional(),
})

/**
 * Shape for the calendar time input.
 * Static tokens (width, padding, font, focusRing) sit at the root — they don't vary by state.
 * The default token path lives under `defaultVariant.defaultState`.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarTimeInputShape = z
  .object({
    width: withRef(z.string().register(themeSchemaRegistry, { id: 'calendarTimeInputWidth', axis: 'none' })).optional(),
    padding: withRef(
      z.string().register(themeSchemaRegistry, { id: 'calendarTimeInputPadding', axis: 'none' })
    ).optional(),
    font: font
      .pick({ weight: true, size: true, family: true })
      .register(themeSchemaRegistry, { id: 'calendarTimeInputFont', axis: 'none' })
      .optional(),
    focusRing: borderWithShadow
      .extend({})
      .register(themeSchemaRegistry, { id: 'calendarTimeInputFocusRing', axis: 'none' })
      .optional(),

    defaultVariant: z
      .object({
        defaultState: calendarTimeInputStateShape.prefault({}),
        hover: calendarTimeInputStateShape.prefault({}),
        focus: calendarTimeInputStateShape.prefault({}),
      })
      .register(themeSchemaRegistry, { id: 'calendarTimeInputVariantShape', axis: 'state' })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'calendarTimeInputShape', axis: 'variant', child: true })

/**
 * Default tokens for the calendar time input.
 */
export const calendarTimeInputDefaults = {
  width: '3rem',
  padding: '{{primitives.space.xs}}',
  font: {
    weight: '{{primitives.font.weight}}',
    size: '{{primitives.font.size}}',
    family: '{{primitives.font.family}}',
  },
  focusRing: {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
    style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
    width: '{{primitives.border.width.md}}',
    offset: '{{primitives.border.offset.none}}',
    shadow: '{{primitives.shadow.none}}',
    radius: '{{primitives.radius.md}}',
  },
  defaultVariant: {
    defaultState: {
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
      border: {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.none}}',
        offset: '{{primitives.border.offset.none}}',
        radius: '{{primitives.border.radius.md}}',
      },
    },
    hover: {
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
      background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
      border: {
        color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
      },
    },
    focus: {
      color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
      background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
      border: {
        color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
      },
    },
  },
}
