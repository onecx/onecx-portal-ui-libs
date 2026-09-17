import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export const BUTTON_SEVERITIES = ['success', 'info', 'warning', 'danger', 'contrast'] as const
export type ButtonSeverity = (typeof BUTTON_SEVERITIES)[number]

/** A single (variant, state, severity) leaf token set. */
export const buttonSeverityLeafShape = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    border: borderWithShadow.optional(),
  })
  .register(themeSchemaRegistry, { id: 'buttonSeverityLeafShape' })

/**
 * A full severity group: the severity-less baseline (`defaultSeverity`) plus every
 * named severity as a flat sibling (no `severity` wrapper key — see theme-schema-audit
 * conventions).
 */
export const buttonSeverityGroupShape = z
  .object({
    defaultSeverity: buttonSeverityLeafShape.prefault({}),
    success: buttonSeverityLeafShape.prefault({}),
    info: buttonSeverityLeafShape.prefault({}),
    warning: buttonSeverityLeafShape.prefault({}),
    danger: buttonSeverityLeafShape.prefault({}),
    contrast: buttonSeverityLeafShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'buttonSeverityGroupShape' })

// `border.style` is a single, design-wide token — every component in the schema points its
// border style at the canonical `primitives.defaultVariant.defaultState.defaultSeverity.
// border.style`. The button previously referenced a per-(variant/state/severity) style slot
// that nothing populates, so we set it to the canonical "default border style" once instead of
// repeating a per-leaf default for a value that never varies.
const BORDER_STYLE = '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}'

/**
 * Builds the defaults for one severity group (`defaultSeverity` + 5 named severities),
 * referencing `primitives.<colorPrefix>.<statePath>.<severitySegment>...`.
 *
 * Only the tokens that genuinely vary at this leaf are set: `color` (varies by severity/state)
 * and the shape-level `radius`/`shadow` (passed in; constant within a shape-variant). `style`
 * is the single canonical border style and `width`/`offset` are invariant design tokens, so they
 * are not set per leaf — a theme author may still supply them via the shape (all-optional), but
 * we stop providing a redundant default that never differs between leaves.
 */
export function buttonSeverityGroupDefaults(
  colorPrefix: string,
  statePath: string,
  radius = '{{primitives.radius.md}}',
  shadow = '{{primitives.shadow.none}}'
) {
  const base = `{{primitives.${colorPrefix}.${statePath}`
  const leaf = (severitySegment: string) => ({
    background: `${base}.${severitySegment}.bg}}`,
    color: `${base}.${severitySegment}.contrast}}`,
    border: {
      color: `${base}.${severitySegment}.border.color}}`,
      style: BORDER_STYLE,
      radius,
      shadow,
    },
  })

  return {
    defaultSeverity: leaf('defaultSeverity'),
    ...Object.fromEntries(BUTTON_SEVERITIES.map((severity) => [severity, leaf(`severity.${severity}`)])),
  }
}
