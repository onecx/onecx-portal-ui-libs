import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

export const dataviewSettingsShape = z.object({
  paginator: withRef(z.boolean()).optional(),
  pageLinks: withRef(z.number()).optional(),
  paginatorPosition: withRef(z.enum(['top', 'bottom', 'both'])).optional(),
  alwaysShowPaginator: withRef(z.boolean()).optional(),
  paginatorDropdownScrollHeight: withRef(z.string()).optional(),
  showCurrentPageReport: withRef(z.boolean()).optional(),
  showJumpToPageDropdown: withRef(z.boolean()).optional(),
  showFirstLastIcon: withRef(z.boolean()).optional(),
  showPageLinks: withRef(z.boolean()).optional(),
  loading: withRef(z.boolean()).optional(),
})

export const dataviewSettingsDefaults = {
  paginator: false,
  pageLinks: 5,
  paginatorPosition: 'bottom',
  alwaysShowPaginator: true,
  paginatorDropdownScrollHeight: '200px',
  showCurrentPageReport: false,
  showJumpToPageDropdown: false,
  showFirstLastIcon: true,
  showPageLinks: true,
  loading: false,
}

export const dataviewSettings = dataviewSettingsShape

export class DataviewSettingsSchema {
  static readonly schema = dataviewSettings
}

void themeSchemaRegistry
