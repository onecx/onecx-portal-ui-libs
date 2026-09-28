/**
 * Shared token shapes and default-token helpers for the DataTable usage.
 *
 * Both the standalone `dataTable` usage and the embedded `dataView.dataTable`
 * read from the same token tree (e.g. `usages.dataTable.row.defaultState.cell`),
 * so the per-state token defaults are defined once here and composed into the
 * per-subcomponent shape/defaults files under `./data-table/`.
 */
import * as z from 'zod'
import { bg, border, color, font, borderWithShadow, withRef } from '../primitives'

/**
 * Default border tokens for a `defaultState` node: color/style come from the
 * `defaultVariant.defaultState` primitive, while width/radius/offset stay
 * `none` (a table row/cell draws no visible box by default).
 */
export const defaultBorderTokens = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

/** Default border tokens for a named state (`hover`/`active`/`selected`/`focus`). */
export const stateBorderTokens = (state: string) => ({
  color: `{{primitives.defaultVariant.state.${state}.defaultSeverity.border.color}}`,
  style: `{{primitives.defaultVariant.state.${state}.defaultSeverity.border.style}}`,
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
})

/** The full font token set (every leaf of the font primitive). */
export const fontTokens = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
}

/**
 * The per-node focus-ring shape. Every per-component focus ring reuses
 * `borderWithShadow`, so `width`/`offset`/`shadow`/`radius` are scalar CSS
 * values (or refs to them).
 */
export const focusRingShape = borderWithShadow

/**
 * Default focus-ring tokens: color/style from the `defaultState` primitive,
 * width/radius/offset/shadow `none`.
 */
export const focusRingTokens = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.focusRing.width.none}}',
  radius: '{{primitives.focusRing.radius.none}}',
  offset: '{{primitives.focusRing.offset.none}}',
  shadow: '{{primitives.focusRing.shadow.none}}',
}

// ---------------------------------------------------------------------------
// Shared shapes — box token sets reused across header/row/footer/cell
// ---------------------------------------------------------------------------

/** A named state that only restyles the box (background/color/border). */
export const stateTokensShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
})

/**
 * The box a row-level node's `defaultState` carries (background/color/border/
 * padding/font/textAlign/height). Shared by header/row/footer/odd/even.
 */
export const rowCellShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  font: font.optional(),
  textAlign: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
})

// ---------------------------------------------------------------------------
// Shared default tokens
// ---------------------------------------------------------------------------

const SURFACE = {
  bg: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
  contrast: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
}

export const stateBg = (state: string) => `{{primitives.defaultVariant.state.${state}.defaultSeverity.bg}}`
export const stateContrast = (state: string) => `{{primitives.defaultVariant.state.${state}.defaultSeverity.contrast}}`

/** Box tokens (background/color/border) for a named state. */
export const stateBoxTokens = (state: string) => ({
  background: stateBg(state),
  color: stateContrast(state),
  border: stateBorderTokens(state),
})

/**
 * The box tokens a row-level node's `defaultState` carries (background/color/
 * border/padding/font/textAlign/height). Shared by header/row/footer/odd/even.
 */
export const rowDefaultStateTokens = {
  background: SURFACE.bg,
  color: SURFACE.contrast,
  border: defaultBorderTokens,
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  font: fontTokens,
  textAlign: 'left',
  height: '2.5rem',
}
