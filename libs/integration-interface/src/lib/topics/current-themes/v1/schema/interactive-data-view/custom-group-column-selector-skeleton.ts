import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export const customGroupColumnSelectorSkeletonShape = z.object({
  border: border.pick({ radius: true }).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  animationBackground: z.union([bg, withRef(z.string())]).optional(),
})

export const customGroupColumnSelectorSkeletonDefaults = {
  border: { radius: '{{primitives.border.radius.none}}' },
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  animationBackground: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
}

export const customGroupColumnSelectorSkeleton = applyDefaultsRecursive(
  customGroupColumnSelectorSkeletonShape,
  customGroupColumnSelectorSkeletonDefaults
).register(themeSchemaRegistry, { id: 'customGroupColumnSelectorSkeleton' })

export class CustomGroupColumnSelectorSkeletonSchema {
  static readonly schema = customGroupColumnSelectorSkeleton
}
