import * as z from 'zod'
import { bg, border, color, font, withRef } from '../primitives'
import { defaultBorderTokens, fontTokens } from './data-table-base-tokens'

/** The table container (stateless). */
export const dataTableBaseShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  font: font.optional(),
  textAlign: withRef(z.string()).optional(),
  borderCollapse: withRef(z.enum(['collapse', 'separate'])).optional(),
  shadow: withRef(z.string()).optional(),
})

/** Column-title font (weight only — the only token this node carries). */
export const dataTableColumnTitleShape = z.object({
  font: font.pick({ weight: true }).prefault({}),
})

/** Table-container (base) defaults. */
export const dataTableBaseDefaults = {
  background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
  border: defaultBorderTokens,
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  font: fontTokens,
  textAlign: 'left',
  borderCollapse: 'separate',
  shadow: '{{primitives.shadow.none}}',
}

export const dataTableColumnTitleDefaults = {
  font: { weight: '{{primitives.font.weight}}' },
}
