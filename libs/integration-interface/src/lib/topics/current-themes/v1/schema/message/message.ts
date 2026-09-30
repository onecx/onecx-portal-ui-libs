import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'

import { messageCloseButtonShape, messageCloseButtonDefaults } from './close-button'
import { messageDefaultVariantShape, messageDefaultVariantDefaults } from './default-variant'
import { messageOutlinedShape, messageOutlinedDefaults } from './outlined'
import { messageSimpleShape, messageSimpleDefaults } from './simple'
import { messageSizeShape, messageSmDefaults, messageLgDefaults } from './size'
import { messageSettingsShape } from './settings'

// ------------------------------------------------------------------
// SHAPE — all keys optional, no defaults baked in
// ------------------------------------------------------------------

/**
 * `border`, `transition`, `content`, `text`, `icon`, `closeButton`, `closeIcon`, and the
 * `sm`/`lg` size overrides do not depend on severity or the named `outlined`/`simple`
 * variants — PrimeNG exposes a single set of them, so they sit as siblings of
 * `defaultVariant`/`outlined`/`simple` at the component root (dependency: nothing).
 */
export const messageShape = z.object({
  settings: messageSettingsShape.optional(),

  border: z
    .object({
      radius: withRef(z.string()).optional(),
      width: withRef(z.string()).optional(),
    })
    .prefault({}),
  transition: z
    .object({
      duration: withRef(z.number()).optional(),
    })
    .prefault({}),
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
  closeButton: messageCloseButtonShape.prefault({}),
  closeIcon: z.object({ size: withRef(z.string()).optional() }).prefault({}),

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
  border: {
    radius: '{{primitives.radius.md}}',
    width: '{{primitives.border.width.md}}',
  },
  transition: {
    duration: '{{primitives.transition.duration}}',
  },
  content: {
    padding: '{{primitives.space.sm}}',
    gap: '{{primitives.space.sm}}',
  },
  text: {
    font: {
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    },
  },
  icon: { size: '{{primitives.icon.md}}' },
  closeButton: messageCloseButtonDefaults,
  closeIcon: { size: '{{primitives.icon.sm}}' },

  sm: messageSmDefaults,
  lg: messageLgDefaults,

  defaultVariant: messageDefaultVariantDefaults,
  outlined: messageOutlinedDefaults,
  simple: messageSimpleDefaults,
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

export const message = applyDefaultsRecursive(messageShape, messageDefaults).register(themeSchemaRegistry, {
  id: 'message',
})
