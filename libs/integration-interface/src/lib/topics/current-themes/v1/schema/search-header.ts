import * as z from 'zod'

import { applyDefaultsRecursive } from './defaults-helper'
import { withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { pageHeaderShape, pageHeaderDefaults } from './page-header/index'

const searchHeaderLayoutShape = z.object({
  rowGap: withRef(z.string()).optional(),
  columnGap: withRef(z.string()).optional(),
})

const searchHeaderLayoutDefaults = {
  rowGap: '{{primitives.space.md}}',
  columnGap: '{{primitives.space.md}}',
}

const searchHeaderControlsShape = z.object({
  gap: withRef(z.string()).optional(),
})

const searchHeaderControlsDefaults = {
  gap: '{{primitives.space.md}}',
}

const searchResetPanelShape = z.object({
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  alignItems: withRef(z.string()).optional(),
})

const searchResetPanelDefaults = {
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  alignItems: 'center',
}

export const searchHeaderShape = pageHeaderShape.extend({
  layout: searchHeaderLayoutShape.prefault({}),
  controls: searchHeaderControlsShape.prefault({}),
  searchResetPanel: searchResetPanelShape.prefault({}),
})

export const searchHeaderDefaults = {
  ...pageHeaderDefaults,
  layout: searchHeaderLayoutDefaults,
  controls: searchHeaderControlsDefaults,
  searchResetPanel: searchResetPanelDefaults,
}

export const searchHeader = applyDefaultsRecursive(searchHeaderShape, searchHeaderDefaults).register(
  themeSchemaRegistry,
  {
    id: 'searchHeader',
  }
)
export class SearchHeaderSchema {
  static readonly schema = searchHeader
}