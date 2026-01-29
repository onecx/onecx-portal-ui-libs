import { DataTableColumn } from '../model/data-table-column.model'
import { Filter, FilterObject } from '../model/filter.model'
import { ObjectUtils } from './objectutils'
import { createLogger } from './logger.utils'

const logger = createLogger('DataOperationStrategy')

/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class DataOperationStrategy {
  endsWith(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('endsWith method not implemented')
    return true
  }

  startsWith(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('startsWith method not implemented')
    return true
  }

  contains(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('contains method not implemented')
    return true
  }

  notContains(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('notContains method not implemented')
    return true
  }

  equals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('equals method not implemented')
    return true
  }

  notEquals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('notEquals method not implemented')
    return true
  }

  lessThan(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('lessThan method not implemented')
    return true
  }

  greaterThan(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('greaterThan method not implemented')
    return true
  }

  lessThanOrEqual(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('lessThanOrEqual method not implemented')
    return true
  }

  greaterThanOrEqual(column: DataTableColumn, value: unknown, target: unknown): boolean {
    logger.error('greaterThanOrEqual method not implemented')
    return true
  }

  isEmpty(column: DataTableColumn, value: unknown): boolean {
    logger.error('isEmpty method not implemented')
    return true
  }

  isNotEmpty(column: DataTableColumn, value: unknown): boolean {
    logger.error('isNotEmpty method not implemented')
    return true
  }

  compare(a: unknown, b: unknown, column: DataTableColumn): number {
    logger.error('compare method not implemented')
    return 0
  }

  filterOptions(hayStack: unknown[], filterObject: FilterObject, columns: DataTableColumn[]): unknown[] {
    const hayStackOptions = hayStack.map((item) => this.mapHaystackItemToValue(item, filterObject))
    const column = columns.find((c) => c.id === filterObject.columnId)
    if (!column) {
      logger.warn('Filter does not have a column id set. All items will be considered a valid option')
      return hayStackOptions
    }
    return hayStackOptions.filter(
      (item, index, self) => index === self.findIndex((t) => this.compare(t, item, column) === 0)
    )
  }

  filter(hayStack: unknown[], filter: Filter, columns: DataTableColumn[]): unknown[] {
    const { filterType, value } = filter
    if (!filterType) {
      logger.warn('Filter does not have a type set. All items will resolve as true')
      return hayStack
    }
    const column = columns.find((c) => c.id === filter.columnId)
    if (!column) {
      logger.warn('Filter does not have a column id set. All items will be considered a valid option')
      return hayStack
    }
    return hayStack.filter((item) => this[filterType](column, this.mapHaystackItemToValue(item, filter), value))
  }

  mapHaystackItemToValue(item: unknown, filter: Filter | FilterObject) {
    return ObjectUtils.resolveFieldData(item, filter.columnId)
  }
}
