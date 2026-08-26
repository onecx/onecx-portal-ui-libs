import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

export class DataviewSettingsSchema {
  static readonly settings = {
    paginator: withRef(z.boolean()).default(false),
    rows: withRef(z.number()).optional(),
    totalRecords: withRef(z.number()).optional(),
    pageLinks: withRef(z.number()).default(5),
    paginatorPosition: withRef(z.enum(['top', 'bottom', 'both'])).default('bottom'),
    alwaysShowPaginator: withRef(z.boolean()).default(true),
    paginatorDropdownScrollHeight: withRef(z.string()).default('200px'),
    showCurrentPageReport: withRef(z.boolean()).default(false),
    showJumpToPageDropdown: withRef(z.boolean()).default(false),
    showFirstLastIcon: withRef(z.boolean()).default(true),
    showPageLinks: withRef(z.boolean()).default(true),
    lazy: withRef(z.boolean()).default(false),
    lazyLoadOnInit: withRef(z.boolean()).default(true),
    loading: withRef(z.boolean()).default(false),
  }

  static readonly schema = z
    .object({
      ...this.settings,
    })
    .register(themeSchemaRegistry, { id: 'dataviewSettings' })
}
