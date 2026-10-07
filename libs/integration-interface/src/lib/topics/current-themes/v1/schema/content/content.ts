/**
 * Schema for the content card usage (`ocx-content` / `.ocx-card`). The card is a static container:
 * no variant, state, or severity, so its tokens sit directly at the top level (no axis wrapper).
 *
 * Shape/defaults are separated: `contentShape` is a pure (all-optional) shape, `contentDefaults`
 * is a plain defaults tree, and `content` applies the defaults via `applyDefaultsRecursive`.
 * Because the card is static, its "baseline" is the whole token set — every root token (and the
 * `title` child's tokens) carries a default.
 */
import * as z from 'zod'
import { bg, border, color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'

import { contentTitleDefaults, contentTitleShape } from './title'

// ------------------------------------------------------------------
// SHAPE — pure, all keys optional, no defaults baked in
// ------------------------------------------------------------------

export const contentShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  font: font.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  marginX: withRef(z.string()).optional(),
  marginY: withRef(z.string()).optional(),
  border: border.optional(),
  shadow: withRef(z.string()).optional(),
  title: contentTitleShape.prefault({}),
})

// ------------------------------------------------------------------
// DEFAULTS — the full static baseline (card + title child)
// ------------------------------------------------------------------

export const contentDefaults = {
  background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
  font: {
    family: '{{primitives.font.family}}',
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
    lineHeight: '{{primitives.font.lineHeight}}',
    letterSpacing: '{{primitives.font.letterSpacing}}',
    style: '{{primitives.font.style}}',
  },
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  marginX: '0',
  marginY: '{{primitives.space.xl}}',
  border: {
    color: '{{primitives.area.surface.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.area.surface.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.border.radius.md}}',
    offset: '{{primitives.border.offset.none}}',
  },
  shadow: '{{primitives.shadow.md}}',
  title: contentTitleDefaults,
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

export const content = applyDefaultsRecursive(contentShape, contentDefaults).register(themeSchemaRegistry, {
  id: 'content',
})
