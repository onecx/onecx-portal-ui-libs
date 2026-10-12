import * as z from 'zod'
import { bg, color, withRef } from '../primitives'
import {
  messageCloseButtonSeverityShape,
  messageDefaultSeverityCloseButtonDefaults,
  messageDefaultSeverityCloseButtonShape,
} from './close-button'

type CanonicalSeverity = 'info' | 'success' | 'warning' | 'danger' | 'contrast'

/**
 * The mandatory baseline (`defaultSeverity`) — every non-settings token the filled look
 * renders, regardless of severity (structural geometry plus the theme's own neutral-default
 * colors). Named severities below only override the subset that actually differs.
 */
const messageDefaultSeverityShape = z.object({
  border: z
    .object({
      radius: withRef(z.string()).optional(),
      width: withRef(z.string()).optional(),
      color: color.optional(),
    })
    .prefault({}),
  transition: z.object({ duration: withRef(z.number()).optional() }).prefault({}),
  content: z
    .object({
      padding: withRef(z.string()).optional(),
      gap: withRef(z.string()).optional(),
    })
    .prefault({}),
  text: z
    .object({
      font: z
        .object({
          size: withRef(z.string()).optional(),
          weight: withRef(z.string()).optional(),
        })
        .prefault({}),
    })
    .prefault({}),
  icon: z.object({ size: withRef(z.string()).optional() }).prefault({}),
  closeIcon: z.object({ size: withRef(z.string()).optional() }).prefault({}),
  closeButton: messageDefaultSeverityCloseButtonShape.prefault({}),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  shadow: withRef(z.string()).optional(),
})

/**
 * Tokens a named severity overrides on top of the `defaultSeverity` baseline — the filled
 * appearance (the default look when no bordered/plain variant is requested).
 */
const messageDefaultVariantSeverityShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  border: z.object({ color: color.optional() }).prefault({}),
  color: color.optional(),
  shadow: withRef(z.string()).optional(),
  closeButton: messageCloseButtonSeverityShape.prefault({}),
})

/**
 * `secondary` is a neutral/muted severity option, but sources its color from the `secondary`
 * color variant rather than a `severity.*` primitive (see the add-theme-usage skill's
 * severity → primitive color mapping).
 */
export const messageDefaultVariantShape = z.object({
  defaultSeverity: messageDefaultSeverityShape.prefault({}),
  info: messageDefaultVariantSeverityShape.prefault({}),
  success: messageDefaultVariantSeverityShape.prefault({}),
  warning: messageDefaultVariantSeverityShape.prefault({}),
  danger: messageDefaultVariantSeverityShape.prefault({}),
  contrast: messageDefaultVariantSeverityShape.prefault({}),
  secondary: messageDefaultVariantSeverityShape.prefault({}),
})

const messageDefaultSeverityDefaults = {
  border: {
    radius: '{{primitives.radius.md}}',
    width: '{{primitives.border.width.md}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  },
  transition: { duration: '{{primitives.transition.duration}}' },
  content: { padding: '{{primitives.space.sm}}', gap: '{{primitives.space.sm}}' },
  text: {
    font: {
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    },
  },
  icon: { size: '{{primitives.icon.md}}' },
  closeIcon: { size: '{{primitives.icon.sm}}' },
  closeButton: messageDefaultSeverityCloseButtonDefaults,
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  shadow: '{{primitives.shadow.sm}}',
}

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
  defaultSeverity: messageDefaultSeverityDefaults,
  info: severityDefaults('info'),
  success: severityDefaults('success'),
  warning: severityDefaults('warning'),
  danger: severityDefaults('danger'),
  contrast: severityDefaults('contrast'),
  secondary: secondaryDefaults(),
}
