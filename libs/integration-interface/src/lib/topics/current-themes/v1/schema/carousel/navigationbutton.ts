import * as z from 'zod'
import { bg, border, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Shape of a single state block of the carousel navigation button.
 * No named severities exist for this node, so its tokens sit directly on the
 * state block instead of behind a `defaultSeverity` wrapper.
 */
const carouselNavigationButtonStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
})

/**
 * Shape for the carousel's previous/next navigation buttons.
 * Static tokens (padding, focusRing) sit at the node root; the default token
 * path lives under `defaultVariant.defaultState`, with the interaction states
 * as flat siblings.
 * All keys are optional — defaults are applied at the carousel schema level.
 */
// The navigation button is a child component (re-roots the fallback) whose single `defaultVariant`
// key is the default variant member. Its `defaultVariant` slot holds the states (axis: 'state');
// `padding` and `focusRing` are static siblings of those states and opt out (axis: 'none').
export const carouselNavigationButtonShape = z
  .object({
    padding: withRef(
      z.string().register(themeSchemaRegistry, { id: 'carouselNavigationButtonPadding', axis: 'none' })
    ).optional(),
    focusRing: borderWithShadow
      .extend({})
      .register(themeSchemaRegistry, { id: 'carouselNavigationButtonFocusRing', axis: 'none' })
      .optional(),

    defaultVariant: z
      .object({
        defaultState: carouselNavigationButtonStateShape.prefault({}),
        hover: carouselNavigationButtonStateShape.prefault({}),
        focus: carouselNavigationButtonStateShape.prefault({}),
        disabled: carouselNavigationButtonStateShape.prefault({}),
      })
      .register(themeSchemaRegistry, { id: 'carouselNavigationButtonStateSlot', axis: 'state' })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'carouselNavigationButton', axis: 'variant', child: true })

/**
 * Default tokens for the carousel navigation buttons.
 * `padding` and `focusRing` are static (variant-level) tokens; the color and
 * border tokens are carried per state.
 */
export const carouselNavigationButtonDefaults = {
  padding: '{{primitives.space.sm}}',
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
        width: '{{primitives.border.width.md}}',
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
      },
    },
    focus: {
      background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
      },
    },
    disabled: {
      background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    },
  },
}
