export interface ColumnViewTemplate {
  label: string
  template: {
    field: string
    active: boolean
  }[]
}
