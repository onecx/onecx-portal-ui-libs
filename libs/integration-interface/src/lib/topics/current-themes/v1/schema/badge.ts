/**
 * This file defines the schema for badge theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from 'zod'
import { bg, border, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

export const badgeSettings = z
  .object({
    badgeSize: withRef(z.string()).optional(),
    size: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'badgeSettings' })

export const badgeDot = z
  .object({
    size: withRef(z.string()).default('0.5rem'),
  })
  .register(themeSchemaRegistry, { id: 'badgeDot' })

const badgeSizeStyle = z
  .object({
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

const badgeColorVariant = (def: { background: string; color: string }) =>
  z
    .object({
      background: z.union([bg, withRef(z.string())]).default(def.background),
      color: color.default(def.color),
    })
    .prefault({})

export const badge = z
  .object({
    settings: (badgeSettings as typeof badgeSettings).optional(),
    dot: (badgeDot as typeof badgeDot).prefault({}),
    font: font.default(badgeBaseDefaults.font),
    border: border.default(badgeBaseDefaults.border),
    padding: withRef(z.string()).default(badgeBaseDefaults.padding),
    minWidth: withRef(z.string()).default(BADGE_DEFAULT_SIZE.minWidth),
    height: withRef(z.string()).default(BADGE_DEFAULT_SIZE.height),
    sm: badgeSizeStyle.default(BADGE_SM_SIZE),
    lg: badgeSizeStyle.default(BADGE_LG_SIZE),
    xl: badgeSizeStyle.default(BADGE_XL_SIZE),
    primary: badgeColorVariant(colorVariant('primary')),
    secondary: badgeColorVariant(colorVariant('secondary')),
    success: badgeColorVariant(colorVariant('primary', 'success')),
    info: badgeColorVariant(colorVariant('primary', 'info')),
    warning: badgeColorVariant(colorVariant('primary', 'warning')),
    danger: badgeColorVariant(colorVariant('primary', 'danger')),
    contrast: badgeColorVariant(colorVariant('primary', 'contrast')),
  })
  .register(themeSchemaRegistry, { id: 'badge' })
