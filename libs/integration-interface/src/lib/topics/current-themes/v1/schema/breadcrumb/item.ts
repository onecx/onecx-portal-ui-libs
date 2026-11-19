import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, borderWithShadow, color, font, icon, withRef } from '../primitives'

const breadcrumbItemSeverityShape = z.object({
  color: color.optional(),
  background: bg.pick({ color: true }).optional(),
  border: border.pick({ radius: true, width: true, color: true }).optional(),
  gap: withRef(z.string()).optional(),
  icon: icon.pick({ color: true, size: true }).optional(),
  label: z
    .object({
      font: font.pick({ weight: true, size: true }).optional(),
    })
    .prefault({})
    .optional(),
  focusRing: borderWithShadow.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
})

export class BreadcrumbItemSchema {
  private static readonly defaultSeverityTokens = {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    background: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' },
    border: {
      radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    },
    gap: '{{primitives.space.sm}}',
    icon: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      size: '{{primitives.icon.md}}',
    },
    label: {
      font: {
        weight: '{{primitives.font.weight.normal}}',
        size: '{{primitives.font.size.md}}',
      },
    },
    focusRing: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      width: '{{primitives.focusRing.width.md}}',
      offset: '{{primitives.focusRing.offset.md}}',
      radius: '{{primitives.focusRing.radius.md}}',
      shadow: '{{primitives.focusRing.shadow.md}}',
    },
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
  }

  static readonly itemHover = z.object({
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
    }),
    icon: icon.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    }),
  })

  static readonly itemFocus = z.object({
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
    }),
    icon: icon.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
    }),
  })

  static readonly itemActive = z.object({
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
    }),
    icon: icon.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
    }),
  })

  static readonly itemDisabled = z.object({
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
    }),
    icon: icon.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    }),
  })

  static readonly schema = z
    .object({
      defaultVariant: z
        .object({
          defaultState: z
            .object({
              defaultSeverity: breadcrumbItemSeverityShape.prefault(this.defaultSeverityTokens),
            })
            .prefault({}),
          hover: z
            .object({
              defaultSeverity: breadcrumbItemSeverityShape.prefault({
                background: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}' },
                color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
                border: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}' },
                icon: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}' },
              }),
            })
            .prefault({}),
          focus: z
            .object({
              defaultSeverity: breadcrumbItemSeverityShape.prefault({
                background: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' },
                color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
                border: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}' },
                icon: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}' },
              }),
            })
            .prefault({}),
          active: z
            .object({
              defaultSeverity: breadcrumbItemSeverityShape.prefault({
                background: { color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}' },
                color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
                border: { color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}' },
                icon: { color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}' },
              }),
            })
            .prefault({}),
          disabled: z
            .object({
              defaultSeverity: breadcrumbItemSeverityShape.prefault({
                background: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}' },
                color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
                border: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}' },
                icon: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}' },
              }),
            })
            .prefault({}),
        })
        .register(themeSchemaRegistry, { id: 'breadcrumbItemVariantShape', axis: 'state' })
        .prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'breadcrumbItem', axis: 'variant', child: true })
}
