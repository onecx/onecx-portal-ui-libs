import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'

/**
 * Shape of a single severity block for calendar footer buttons (today / clear).
 *
 * Unlike the icon-only `panelButton`, these are full text `p-button`s
 * (labelled "Today" / "Clear"), so they carry text typography and a
 * minimum width rather than a fixed square size.
 */
const calendarFooterButtonSeverityShape = z.object({
  padding: withRef(z.string()).optional(),
  font: font.pick({ family: true, size: true, weight: true }).optional(),
  color: z.union([color, withRef(z.string())]).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  border: border.optional(),
})

/**
 * Shape of a single state block for calendar footer buttons (default severity only).
 */
const calendarFooterButtonStateShape = z.object({
  defaultSeverity: calendarFooterButtonSeverityShape.prefault({}),
})

/**
 * Shape for calendar footer buttons (todayButton, clearButton).
 * Static token (minWidth, focusRing) sits at the root; the default token path lives under
 * `defaultVariant.defaultState.defaultSeverity`.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarFooterButtonShape = z.object({
  minWidth: withRef(z.string()).optional(),
  focusRing: borderWithShadow.optional(),

  defaultVariant: z.object({
    defaultState: calendarFooterButtonStateShape.prefault({}),
    hover: calendarFooterButtonStateShape.prefault({}),
    focus: calendarFooterButtonStateShape.prefault({}),
    active: calendarFooterButtonStateShape.prefault({}),
    disabled: calendarFooterButtonStateShape.prefault({}),
  }).prefault({}),
})

/**
 * Shared focus ring for the footer buttons.
 */
const footerButtonFocusRing = {
  color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.border.width.md}}',
  offset: '{{primitives.border.offset.none}}',
  shadow: '{{primitives.shadow.none}}',
  radius: '{{primitives.radius.md}}',
}

/**
 * Defaults for the "Today" footer button (filled look).
 * Independent from the "Clear" button so each can be themed separately.
 */
export const calendarTodayButtonDefaults = {
  minWidth: '2.5rem',
  focusRing: footerButtonFocusRing,
  defaultVariant: {
    defaultState: {
      defaultSeverity: {
        padding: '{{primitives.space.sm}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
        },
      },
    },
    hover: {
      defaultSeverity: {
        background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
        color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
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

/**
 * Defaults for the "Clear" footer button.
 * Independent from the "Today" button so each can be themed separately.
 * Currently mirrors the filled baseline; override at the theme level for a
 * neutral/outline look.
 */
export const calendarClearButtonDefaults = {
  minWidth: '2.5rem',
  focusRing: footerButtonFocusRing,
  defaultVariant: {
    defaultState: {
      defaultSeverity: {
        padding: '{{primitives.space.sm}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
        },
      },
    },
    hover: {
      defaultSeverity: {
        background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
        color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
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
