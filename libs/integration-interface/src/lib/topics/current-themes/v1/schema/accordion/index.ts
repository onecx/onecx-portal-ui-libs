import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import { accordionPanelDefaults, accordionPanelShape } from './panel'

export const accordionShape = z.object({
  defaultVariant: z
    .object({
      panel: accordionPanelShape.prefault({}),
    })
    .prefault({}),
})

export type AccordionShapeInput = {
  defaultVariant?: {
    panel?: z.input<typeof accordionPanelShape>
  }
}

export const accordionDefaults = {
  defaultVariant: {
    panel: accordionPanelDefaults,
  },
}

export const accordion: z.ZodType<AccordionShapeInput, AccordionShapeInput> = applyDefaultsRecursive(
  accordionShape,
  accordionDefaults
).register(themeSchemaRegistry, { id: 'accordion' })

export class AccordionSchema {
  static readonly schema = accordion
}
