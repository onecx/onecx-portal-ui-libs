import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { breadcrumbItemDefaults, breadcrumbItemShape } from './item'
import { breadcrumbSeparatorDefaults, breadcrumbSeparatorShape } from './separator'

const breadcrumbVariantShape = z.object({
  padding: withRef(z.string()).optional(),
  background: bg.pick({ color: true }).optional(),
  gap: withRef(z.string()).optional(),
  transition: z
    .object({
      duration: withRef(z.string()).optional(),
    })
    .prefault({}),
})

export const breadcrumbShape = z.object({
  defaultVariant: breadcrumbVariantShape.prefault({}),
  item: breadcrumbItemShape.prefault({}),
  separator: breadcrumbSeparatorShape.prefault({}),
})

export const breadcrumbDefaults = {
  defaultVariant: {
    padding: '{{primitives.space.md}}',
    background: {
      color:
        '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
    },
    gap: '{{primitives.space.md}}',
    transition: {
      duration: '{{primitives.transition.duration}}',
    },
  },
  item: breadcrumbItemDefaults,
  separator: breadcrumbSeparatorDefaults,
}

export const breadcrumb = applyDefaultsRecursive(
  breadcrumbShape,
  breadcrumbDefaults,
).register(themeSchemaRegistry, {
  id: 'breadcrumb',
})

export class BreadcrumbSchema {
  static readonly schema = breadcrumb
}