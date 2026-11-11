import { applyDefaultsRecursive } from '../defaults-helper'
import { themeSchemaRegistry } from '../registry'
import { dataviewHeaderDefaults, dataviewHeaderShape } from './header'

export const dataviewFooterShape = dataviewHeaderShape
export const dataviewFooterDefaults = dataviewHeaderDefaults
export const dataviewFooter = applyDefaultsRecursive(dataviewFooterShape, dataviewFooterDefaults).register(
  themeSchemaRegistry,
  { id: 'dataviewFooter' }
)

export class DataviewFooterSchema {
  static readonly schema = dataviewFooter
}
