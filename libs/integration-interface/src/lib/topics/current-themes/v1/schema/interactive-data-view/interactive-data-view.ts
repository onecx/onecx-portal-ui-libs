import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import { interactiveDataViewSettingsDefaults, interactiveDataViewSettingsShape } from './settings'
import { interactiveDataViewContainerDefaults, interactiveDataViewContainerShape } from './container'
import { filterViewShape, filterViewDefaults } from './filter-view'
import { dataListGridSortingDefaults, dataListGridSortingShape } from './data-list-grid-sorting/data-list-grid-sorting'

export const interactiveDataViewShape = interactiveDataViewContainerShape.extend({
  settings: interactiveDataViewSettingsShape.optional(),
  filterView: filterViewShape.optional(),
  dataListGridSorting: dataListGridSortingShape.optional(),
})

export const interactiveDataViewDefaults = {
  ...interactiveDataViewContainerDefaults,
  settings: interactiveDataViewSettingsDefaults,
  filterView: filterViewDefaults,
  dataListGridSorting: dataListGridSortingDefaults,
}

export const interactiveDataView = applyDefaultsRecursive(
  interactiveDataViewShape,
  interactiveDataViewDefaults
).register(themeSchemaRegistry, { id: 'interactiveDataView' })

export class InteractiveDataViewSchema {
  static readonly schema = interactiveDataView
}
