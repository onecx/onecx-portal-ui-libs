import z from 'zod'
import { withRef } from '../primitives'

export class PageHeaderSettingsSchema {
  static readonly schema = z.object({
    mode: withRef(z.enum(['basic', 'advanced'])).default('basic'),
    showBreadcrumbs: withRef(z.boolean()).default(true),
    manualBreadcrumbs: withRef(z.boolean()).default(false),
    loading: withRef(z.boolean()).default(false),
    enableGrid: withRef(z.boolean()).default(false),
    disableDefaultActions: withRef(z.boolean()).default(false),
    gridLayoutDesktopColumns: withRef(
      z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(6), z.literal(12)])
    ).default(12),
  })
}
