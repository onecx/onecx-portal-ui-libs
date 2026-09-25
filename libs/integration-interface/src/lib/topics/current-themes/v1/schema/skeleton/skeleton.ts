import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export const skeletonShape = z.object({
  border: border.pick({ radius: true }).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  animationBackground: z.union([bg, withRef(z.string())]).optional(),
})

export const skeletonDefaults = {
  border: { radius: '{{primitives.border.radius.none}}' },
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  animationBackground: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
}

export const skeleton = applyDefaultsRecursive(skeletonShape, skeletonDefaults).register(themeSchemaRegistry, {
  id: 'skeleton',
})

export class SkeletonSchema {
  static readonly schema = skeleton
}