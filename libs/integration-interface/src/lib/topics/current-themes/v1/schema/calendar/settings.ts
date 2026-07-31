import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Calendar component settings schema.
 */
export class CalendarSettingsSchema {
  static readonly schema = z
    .object({
      unstyled: withRef(z.boolean()),
      inputStyle: withRef(z.string()),
      inputStyleClass: withRef(z.string()),
      panelStyle: withRef(z.string()),
      panelStyleClass: withRef(z.string()),
      todayButtonStyleClass: withRef(z.string()),
      clearButtonStyleClass: withRef(z.string()),
      showIcon: withRef(z.boolean()),
      icon: withRef(z.string()),
      iconDisplay: withRef(z.enum(['input', 'button'])),
      appendTo: withRef(z.string()),
      size: withRef(z.enum(['small', 'large'])),
      variant: withRef(z.enum(['filled', 'outlined'])),
      fluid: withRef(z.boolean()),
      invalid: withRef(z.boolean()),
    })
    .register(themeSchemaRegistry, { id: 'calendarSettings' })
}
