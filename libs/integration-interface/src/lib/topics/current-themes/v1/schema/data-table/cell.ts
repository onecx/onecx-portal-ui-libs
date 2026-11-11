import * as z from 'zod'
import { bg, border, color, font, withRef } from '../primitives'
import {
  defaultBorderTokens,
  fontTokens,
  stateBoxTokens,
  stateTokensShape,
} from './data-table-base-tokens'

/**
 * A cell — the smallest repeating unit. `defaultState` carries the full token
 * set (incl. verticalAlign/truncate); named states only restyle the box.
 */
const cellDefaultStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  font: font.optional(),
  textAlign: withRef(z.string()).optional(),
  verticalAlign: withRef(z.string()).optional(),
  truncate: withRef(z.boolean()).optional(),
})

export const dataTableCellShape = z.object({
  defaultState: cellDefaultStateShape.prefault({}),
  hover: stateTokensShape.prefault({}),
  active: stateTokensShape.prefault({}),
  selected: stateTokensShape.prefault({}),
  focus: stateTokensShape.prefault({}),
})

/**
 * Full cell `defaultState` tokens — the baseline cell a header/footer/body row
 * inherits before any state override.
 */
const cellDefaultStateTokens = {
  background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
  border: defaultBorderTokens,
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  font: fontTokens,
  textAlign: 'left',
}

/**
 * The cell node: a full `defaultState` plus hover/active/selected/focus boxes.
 * `verticalAlign`/`truncate` default on the cell's `defaultState` (the new
 * `data-table` cell additions) and are kept here so the standalone and
 * dataView views resolve identical cell tokens.
 */
export const dataTableCellDefaults = {
  defaultState: {
    ...cellDefaultStateTokens,
    verticalAlign: 'middle',
    truncate: false,
  },
  hover: stateBoxTokens('hover'),
  active: stateBoxTokens('active'),
  selected: stateBoxTokens('selected'),
  focus: stateBoxTokens('focus'),
}
