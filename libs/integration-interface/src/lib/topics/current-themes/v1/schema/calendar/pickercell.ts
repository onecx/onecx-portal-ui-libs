import * as z from 'zod'
import { bg, border, color, font, withRef } from '../primitives'

/**
 * Shape of a single severity block for calendar picker cells.
 */
const calendarPickerCellSeverityShape = z.object({
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  padding: withRef(z.string()).optional(),
  font: font.pick({ weight: true, size: true }).optional(),
  color: color.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  border: border.optional(),
  inRangeBackground: z.union([bg, withRef(z.string())]).optional(),
  rangeSelectedBackground: color.optional(),
})

/**
 * Shape of a single state block for calendar picker cells (default severity only).
 */
const calendarPickerCellStateShape = z.object({
  defaultSeverity: calendarPickerCellSeverityShape.prefault({}),
})

/**
 * Shape for calendar picker cells (dateCell, monthCell, yearCell).
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarPickerCellShape = z.object({
  defaultVariant: z.object({
    defaultState: calendarPickerCellStateShape.prefault({}),
    hover: calendarPickerCellStateShape.prefault({}),
    selected: calendarPickerCellStateShape.prefault({}),
    focus: calendarPickerCellStateShape.prefault({}),
    active: calendarPickerCellStateShape.prefault({}),
    disabled: calendarPickerCellStateShape.prefault({}),
  }).prefault({}),
})

/**
 * Default tokens for calendar picker cells.
 * Shared across dateCell, monthCell and yearCell.
 */
export const calendarPickerCellDefaults = {
  defaultVariant: {
    defaultState: {
      defaultSeverity: {
        width: '2.5rem',
        height: '2.5rem',
        padding: '{{primitives.space.xs}}',
        font: {
          weight: '{{primitives.font.weight}}',
          size: '{{primitives.font.size}}',
        },
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
        },
      },
    },
    hover: {
      defaultSeverity: {
        color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
        border: {
          color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
        },
      },
    },
    selected: {
      defaultSeverity: {
        color: '{{primitives.area.overlay.state.selected.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.state.selected.defaultSeverity.bg}}',
        border: {
          color: '{{primitives.area.overlay.state.selected.defaultSeverity.border.color}}',
        },
        inRangeBackground: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        rangeSelectedBackground: '{{primitives.area.overlay.state.selected.defaultSeverity.bg}}',
      },
    },
    focus: {
      defaultSeverity: {
        border: {
          color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
          width: '{{primitives.border.width.md}}',
        },
      },
    },
    active: {
      defaultSeverity: {
        background: '{{primitives.area.overlay.state.active.defaultSeverity.bg}}',
      },
    },
    disabled: {
      defaultSeverity: {
        color: '{{primitives.area.overlay.state.disabled.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.state.disabled.defaultSeverity.bg}}',
      },
    },
  },
}
