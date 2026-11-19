import * as z from 'zod'
import { border } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { accordionContentDefaults, accordionContentShape } from './content'
import { accordionHeaderDefaults, accordionHeaderShape } from './header'

const accordionPanelStateShape = z.object({
  border: border.pick({ color: true, width: true }).optional(),
  header: accordionHeaderShape.prefault({}),
  content: accordionContentShape.prefault({}),
})

const accordionPanelStateSlot = z
  .object({
    defaultState: accordionPanelStateShape.prefault({}),
    active: accordionPanelStateShape.prefault({}),
    disabled: accordionPanelStateShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'accordion.panel.defaultVariant', axis: 'state' })

// The panel is a child component: it re-roots the fallback (child) and its single `defaultVariant`
// key is the default variant member (variant), so its states can fall back within the panel scope.
export const accordionPanelShape = z
  .object({
    defaultVariant: accordionPanelStateSlot.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'accordion.panel', axis: 'variant', child: true })

export const accordionPanelDefaults = {
  defaultVariant: {
    defaultState: {
      border: {
        width: '{{primitives.border.width.md}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      },
      header: accordionHeaderDefaults,
      content: accordionContentDefaults,
    },
    active: {
      header: {
        defaultVariant: {
          defaultState: {
            color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
            background: {
              color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}',
            },
            toggleIcon: {
              color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
            },
            last: {
              border: {
                radius: '{{primitives.border.radius.md}}',
              },
            },
          },
        },
      },
    },
  },
}
