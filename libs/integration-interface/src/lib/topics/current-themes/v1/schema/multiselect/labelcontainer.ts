import { border, color, font, icon, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { z } from 'zod'
import { MultiselectChipSchema } from './chip'

// TODO: use schema from input component when available
/**
 * Multiselect label container schema that contains selcted items and dropdown icon.
 */
export class MultiselectLabelContainerSchema {
  private static readonly commonTokens = {
    font: font.pick({ weight: true, size: true, style: true }).default({
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
      style: '{{primitives.font.color}}',
    }),
    sm: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.sm}}'),
        font: font.pick({ size: true }).default({
          size: '{{primitives.font.size.sm}}',
        }),
      })
      .optional(),
    lg: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.lg}}'),
        font: font.pick({ size: true }).default({
          size: '{{primitives.font.size.lg}}',
        }),
      })
      .optional(),
  }

  private static readonly commonBorder = {
    width: '{{primitives.border.width.md}}',
    radius: '{{primitives.border.radius.md}}',
    offset: '{{primitives.border.offset.none}}',
  }

  private static readonly commonDropdown = {
    size: '{{primitives.icon.size.sm}}',
    paddingX: '{{primitives.space.sm}}',
    paddingY: '{{primitives.space.sm}}',
  }

  private static readonly commonClearIcon = {
    size: '{{primitives.icon.size.sm}}',
    paddingX: '{{primitives.space.sm}}',
    paddingY: '{{primitives.space.sm}}',
  }

  private static readonly defaultStateTokens = {
    background: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    }),
    dropdownIcon: icon.default({
      ...this.commonDropdown,
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    }),
    clearIcon: icon.default({
      ...this.commonClearIcon,
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    }),
    ...this.commonTokens,
  }

  private static readonly hoverTokens = z.object({
    background: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
    dropdownIcon: icon.default({
      ...this.commonDropdown,
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    }),
    clearIcon: icon.default({
      ...this.commonClearIcon,
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    }),
    ...this.commonTokens,
  })

  private static readonly focusTokens = z.object({
    background: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
    dropdownIcon: icon.default({
      ...this.commonDropdown,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
    }),
    clearIcon: icon.default({
      ...this.commonClearIcon,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
    }),
    ...this.commonTokens,
  })

  private static readonly invalidTokens = z.object({
    background: withRef(z.string()).default('{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
    }),
    dropdownIcon: icon.default({
      ...this.commonDropdown,
      color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
    }),
    clearIcon: icon.default({
      ...this.commonClearIcon,
      color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
    }),
    ...this.commonTokens,
  })

  private static readonly disabledTokens = z.object({
    background: withRef(z.string()).default('{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    }),
    dropdownIcon: icon.default({
      ...this.commonDropdown,
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    }),
    clearIcon: icon.default({
      ...this.commonClearIcon,
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    }),
    ...this.commonTokens,
  })

  static readonly schema = z
    .object({
      chip: (MultiselectChipSchema.schema as typeof MultiselectChipSchema.schema).prefault({}),
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
      invalid: this.invalidTokens.prefault({}),
      disabled: this.disabledTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectLabelContainer' })
}
