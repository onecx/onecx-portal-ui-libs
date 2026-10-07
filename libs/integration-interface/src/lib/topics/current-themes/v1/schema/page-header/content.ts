import * as z from 'zod'

import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, color, font, icon, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

const detailIconShape = z.object({
  color: color.optional(),
  icon: icon
    .pick({ size: true })
    .extend({
      width: withRef(z.string()).optional(),
      height: withRef(z.string()).optional(),
    })
    .prefault({}),
  paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
})

const detailValueShape = z.object({
  color: color.optional(),
  paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
  font: font.pick({ family: true, size: true, weight: true }).optional(),
  infoIcon: detailIconShape.prefault({}),
  actionIcon: detailIconShape.prefault({}),
})

const detailLabelShape = z.object({
  color: color.optional(),
  paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
  gap: withRef(z.string()).optional(),
  font: font.pick({ family: true, size: true, weight: true }).optional(),
})

const objectPanelShape = {
  gap: withRef(z.string()).optional(),
  value: detailValueShape.prefault({}),
  label: detailLabelShape.prefault({}),
}

export const pageHeaderContentShape = z.object({
  paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
  border: z.object({
    top: border.pick({ width: true, color: true }).optional(),
    bottom: border.pick({ width: true, color: true }).optional(),
    left: border.pick({ width: true, color: true }).optional(),
    right: border.pick({ width: true, color: true }).optional(),
  }).optional(),
  color: color.optional(),
  background: bg.pick({ color: true }).optional(),
  font: font.pick({ family: true, size: true, weight: true }).optional(),
  ...objectPanelShape,
})

export const pageHeaderContentDefaults = {
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  gap: '{{primitives.space.md}}',
  border: {
    top: {
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    },
    bottom: {
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    },
    left: {
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    },
    right: {
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    },
  },
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  background: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
  },
  font: {
    family: '{{primitives.font.family}}',
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
  },

  value: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
    font: {
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    },
    infoIcon: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      icon: {
        size: '{{primitives.icon.md}}',
        width: '1rem',
        height: '1rem',
      },
      paddingX: '{{primitives.space.md}}',
      paddingY: '{{primitives.space.md}}',
    },
    actionIcon: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      icon: {
        size: '{{primitives.icon.md}}',
        width: '1rem',
        height: '1rem',
      },
      paddingX: '{{primitives.space.md}}',
      paddingY: '{{primitives.space.md}}',
    },
  },

  label: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
    gap: '{{primitives.space.md}}',
    font: {
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    },
  },
}

export const pageHeaderContent = applyDefaultsRecursive(pageHeaderContentShape, pageHeaderContentDefaults).register(
  themeSchemaRegistry,
  {
    id: 'pageHeaderContent',
  }
)

export class PageHeaderContentSchema {
  static readonly schema = pageHeaderContent
}
