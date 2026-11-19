import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

// Behavioral options with no visual tokens; `axis: 'setting'` opts the block out of any enclosing axis.
export const interactiveDataViewSettingsShape = z
  .object({
    emptyResultsMessage: withRef(z.string()).optional(),
    sortDirection: withRef(z.enum(['NONE', 'ASCENDING', 'DESCENDING'])).optional(),
    layout: withRef(z.enum(['grid', 'table', 'list'])).optional(),
    paginator: withRef(z.boolean()).optional(),
    pageSizes: withRef(z.array(z.number())).optional(),
    allowSelectAll: withRef(z.boolean()).optional(),
    checkboxColumnPosition: withRef(z.enum(['start', 'end'])).optional(),
  })
  .register(themeSchemaRegistry, { id: 'interactiveDataViewSettingsShape', axis: 'setting' })

export const interactiveDataViewSettingsDefaults = {
  emptyResultsMessage: '',
  sortDirection: 'NONE',
  layout: 'table',
  paginator: true,
  pageSizes: [10, 25, 50],
  allowSelectAll: true,
  checkboxColumnPosition: 'start',
}