/**
 * This file defines the schema for badge theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from 'zod'
import { bg, border, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

const badgeDefaultSeverityShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  font: font.optional(),
  padding: withRef(z.string()).optional(),
  minWidth: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
})

const badgeSeverityOverrideShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
})

const badgeVariantShape = z.object({
  defaultSeverity: badgeDefaultSeverityShape.prefault({}),
  primary: badgeSeverityOverrideShape.prefault({}),
  secondary: badgeSeverityOverrideShape.prefault({}),
  success: badgeSeverityOverrideShape.prefault({}),
  info: badgeSeverityOverrideShape.prefault({}),
  warning: badgeSeverityOverrideShape.prefault({}),
  danger: badgeSeverityOverrideShape.prefault({}),
  contrast: badgeSeverityOverrideShape.prefault({}),
})

const badgeSizeShape = z.object({
  fontSize: withRef(z.string()).optional(),
  minWidth: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
})

const badgeDotShape = z.object({
  size: withRef(z.string()).optional(),
})

export const badgeShape = z.object({
  defaultVariant: badgeVariantShape.prefault({}),
  sm: badgeSizeShape.prefault({}),
  lg: badgeSizeShape.prefault({}),
  xl: badgeSizeShape.prefault({}),
  dot: badgeDotShape.prefault({}),
})

const defaultSeverityTokens = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  border: {
    radius: '{{primitives.radius.full}}',
  },
  font: {
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
  },
  padding: '{{primitives.space.sm}}',
  minWidth: '1.5rem',
  height: '1.5rem',
}

const colorVariantOverride = (variantName: 'primary' | 'secondary') => ({
  background: `{{primitives.variant.${variantName}.defaultState.defaultSeverity.bg}}`,
  color: `{{primitives.variant.${variantName}.defaultState.defaultSeverity.contrast}}`,
})

const severityOverride = (severity: 'success' | 'info' | 'warning' | 'danger' | 'contrast') => ({
  background: `{{primitives.defaultVariant.defaultState.severity.${severity}.bg}}`,
  color: `{{primitives.defaultVariant.defaultState.severity.${severity}.contrast}}`,
})

export const badgeDefaults = {
  defaultVariant: {
    defaultSeverity: defaultSeverityTokens,
    primary: colorVariantOverride('primary'),
    secondary: colorVariantOverride('secondary'),
    success: severityOverride('success'),
    info: severityOverride('info'),
    warning: severityOverride('warning'),
    danger: severityOverride('danger'),
    contrast: severityOverride('contrast'),
  },
  sm: {
    fontSize: '{{primitives.font.size}}',
    minWidth: '1.25rem',
    height: '1.25rem',
  },
  lg: {
    fontSize: '{{primitives.font.size}}',
    minWidth: '1.75rem',
    height: '1.75rem',
  },
  xl: {
    fontSize: '{{primitives.font.size}}',
    minWidth: '2rem',
    height: '2rem',
  },
  dot: {
    size: '0.5rem',
  },
}

export const badge = applyDefaultsRecursive(badgeShape, badgeDefaults).register(themeSchemaRegistry, {
  id: 'badge',
})
