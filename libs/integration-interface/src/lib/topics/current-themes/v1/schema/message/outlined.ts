import * as z from 'zod'
import { color, withRef } from '../primitives'

type CanonicalSeverity = 'info' | 'success' | 'warning' | 'danger' | 'contrast'

const messageOutlinedDefaultSeverityShape = z.object({
  border: z
    .object({
      width: withRef(z.string()).optional(),
      color: color.optional(),
    })
    .prefault({}),
  color: color.optional(),
})

const messageOutlinedSeverityShape = z.object({
  color: color.optional(),
  border: z.object({ color: color.optional() }).prefault({}),
})

/**
 * `outlined` named variant — border only, no fill background. Only the root border width
 * and, per severity, the text/border color differ from the filled look (no background/shadow).
 */
export const messageOutlinedShape = z.object({
  defaultSeverity: messageOutlinedDefaultSeverityShape.prefault({}),
  info: messageOutlinedSeverityShape.prefault({}),
  success: messageOutlinedSeverityShape.prefault({}),
  warning: messageOutlinedSeverityShape.prefault({}),
  danger: messageOutlinedSeverityShape.prefault({}),
  contrast: messageOutlinedSeverityShape.prefault({}),
  secondary: messageOutlinedSeverityShape.prefault({}),
})

const severityDefaults = (severity: CanonicalSeverity) => ({
  color: `{{primitives.defaultVariant.defaultState.severity.${severity}.contrast}}`,
  border: { color: `{{primitives.defaultVariant.defaultState.severity.${severity}.contrast}}` },
})

const secondaryDefaults = () => ({
  color: '{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}',
  border: { color: '{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}' },
})

export const messageOutlinedDefaults = {
  defaultSeverity: {
    border: {
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    },
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  },
  info: severityDefaults('info'),
  success: severityDefaults('success'),
  warning: severityDefaults('warning'),
  danger: severityDefaults('danger'),
  contrast: severityDefaults('contrast'),
  secondary: secondaryDefaults(),
}
