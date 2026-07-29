/**
 * This file defines the schema for button theming.
 */
import * as z from "zod";
import { bg, border, borderWithShadow, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const buttonSettings = z
  .object({
    transition: withRef(z.string()).optional(),
    defaultVariant: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonSettings" });

export const buttonSeverityStyles = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    border: border.optional(),
    focusRing: borderWithShadow.optional(),
    shadow: withRef(z.string()).optional(),
    cursor: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonSeverityStyles" });

export const buttonSeverityVariants = z
  .object({
    secondary: buttonSeverityStyles.optional(),
    success: buttonSeverityStyles.optional(),
    info: buttonSeverityStyles.optional(),
    warning: buttonSeverityStyles.optional(),
    help: buttonSeverityStyles.optional(),
    danger: buttonSeverityStyles.optional(),
    contrast: buttonSeverityStyles.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonSeverityVariants" });

export const buttonSeverityGroup = z
  .object({
    defaultSeverity: buttonSeverityStyles.optional(),
    severity: buttonSeverityVariants.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonSeverityGroup" });

export const buttonStateVariant = z
  .object({
    hover: buttonSeverityGroup.optional(),
    active: buttonSeverityGroup.optional(),
    focus: buttonSeverityGroup.optional(),
    disabled: buttonSeverityGroup.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonStateVariant" });

export const buttonSize = z
  .object({
    fontSize: withRef(z.string()).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    iconOnlyWidth: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonSize" });

export const buttonSizes = z
  .object({
    md: buttonSize
      .default({
        fontSize: "{{primitives.font.size}}",
        paddingX: "{{primitives.space.md}}",
        paddingY: "{{primitives.space.sm}}",
        iconOnlyWidth: "{{primitives.space.lg}}",
      })
      .optional(),
    sm: buttonSize
      .default({
        fontSize: "{{primitives.font.size}}",
        paddingX: "{{primitives.space.sm}}",
        paddingY: "{{primitives.space.xs}}",
        iconOnlyWidth: "{{primitives.space.lg}}",
      })
      .optional(),
    lg: buttonSize
      .default({
        fontSize: "{{primitives.font.size}}",
        paddingX: "{{primitives.space.lg}}",
        paddingY: "{{primitives.space.md}}",
        iconOnlyWidth: "{{primitives.space.xl}}",
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonSizes" });

export const buttonDisplayVariant = z
  .object({
    border: border.optional(),
    layout: z
      .object({
        gap: withRef(z.string()).optional(),
        paddingX: withRef(z.string()).optional(),
        paddingY: withRef(z.string()).optional(),
        iconOnlyWidth: withRef(z.string()).optional(),
      })
      .optional(),
    focusRing: borderWithShadow.optional(),
    text: z
      .object({
        fontWeight: withRef(z.string()).optional(),
        color: color.optional(),
      })
      .optional(),
    icon: z
      .object({
        color: color.optional(),
      })
      .optional(),
    defaultState: buttonSeverityGroup.optional(),
    state: buttonStateVariant.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonDisplayVariant" });

export const buttonTopVariant = z
  .object({
    defaultVariant: buttonDisplayVariant,
    variants: z
      .object({
        text: buttonDisplayVariant.optional(),
        outlined: buttonDisplayVariant.optional(),
        raised: buttonDisplayVariant.optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonTopVariant" });


const buttonDefaultVariant: z.input<typeof buttonTopVariant> = {
  defaultVariant: {
    border: {
      width: "{{primitives.border.width.sm}}",
      radius: "{{primitives.radius.md}}",
    },
    layout: {
      gap: "{{primitives.space.xs}}",
      paddingX: "{{primitives.space.md}}",
      paddingY: "{{primitives.space.sm}}",
      iconOnlyWidth: "{{primitives.space.lg}}",
    },
    focusRing: {
      width: "{{primitives.focusRing.width.sm}}",
      style: "{{primitives.focusRing.style}}",
      color: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.color}}",
      offset: "{{primitives.focusRing.offset.sm}}",
      shadow: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.shadow}}",
    },
    text: {
      fontWeight: "{{primitives.font.weight}}",
    },
    defaultState: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}",
          radius: "{{primitives.radius.md}}",
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.shadow}}",
        },
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        success: {
          background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.success.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        info: {
          background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        warning: {
          background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        help: {
          background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.help.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        danger: {
          background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        contrast: {
          background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
    state: {
      hover: {
        defaultSeverity: {
          background: "{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
      active: {
        defaultSeverity: {
          background: "{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
      focus: {
        defaultSeverity: {
          background: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}",
          },
        },
      },
      disabled: {
        defaultSeverity: {
          background: "{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
  },

  variants: {
    text: {
      border: {
        radius: "{{primitives.radius.md}}",
      },
      layout: {
        gap: "{{primitives.space.xs}}",
        paddingX: "{{primitives.space.md}}",
        paddingY: "{{primitives.space.sm}}",
        iconOnlyWidth: "{{primitives.space.lg}}",
      },
      defaultState: {
        defaultSeverity: {
          background: "{{primitives.defaultVariant.text.defaultState.defaultSeverity.bg}}",
          color: "{{primitives.defaultVariant.text.defaultState.defaultSeverity.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.text.defaultState.defaultSeverity.border.color}}",
            style: "{{primitives.defaultVariant.text.defaultState.defaultSeverity.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
      state: {
        hover: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.text.state.hover.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.text.state.hover.defaultSeverity.contrast}}",
          },
        },
        active: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.text.state.active.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.text.state.active.defaultSeverity.contrast}}",
          },
        },
        focus: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.text.state.focus.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.text.state.focus.defaultSeverity.contrast}}",
            focusRing: {
              width: "{{primitives.focusRing.width.sm}}",
              style: "{{primitives.focusRing.style}}",
              color: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.color}}",
              offset: "{{primitives.focusRing.offset.sm}}",
              shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}",
            },
          },
        },
        disabled: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.text.state.disabled.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.text.state.disabled.defaultSeverity.contrast}}",
          },
        },
      },
    },

    outlined: {
      border: {
        radius: "{{primitives.radius.md}}",
      },
      layout: {
        gap: "{{primitives.space.xs}}",
        paddingX: "{{primitives.space.md}}",
        paddingY: "{{primitives.space.sm}}",
        iconOnlyWidth: "{{primitives.space.lg}}",
      },
      defaultState: {
        defaultSeverity: {
          background: "{{primitives.defaultVariant.outlined.defaultState.defaultSeverity.bg}}",
          color: "{{primitives.defaultVariant.outlined.defaultState.defaultSeverity.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.defaultState.defaultSeverity.border.color}}",
            style: "{{primitives.defaultVariant.outlined.defaultState.defaultSeverity.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
      state: {
        hover: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.outlined.state.hover.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.outlined.state.hover.defaultSeverity.contrast}}",
            border: {
              color: "{{primitives.defaultVariant.outlined.state.hover.defaultSeverity.border.color}}",
              style: "{{primitives.defaultVariant.outlined.state.hover.defaultSeverity.border.style}}",
              width: "{{primitives.border.width.sm}}",
            },
          },
        },
        active: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.outlined.state.active.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.outlined.state.active.defaultSeverity.contrast}}",
            border: {
              color: "{{primitives.defaultVariant.outlined.state.active.defaultSeverity.border.color}}",
              style: "{{primitives.defaultVariant.outlined.state.active.defaultSeverity.border.style}}",
              width: "{{primitives.border.width.sm}}",
            },
          },
        },
        focus: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.outlined.state.focus.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.outlined.state.focus.defaultSeverity.contrast}}",
            focusRing: {
              width: "{{primitives.focusRing.width.sm}}",
              style: "{{primitives.focusRing.style}}",
              color: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.color}}",
              offset: "{{primitives.focusRing.offset.sm}}",
              shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}",
            },
          },
        },
        disabled: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.outlined.state.disabled.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.outlined.state.disabled.defaultSeverity.contrast}}",
            border: {
              color: "{{primitives.defaultVariant.outlined.state.disabled.defaultSeverity.border.color}}",
              style: "{{primitives.defaultVariant.outlined.state.disabled.defaultSeverity.border.style}}",
              width: "{{primitives.border.width.sm}}",
            },
          },
        },
      },
    },

    raised: {
      border: {
        width: "{{primitives.border.width.sm}}",
        radius: "{{primitives.radius.md}}",
      },
      layout: {
        gap: "{{primitives.space.xs}}",
        paddingX: "{{primitives.space.md}}",
        paddingY: "{{primitives.space.sm}}",
        iconOnlyWidth: "{{primitives.space.lg}}",
      },
      defaultState: {
        defaultSeverity: {
          background: "{{primitives.defaultVariant.raised.defaultState.defaultSeverity.bg}}",
          color: "{{primitives.defaultVariant.raised.defaultState.defaultSeverity.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.defaultState.defaultSeverity.border.color}}",
            style: "{{primitives.defaultVariant.raised.defaultState.defaultSeverity.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          shadow: "{{primitives.shadow.md}}",
        },
      },
      state: {
        hover: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.raised.state.hover.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.raised.state.hover.defaultSeverity.contrast}}",
            border: {
              color: "{{primitives.defaultVariant.raised.state.hover.defaultSeverity.border.color}}",
              style: "{{primitives.defaultVariant.raised.state.hover.defaultSeverity.border.style}}",
              width: "{{primitives.border.width.sm}}",
            },
            shadow: "{{primitives.shadow.lg}}",
          },
        },
        active: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.raised.state.active.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.raised.state.active.defaultSeverity.contrast}}",
            border: {
              color: "{{primitives.defaultVariant.raised.state.active.defaultSeverity.border.color}}",
              style: "{{primitives.defaultVariant.raised.state.active.defaultSeverity.border.style}}",
              width: "{{primitives.border.width.sm}}",
            },
          },
        },
        focus: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.contrast}}",
            border: {
              color: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.border.color}}",
              style: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.border.style}}",
              width: "{{primitives.border.width.sm}}",
            },
            focusRing: {
              width: "{{primitives.focusRing.width.sm}}",
              style: "{{primitives.focusRing.style}}",
              color: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.color}}",
              offset: "{{primitives.focusRing.offset.sm}}",
              shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}",
            },
          },
        },
        disabled: {
          defaultSeverity: {
            background: "{{primitives.defaultVariant.raised.state.disabled.defaultSeverity.bg}}",
            color: "{{primitives.defaultVariant.raised.state.disabled.defaultSeverity.contrast}}",
            border: {
              color: "{{primitives.defaultVariant.raised.state.disabled.defaultSeverity.border.color}}",
              style: "{{primitives.defaultVariant.raised.state.disabled.defaultSeverity.border.style}}",
              width: "{{primitives.border.width.sm}}",
            },
          },
        },
      },
    },
  },
};

export const button = z.object({
  settings: (buttonSettings as typeof buttonSettings).optional(),

  sizes: (buttonSizes as typeof buttonSizes).optional(),

  roundedBorderRadius: withRef(z.string()).default("{{primitives.radius.full}}"),
  raisedShadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
  badgeSize: withRef(z.string()).default("{{primitives.space.lg}}"),

  defaultVariant: (buttonTopVariant as typeof buttonTopVariant).default(buttonDefaultVariant),

  variants: z
    .object({
      primary: (buttonTopVariant as typeof buttonTopVariant).optional(),
      secondary: (buttonTopVariant as typeof buttonTopVariant).optional(),
    })
    .optional(),
})
  .register(themeSchemaRegistry, { id: "button" });