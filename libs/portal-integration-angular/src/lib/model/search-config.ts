export type SearchConfigPrimitive = string | number | bigint | boolean | Date | undefined
export interface SearchConfig {
  id: string
  name: string
  fieldListVersion: number
  isReadonly: boolean
  isAdvanced: boolean
  values: Record<string, SearchConfigPrimitive>
}
