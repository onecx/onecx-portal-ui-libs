import * as z from 'zod'
import { border } from '../primitives'
import { accordionContentDefaults, accordionContentShape } from './content'
import { accordionHeaderDefaults, accordionHeaderShape } from './header'

const accordionPanelStateShape = z.object({
  border: border.pick({ color: true, width: true }).optional(),
  header: accordionHeaderShape.prefault({}),
  content: accordionContentShape.prefault({}),
})

export const accordionPanelShape = z.object({
  defaultVariant: z
    .object({
      defaultState: accordionPanelStateShape.prefault({}),
      active: accordionPanelStateShape.prefault({}),
      disabled: accordionPanelStateShape.prefault({}),
    })
    .prefault({}),
})

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
