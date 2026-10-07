import * as z from 'zod'
import { bg, borderWithShadow, color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export const BUTTON_SEVERITIES = ['success', 'info', 'help', 'warning', 'danger', 'contrast'] as const
export type ButtonSeverity = (typeof BUTTON_SEVERITIES)[number]

/**
 * Font for the button component — excludes family and size (set globally/individually).
 *
 * Defined here (in the leaf module) rather than in `color-variant.ts` so the shared
 * `buttonSeverityLeafShape` can reference it at module-evaluation time without creating a
 * `color-variant → stateful → severity → color-variant` import cycle (which would leave this
 * `const` in the TDZ when `severity.ts`'s top-level leaf shape runs).
 */
export const buttonFont = font.omit({ family: true, size: true }).default({
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
})

/** A single (variant, state, severity) leaf token set. */
export const buttonSeverityLeafShape = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    border: borderWithShadow.optional(),
    font: buttonFont.optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    focusRing: borderWithShadow.optional(),
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
    help: buttonSeverityLeafShape.prefault({}),
    warning: buttonSeverityLeafShape.prefault({}),
    danger: buttonSeverityLeafShape.prefault({}),
    contrast: buttonSeverityLeafShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'buttonSeverityGroupShape', axis: 'severity' })

// `border.style` is a single, design-wide token — every component in the schema points its
// border style at the canonical `primitives.defaultVariant.defaultState.defaultSeverity.
// border.style`. The button previously referenced a per-(variant/state/severity) style slot
// that nothing populates, so we set it to the canonical "default border style" once instead of
// repeating a per-leaf default for a value that never varies.
const BORDER_STYLE = '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}'

/**
 * Builds the defaults for one severity group (`defaultSeverity` + 6 named severities),
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

/**
 * The self-defaulting leaf tokens for the plain (no shape modifier) button baseline —
 * `font`/`paddingX`/`paddingY`/`focusRing`. These land on
 * `<colorVariant>.defaultVariant.defaultState.defaultSeverity` and are the **only** place
 * defaulted; the named shape variants expose the same keys (via the shared leaf) but leave
 * them unset.
 *
 * `font` is captured in lockstep with the shape via `.parse(undefined)` (the "empty input"
 * semantics), mirroring how the color-variant previously self-defaulted its root `font`.
 */
export function buttonBaselineLeafTokens(colorPrefix: string) {
  const rootPrefix = `${colorPrefix}.defaultVariant`
  return {
    font: (buttonFont as z.ZodTypeAny).parse(undefined),
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.sm}}',
    // Only the focus-ring tokens that vary per variant are set; `radius`/`shadow` are not
    // focus-ring-specific design tokens (the ring inherits the variant's radius/shadow) and
    // nothing downstream reads focusRing.radius/focusRing.shadow, so they're left unset.
    focusRing: {
      color: `{{primitives.${rootPrefix}.defaultState.defaultSeverity.focusRing.color}}`,
      style: `{{primitives.${rootPrefix}.defaultState.defaultSeverity.focusRing.style}}`,
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
    },
  }
}
