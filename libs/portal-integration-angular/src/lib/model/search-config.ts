export type SearchConfigPrimitive = string | number | bigint | boolean | Date | undefined
export interface SearchConfig {
  id: string
  name: string
  page: string
  modificationCount: number
  fieldListVersion: number
  isReadonly: boolean
  isAdvanced: boolean
  columns: Array<string>
  values: { [key: string]: string }
}
