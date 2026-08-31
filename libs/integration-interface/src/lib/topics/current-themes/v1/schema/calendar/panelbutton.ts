import * as z from 'zod'
import { bg, border, borderWithShadow, color, withRef } from '../primitives'

/**
 * Shape of a single state block for calendar panel buttons.
 * No named severities exist for this node, so its tokens sit directly on the state block instead
 * of behind a `defaultSeverity` wrapper.
 */
const calendarPanelButtonStateShape = z.object({
  color: z.union([color, withRef(z.string())]).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  border: border.optional(),
})

/**
 * Shape for calendar panel buttons (e.g. navigation buttons in panel header).
 * Static tokens (width/height, focusRing) sit at the root; the default token path lives under
 * `defaultVariant.defaultState`.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarPanelButtonShape = z.object({
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  focusRing: borderWithShadow.optional(),

  defaultVariant: z.object({
    defaultState: calendarPanelButtonStateShape.prefault({}),
    hover: calendarPanelButtonStateShape.prefault({}),
    focus: calendarPanelButtonStateShape.prefault({}),
    active: calendarPanelButtonStateShape.prefault({}),
    disabled: calendarPanelButtonStateShape.prefault({}),
  }).prefault({}),
})

/**
 * Default tokens for calendar panel buttons.
 * Shared across navButton, timePickerButton and calendarIconButton.
 */
export const calendarPanelButtonDefaults = {
  width: '2.5rem',
  height: '2.5rem',
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
      background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
    },
    focus: {
      border: {
        color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
        width: '{{primitives.border.width.md}}',
      },
    },
    active: {
      background: '{{primitives.area.overlay.state.active.defaultSeverity.bg}}',
    },
    disabled: {
      color: '{{primitives.area.overlay.state.disabled.defaultSeverity.contrast}}',
      background: '{{primitives.area.overlay.state.disabled.defaultSeverity.bg}}',
    },
  },
}
