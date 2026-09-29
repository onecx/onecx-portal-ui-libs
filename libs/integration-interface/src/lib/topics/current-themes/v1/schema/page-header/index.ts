import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, borderWithShadow, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { pageHeaderContentDefaults, pageHeaderContentShape } from './content'
import { pageHeaderSettingsDefaults, pageHeaderSettingsShape } from './settings'
import { pageHeaderTitleBarDefaults, pageHeaderTitleBarShape } from './title-bar'

const breadcrumbWrapperShape = z.object({
  paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
  marginX: withRef(z.string()).default('{{primitives.space.sm}}'),
  marginY: withRef(z.string()).default('{{primitives.space.sm}}'),
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
  paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
  background: bg.pick({ color: true }).optional(),
  marginX: withRef(z.string()).default('{{primitives.space.sm}}'),
  marginY: withRef(z.string()).default('{{primitives.space.sm}}'),
  settings: pageHeaderSettingsShape.prefault({}),
  breadcrumbWrapper: breadcrumbWrapperShape.prefault({}),
  header: pageHeaderTitleBarShape.prefault({}),
  content: pageHeaderContentShape.prefault({}),
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
  marginX: '{{primitives.space.sm}}',
  marginY: '{{primitives.space.sm}}',
  settings: pageHeaderSettingsDefaults,
  breadcrumbWrapper: {
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
    marginX: '{{primitives.space.sm}}',
    marginY: '{{primitives.space.sm}}',
  },
  header: pageHeaderTitleBarDefaults,
  content: pageHeaderContentDefaults,
}

export const pageHeader = applyDefaultsRecursive(pageHeaderShape, pageHeaderDefaults).register(themeSchemaRegistry, {
  id: 'pageHeader',
})

export class PageHeaderSchema {
  static readonly schema = pageHeader
}
