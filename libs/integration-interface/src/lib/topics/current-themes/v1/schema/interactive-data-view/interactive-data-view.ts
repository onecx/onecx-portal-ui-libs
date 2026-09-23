import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import { interactiveDataViewSettingsDefaults, interactiveDataViewSettingsShape } from './settings'
import { interactiveDataViewContainerDefaults, interactiveDataViewContainerShape } from './container'
import { filterViewShape, filterViewDefaults } from './filter-view'
import { dataViewShape, DataViewSchema } from './data-view'
import { dataListGridSortingDefaults, dataListGridSortingShape } from './data-list-grid-sorting/data-list-grid-sorting'
import { selectbutton } from '../selectbutton'
import {
  customGroupColumnSelectorDefaults,
  customGroupColumnSelectorShape,
} from './custom-group-column-selector'

const selectbuttonShape = z.object(selectbutton.shape)

export const interactiveDataViewShape = interactiveDataViewContainerShape.extend({
  settings: interactiveDataViewSettingsShape.optional(),
  selectButton: selectbuttonShape.optional(),
  filterView: filterViewShape.optional(),
  dataListGridSorting: dataListGridSortingShape.optional(),
  customGroupColumnSelector: customGroupColumnSelectorShape.optional(),
  dataView: dataViewShape.optional(),
})

export const interactiveDataViewDefaults = {
  ...interactiveDataViewContainerDefaults,
  settings: interactiveDataViewSettingsDefaults,
  selectButton: selectbutton.parse({}),
  filterView: filterViewDefaults,
  dataListGridSorting: dataListGridSortingDefaults,
  customGroupColumnSelector: customGroupColumnSelectorDefaults,
  dataView: DataViewSchema.schema.parse({}),
}

export const interactiveDataView = applyDefaultsRecursive(
  interactiveDataViewShape,
  interactiveDataViewDefaults
).register(themeSchemaRegistry, { id: 'interactiveDataView' })

export class InteractiveDataViewSchema {
  static readonly schema = interactiveDataView
}
