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
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.sm}}',
    })
    .optional(),

  shadow: withRef(z.string()).default("{{primitives.shadow.sm}}").optional(),

  defaultState: inputState
    .default({
      background: "{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}",
      placeholder: {
        color: "{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}",
      },
    })
    .optional(),

  hover: inputState
    .default({
      background: "{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}",
      placeholder: {
        color: "{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}",
      },
      border: {
        color: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}",
        style: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
    })
    .optional(),

  focus: inputState
    .extend({
      ring: inputFocusRing.optional(),
    })
    .default({
      background: "{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}",
        style: "{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
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
      background: "{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}",
      placeholder: {
        color: "{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}",
      },
    })
    .optional(),

  invalid: inputState
    .default({
      background: "{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}",
        style: "{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      placeholder: {
        color: "{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}",
      },
    })
    .optional(),

  sizes: z
    .object({
      sm: inputSize.default({
        fontSize: "{{primitives.font.size}}",
        padding: {
          x: "{{primitives.space.sm}}",
          y: "{{primitives.space.xs}}",
        },
      }),
      lg: inputSize.default({
        fontSize: "{{primitives.font.size}}",
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

    defaultVariant: inputVariant,
    variants: z
      .object({
        filled: inputVariant
          .default({
            defaultState: {
              background: "{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}",
              color: "{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}",
            },
            hover: {
              background: "{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}",
              color: "{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}",
            },
            focus: {
              background: "{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}",
              color: "{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}",
            },
          })
          .optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "input" });