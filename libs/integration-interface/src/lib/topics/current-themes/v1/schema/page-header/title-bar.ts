import * as z from 'zod'

import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, color, font, icon, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

const titleShape = z.object({
  font: font.pick({ family: true, size: true, weight: true }).optional(),
  padding: withRef(z.string()).optional(),
})

const subtitleShape = z.object({
  font: font.pick({ family: true, size: true, weight: true }).optional(),
  padding: withRef(z.string()).optional(),
})

const titleIconShape = z.object({
  color: color.optional(),
  background: bg.pick({ color: true }).optional(),
  icon: icon
    .pick({ size: true })
    .extend({
      width: withRef(z.string()).optional(),
      height: withRef(z.string()).optional(),
    })
    .prefault({}),
  image: z
    .object({
      size: withRef(z.string()).optional(),
      width: withRef(z.string()).optional(),
      height: withRef(z.string()).optional(),
    })
    .prefault({}),
})

const titleWrapShape = z.object({
  alignItems: withRef(z.string()).optional(),
})

const actionPanelShape = z.object({
  padding: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  alignItems: withRef(z.string()).optional(),
  justifyContent: withRef(z.string()).optional(),
})

export const pageHeaderTitleBarShape = z.object({
  color: color.optional(),
  background: bg.pick({ color: true }).optional(),
  padding: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  title: titleShape.prefault({}),
  subtitle: subtitleShape.prefault({}),
  titleIcon: titleIconShape.prefault({}),
  titleWrap: titleWrapShape.prefault({}),
  actionPanel: actionPanelShape.prefault({}),
})

export const pageHeaderTitleBarDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  background: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
  },
  padding: '{{primitives.space.md}}',
  gap: '{{primitives.space.md}}',
  title: {
    font: {
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    },
    padding: '{{primitives.space.md}}',
  },
  subtitle: {
    font: {
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    },
    padding: '{{primitives.space.md}}',
  },
  titleIcon: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    background: {
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.bg.color}}',
    },
    icon: {
      size: '{{primitives.icon.md}}',
      width: '1rem',
      height: '1rem',
    },
    image: {
      size: '{{primitives.icon.md}}',
      width: '1rem',
      height: '1rem',
    },
  },
  titleWrap: {
    alignItems: 'flex-start',
  },
  actionPanel: {
    padding: '{{primitives.space.md}}',
    gap: '{{primitives.space.md}}',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export const pageHeaderTitleBar = applyDefaultsRecursive(pageHeaderTitleBarShape, pageHeaderTitleBarDefaults).register(
  themeSchemaRegistry,
  {
    id: 'pageHeaderTitleBar',
  }
)

export class PageHeaderTitleBarSchema {
  static readonly schema = pageHeaderTitleBar
}
