import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import { interactiveDataViewContainerDefaults, interactiveDataViewContainerShape } from './container'

const filterViewSettingsShape = z.object({
  filterViewEnabled: withRef(z.boolean()).optional(),
  filterViewDisplayMode: withRef(z.enum(['chips', 'button'])).optional(),
  maxDisplayedChips: withRef(z.number()).optional(),
})

export const filterViewShape = interactiveDataViewContainerShape.extend({
  settings: filterViewSettingsShape.optional(),
})

export const filterViewDefaults = {
  ...interactiveDataViewContainerDefaults,
  settings: {
    filterViewEnabled: false,
    filterViewDisplayMode: 'button',
    maxDisplayedChips: 3,
  },
}

export const filterView = applyDefaultsRecursive(filterViewShape, filterViewDefaults).register(themeSchemaRegistry, {
  id: 'filterView',
})

export class FilterViewSchema {
  static readonly schema = filterView
}
