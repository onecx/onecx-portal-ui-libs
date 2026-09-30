import * as z from 'zod'
import { bg, border, borderWithShadow, color, withRef } from '../primitives'

/**
 * Shape of a single state block of a carousel indicator button.
 * No named severities exist for this node, so its tokens sit directly on the
 * state block instead of behind a `defaultSeverity` wrapper.
 */
const carouselIndicatorStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
})

/**
 * Shape for the carousel's indicator (dot) buttons.
 * Static tokens (width/height, focusRing) sit at the node root; the default
 * token path lives under `defaultVariant.defaultState`, with the interaction
 * states as flat siblings.
 * All keys are optional — defaults are applied at the carousel schema level.
 */
export const carouselIndicatorShape = z.object({
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  focusRing: borderWithShadow.optional(),

  defaultVariant: z
    .object({
      defaultState: carouselIndicatorStateShape.prefault({}),
      hover: carouselIndicatorStateShape.prefault({}),
      active: carouselIndicatorStateShape.prefault({}),
      focus: carouselIndicatorStateShape.prefault({}),
    })
    .prefault({}),
})

/**
 * Default tokens for the carousel indicators.
 * `width`/`height`/`focusRing` are static (variant-level) tokens; the color
 * and border tokens are carried per state.
 */
export const carouselIndicatorDefaults = {
  width: '{{primitives.space.md}}',
  height: '{{primitives.space.md}}',
  focusRing: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
    width: '{{primitives.border.width.md}}',
    radius: '{{primitives.border.radius.md}}',
    offset: '{{primitives.border.offset.none}}',
    shadow: '{{primitives.shadow.none}}',
  },
  defaultVariant: {
    defaultState: {
      background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.none}}',
        radius: '{{primitives.border.radius.md}}',
        offset: '{{primitives.border.offset.none}}',
      },
    },
    hover: {
      background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.none}}',
        radius: '{{primitives.border.radius.md}}',
        offset: '{{primitives.border.offset.none}}',
      },
    },
    active: {
      background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.none}}',
        radius: '{{primitives.border.radius.md}}',
        offset: '{{primitives.border.offset.none}}',
      },
    },
    focus: {
      background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.none}}',
        radius: '{{primitives.border.radius.md}}',
        offset: '{{primitives.border.offset.none}}',
      },
    },
  },
}
