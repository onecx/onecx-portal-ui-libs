import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import {
  buttonFont,
  primaryBorderDefaults,
  primaryFocusRingDefaults,
  primaryButtonHover,
  primaryButtonActive,
  primaryButtonFocus,
  primaryButtonDisabled,
  primaryButtonRounded,
  primaryButtonIconOnly,
  primaryButtonRaised,
  primaryButtonText,
  primaryButtonTextRaised,
  primaryButtonOutlined,
  createButtonSeverityFields,
  smButtonTokens,
  lgButtonTokens,
  mdButtonTokens,
} from './primary'
import { secondaryButton } from './secondary'

/**
 * Button component schema with primary as default (root-level) and secondary as sibling.
 */
export class ButtonSchema {
  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    font: buttonFont as typeof buttonFont,
    border: borderWithShadow.default(primaryBorderDefaults),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    focusRing: borderWithShadow.default(primaryFocusRingDefaults),
    hover: primaryButtonHover.prefault({}),
    active: primaryButtonActive.prefault({}),
    focus: primaryButtonFocus.prefault({}),
    disabled: primaryButtonDisabled.prefault({}),
    rounded: primaryButtonRounded.prefault({}),
    iconOnly: primaryButtonIconOnly.prefault({}),
    raised: primaryButtonRaised.prefault({}),
    text: primaryButtonText.prefault({}),
    textRaised: primaryButtonTextRaised.prefault({}),
    outlined: primaryButtonOutlined.prefault({}),
    ...createButtonSeverityFields('primaryButtonBrandDefault', 'defaultVariant.defaultVariant', 'defaultState'),
    sm: smButtonTokens.prefault({}),
    md: mdButtonTokens.prefault({}),
    lg: lgButtonTokens.prefault({}),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      secondary: secondaryButton.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'button' })
}
