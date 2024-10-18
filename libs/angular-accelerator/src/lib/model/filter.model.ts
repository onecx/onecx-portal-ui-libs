export type Filter = { columnId: string; value: unknown; filterType?: FilterType }

export enum FilterType {
  EQUAL = 'EQUAL',
  TRUTHY = 'TRUTHY',
}
