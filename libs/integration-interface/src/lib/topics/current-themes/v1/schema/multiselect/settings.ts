/**
 * Multiselect component settings schema. Every field is optional/no-default, consistent with
 * `dropdownSettingsShape` (`../dropdown.ts`) — these are plain pass-through config values, not
 * themeable tokens.
 */
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

export const multiselectSettingsShape = z
  .object({
    variant: withRef(z.enum(['filled', 'outlined'])).optional(),
    scrollHeight: withRef(z.string()).optional(),
    filter: withRef(z.boolean()).optional(),
    filterLocale: withRef(z.string()).optional(),
    readonly: withRef(z.boolean()).optional(),
    showClear: withRef(z.boolean()).optional(),
    virtualScroll: withRef(z.boolean()).optional(),
    virtualScrollItemSize: withRef(z.number()).optional(),
    selectOnFocus: withRef(z.boolean()).optional(),
    autoOptionFocus: withRef(z.boolean()).optional(),
    display: withRef(z.enum(['chip', 'comma'])).optional(),
    maxSelectedLabels: withRef(z.number()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectSettingsShape' })
