import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/** Component-level behaviour (not visual tokens) — opts out of the root's axis. */
export const dataTableSettingsShape = z
  .object({
    checkboxColumnPosition: withRef(z.enum(['start', 'end'])).optional(),
    actionColumnPosition: withRef(z.enum(['start', 'end'])).optional(),
    actionColumnSticky: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dataTable.settings', axis: 'setting' })

export const dataTableSettingsDefaults = {
  checkboxColumnPosition: 'start',
  actionColumnPosition: 'end',
  actionColumnSticky: false,
}
