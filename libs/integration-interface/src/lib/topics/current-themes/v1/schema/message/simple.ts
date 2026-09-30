import * as z from 'zod'
import { color, withRef } from '../primitives'

type CanonicalSeverity = 'info' | 'success' | 'warning' | 'danger' | 'contrast'

const messageSimpleSeverityShape = z.object({
  color: color.optional(),
})

/**
 * `simple` named variant — no background, no border, no shadow; PrimeNG only overrides
 * the root content padding (down to 0) and, per severity, the text color.
 */
export const messageSimpleShape = z.object({
  content: z.object({ padding: withRef(z.string()).optional() }).prefault({}),
  info: messageSimpleSeverityShape.prefault({}),
  success: messageSimpleSeverityShape.prefault({}),
  warning: messageSimpleSeverityShape.prefault({}),
  danger: messageSimpleSeverityShape.prefault({}),
  contrast: messageSimpleSeverityShape.prefault({}),
  secondary: messageSimpleSeverityShape.prefault({}),
})

const severityDefaults = (severity: CanonicalSeverity) => ({
  color: `{{primitives.defaultVariant.defaultState.severity.${severity}.contrast}}`,
})

const secondaryDefaults = () => ({
  color: '{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}',
})

export const messageSimpleDefaults = {
  content: { padding: '0' },
  info: severityDefaults('info'),
  success: severityDefaults('success'),
  warning: severityDefaults('warning'),
  danger: severityDefaults('danger'),
  contrast: severityDefaults('contrast'),
  secondary: secondaryDefaults(),
}
