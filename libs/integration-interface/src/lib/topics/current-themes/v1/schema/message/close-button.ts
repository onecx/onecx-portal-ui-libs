import * as z from 'zod'
import { bg, color, withRef } from '../primitives'

/**
 * Structural tokens for the message close button (size, shape, focus-ring geometry).
 * These do not depend on severity or variant — PrimeNG exposes a single set of them.
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
 * Per-severity close button color tokens — only exist under the filled `defaultVariant`
 * look (outlined/simple always render a transparent hover, un-tokenized in PrimeNG).
 */
export const messageCloseButtonSeverityShape = z.object({
  hover: z.object({ background: z.union([bg, withRef(z.string())]).optional() }).prefault({}),
  focus: z.object({ color: color.optional(), shadow: withRef(z.string()).optional() }).prefault({}),
})
