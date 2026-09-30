import * as z from 'zod'
import { bg, color, withRef } from '../primitives'
import { messageCloseButtonSeverityShape } from './close-button'

type CanonicalSeverity = 'info' | 'success' | 'warning' | 'danger' | 'contrast'

/**
 * Tokens for a single severity of the filled (`defaultVariant`) look — the appearance
 * used when no `variant` (or `variant="text"`, which PrimeNG renders identically) is set.
 */
const messageDefaultVariantSeverityShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  border: z.object({ color: color.optional() }).prefault({}),
  color: color.optional(),
  shadow: withRef(z.string()).optional(),
  closeButton: messageCloseButtonSeverityShape.prefault({}),
})

/**
 * `secondary` is one of PrimeNG message's own severity values, but sources its color from
 * the `secondary` color variant rather than a `severity.*` primitive (see the add-theme-usage
 * skill's severity → primitive color mapping).
 */
export const messageDefaultVariantShape = z.object({
  info: messageDefaultVariantSeverityShape.prefault({}),
  success: messageDefaultVariantSeverityShape.prefault({}),
  warning: messageDefaultVariantSeverityShape.prefault({}),
  danger: messageDefaultVariantSeverityShape.prefault({}),
  contrast: messageDefaultVariantSeverityShape.prefault({}),
  secondary: messageDefaultVariantSeverityShape.prefault({}),
})

const severityDefaults = (severity: CanonicalSeverity) => ({
  background: `{{primitives.defaultVariant.defaultState.severity.${severity}.bg}}`,
  border: { color: `{{primitives.defaultVariant.defaultState.severity.${severity}.border.color}}` },
  color: `{{primitives.defaultVariant.defaultState.severity.${severity}.contrast}}`,
  shadow: '{{primitives.shadow.sm}}',
  closeButton: {
    hover: { background: `{{primitives.defaultVariant.state.hover.severity.${severity}.bg}}` },
    focus: {
      color: `{{primitives.defaultVariant.defaultState.severity.${severity}.contrast}}`,
      shadow: '{{primitives.shadow.none}}',
    },
  },
})

const secondaryDefaults = () => ({
  background: '{{primitives.variant.secondary.defaultState.defaultSeverity.bg}}',
  border: { color: '{{primitives.variant.secondary.defaultState.defaultSeverity.border.color}}' },
  color: '{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}',
  shadow: '{{primitives.shadow.sm}}',
  closeButton: {
    hover: { background: '{{primitives.variant.secondary.state.hover.defaultSeverity.bg}}' },
    focus: {
      color: '{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}',
      shadow: '{{primitives.shadow.none}}',
    },
  },
})

export const messageDefaultVariantDefaults = {
  info: severityDefaults('info'),
  success: severityDefaults('success'),
  warning: severityDefaults('warning'),
  danger: severityDefaults('danger'),
  contrast: severityDefaults('contrast'),
  secondary: secondaryDefaults(),
}
