import * as z from "zod";
import { bg, border, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

const inputPadding = z.object({
  x: withRef(z.string()),
  y: withRef(z.string()),
});

const inputSize = z.object({
  fontSize: withRef(z.string()),
  padding: inputPadding,
});

const inputFocusRing = z.object({
  width: withRef(z.string()).default("{{primitives.focusRing.width}}"),
  style: withRef(z.string()).default("{{primitives.focusRing.style}}"),
  color: color.default("{{primitives.focusRing.color}}"),
  offset: withRef(z.string()).default("{{primitives.focusRing.offset}}"),
  shadow: withRef(z.string()).default("{{primitives.focusRing.shadow}}"),
});

const inputState = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  placeholder: z
    .object({
      color: color,
    })
    .optional(),
  shadow: withRef(z.string()).optional(),
});

const inputVariant = z.object({
  font: z
    .object({
      weight: withRef(z.string()).default("{{primitives.font.weight}}"),
      size: withRef(z.string()).default("{{primitives.font.size}}"),
    })
    .optional(),

  padding: inputPadding
    .default({
      x: "{{primitives.space.md}}",
      y: "{{primitives.space.sm}}",
    })
    .optional(),

  border: border
    .default({
      color: "{{primitives.border.defaultVariant.color}}",
      radius: "{{primitives.radius.md}}",
    })
    .optional(),

  shadow: withRef(z.string()).default("{{primitives.shadow.sm}}").optional(),

  defaultState: inputState
    .default({
      background: "{{primitives.area.surface.defaultState.defaultVariant.bg}}",
      color: "{{primitives.area.surface.defaultState.defaultVariant.contrast}}",
      placeholder: {
        color: "{{primitives.area.surface.defaultState.defaultVariant.contrast}}",
      },
    })
    .optional(),

  hover: inputState
    .default({
      background: "{{primitives.area.surface.hover.defaultVariant.bg}}",
      color: "{{primitives.area.surface.hover.defaultVariant.contrast}}",
      border: {
        color: "{{primitives.border.defaultVariant.color}}",
      },
    })
    .optional(),

  focus: inputState
    .extend({
      ring: inputFocusRing.optional(),
    })
    .default({
      background: "{{primitives.area.surface.focus.defaultVariant.bg}}",
      color: "{{primitives.area.surface.focus.defaultVariant.contrast}}",
      border: {
        color: "{{primitives.border.defaultVariant.color}}",
      },
      ring: {
        width: "{{primitives.focusRing.width}}",
        style: "{{primitives.focusRing.style}}",
        color: "{{primitives.focusRing.color}}",
        offset: "{{primitives.focusRing.offset}}",
        shadow: "{{primitives.focusRing.shadow}}",
      },
    })
    .optional(),

  disabled: inputState
    .default({
      background: "{{primitives.area.surface.disabled.defaultVariant.bg}}",
      color: "{{primitives.area.surface.disabled.defaultVariant.contrast}}",
      placeholder: {
        color: "{{primitives.area.surface.disabled.defaultVariant.contrast}}",
      },
    })
    .optional(),

  invalid: inputState
    .default({
      background: "{{primitives.area.surface.defaultState.defaultVariant.bg}}",
      color: "{{primitives.area.surface.defaultState.defaultVariant.contrast}}",
      border: {
        color: "{{primitives.variant.danger.defaultState.defaultVariant.bg}}",
      },
      placeholder: {
        color: "{{primitives.variant.danger.defaultState.defaultVariant.bg}}",
      },
    })
    .optional(),

  sizes: z
    .object({
      sm: inputSize.default({
        fontSize: "{{primitives.font.size.sm}}",
        padding: {
          x: "{{primitives.space.sm}}",
          y: "{{primitives.space.xs}}",
        },
      }),
      lg: inputSize.default({
        fontSize: "{{primitives.font.size.lg}}",
        padding: {
          x: "{{primitives.space.lg}}",
          y: "{{primitives.space.md}}",
        },
      }),
    })
    .optional(),
});

export const input = z
  .object({
    settings: z
      .object({
        transition: z
          .object({
            duration: withRef(z.string()).default("{{primitives.transition.duration}}"),
          })
          .optional(),
        defaultVariant: withRef(z.string()).default("defaultVariant"),
      })
      .optional(),

    defaultVariant: inputVariant.default({
      font: {
        weight: "{{primitives.font.weight}}",
        size: "{{primitives.font.size}}",
      },
      padding: {
        x: "{{primitives.space.md}}",
        y: "{{primitives.space.sm}}",
      },
    }),

    variants: z
      .object({
        filled: inputVariant
          .default({
            defaultState: {
              background: "{{primitives.area.subtle.defaultState.defaultVariant.bg}}",
              color: "{{primitives.area.subtle.defaultState.defaultVariant.contrast}}",
            },
            hover: {
              background: "{{primitives.area.subtle.hover.defaultVariant.bg}}",
              color: "{{primitives.area.subtle.hover.defaultVariant.contrast}}",
            },
            focus: {
              background: "{{primitives.area.subtle.focus.defaultVariant.bg}}",
              color: "{{primitives.area.subtle.focus.defaultVariant.contrast}}",
            },
          })
          .optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "input" });