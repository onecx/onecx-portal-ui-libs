import * as z from 'zod'
import { bg, border, color, withRef } from '../primitives'

export const interactiveDataViewContainerShape = z.object({
  border: border.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  gap: withRef(z.string()).optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
})

export const interactiveDataViewContainerDefaults = {
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    width: '{{primitives.border.width.none}}',
  },
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  gap: '{{primitives.space.md}}',
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
}