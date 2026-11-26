import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'

import { messageDefaultVariantShape, messageDefaultVariantDefaults } from './default-variant'
import { messageOutlinedShape, messageOutlinedDefaults } from './outlined'
import { messageSimpleShape, messageSimpleDefaults } from './simple'
import { messageSizeShape, messageSmDefaults, messageLgDefaults } from './size'
import { messageSettingsShape } from './settings'

// ------------------------------------------------------------------
// SHAPE — all keys optional, no defaults baked in
// ------------------------------------------------------------------

/**
 * `border`/`transition`/`content`/`text`/`icon`/`closeButton`/`closeIcon` are not root
 * siblings — message is a severity-bearing node (like `badge`), so all of its own tokens
 * (varying by severity or not) live inside `defaultVariant.defaultSeverity`. Only nodes with
 * no severity of their own (`outlined`/`simple` are named variants with their own severities;
 * `sm`/`lg` are pure size overrides, not severity-bearing) sit as root siblings.
 */
export const messageShape = z.object({
  settings: messageSettingsShape.optional(),

  sm: messageSizeShape.prefault({}),
  lg: messageSizeShape.prefault({}),

  defaultVariant: messageDefaultVariantShape.prefault({}),
  outlined: messageOutlinedShape.prefault({}),
  simple: messageSimpleShape.prefault({}),
})

// ------------------------------------------------------------------
// DEFAULTS — composed from per-subcomponent defaults
// ------------------------------------------------------------------

export const messageDefaults = {
  sm: messageSmDefaults,
  lg: messageLgDefaults,

  defaultVariant: messageDefaultVariantDefaults,
  outlined: messageOutlinedDefaults,
  simple: messageSimpleDefaults,
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

// Message is flattened like `badge` (no `variant`/`state` wrappers): the root's own keys are the
// named variants (`defaultVariant`/`outlined`/`simple`), and each variant's value is a severity
// container. `settings` (axis: 'setting') and `sm`/`lg` (axis: 'none') opt out of the root's variant
// axis. The axis containers are the root (variant) and the three inner severity blocks.
export const message = applyDefaultsRecursive(messageShape, messageDefaults).register(themeSchemaRegistry, {
  id: 'message',
  axis: 'variant',
})
