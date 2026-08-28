import z from 'zod'
import { withRef } from './primitives'
import { PageHeaderSchema } from './page-header/index'

export class SearchHeaderSchema {
  static readonly layout = z.object({
    rowGap: withRef(z.string()).default('{{primitives.space.md}}'),
    columnGap: withRef(z.string()).default('{{primitives.space.md}}'),
  })

  static readonly controls = z.object({
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
  })

  static readonly searchResetPanel = z.object({
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    alignItems: withRef(z.string()).default('center'),
  })

  static readonly schema = PageHeaderSchema.schema.extend({
    layout: this.layout.prefault({}),
    controls: this.controls.prefault({}),
    searchResetPanel: this.searchResetPanel.prefault({}),
  })
}

export const searchHeader = SearchHeaderSchema.schema.prefault({})
