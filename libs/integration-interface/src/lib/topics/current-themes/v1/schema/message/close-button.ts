import * as z from 'zod'
import { bg, color, withRef } from '../primitives'

/**
 * Structural tokens for the message close/dismiss button (size, shape, focus-ring geometry).
 * A dismiss affordance is typically sized/shaped the same regardless of the message's severity
 * or look, so these sit outside the per-severity tree (verified against PrimeNG's `p-message`).
 */
export const messageCloseButtonShape = z.object({
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  border: z.object({ radius: withRef(z.string()).optional() }).prefault({}),
  focusRing: z
    .object({
      width: withRef(z.string()).optional(),
      style: withRef(z.string()).optional(),
      offset: withRef(z.string()).optional(),
    })
    .prefault({}),
})

export const messageCloseButtonDefaults = {
  width: '1.75rem',
  height: '1.75rem',
  border: { radius: '{{primitives.radius.full}}' },
  focusRing: {
    width: '{{primitives.border.width.md}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
    offset: '{{primitives.border.offset.none}}',
  },
}

/**
 * Per-severity close button color tokens — only meaningful for the filled `defaultVariant`
 * look; the bordered/plain looks render the close button without its own background, so no
 * hover/focus color needs theming there.
 */
export const messageCloseButtonSeverityShape = z.object({
  hover: z.object({ background: z.union([bg, withRef(z.string())]).optional() }).prefault({}),
  focus: z.object({ color: color.optional(), shadow: withRef(z.string()).optional() }).prefault({}),
})

/**
 * `defaultSeverity`'s close button = structural tokens + the neutral-default severity colors
 * (the theme's own fallback look, not tied to any single named severity).
 */
export const messageDefaultSeverityCloseButtonShape = messageCloseButtonShape.extend(
  messageCloseButtonSeverityShape.shape
)

export const messageDefaultSeverityCloseButtonDefaults = {
  ...messageCloseButtonDefaults,
  hover: { background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}' },
  focus: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    shadow: '{{primitives.shadow.none}}',
  },
}
