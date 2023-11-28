export interface SearchConfig {
  id: string
  name: string
  version: number
  readonly: boolean
  isAdvanced: boolean
  values: Record<string, string>
}
