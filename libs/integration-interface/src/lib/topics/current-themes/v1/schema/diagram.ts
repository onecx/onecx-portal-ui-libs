import * as z from 'zod'
import { applyDefaultsRecursive } from './defaults-helper'
import { bg, border, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { selectbutton } from './selectbutton'

export const diagramTextShape = z.object({
  font: font.optional(),
})

export const diagramContainerShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  paddingX: withRef(z.string()).default('{{primitives.space.xs}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.xs}}'),
})

export const diagramSelectButtonShape = z.object({
  gap: withRef(z.string()).optional(),
  border: border.optional(),
  paddingX: withRef(z.string()).default('{{primitives.space.xs}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.xs}}'),
})

export const diagramShape = z.object({
  container: diagramContainerShape.optional(),
  header: diagramTextShape.optional(),
  description: diagramTextShape.optional(),
  selectButton: diagramSelectButtonShape.optional(),
  footer: diagramTextShape.optional(),
})

const textDefaults = {
  font: {
    family: '{{primitives.font.family}}',
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
  },
}

export const diagramDefaults = {
  container: {
    background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
    paddingX: '{{primitives.space.xs}}',
    paddingY: '{{primitives.space.xs}}',
  },
  header: textDefaults,
  description: textDefaults,
  selectButton: {
    paddingX: withRef(z.string()).default('{{primitives.space.xs}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.xs}}'),
  },
  footer: textDefaults,
}

export const diagram = applyDefaultsRecursive(diagramShape, diagramDefaults).register(themeSchemaRegistry, {
  id: 'diagram',
})
