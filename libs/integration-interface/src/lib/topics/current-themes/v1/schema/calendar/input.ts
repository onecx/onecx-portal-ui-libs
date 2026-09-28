import * as z from 'zod'
import { inputShape, inputDefaults } from '../input'
import { calendarIconShape, calendarIconDefaults } from './inputicon'

/**
 * Shape for the calendar's input field.
 *
 * Option 1 (extends the generic input usage): reuses the full `inputShape`
 * token set (so the calendar input can be themed exactly like a standalone
 * input, via `usages.calendar.input.*` exclusively) and adds the two
 * calendar-only tokens that the generic input does not carry:
 *   - `icon`   — the calendar-specific input icon (own variant/state tree)
 *   - `shadow` — a calendar-specific static elevation token
 * Both sit at the input's root, as siblings of `defaultVariant`/`filled`.
 * (A shallow `.extend()` cannot re-nest the generic input's severity blocks,
 * so calendar-only tokens are added at the root rather than inside a state.)
 */
export const calendarInputShape = inputShape.extend({
  icon: calendarIconShape.prefault({}),
  shadow: z.string().optional(),
})

/**
 * Defaults for the calendar input.
 *
 * Inherits the generic input's full defaults tree (baseline + named states +
 * the `filled` variant). Because the generic input's `active` background
 * already equals the calendar's panel-open look, no `active` override is
 * needed here. The only calendar-specific defaults are `icon` and `shadow`.
 */
export const calendarInputDefaults = {
  ...inputDefaults,
  icon: calendarIconDefaults,
  shadow: '{{primitives.shadow.md}}',
}
