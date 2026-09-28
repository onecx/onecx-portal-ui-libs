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
  padding: z
    .object({
      left: withRef(z.string()).optional(),
      right: withRef(z.string()).optional(),
    })
    .prefault({}),
})

const detailValueShape = z.object({
  color: color.optional(),
  padding: withRef(z.string()).optional(),
  font: font.pick({ family: true, size: true, weight: true }).optional(),
  infoIcon: detailIconShape.prefault({}),
  actionIcon: detailIconShape.prefault({}),
})

const detailLabelShape = z.object({
  color: color.optional(),
  padding: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  font: font.pick({ family: true, size: true, weight: true }).optional(),
})

const objectPanelShape = {
  gap: withRef(z.string()).optional(),
  value: detailValueShape.prefault({}),
  label: detailLabelShape.prefault({}),
}

export const pageHeaderContentShape = z.object({
  padding: withRef(z.string()).optional(),
  borderTop: border.pick({ width: true, color: true }).optional(),
  color: color.optional(),
  background: bg.pick({ color: true }).optional(),
  font: font.pick({ family: true, size: true, weight: true }).optional(),
  ...objectPanelShape,
})

export const pageHeaderContentDefaults = {
  padding: '{{primitives.space.md}}',
  gap: '{{primitives.space.md}}',
  borderTop: {
    width: '{{primitives.border.width.md}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
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
    padding: '{{primitives.space.md}}',
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
      padding: {
        right: '{{primitives.space.md}}',
      },
    },
    actionIcon: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      icon: {
        size: '{{primitives.icon.md}}',
        width: '1rem',
        height: '1rem',
      },
      padding: {
        left: '{{primitives.space.md}}',
      },
    },
  },

  label: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    padding: '{{primitives.space.md}}',
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
