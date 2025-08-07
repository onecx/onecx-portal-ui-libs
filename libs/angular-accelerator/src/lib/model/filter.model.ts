export interface ColumnFilterDataSelectOptions {
  reverse: boolean
}

export type FilterObject = { columnId: string; filterType?: FilterType }

export type Filter = FilterObject & { value: unknown }

export enum FilterType {
  ENDS_WITH = 'endsWith',
  STARTS_WITH = 'startsWith',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  LESS_THAN = 'lessThan',
  GREATER_THAN = 'greaterThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
}
