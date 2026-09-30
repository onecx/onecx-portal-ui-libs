import { applyDefaultsRecursive } from './defaults-helper'
import { diagramDefaults, diagramShape } from './diagram'
import { themeSchemaRegistry } from './registry'

export const groupByCountDiagramShape = diagramShape.extend({})

export const groupByCountDiagramDefaults = {
  ...diagramDefaults,
}

export const groupByCountDiagram = applyDefaultsRecursive(
  groupByCountDiagramShape,
  groupByCountDiagramDefaults
).register(themeSchemaRegistry, {
  id: 'groupByCountDiagram',
})