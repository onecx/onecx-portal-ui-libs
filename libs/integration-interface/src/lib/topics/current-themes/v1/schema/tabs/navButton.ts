import * as z from 'zod'
import { bg, color, focusRingShape, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

const navButtonStateShape = z.object({
  nextIcon: withRef(z.string()).optional(),
  prevIcon: withRef(z.string()).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  width: withRef(z.string()).optional(),
  focusRing: focusRingShape.optional(),
})

// The navButton is a child component whose own keys are the interaction states (defaultState,
// hover). `child: true` re-roots the fallback and `axis: 'state'` classifies its keys as state
// members; the per-state content is left unmarked.
export const tabsNavButtonShape = z
  .object({
    defaultState: navButtonStateShape.prefault({}),
    hover: navButtonStateShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'tabs.navButton', axis: 'state', child: true })

export const tabsNavButtonDefaults = {
  defaultState: {
    nextIcon: '{{primitives.icon.arrowRight}}',
    prevIcon: '{{primitives.icon.arrowLeft}}',
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    width: '2.5rem',
    focusRing: {
      width: '{{primitives.focusRing.width}}',
      style: '{{primitives.focusRing.style}}',
      color: '{{primitives.focusRing.color}}',
      offset: '{{primitives.focusRing.offset}}',
      shadow: '{{primitives.focusRing.shadow}}',
    },
  },
  hover: {
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
  },
}
