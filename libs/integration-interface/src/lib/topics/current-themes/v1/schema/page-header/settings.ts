import * as z from 'zod'

import { applyDefaultsRecursive } from '../defaults-helper'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

// Behavioral options with no visual tokens; `axis: 'setting'` opts the block out of any enclosing axis.
export const pageHeaderSettingsShape = z
  .object({
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
  .register(themeSchemaRegistry, { id: 'pageHeaderSettingsShape', axis: 'setting' })

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
