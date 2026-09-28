import * as z from 'zod'

import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, borderWithShadow, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { PageHeaderContentSchema } from './content'
import { PageHeaderSettingsSchema } from './settings'
import { PageHeaderTitleBarSchema } from './title-bar'

const breadcrumbWrapperShape = z.object({
  padding: withRef(z.string()).optional(),
  margin: withRef(z.string()).optional(),
})

export const pageHeaderShape = z.object({
  border: borderWithShadow
    .pick({
      width: true,
      color: true,
      radius: true,
      shadow: true,
    })
    .optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  background: bg.pick({ color: true }).optional(),
  marginX: withRef(z.string()).optional(),
  marginY: withRef(z.string()).optional(),
  settings: PageHeaderSettingsSchema.schema.prefault({}),
  breadcrumbWrapper: breadcrumbWrapperShape.prefault({}),
  header: PageHeaderTitleBarSchema.schema.prefault({}),
  content: PageHeaderContentSchema.schema.prefault({}),
})

export const pageHeaderDefaults = {
  border: {
    width: '{{primitives.border.width.md}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    radius: '{{primitives.radius.md}}',
    shadow: '{{primitives.shadow.md}}',
  },

  paddingX: '{{primitives.space.md}}',

  paddingY: '{{primitives.space.md}}',

  background: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
  },

  marginX: '{{primitives.space.md}}',

  marginY: '{{primitives.space.md}}',

  breadcrumbWrapper: {
    padding: '{{primitives.space.md}}',
    margin: '{{primitives.space.md}}',
  },
}

export const pageHeader = applyDefaultsRecursive(
  pageHeaderShape,
  pageHeaderDefaults
).register(themeSchemaRegistry, {
  id: 'pageHeader',
})

export class PageHeaderSchema {
  static readonly schema = pageHeader
}
