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

// Root marker goes on the final applied export (`applyDefaultsRecursive` rebuilds the root object
// fresh, so a marker on `accordionShape` would be discarded). `defaultVariant` is the single
// variant member; `panel` re-roots as a child component (see `accordionPanelShape`).
export const accordion: z.ZodType<AccordionShapeInput, AccordionShapeInput> = applyDefaultsRecursive(
  accordionShape,
  accordionDefaults
).register(themeSchemaRegistry, { id: 'accordion', axis: 'variant' })

export class AccordionSchema {
  static readonly schema = accordion
}
