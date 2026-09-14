/**
 * This file defines the schema for badge theming. It, by default, uses primitives for default
 * values but allows overriding any of them with custom values.
 */
import * as z from 'zod'
import { bg, border, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

export const badgeSettings = z
  .object({
    badgeSize: withRef(z.string()).optional(),
    size: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'badgeSettings' })

export const badgeDotShape = z.object({
  size: withRef(z.string()).optional(),
})

export const badgeDotDefaults = {
  size: '0.5rem',
}

export const badgeDot = applyDefaultsRecursive(badgeDotShape, badgeDotDefaults).register(themeSchemaRegistry, {
  id: 'badgeDot',
})

export const badgeSizeShape = z.object({
  fontSize: withRef(z.string()).optional(),
  minWidth: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
})

const badgeBaseDefaults = {
  font: {
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
  },
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.radius.full}}',
  },
  padding: '{{primitives.space.sm}}',
}

const BADGE_DEFAULT_SIZE = {
  minWidth: '1.5rem',
  height: '1.5rem',
}

const BADGE_SM_SIZE = {
  fontSize: '{{primitives.font.size}}',
  minWidth: '1.25rem',
  height: '1.25rem',
}

const BADGE_LG_SIZE = {
  fontSize: '{{primitives.font.size}}',
  minWidth: '1.75rem',
  height: '1.75rem',
}

const BADGE_XL_SIZE = {
  fontSize: '{{primitives.font.size}}',
  minWidth: '2rem',
  height: '2rem',
}

const colorVariant = (variant: string, severity?: string) => ({
  background: `{{primitives.variant.${variant}.defaultState.${severity ? `severity.${severity}` : 'defaultSeverity'}.bg}}`,
  color: `{{primitives.variant.${variant}.defaultState.${severity ? `severity.${severity}` : 'defaultSeverity'}.contrast}}`,
})

export const badgeColorVariantShape = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
  })
  .prefault({})

export const badgeShape = z.object({
  settings: badgeSettings.optional(),
  dot: badgeDotShape.prefault({}),
  font: font.optional(),
  border: border.optional(),
  padding: withRef(z.string()).optional(),
  minWidth: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  sm: badgeSizeShape.optional(),
  lg: badgeSizeShape.optional(),
  xl: badgeSizeShape.optional(),
  primary: badgeColorVariantShape.optional(),
  secondary: badgeColorVariantShape.optional(),
  success: badgeColorVariantShape.optional(),
  info: badgeColorVariantShape.optional(),
  warning: badgeColorVariantShape.optional(),
  danger: badgeColorVariantShape.optional(),
  contrast: badgeColorVariantShape.optional(),
})

export const badgeDefaults = {
  dot: badgeDotDefaults,
  font: badgeBaseDefaults.font,
  border: badgeBaseDefaults.border,
  padding: badgeBaseDefaults.padding,
  minWidth: BADGE_DEFAULT_SIZE.minWidth,
  height: BADGE_DEFAULT_SIZE.height,
  sm: BADGE_SM_SIZE,
  lg: BADGE_LG_SIZE,
  xl: BADGE_XL_SIZE,
  primary: colorVariant('primary'),
  secondary: colorVariant('secondary'),
  success: colorVariant('primary', 'success'),
  info: colorVariant('primary', 'info'),
  warning: colorVariant('primary', 'warning'),
  danger: colorVariant('primary', 'danger'),
  contrast: colorVariant('primary', 'contrast'),
}

export const badge = applyDefaultsRecursive(badgeShape, badgeDefaults).register(themeSchemaRegistry, {
  id: 'badge',
})
