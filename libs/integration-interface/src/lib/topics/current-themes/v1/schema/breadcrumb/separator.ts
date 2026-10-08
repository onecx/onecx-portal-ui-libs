import * as z from 'zod'
import { color, withRef } from '../primitives'

const breadcrumbSeparatorVariantShape = z.object({
  color: color.optional(),
  width: withRef(z.string()).optional(),
})

export const breadcrumbSeparatorShape = z.object({
  defaultVariant: breadcrumbSeparatorVariantShape.prefault({}),
})

export const breadcrumbSeparatorDefaults = {
  defaultVariant: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    width: '{{primitives.border.width.md}}',
  },
}
