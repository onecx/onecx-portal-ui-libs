import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { dataviewSettingsDefaults, dataviewSettingsShape } from './settings'
import { dataviewHeaderDefaults, dataviewHeaderShape } from './header'
import { dataviewContentDefaults, dataviewContentShape } from './content'
import { dataviewFooterDefaults, dataviewFooterShape } from './footer'

export const dataviewShape = z.object({
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  settings: dataviewSettingsShape.optional(),
  header: dataviewHeaderShape.optional(),
  content: dataviewContentShape.optional(),
  footer: dataviewFooterShape.optional(),
})

export const dataviewDefaults = {
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  gap: '{{primitives.space.sm}}',
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.border.radius.none}}',
    offset: '{{primitives.border.offset.none}}',
  },
  settings: dataviewSettingsDefaults,
  header: dataviewHeaderDefaults,
  content: dataviewContentDefaults,
  footer: dataviewFooterDefaults,
}

export const dataview = applyDefaultsRecursive(dataviewShape, dataviewDefaults).register(themeSchemaRegistry, {
  id: 'dataview',
})

export class DataviewSchema {
  static readonly schema = dataview
}
