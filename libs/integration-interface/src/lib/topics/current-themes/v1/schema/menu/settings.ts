import z from 'zod'
import { withRef } from '../primitives'

export class MenuSettingsSchema {
  static readonly schema = z.object({
    hasPopup: withRef(z.boolean()).default(false),
    appendTo: withRef(z.string()).default('body'),
    autoZIndex: withRef(z.boolean()).default(true),
    baseZIndex: withRef(z.number()).default(1000),
  })
}
