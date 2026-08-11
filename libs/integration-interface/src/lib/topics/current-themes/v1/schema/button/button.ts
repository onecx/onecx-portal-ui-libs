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
  primaryButtonRaised,
  primaryButtonText,
  primaryButtonTextRaised,
  primaryButtonOutlined,
  createButtonSeverityFields,
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
    raised: primaryButtonRaised.prefault({}),
    text: primaryButtonText.prefault({}),
    textRaised: primaryButtonTextRaised.prefault({}),
    outlined: primaryButtonOutlined.prefault({}),
    ...createButtonSeverityFields('primaryButtonBrandDefault', 'defaultVariant.defaultVariant', 'defaultState'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      secondary: secondaryButton.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'button' })
}
