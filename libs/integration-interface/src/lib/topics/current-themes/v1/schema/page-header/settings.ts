import * as z from 'zod'

import { applyDefaultsRecursive } from '../defaults-helper'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export const pageHeaderSettingsShape = z.object({
  mode: withRef(z.enum(['basic', 'advanced'])).optional(),
  showBreadcrumbs: withRef(z.boolean()).optional(),
  manualBreadcrumbs: withRef(z.boolean()).optional(),
  loading: withRef(z.boolean()).optional(),
  enableGrid: withRef(z.boolean()).optional(),
  disableDefaultActions: withRef(z.boolean()).optional(),
  gridLayoutDesktopColumns: withRef(
    z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(6), z.literal(12)])
  ).optional(),
})

export const pageHeaderSettingsDefaults = {
  mode: 'basic',
  showBreadcrumbs: true,
  manualBreadcrumbs: false,
  loading: false,
  enableGrid: false,
  disableDefaultActions: false,
  gridLayoutDesktopColumns: 12,
}

export const pageHeaderSettings = applyDefaultsRecursive(pageHeaderSettingsShape, pageHeaderSettingsDefaults).register(
  themeSchemaRegistry,
  {
    id: 'pageHeaderSettings',
  }
)

export class PageHeaderSettingsSchema {
  static readonly schema = pageHeaderSettings
}