import * as z from 'zod'
import { badge } from '../badge'
import { themeSchemaRegistry } from '../registry'
import { buttonBaselineLeafTokens } from './severity'
import { buttonStatefulDefaults, buttonStatefulShape } from './stateful'
import { buttonIconOnlyDefaults, buttonIconOnlyShape } from './icon-only'
import { lgButtonShape, mdButtonShape, smButtonShape } from './sizes'

/**
 * Maps a usage-schema shape-variant key to the primitives segment it refers to.
 * Every key matches 1:1 except `textRaised`, whose primitives segment is `raisedText`.
 */
const SHAPE_VARIANT_PRIMITIVE_SEGMENT = {
  rounded: 'rounded',
  raised: 'raised',
  text: 'text',
  textRaised: 'raisedText',
  outlined: 'outlined',
} as const

/**
 * One color variant of the button (`defaultVariant` / `primary` / `secondary`).
 *
 * Shape is itself a variant-dependency axis (mirroring how `primitives.ts` distinguishes
 * `<colorPrefix>.defaultVariant...` from `<colorPrefix>.variant.<shape>...`): the "plain" (no
 * shape modifier) button sits under its own `defaultVariant` key, a flat sibling of the named
 * shape variants (`rounded`/`raised`/`text`/`textRaised`/`outlined`/`iconOnly`) — it is never
 * flattened directly onto this object.
 *
 * `badge` is a generic child (PrimeNG's `<p-button>` optionally renders a `<p-badge>`) that
 * extends the standalone `badge` usage verbatim (Option 1) — its own `badgeSeverity` input is
 * independent of the button's color, so all three color variants reuse the exact same
 * self-defaulting `badge` schema/defaults rather than a button-color-parameterized copy.
 */
export const buttonColorVariantShape: z.ZodObject<Record<string, z.ZodTypeAny>> = z
  .object({
    defaultVariant: buttonStatefulShape.prefault({}),
    rounded: buttonStatefulShape.prefault({}),
    raised: buttonStatefulShape.prefault({}),
    text: buttonStatefulShape.prefault({}),
    textRaised: buttonStatefulShape.prefault({}),
    outlined: buttonStatefulShape.prefault({}),
    iconOnly: buttonIconOnlyShape.prefault({}),
    sm: smButtonShape.prefault({}),
    md: mdButtonShape.prefault({}),
    lg: lgButtonShape.prefault({}),
    badge: badge.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'buttonColorVariantShape', axis: 'variant' })

/**
 * The color-independent, self-defaulting leaves of a color variant (`sm`/`md`/`lg`,
 * `badge`). Their values never depend on the color prefix, so they're captured once from the
 * self-defaulting shapes via `.parse({})` — this keeps the defaults tree in lockstep with the
 * shape and is required because the color-variant field is a `.prefault({})`-wrapped object that
 * `applyDefaultsRecursive` applies verbatim: any key absent from this defaults tree would be
 * dropped from `button.parse({})` (its inner `.default()`/`.prefault()` would never run).
 *
 * (The former color-variant-root `font`/`paddingX`/`paddingY`/`focusRing` self-defaults now live
 * on the plain-button baseline leaf — see `buttonBaselineLeafTokens` in `severity.ts`.)
 *
 * Each leaf is captured with the same `.prefault({})` wrapper the shape applies to its field and
 * resolved via `.parse(undefined)` — the exact "empty input" semantics that populate the field,
 * so the captured defaults stay in lockstep with the shape.
 */
const selfDefaultingLeafDefaults = {
  sm: (smButtonShape.prefault({}) as z.ZodTypeAny).parse(undefined),
  md: (mdButtonShape.prefault({}) as z.ZodTypeAny).parse(undefined),
  lg: (lgButtonShape.prefault({}) as z.ZodTypeAny).parse(undefined),
  badge: (badge.prefault({}) as z.ZodTypeAny).parse(undefined),
}

/**
 * Builds the full defaults tree for one color variant, referencing
 * `primitives.<colorPrefix>.defaultVariant...` for the baseline (plain-shape) stateful axis and
 * `primitives.<colorPrefix>.variant.<shape>...` for each named shape variant.
 */
export function buttonColorVariantDefaults(colorPrefix: string) {
  const rootPrefix = `${colorPrefix}.defaultVariant`

  const baseline = buttonStatefulDefaults(rootPrefix)
  // The plain (no shape modifier) button carries the self-defaulting `font`/`paddingX`/`paddingY`/
  // `focusRing` on its baseline leaf — `defaultVariant.defaultState.defaultSeverity` — merged over
  // the baseline's own `background`/`color`/`border` defaults. The named shape variants below do
  // not set these leaf tokens (they remain optional on the shared leaf, like `background`/`color`/
  // `border`).
  baseline.defaultState.defaultSeverity = {
    ...baseline.defaultState.defaultSeverity,
    ...buttonBaselineLeafTokens(colorPrefix),
  }

  return {
    defaultVariant: baseline,
    rounded: buttonStatefulDefaults(
      `${colorPrefix}.variant.${SHAPE_VARIANT_PRIMITIVE_SEGMENT.rounded}`,
      '{{primitives.radius.full}}'
    ),
    raised: buttonStatefulDefaults(
      `${colorPrefix}.variant.${SHAPE_VARIANT_PRIMITIVE_SEGMENT.raised}`,
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
    text: buttonStatefulDefaults(`${colorPrefix}.variant.${SHAPE_VARIANT_PRIMITIVE_SEGMENT.text}`),
    textRaised: buttonStatefulDefaults(
      `${colorPrefix}.variant.${SHAPE_VARIANT_PRIMITIVE_SEGMENT.textRaised}`,
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
    outlined: buttonStatefulDefaults(`${colorPrefix}.variant.${SHAPE_VARIANT_PRIMITIVE_SEGMENT.outlined}`),
    iconOnly: buttonIconOnlyDefaults(colorPrefix),
    sm: selfDefaultingLeafDefaults.sm,
    md: selfDefaultingLeafDefaults.md,
    lg: selfDefaultingLeafDefaults.lg,
    badge: selfDefaultingLeafDefaults.badge,
  }
}
