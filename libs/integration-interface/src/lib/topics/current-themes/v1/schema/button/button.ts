import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { defaultVariant } from './default-variant'
import {
  buttonFont,
  borderDefaults,
  focusRingDefaults,
  defaultButtonHover,
  defaultButtonActive,
  defaultButtonFocus,
  defaultButtonDisabled,
  defaultButtonRounded,
  defaultButtonIconOnly,
  defaultButtonRaised,
  defaultButtonText,
  defaultButtonTextRaised,
  defaultButtonOutlined,
  createButtonSeverityFields,
  smButtonTokens,
  lgButtonTokens,
  mdButtonTokens,
} from './default'
import { secondaryButton } from './secondary'
import { primaryVariantButton } from './primary-variant'

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
    border: borderWithShadow.default(borderDefaults),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    focusRing: borderWithShadow.default(focusRingDefaults),
    hover: defaultButtonHover.prefault({ severity: {} }),
    active: defaultButtonActive.prefault({ severity: {} }),
    focus: defaultButtonFocus.prefault({ severity: {} }),
    disabled: defaultButtonDisabled.prefault({ severity: {} }),
    rounded: defaultButtonRounded.prefault({ severity: {} }),
    iconOnly: defaultButtonIconOnly.prefault({ severity: {} }),
    raised: defaultButtonRaised.prefault({ severity: {} }),
    text: defaultButtonText.prefault({ severity: {} }),
    textRaised: defaultButtonTextRaised.prefault({ severity: {} }),
    outlined: defaultButtonOutlined.prefault({ severity: {} }),
    ...createButtonSeverityFields('defaultButtonBrandDefault', 'defaultVariant.defaultVariant', 'defaultState'),
    sm: smButtonTokens.prefault({}),
    md: mdButtonTokens.prefault({}),
    lg: lgButtonTokens.prefault({}),
  }

  static readonly schema = z
    .object({
      defaultVariant: defaultVariant.prefault({ severity: {} }),
      primary: primaryVariantButton.prefault({ severity: {} }),
      secondary: secondaryButton.prefault({ severity: {} }),
    })
    .register(themeSchemaRegistry, { id: 'button' })
}
