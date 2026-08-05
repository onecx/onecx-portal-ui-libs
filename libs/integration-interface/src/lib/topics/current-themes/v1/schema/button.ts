/**
 * This file defines the schema for button theming.
 */
import * as z from "zod";
import { bg, border, borderWithShadow, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const buttonTransition = z
  .object({
    duration: withRef(z.string()).default("{{primitives.transition.duration}}"),
  })
  .register(themeSchemaRegistry, { id: "buttonTransition" });

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
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    border: border.optional(),
    focusRing: borderWithShadow.optional(),
    shadow: withRef(z.string()).optional(),
    cursor: withRef(z.string()).optional(),
    severity: buttonSeverityVariants.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonSeverityGroup" });

export const buttonLinkState = z
  .object({
    color: color.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonLinkState" });

export const buttonLinkVariant = z
  .object({
    color: color.optional(),
    hover: buttonLinkState.optional(),
    active: buttonLinkState.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonLinkVariant" });

/** Default values for the link button variant. */
export const buttonLinkDefaults = {
  color: "{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}",
  hover: {
    color: "{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}",
  },
  active: {
    color: "{{primitives.variant.primary.state.active.defaultSeverity.contrast}}",
  },
};

/** Default values for the text button variant. */
export const buttonTextVariantDefaults = {
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
    background: "{{primitives.variant.secondary.defaultState.defaultSeverity.bg}}",
    color: "{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}",
    severity: {
      secondary: {
        background: "{{primitives.variant.secondary.defaultState.severity.secondary.bg}}",
        color: "{{primitives.variant.secondary.defaultState.severity.secondary.contrast}}",
      },
      success: {
        background: "{{primitives.variant.secondary.defaultState.severity.success.bg}}",
        color: "{{primitives.variant.secondary.defaultState.severity.success.contrast}}",
      },
      info: {
        background: "{{primitives.variant.secondary.defaultState.severity.info.bg}}",
        color: "{{primitives.variant.secondary.defaultState.severity.info.contrast}}",
      },
      warning: {
        background: "{{primitives.variant.secondary.defaultState.severity.warning.bg}}",
        color: "{{primitives.variant.secondary.defaultState.severity.warning.contrast}}",
      },
      help: {
        background: "{{primitives.variant.secondary.defaultState.severity.help.bg}}",
        color: "{{primitives.variant.secondary.defaultState.severity.help.contrast}}",
      },
      danger: {
        background: "{{primitives.variant.secondary.defaultState.severity.danger.bg}}",
        color: "{{primitives.variant.secondary.defaultState.severity.danger.contrast}}",
      },
      contrast: {
        background: "{{primitives.variant.secondary.defaultState.severity.contrast.bg}}",
        color: "{{primitives.variant.secondary.defaultState.severity.contrast.contrast}}",
      },
    },
  },
  state: {
    hover: {
      background: "{{primitives.variant.secondary.state.hover.defaultSeverity.bg}}",
      color: "{{primitives.variant.secondary.state.hover.defaultSeverity.contrast}}",
      severity: {
        secondary: {
          background: "{{primitives.variant.secondary.state.hover.severity.secondary.bg}}",
          color: "{{primitives.variant.secondary.state.hover.severity.secondary.contrast}}",
        },
        success: {
          background: "{{primitives.variant.secondary.state.hover.severity.success.bg}}",
          color: "{{primitives.variant.secondary.state.hover.severity.success.contrast}}",
        },
        info: {
          background: "{{primitives.variant.secondary.state.hover.severity.info.bg}}",
          color: "{{primitives.variant.secondary.state.hover.severity.info.contrast}}",
        },
        warning: {
          background: "{{primitives.variant.secondary.state.hover.severity.warning.bg}}",
          color: "{{primitives.variant.secondary.state.hover.severity.warning.contrast}}",
        },
        help: {
          background: "{{primitives.variant.secondary.state.hover.severity.help.bg}}",
          color: "{{primitives.variant.secondary.state.hover.severity.help.contrast}}",
        },
        danger: {
          background: "{{primitives.variant.secondary.state.hover.severity.danger.bg}}",
          color: "{{primitives.variant.secondary.state.hover.severity.danger.contrast}}",
        },
        contrast: {
          background: "{{primitives.variant.secondary.state.hover.severity.contrast.bg}}",
          color: "{{primitives.variant.secondary.state.hover.severity.contrast.contrast}}",
        },
      },
    },
    active: {
      background: "{{primitives.variant.secondary.state.active.defaultSeverity.bg}}",
      color: "{{primitives.variant.secondary.state.active.defaultSeverity.contrast}}",
      severity: {
        secondary: {
          background: "{{primitives.variant.secondary.state.active.severity.secondary.bg}}",
          color: "{{primitives.variant.secondary.state.active.severity.secondary.contrast}}",
        },
        success: {
          background: "{{primitives.variant.secondary.state.active.severity.success.bg}}",
          color: "{{primitives.variant.secondary.state.active.severity.success.contrast}}",
        },
        info: {
          background: "{{primitives.variant.secondary.state.active.severity.info.bg}}",
          color: "{{primitives.variant.secondary.state.active.severity.info.contrast}}",
        },
        warning: {
          background: "{{primitives.variant.secondary.state.active.severity.warning.bg}}",
          color: "{{primitives.variant.secondary.state.active.severity.warning.contrast}}",
        },
        help: {
          background: "{{primitives.variant.secondary.state.active.severity.help.bg}}",
          color: "{{primitives.variant.secondary.state.active.severity.help.contrast}}",
        },
        danger: {
          background: "{{primitives.variant.secondary.state.active.severity.danger.bg}}",
          color: "{{primitives.variant.secondary.state.active.severity.danger.contrast}}",
        },
        contrast: {
          background: "{{primitives.variant.secondary.state.active.severity.contrast.bg}}",
          color: "{{primitives.variant.secondary.state.active.severity.contrast.contrast}}",
        },
      },
    },
    focus: {
      background: "{{primitives.variant.secondary.state.focus.defaultSeverity.bg}}",
      color: "{{primitives.variant.secondary.state.focus.defaultSeverity.contrast}}",
      focusRing: {
        width: "{{primitives.focusRing.width.sm}}",
        style: "{{primitives.focusRing.style}}",
        color: "{{primitives.variant.secondary.state.focus.defaultSeverity.focusRing.color}}",
        offset: "{{primitives.focusRing.offset.sm}}",
        shadow: "{{primitives.variant.secondary.state.focus.defaultSeverity.focusRing.shadow}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.secondary.state.focus.severity.secondary.bg}}",
          color: "{{primitives.variant.secondary.state.focus.severity.secondary.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.secondary.state.focus.severity.secondary.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.secondary.state.focus.severity.secondary.focusRing.shadow}}",
          },
        },
        success: {
          background: "{{primitives.variant.secondary.state.focus.severity.success.bg}}",
          color: "{{primitives.variant.secondary.state.focus.severity.success.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.secondary.state.focus.severity.success.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.secondary.state.focus.severity.success.focusRing.shadow}}",
          },
        },
        info: {
          background: "{{primitives.variant.secondary.state.focus.severity.info.bg}}",
          color: "{{primitives.variant.secondary.state.focus.severity.info.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.secondary.state.focus.severity.info.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.secondary.state.focus.severity.info.focusRing.shadow}}",
          },
        },
        warning: {
          background: "{{primitives.variant.secondary.state.focus.severity.warning.bg}}",
          color: "{{primitives.variant.secondary.state.focus.severity.warning.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.secondary.state.focus.severity.warning.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.secondary.state.focus.severity.warning.focusRing.shadow}}",
          },
        },
        help: {
          background: "{{primitives.variant.secondary.state.focus.severity.help.bg}}",
          color: "{{primitives.variant.secondary.state.focus.severity.help.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.secondary.state.focus.severity.help.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.secondary.state.focus.severity.help.focusRing.shadow}}",
          },
        },
        danger: {
          background: "{{primitives.variant.secondary.state.focus.severity.danger.bg}}",
          color: "{{primitives.variant.secondary.state.focus.severity.danger.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.secondary.state.focus.severity.danger.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.secondary.state.focus.severity.danger.focusRing.shadow}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.secondary.state.focus.severity.contrast.bg}}",
          color: "{{primitives.variant.secondary.state.focus.severity.contrast.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.secondary.state.focus.severity.contrast.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.secondary.state.focus.severity.contrast.focusRing.shadow}}",
          },
        },
      },
    },
    disabled: {
      background: "{{primitives.variant.secondary.state.disabled.defaultSeverity.bg}}",
      color: "{{primitives.variant.secondary.state.disabled.defaultSeverity.contrast}}",
      severity: {
        secondary: {
          background: "{{primitives.variant.secondary.state.disabled.severity.secondary.bg}}",
          color: "{{primitives.variant.secondary.state.disabled.severity.secondary.contrast}}",
        },
        success: {
          background: "{{primitives.variant.secondary.state.disabled.severity.success.bg}}",
          color: "{{primitives.variant.secondary.state.disabled.severity.success.contrast}}",
        },
        info: {
          background: "{{primitives.variant.secondary.state.disabled.severity.info.bg}}",
          color: "{{primitives.variant.secondary.state.disabled.severity.info.contrast}}",
        },
        warning: {
          background: "{{primitives.variant.secondary.state.disabled.severity.warning.bg}}",
          color: "{{primitives.variant.secondary.state.disabled.severity.warning.contrast}}",
        },
        help: {
          background: "{{primitives.variant.secondary.state.disabled.severity.help.bg}}",
          color: "{{primitives.variant.secondary.state.disabled.severity.help.contrast}}",
        },
        danger: {
          background: "{{primitives.variant.secondary.state.disabled.severity.danger.bg}}",
          color: "{{primitives.variant.secondary.state.disabled.severity.danger.contrast}}",
        },
        contrast: {
          background: "{{primitives.variant.secondary.state.disabled.severity.contrast.bg}}",
          color: "{{primitives.variant.secondary.state.disabled.severity.contrast.contrast}}",
        },
      },
    },
  },
};

/** Default values for the outlined button variant. */
export const buttonOutlinedDefaults = {
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
    background: "{{primitives.variant.tertiary.defaultState.defaultSeverity.bg}}",
    color: "{{primitives.variant.tertiary.defaultState.defaultSeverity.contrast}}",
    border: {
      color: "{{primitives.variant.tertiary.defaultState.defaultSeverity.border.color}}",
      style: "{{primitives.variant.tertiary.defaultState.defaultSeverity.border.style}}",
      width: "{{primitives.border.width.sm}}",
    },
    severity: {
      secondary: {
        background: "{{primitives.variant.tertiary.defaultState.severity.secondary.bg}}",
        color: "{{primitives.variant.tertiary.defaultState.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.variant.tertiary.defaultState.severity.secondary.border.color}}",
          style: "{{primitives.variant.tertiary.defaultState.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      success: {
        background: "{{primitives.variant.tertiary.defaultState.severity.success.bg}}",
        color: "{{primitives.variant.tertiary.defaultState.severity.success.contrast}}",
        border: {
          color: "{{primitives.variant.tertiary.defaultState.severity.success.border.color}}",
          style: "{{primitives.variant.tertiary.defaultState.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      info: {
        background: "{{primitives.variant.tertiary.defaultState.severity.info.bg}}",
        color: "{{primitives.variant.tertiary.defaultState.severity.info.contrast}}",
        border: {
          color: "{{primitives.variant.tertiary.defaultState.severity.info.border.color}}",
          style: "{{primitives.variant.tertiary.defaultState.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      warning: {
        background: "{{primitives.variant.tertiary.defaultState.severity.warning.bg}}",
        color: "{{primitives.variant.tertiary.defaultState.severity.warning.contrast}}",
        border: {
          color: "{{primitives.variant.tertiary.defaultState.severity.warning.border.color}}",
          style: "{{primitives.variant.tertiary.defaultState.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      help: {
        background: "{{primitives.variant.tertiary.defaultState.severity.help.bg}}",
        color: "{{primitives.variant.tertiary.defaultState.severity.help.contrast}}",
        border: {
          color: "{{primitives.variant.tertiary.defaultState.severity.help.border.color}}",
          style: "{{primitives.variant.tertiary.defaultState.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      danger: {
        background: "{{primitives.variant.tertiary.defaultState.severity.danger.bg}}",
        color: "{{primitives.variant.tertiary.defaultState.severity.danger.contrast}}",
        border: {
          color: "{{primitives.variant.tertiary.defaultState.severity.danger.border.color}}",
          style: "{{primitives.variant.tertiary.defaultState.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      contrast: {
        background: "{{primitives.variant.tertiary.defaultState.severity.contrast.bg}}",
        color: "{{primitives.variant.tertiary.defaultState.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.variant.tertiary.defaultState.severity.contrast.border.color}}",
          style: "{{primitives.variant.tertiary.defaultState.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
    },
  },
  state: {
    hover: {
      background: "{{primitives.variant.tertiary.state.hover.defaultSeverity.bg}}",
      color: "{{primitives.variant.tertiary.state.hover.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.tertiary.state.hover.defaultSeverity.border.color}}",
        style: "{{primitives.variant.tertiary.state.hover.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.tertiary.state.hover.severity.secondary.bg}}",
          color: "{{primitives.variant.tertiary.state.hover.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.hover.severity.secondary.border.color}}",
            style: "{{primitives.variant.tertiary.state.hover.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        success: {
          background: "{{primitives.variant.tertiary.state.hover.severity.success.bg}}",
          color: "{{primitives.variant.tertiary.state.hover.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.hover.severity.success.border.color}}",
            style: "{{primitives.variant.tertiary.state.hover.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        info: {
          background: "{{primitives.variant.tertiary.state.hover.severity.info.bg}}",
          color: "{{primitives.variant.tertiary.state.hover.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.hover.severity.info.border.color}}",
            style: "{{primitives.variant.tertiary.state.hover.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        warning: {
          background: "{{primitives.variant.tertiary.state.hover.severity.warning.bg}}",
          color: "{{primitives.variant.tertiary.state.hover.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.hover.severity.warning.border.color}}",
            style: "{{primitives.variant.tertiary.state.hover.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        help: {
          background: "{{primitives.variant.tertiary.state.hover.severity.help.bg}}",
          color: "{{primitives.variant.tertiary.state.hover.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.hover.severity.help.border.color}}",
            style: "{{primitives.variant.tertiary.state.hover.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        danger: {
          background: "{{primitives.variant.tertiary.state.hover.severity.danger.bg}}",
          color: "{{primitives.variant.tertiary.state.hover.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.hover.severity.danger.border.color}}",
            style: "{{primitives.variant.tertiary.state.hover.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.tertiary.state.hover.severity.contrast.bg}}",
          color: "{{primitives.variant.tertiary.state.hover.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.hover.severity.contrast.border.color}}",
            style: "{{primitives.variant.tertiary.state.hover.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
    active: {
      background: "{{primitives.variant.tertiary.state.active.defaultSeverity.bg}}",
      color: "{{primitives.variant.tertiary.state.active.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.tertiary.state.active.defaultSeverity.border.color}}",
        style: "{{primitives.variant.tertiary.state.active.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.tertiary.state.active.severity.secondary.bg}}",
          color: "{{primitives.variant.tertiary.state.active.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.active.severity.secondary.border.color}}",
            style: "{{primitives.variant.tertiary.state.active.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        success: {
          background: "{{primitives.variant.tertiary.state.active.severity.success.bg}}",
          color: "{{primitives.variant.tertiary.state.active.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.active.severity.success.border.color}}",
            style: "{{primitives.variant.tertiary.state.active.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        info: {
          background: "{{primitives.variant.tertiary.state.active.severity.info.bg}}",
          color: "{{primitives.variant.tertiary.state.active.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.active.severity.info.border.color}}",
            style: "{{primitives.variant.tertiary.state.active.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        warning: {
          background: "{{primitives.variant.tertiary.state.active.severity.warning.bg}}",
          color: "{{primitives.variant.tertiary.state.active.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.active.severity.warning.border.color}}",
            style: "{{primitives.variant.tertiary.state.active.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        help: {
          background: "{{primitives.variant.tertiary.state.active.severity.help.bg}}",
          color: "{{primitives.variant.tertiary.state.active.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.active.severity.help.border.color}}",
            style: "{{primitives.variant.tertiary.state.active.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        danger: {
          background: "{{primitives.variant.tertiary.state.active.severity.danger.bg}}",
          color: "{{primitives.variant.tertiary.state.active.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.active.severity.danger.border.color}}",
            style: "{{primitives.variant.tertiary.state.active.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.tertiary.state.active.severity.contrast.bg}}",
          color: "{{primitives.variant.tertiary.state.active.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.active.severity.contrast.border.color}}",
            style: "{{primitives.variant.tertiary.state.active.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
    focus: {
      background: "{{primitives.variant.tertiary.state.focus.defaultSeverity.bg}}",
      color: "{{primitives.variant.tertiary.state.focus.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.tertiary.state.focus.defaultSeverity.border.color}}",
        style: "{{primitives.variant.tertiary.state.focus.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      focusRing: {
        width: "{{primitives.focusRing.width.sm}}",
        style: "{{primitives.focusRing.style}}",
        color: "{{primitives.variant.tertiary.state.focus.defaultSeverity.focusRing.color}}",
        offset: "{{primitives.focusRing.offset.sm}}",
        shadow: "{{primitives.variant.tertiary.state.focus.defaultSeverity.focusRing.shadow}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.tertiary.state.focus.severity.secondary.bg}}",
          color: "{{primitives.variant.tertiary.state.focus.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.focus.severity.secondary.border.color}}",
            style: "{{primitives.variant.tertiary.state.focus.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.tertiary.state.focus.severity.secondary.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.tertiary.state.focus.severity.secondary.focusRing.shadow}}",
          },
        },
        success: {
          background: "{{primitives.variant.tertiary.state.focus.severity.success.bg}}",
          color: "{{primitives.variant.tertiary.state.focus.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.focus.severity.success.border.color}}",
            style: "{{primitives.variant.tertiary.state.focus.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.tertiary.state.focus.severity.success.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.tertiary.state.focus.severity.success.focusRing.shadow}}",
          },
        },
        info: {
          background: "{{primitives.variant.tertiary.state.focus.severity.info.bg}}",
          color: "{{primitives.variant.tertiary.state.focus.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.focus.severity.info.border.color}}",
            style: "{{primitives.variant.tertiary.state.focus.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.tertiary.state.focus.severity.info.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.tertiary.state.focus.severity.info.focusRing.shadow}}",
          },
        },
        warning: {
          background: "{{primitives.variant.tertiary.state.focus.severity.warning.bg}}",
          color: "{{primitives.variant.tertiary.state.focus.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.focus.severity.warning.border.color}}",
            style: "{{primitives.variant.tertiary.state.focus.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.tertiary.state.focus.severity.warning.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.tertiary.state.focus.severity.warning.focusRing.shadow}}",
          },
        },
        help: {
          background: "{{primitives.variant.tertiary.state.focus.severity.help.bg}}",
          color: "{{primitives.variant.tertiary.state.focus.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.focus.severity.help.border.color}}",
            style: "{{primitives.variant.tertiary.state.focus.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.tertiary.state.focus.severity.help.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.tertiary.state.focus.severity.help.focusRing.shadow}}",
          },
        },
        danger: {
          background: "{{primitives.variant.tertiary.state.focus.severity.danger.bg}}",
          color: "{{primitives.variant.tertiary.state.focus.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.focus.severity.danger.border.color}}",
            style: "{{primitives.variant.tertiary.state.focus.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.tertiary.state.focus.severity.danger.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.tertiary.state.focus.severity.danger.focusRing.shadow}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.tertiary.state.focus.severity.contrast.bg}}",
          color: "{{primitives.variant.tertiary.state.focus.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.focus.severity.contrast.border.color}}",
            style: "{{primitives.variant.tertiary.state.focus.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.tertiary.state.focus.severity.contrast.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.tertiary.state.focus.severity.contrast.focusRing.shadow}}",
          },
        },
      },
    },
    disabled: {
      background: "{{primitives.variant.tertiary.state.disabled.defaultSeverity.bg}}",
      color: "{{primitives.variant.tertiary.state.disabled.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.tertiary.state.disabled.defaultSeverity.border.color}}",
        style: "{{primitives.variant.tertiary.state.disabled.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.tertiary.state.disabled.severity.secondary.bg}}",
          color: "{{primitives.variant.tertiary.state.disabled.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.disabled.severity.secondary.border.color}}",
            style: "{{primitives.variant.tertiary.state.disabled.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        success: {
          background: "{{primitives.variant.tertiary.state.disabled.severity.success.bg}}",
          color: "{{primitives.variant.tertiary.state.disabled.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.disabled.severity.success.border.color}}",
            style: "{{primitives.variant.tertiary.state.disabled.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        info: {
          background: "{{primitives.variant.tertiary.state.disabled.severity.info.bg}}",
          color: "{{primitives.variant.tertiary.state.disabled.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.disabled.severity.info.border.color}}",
            style: "{{primitives.variant.tertiary.state.disabled.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        warning: {
          background: "{{primitives.variant.tertiary.state.disabled.severity.warning.bg}}",
          color: "{{primitives.variant.tertiary.state.disabled.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.disabled.severity.warning.border.color}}",
            style: "{{primitives.variant.tertiary.state.disabled.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        help: {
          background: "{{primitives.variant.tertiary.state.disabled.severity.help.bg}}",
          color: "{{primitives.variant.tertiary.state.disabled.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.disabled.severity.help.border.color}}",
            style: "{{primitives.variant.tertiary.state.disabled.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        danger: {
          background: "{{primitives.variant.tertiary.state.disabled.severity.danger.bg}}",
          color: "{{primitives.variant.tertiary.state.disabled.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.disabled.severity.danger.border.color}}",
            style: "{{primitives.variant.tertiary.state.disabled.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.tertiary.state.disabled.severity.contrast.bg}}",
          color: "{{primitives.variant.tertiary.state.disabled.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.tertiary.state.disabled.severity.contrast.border.color}}",
            style: "{{primitives.variant.tertiary.state.disabled.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
  },
};

/** Default values for the rounded button variant. */
export const buttonRoundedDefaults = {
  border: {
    width: "{{primitives.border.width.sm}}",
    radius: "{{primitives.radius.full}}",
  },
  layout: {
    gap: "{{primitives.space.xs}}",
    paddingX: "{{primitives.space.md}}",
    paddingY: "{{primitives.space.sm}}",
    iconOnlyWidth: "{{primitives.space.lg}}",
  },
  defaultState: {
    background: "{{primitives.variant.quaternary.defaultState.defaultSeverity.bg}}",
    color: "{{primitives.variant.quaternary.defaultState.defaultSeverity.contrast}}",
    border: {
      color: "{{primitives.variant.quaternary.defaultState.defaultSeverity.border.color}}",
      style: "{{primitives.variant.quaternary.defaultState.defaultSeverity.border.style}}",
      width: "{{primitives.border.width.sm}}",
    },
    severity: {
      secondary: {
        background: "{{primitives.variant.quaternary.defaultState.severity.secondary.bg}}",
        color: "{{primitives.variant.quaternary.defaultState.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.variant.quaternary.defaultState.severity.secondary.border.color}}",
          style: "{{primitives.variant.quaternary.defaultState.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      success: {
        background: "{{primitives.variant.quaternary.defaultState.severity.success.bg}}",
        color: "{{primitives.variant.quaternary.defaultState.severity.success.contrast}}",
        border: {
          color: "{{primitives.variant.quaternary.defaultState.severity.success.border.color}}",
          style: "{{primitives.variant.quaternary.defaultState.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      info: {
        background: "{{primitives.variant.quaternary.defaultState.severity.info.bg}}",
        color: "{{primitives.variant.quaternary.defaultState.severity.info.contrast}}",
        border: {
          color: "{{primitives.variant.quaternary.defaultState.severity.info.border.color}}",
          style: "{{primitives.variant.quaternary.defaultState.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      warning: {
        background: "{{primitives.variant.quaternary.defaultState.severity.warning.bg}}",
        color: "{{primitives.variant.quaternary.defaultState.severity.warning.contrast}}",
        border: {
          color: "{{primitives.variant.quaternary.defaultState.severity.warning.border.color}}",
          style: "{{primitives.variant.quaternary.defaultState.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      help: {
        background: "{{primitives.variant.quaternary.defaultState.severity.help.bg}}",
        color: "{{primitives.variant.quaternary.defaultState.severity.help.contrast}}",
        border: {
          color: "{{primitives.variant.quaternary.defaultState.severity.help.border.color}}",
          style: "{{primitives.variant.quaternary.defaultState.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      danger: {
        background: "{{primitives.variant.quaternary.defaultState.severity.danger.bg}}",
        color: "{{primitives.variant.quaternary.defaultState.severity.danger.contrast}}",
        border: {
          color: "{{primitives.variant.quaternary.defaultState.severity.danger.border.color}}",
          style: "{{primitives.variant.quaternary.defaultState.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      contrast: {
        background: "{{primitives.variant.quaternary.defaultState.severity.contrast.bg}}",
        color: "{{primitives.variant.quaternary.defaultState.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.variant.quaternary.defaultState.severity.contrast.border.color}}",
          style: "{{primitives.variant.quaternary.defaultState.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
    },
  },
  state: {
    hover: {
      background: "{{primitives.variant.quaternary.state.hover.defaultSeverity.bg}}",
      color: "{{primitives.variant.quaternary.state.hover.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.quaternary.state.hover.defaultSeverity.border.color}}",
        style: "{{primitives.variant.quaternary.state.hover.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.quaternary.state.hover.severity.secondary.bg}}",
          color: "{{primitives.variant.quaternary.state.hover.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.hover.severity.secondary.border.color}}",
            style: "{{primitives.variant.quaternary.state.hover.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        success: {
          background: "{{primitives.variant.quaternary.state.hover.severity.success.bg}}",
          color: "{{primitives.variant.quaternary.state.hover.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.hover.severity.success.border.color}}",
            style: "{{primitives.variant.quaternary.state.hover.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        info: {
          background: "{{primitives.variant.quaternary.state.hover.severity.info.bg}}",
          color: "{{primitives.variant.quaternary.state.hover.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.hover.severity.info.border.color}}",
            style: "{{primitives.variant.quaternary.state.hover.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        warning: {
          background: "{{primitives.variant.quaternary.state.hover.severity.warning.bg}}",
          color: "{{primitives.variant.quaternary.state.hover.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.hover.severity.warning.border.color}}",
            style: "{{primitives.variant.quaternary.state.hover.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        help: {
          background: "{{primitives.variant.quaternary.state.hover.severity.help.bg}}",
          color: "{{primitives.variant.quaternary.state.hover.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.hover.severity.help.border.color}}",
            style: "{{primitives.variant.quaternary.state.hover.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        danger: {
          background: "{{primitives.variant.quaternary.state.hover.severity.danger.bg}}",
          color: "{{primitives.variant.quaternary.state.hover.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.hover.severity.danger.border.color}}",
            style: "{{primitives.variant.quaternary.state.hover.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.quaternary.state.hover.severity.contrast.bg}}",
          color: "{{primitives.variant.quaternary.state.hover.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.hover.severity.contrast.border.color}}",
            style: "{{primitives.variant.quaternary.state.hover.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
    active: {
      background: "{{primitives.variant.quaternary.state.active.defaultSeverity.bg}}",
      color: "{{primitives.variant.quaternary.state.active.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.quaternary.state.active.defaultSeverity.border.color}}",
        style: "{{primitives.variant.quaternary.state.active.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.quaternary.state.active.severity.secondary.bg}}",
          color: "{{primitives.variant.quaternary.state.active.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.active.severity.secondary.border.color}}",
            style: "{{primitives.variant.quaternary.state.active.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        success: {
          background: "{{primitives.variant.quaternary.state.active.severity.success.bg}}",
          color: "{{primitives.variant.quaternary.state.active.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.active.severity.success.border.color}}",
            style: "{{primitives.variant.quaternary.state.active.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        info: {
          background: "{{primitives.variant.quaternary.state.active.severity.info.bg}}",
          color: "{{primitives.variant.quaternary.state.active.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.active.severity.info.border.color}}",
            style: "{{primitives.variant.quaternary.state.active.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        warning: {
          background: "{{primitives.variant.quaternary.state.active.severity.warning.bg}}",
          color: "{{primitives.variant.quaternary.state.active.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.active.severity.warning.border.color}}",
            style: "{{primitives.variant.quaternary.state.active.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        help: {
          background: "{{primitives.variant.quaternary.state.active.severity.help.bg}}",
          color: "{{primitives.variant.quaternary.state.active.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.active.severity.help.border.color}}",
            style: "{{primitives.variant.quaternary.state.active.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        danger: {
          background: "{{primitives.variant.quaternary.state.active.severity.danger.bg}}",
          color: "{{primitives.variant.quaternary.state.active.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.active.severity.danger.border.color}}",
            style: "{{primitives.variant.quaternary.state.active.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.quaternary.state.active.severity.contrast.bg}}",
          color: "{{primitives.variant.quaternary.state.active.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.active.severity.contrast.border.color}}",
            style: "{{primitives.variant.quaternary.state.active.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
    focus: {
      background: "{{primitives.variant.quaternary.state.focus.defaultSeverity.bg}}",
      color: "{{primitives.variant.quaternary.state.focus.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.quaternary.state.focus.defaultSeverity.border.color}}",
        style: "{{primitives.variant.quaternary.state.focus.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      focusRing: {
        width: "{{primitives.focusRing.width.sm}}",
        style: "{{primitives.focusRing.style}}",
        color: "{{primitives.variant.quaternary.state.focus.defaultSeverity.focusRing.color}}",
        offset: "{{primitives.focusRing.offset.sm}}",
        shadow: "{{primitives.variant.quaternary.state.focus.defaultSeverity.focusRing.shadow}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.quaternary.state.focus.severity.secondary.bg}}",
          color: "{{primitives.variant.quaternary.state.focus.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.focus.severity.secondary.border.color}}",
            style: "{{primitives.variant.quaternary.state.focus.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quaternary.state.focus.severity.secondary.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quaternary.state.focus.severity.secondary.focusRing.shadow}}",
          },
        },
        success: {
          background: "{{primitives.variant.quaternary.state.focus.severity.success.bg}}",
          color: "{{primitives.variant.quaternary.state.focus.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.focus.severity.success.border.color}}",
            style: "{{primitives.variant.quaternary.state.focus.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quaternary.state.focus.severity.success.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quaternary.state.focus.severity.success.focusRing.shadow}}",
          },
        },
        info: {
          background: "{{primitives.variant.quaternary.state.focus.severity.info.bg}}",
          color: "{{primitives.variant.quaternary.state.focus.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.focus.severity.info.border.color}}",
            style: "{{primitives.variant.quaternary.state.focus.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quaternary.state.focus.severity.info.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quaternary.state.focus.severity.info.focusRing.shadow}}",
          },
        },
        warning: {
          background: "{{primitives.variant.quaternary.state.focus.severity.warning.bg}}",
          color: "{{primitives.variant.quaternary.state.focus.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.focus.severity.warning.border.color}}",
            style: "{{primitives.variant.quaternary.state.focus.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quaternary.state.focus.severity.warning.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quaternary.state.focus.severity.warning.focusRing.shadow}}",
          },
        },
        help: {
          background: "{{primitives.variant.quaternary.state.focus.severity.help.bg}}",
          color: "{{primitives.variant.quaternary.state.focus.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.focus.severity.help.border.color}}",
            style: "{{primitives.variant.quaternary.state.focus.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quaternary.state.focus.severity.help.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quaternary.state.focus.severity.help.focusRing.shadow}}",
          },
        },
        danger: {
          background: "{{primitives.variant.quaternary.state.focus.severity.danger.bg}}",
          color: "{{primitives.variant.quaternary.state.focus.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.focus.severity.danger.border.color}}",
            style: "{{primitives.variant.quaternary.state.focus.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quaternary.state.focus.severity.danger.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quaternary.state.focus.severity.danger.focusRing.shadow}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.quaternary.state.focus.severity.contrast.bg}}",
          color: "{{primitives.variant.quaternary.state.focus.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.focus.severity.contrast.border.color}}",
            style: "{{primitives.variant.quaternary.state.focus.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quaternary.state.focus.severity.contrast.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quaternary.state.focus.severity.contrast.focusRing.shadow}}",
          },
        },
      },
    },
    disabled: {
      background: "{{primitives.variant.quaternary.state.disabled.defaultSeverity.bg}}",
      color: "{{primitives.variant.quaternary.state.disabled.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.quaternary.state.disabled.defaultSeverity.border.color}}",
        style: "{{primitives.variant.quaternary.state.disabled.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.quaternary.state.disabled.severity.secondary.bg}}",
          color: "{{primitives.variant.quaternary.state.disabled.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.disabled.severity.secondary.border.color}}",
            style: "{{primitives.variant.quaternary.state.disabled.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        success: {
          background: "{{primitives.variant.quaternary.state.disabled.severity.success.bg}}",
          color: "{{primitives.variant.quaternary.state.disabled.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.disabled.severity.success.border.color}}",
            style: "{{primitives.variant.quaternary.state.disabled.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        info: {
          background: "{{primitives.variant.quaternary.state.disabled.severity.info.bg}}",
          color: "{{primitives.variant.quaternary.state.disabled.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.disabled.severity.info.border.color}}",
            style: "{{primitives.variant.quaternary.state.disabled.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        warning: {
          background: "{{primitives.variant.quaternary.state.disabled.severity.warning.bg}}",
          color: "{{primitives.variant.quaternary.state.disabled.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.disabled.severity.warning.border.color}}",
            style: "{{primitives.variant.quaternary.state.disabled.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        help: {
          background: "{{primitives.variant.quaternary.state.disabled.severity.help.bg}}",
          color: "{{primitives.variant.quaternary.state.disabled.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.disabled.severity.help.border.color}}",
            style: "{{primitives.variant.quaternary.state.disabled.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        danger: {
          background: "{{primitives.variant.quaternary.state.disabled.severity.danger.bg}}",
          color: "{{primitives.variant.quaternary.state.disabled.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.disabled.severity.danger.border.color}}",
            style: "{{primitives.variant.quaternary.state.disabled.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.quaternary.state.disabled.severity.contrast.bg}}",
          color: "{{primitives.variant.quaternary.state.disabled.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.quaternary.state.disabled.severity.contrast.border.color}}",
            style: "{{primitives.variant.quaternary.state.disabled.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
  },
};

/** Default values for the raised button variant. */
export const buttonRaisedDefaults = {
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
    background: "{{primitives.variant.quinary.defaultState.defaultSeverity.bg}}",
    color: "{{primitives.variant.quinary.defaultState.defaultSeverity.contrast}}",
    border: {
      color: "{{primitives.variant.quinary.defaultState.defaultSeverity.border.color}}",
      style: "{{primitives.variant.quinary.defaultState.defaultSeverity.border.style}}",
      width: "{{primitives.border.width.sm}}",
    },
    shadow: "{{primitives.shadow.md}}",
    severity: {
      secondary: {
        background: "{{primitives.variant.quinary.defaultState.severity.secondary.bg}}",
        color: "{{primitives.variant.quinary.defaultState.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.variant.quinary.defaultState.severity.secondary.border.color}}",
          style: "{{primitives.variant.quinary.defaultState.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        shadow: "{{primitives.shadow.md}}",
      },
      success: {
        background: "{{primitives.variant.quinary.defaultState.severity.success.bg}}",
        color: "{{primitives.variant.quinary.defaultState.severity.success.contrast}}",
        border: {
          color: "{{primitives.variant.quinary.defaultState.severity.success.border.color}}",
          style: "{{primitives.variant.quinary.defaultState.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        shadow: "{{primitives.shadow.md}}",
      },
      info: {
        background: "{{primitives.variant.quinary.defaultState.severity.info.bg}}",
        color: "{{primitives.variant.quinary.defaultState.severity.info.contrast}}",
        border: {
          color: "{{primitives.variant.quinary.defaultState.severity.info.border.color}}",
          style: "{{primitives.variant.quinary.defaultState.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        shadow: "{{primitives.shadow.md}}",
      },
      warning: {
        background: "{{primitives.variant.quinary.defaultState.severity.warning.bg}}",
        color: "{{primitives.variant.quinary.defaultState.severity.warning.contrast}}",
        border: {
          color: "{{primitives.variant.quinary.defaultState.severity.warning.border.color}}",
          style: "{{primitives.variant.quinary.defaultState.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        shadow: "{{primitives.shadow.md}}",
      },
      help: {
        background: "{{primitives.variant.quinary.defaultState.severity.help.bg}}",
        color: "{{primitives.variant.quinary.defaultState.severity.help.contrast}}",
        border: {
          color: "{{primitives.variant.quinary.defaultState.severity.help.border.color}}",
          style: "{{primitives.variant.quinary.defaultState.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        shadow: "{{primitives.shadow.md}}",
      },
      danger: {
        background: "{{primitives.variant.quinary.defaultState.severity.danger.bg}}",
        color: "{{primitives.variant.quinary.defaultState.severity.danger.contrast}}",
        border: {
          color: "{{primitives.variant.quinary.defaultState.severity.danger.border.color}}",
          style: "{{primitives.variant.quinary.defaultState.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        shadow: "{{primitives.shadow.md}}",
      },
      contrast: {
        background: "{{primitives.variant.quinary.defaultState.severity.contrast.bg}}",
        color: "{{primitives.variant.quinary.defaultState.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.variant.quinary.defaultState.severity.contrast.border.color}}",
          style: "{{primitives.variant.quinary.defaultState.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        shadow: "{{primitives.shadow.md}}",
      },
    },
  },
  state: {
    hover: {
      background: "{{primitives.variant.quinary.state.hover.defaultSeverity.bg}}",
      color: "{{primitives.variant.quinary.state.hover.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.quinary.state.hover.defaultSeverity.border.color}}",
        style: "{{primitives.variant.quinary.state.hover.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      shadow: "{{primitives.shadow.lg}}",
      severity: {
        secondary: {
          background: "{{primitives.variant.quinary.state.hover.severity.secondary.bg}}",
          color: "{{primitives.variant.quinary.state.hover.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.hover.severity.secondary.border.color}}",
            style: "{{primitives.variant.quinary.state.hover.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          shadow: "{{primitives.shadow.lg}}",
        },
        success: {
          background: "{{primitives.variant.quinary.state.hover.severity.success.bg}}",
          color: "{{primitives.variant.quinary.state.hover.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.hover.severity.success.border.color}}",
            style: "{{primitives.variant.quinary.state.hover.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          shadow: "{{primitives.shadow.lg}}",
        },
        info: {
          background: "{{primitives.variant.quinary.state.hover.severity.info.bg}}",
          color: "{{primitives.variant.quinary.state.hover.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.hover.severity.info.border.color}}",
            style: "{{primitives.variant.quinary.state.hover.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          shadow: "{{primitives.shadow.lg}}",
        },
        warning: {
          background: "{{primitives.variant.quinary.state.hover.severity.warning.bg}}",
          color: "{{primitives.variant.quinary.state.hover.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.hover.severity.warning.border.color}}",
            style: "{{primitives.variant.quinary.state.hover.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          shadow: "{{primitives.shadow.lg}}",
        },
        help: {
          background: "{{primitives.variant.quinary.state.hover.severity.help.bg}}",
          color: "{{primitives.variant.quinary.state.hover.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.hover.severity.help.border.color}}",
            style: "{{primitives.variant.quinary.state.hover.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          shadow: "{{primitives.shadow.lg}}",
        },
        danger: {
          background: "{{primitives.variant.quinary.state.hover.severity.danger.bg}}",
          color: "{{primitives.variant.quinary.state.hover.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.hover.severity.danger.border.color}}",
            style: "{{primitives.variant.quinary.state.hover.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          shadow: "{{primitives.shadow.lg}}",
        },
        contrast: {
          background: "{{primitives.variant.quinary.state.hover.severity.contrast.bg}}",
          color: "{{primitives.variant.quinary.state.hover.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.hover.severity.contrast.border.color}}",
            style: "{{primitives.variant.quinary.state.hover.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          shadow: "{{primitives.shadow.lg}}",
        },
      },
    },
    active: {
      background: "{{primitives.variant.quinary.state.active.defaultSeverity.bg}}",
      color: "{{primitives.variant.quinary.state.active.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.quinary.state.active.defaultSeverity.border.color}}",
        style: "{{primitives.variant.quinary.state.active.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.quinary.state.active.severity.secondary.bg}}",
          color: "{{primitives.variant.quinary.state.active.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.active.severity.secondary.border.color}}",
            style: "{{primitives.variant.quinary.state.active.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        success: {
          background: "{{primitives.variant.quinary.state.active.severity.success.bg}}",
          color: "{{primitives.variant.quinary.state.active.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.active.severity.success.border.color}}",
            style: "{{primitives.variant.quinary.state.active.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        info: {
          background: "{{primitives.variant.quinary.state.active.severity.info.bg}}",
          color: "{{primitives.variant.quinary.state.active.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.active.severity.info.border.color}}",
            style: "{{primitives.variant.quinary.state.active.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        warning: {
          background: "{{primitives.variant.quinary.state.active.severity.warning.bg}}",
          color: "{{primitives.variant.quinary.state.active.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.active.severity.warning.border.color}}",
            style: "{{primitives.variant.quinary.state.active.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        help: {
          background: "{{primitives.variant.quinary.state.active.severity.help.bg}}",
          color: "{{primitives.variant.quinary.state.active.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.active.severity.help.border.color}}",
            style: "{{primitives.variant.quinary.state.active.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        danger: {
          background: "{{primitives.variant.quinary.state.active.severity.danger.bg}}",
          color: "{{primitives.variant.quinary.state.active.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.active.severity.danger.border.color}}",
            style: "{{primitives.variant.quinary.state.active.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.quinary.state.active.severity.contrast.bg}}",
          color: "{{primitives.variant.quinary.state.active.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.active.severity.contrast.border.color}}",
            style: "{{primitives.variant.quinary.state.active.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
    focus: {
      background: "{{primitives.variant.quinary.state.focus.defaultSeverity.bg}}",
      color: "{{primitives.variant.quinary.state.focus.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.quinary.state.focus.defaultSeverity.border.color}}",
        style: "{{primitives.variant.quinary.state.focus.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      focusRing: {
        width: "{{primitives.focusRing.width.sm}}",
        style: "{{primitives.focusRing.style}}",
        color: "{{primitives.variant.quinary.state.focus.defaultSeverity.focusRing.color}}",
        offset: "{{primitives.focusRing.offset.sm}}",
        shadow: "{{primitives.variant.quinary.state.focus.defaultSeverity.focusRing.shadow}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.quinary.state.focus.severity.secondary.bg}}",
          color: "{{primitives.variant.quinary.state.focus.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.focus.severity.secondary.border.color}}",
            style: "{{primitives.variant.quinary.state.focus.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quinary.state.focus.severity.secondary.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quinary.state.focus.severity.secondary.focusRing.shadow}}",
          },
        },
        success: {
          background: "{{primitives.variant.quinary.state.focus.severity.success.bg}}",
          color: "{{primitives.variant.quinary.state.focus.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.focus.severity.success.border.color}}",
            style: "{{primitives.variant.quinary.state.focus.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quinary.state.focus.severity.success.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quinary.state.focus.severity.success.focusRing.shadow}}",
          },
        },
        info: {
          background: "{{primitives.variant.quinary.state.focus.severity.info.bg}}",
          color: "{{primitives.variant.quinary.state.focus.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.focus.severity.info.border.color}}",
            style: "{{primitives.variant.quinary.state.focus.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quinary.state.focus.severity.info.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quinary.state.focus.severity.info.focusRing.shadow}}",
          },
        },
        warning: {
          background: "{{primitives.variant.quinary.state.focus.severity.warning.bg}}",
          color: "{{primitives.variant.quinary.state.focus.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.focus.severity.warning.border.color}}",
            style: "{{primitives.variant.quinary.state.focus.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quinary.state.focus.severity.warning.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quinary.state.focus.severity.warning.focusRing.shadow}}",
          },
        },
        help: {
          background: "{{primitives.variant.quinary.state.focus.severity.help.bg}}",
          color: "{{primitives.variant.quinary.state.focus.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.focus.severity.help.border.color}}",
            style: "{{primitives.variant.quinary.state.focus.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quinary.state.focus.severity.help.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quinary.state.focus.severity.help.focusRing.shadow}}",
          },
        },
        danger: {
          background: "{{primitives.variant.quinary.state.focus.severity.danger.bg}}",
          color: "{{primitives.variant.quinary.state.focus.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.focus.severity.danger.border.color}}",
            style: "{{primitives.variant.quinary.state.focus.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quinary.state.focus.severity.danger.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quinary.state.focus.severity.danger.focusRing.shadow}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.quinary.state.focus.severity.contrast.bg}}",
          color: "{{primitives.variant.quinary.state.focus.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.focus.severity.contrast.border.color}}",
            style: "{{primitives.variant.quinary.state.focus.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.variant.quinary.state.focus.severity.contrast.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.variant.quinary.state.focus.severity.contrast.focusRing.shadow}}",
          },
        },
      },
    },
    disabled: {
      background: "{{primitives.variant.quinary.state.disabled.defaultSeverity.bg}}",
      color: "{{primitives.variant.quinary.state.disabled.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.variant.quinary.state.disabled.defaultSeverity.border.color}}",
        style: "{{primitives.variant.quinary.state.disabled.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
      severity: {
        secondary: {
          background: "{{primitives.variant.quinary.state.disabled.severity.secondary.bg}}",
          color: "{{primitives.variant.quinary.state.disabled.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.disabled.severity.secondary.border.color}}",
            style: "{{primitives.variant.quinary.state.disabled.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        success: {
          background: "{{primitives.variant.quinary.state.disabled.severity.success.bg}}",
          color: "{{primitives.variant.quinary.state.disabled.severity.success.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.disabled.severity.success.border.color}}",
            style: "{{primitives.variant.quinary.state.disabled.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        info: {
          background: "{{primitives.variant.quinary.state.disabled.severity.info.bg}}",
          color: "{{primitives.variant.quinary.state.disabled.severity.info.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.disabled.severity.info.border.color}}",
            style: "{{primitives.variant.quinary.state.disabled.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        warning: {
          background: "{{primitives.variant.quinary.state.disabled.severity.warning.bg}}",
          color: "{{primitives.variant.quinary.state.disabled.severity.warning.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.disabled.severity.warning.border.color}}",
            style: "{{primitives.variant.quinary.state.disabled.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        help: {
          background: "{{primitives.variant.quinary.state.disabled.severity.help.bg}}",
          color: "{{primitives.variant.quinary.state.disabled.severity.help.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.disabled.severity.help.border.color}}",
            style: "{{primitives.variant.quinary.state.disabled.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        danger: {
          background: "{{primitives.variant.quinary.state.disabled.severity.danger.bg}}",
          color: "{{primitives.variant.quinary.state.disabled.severity.danger.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.disabled.severity.danger.border.color}}",
            style: "{{primitives.variant.quinary.state.disabled.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
        contrast: {
          background: "{{primitives.variant.quinary.state.disabled.severity.contrast.bg}}",
          color: "{{primitives.variant.quinary.state.disabled.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.variant.quinary.state.disabled.severity.contrast.border.color}}",
            style: "{{primitives.variant.quinary.state.disabled.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}",
          },
        },
      },
    },
  },
};

export const buttonStateDefaults = {
  background: "{{primitives.variant.primary.defaultState.defaultSeverity.bg}}",
  color: "{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}",
  border: {
    color: "{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}",
    style: "{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.sm}}",
  },
  severity: {
    secondary: {
      background: "{{primitives.variant.primary.defaultState.severity.secondary.bg}}",
      color: "{{primitives.variant.primary.defaultState.severity.secondary.contrast}}",
      border: {
        color: "{{primitives.variant.primary.defaultState.severity.secondary.border.color}}",
        style: "{{primitives.variant.primary.defaultState.severity.secondary.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
    },
    success: {
      background: "{{primitives.variant.primary.defaultState.severity.success.bg}}",
      color: "{{primitives.variant.primary.defaultState.severity.success.contrast}}",
      border: {
        color: "{{primitives.variant.primary.defaultState.severity.success.border.color}}",
        style: "{{primitives.variant.primary.defaultState.severity.success.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
    },
    info: {
      background: "{{primitives.variant.primary.defaultState.severity.info.bg}}",
      color: "{{primitives.variant.primary.defaultState.severity.info.contrast}}",
      border: {
        color: "{{primitives.variant.primary.defaultState.severity.info.border.color}}",
        style: "{{primitives.variant.primary.defaultState.severity.info.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
    },
    warning: {
      background: "{{primitives.variant.primary.defaultState.severity.warning.bg}}",
      color: "{{primitives.variant.primary.defaultState.severity.warning.contrast}}",
      border: {
        color: "{{primitives.variant.primary.defaultState.severity.warning.border.color}}",
        style: "{{primitives.variant.primary.defaultState.severity.warning.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
    },
    help: {
      background: "{{primitives.variant.primary.defaultState.severity.help.bg}}",
      color: "{{primitives.variant.primary.defaultState.severity.help.contrast}}",
      border: {
        color: "{{primitives.variant.primary.defaultState.severity.help.border.color}}",
        style: "{{primitives.variant.primary.defaultState.severity.help.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
    },
    danger: {
      background: "{{primitives.variant.primary.defaultState.severity.danger.bg}}",
      color: "{{primitives.variant.primary.defaultState.severity.danger.contrast}}",
      border: {
        color: "{{primitives.variant.primary.defaultState.severity.danger.border.color}}",
        style: "{{primitives.variant.primary.defaultState.severity.danger.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
    },
    contrast: {
      background: "{{primitives.variant.primary.defaultState.severity.contrast.bg}}",
      color: "{{primitives.variant.primary.defaultState.severity.contrast.contrast}}",
      border: {
        color: "{{primitives.variant.primary.defaultState.severity.contrast.border.color}}",
        style: "{{primitives.variant.primary.defaultState.severity.contrast.border.style}}",
        width: "{{primitives.border.width.sm}}",
      },
    },
  },
  hover: {
    background: "{{primitives.variant.primary.state.hover.defaultSeverity.bg}}",
    color: "{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}",
    border: {
      color: "{{primitives.variant.primary.state.hover.defaultSeverity.border.color}}",
      style: "{{primitives.variant.primary.state.hover.defaultSeverity.border.style}}",
      width: "{{primitives.border.width.sm}}",
    },
    severity: {
      secondary: {
        background: "{{primitives.variant.primary.state.hover.severity.secondary.bg}}",
        color: "{{primitives.variant.primary.state.hover.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.hover.severity.secondary.border.color}}",
          style: "{{primitives.variant.primary.state.hover.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      success: {
        background: "{{primitives.variant.primary.state.hover.severity.success.bg}}",
        color: "{{primitives.variant.primary.state.hover.severity.success.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.hover.severity.success.border.color}}",
          style: "{{primitives.variant.primary.state.hover.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      info: {
        background: "{{primitives.variant.primary.state.hover.severity.info.bg}}",
        color: "{{primitives.variant.primary.state.hover.severity.info.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.hover.severity.info.border.color}}",
          style: "{{primitives.variant.primary.state.hover.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      warning: {
        background: "{{primitives.variant.primary.state.hover.severity.warning.bg}}",
        color: "{{primitives.variant.primary.state.hover.severity.warning.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.hover.severity.warning.border.color}}",
          style: "{{primitives.variant.primary.state.hover.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      help: {
        background: "{{primitives.variant.primary.state.hover.severity.help.bg}}",
        color: "{{primitives.variant.primary.state.hover.severity.help.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.hover.severity.help.border.color}}",
          style: "{{primitives.variant.primary.state.hover.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      danger: {
        background: "{{primitives.variant.primary.state.hover.severity.danger.bg}}",
        color: "{{primitives.variant.primary.state.hover.severity.danger.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.hover.severity.danger.border.color}}",
          style: "{{primitives.variant.primary.state.hover.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      contrast: {
        background: "{{primitives.variant.primary.state.hover.severity.contrast.bg}}",
        color: "{{primitives.variant.primary.state.hover.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.hover.severity.contrast.border.color}}",
          style: "{{primitives.variant.primary.state.hover.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
    },
  },
  active: {
    background: "{{primitives.variant.primary.state.active.defaultSeverity.bg}}",
    color: "{{primitives.variant.primary.state.active.defaultSeverity.contrast}}",
    border: {
      color: "{{primitives.variant.primary.state.active.defaultSeverity.border.color}}",
      style: "{{primitives.variant.primary.state.active.defaultSeverity.border.style}}",
      width: "{{primitives.border.width.sm}}",
    },
    severity: {
      secondary: {
        background: "{{primitives.variant.primary.state.active.severity.secondary.bg}}",
        color: "{{primitives.variant.primary.state.active.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.active.severity.secondary.border.color}}",
          style: "{{primitives.variant.primary.state.active.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      success: {
        background: "{{primitives.variant.primary.state.active.severity.success.bg}}",
        color: "{{primitives.variant.primary.state.active.severity.success.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.active.severity.success.border.color}}",
          style: "{{primitives.variant.primary.state.active.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      info: {
        background: "{{primitives.variant.primary.state.active.severity.info.bg}}",
        color: "{{primitives.variant.primary.state.active.severity.info.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.active.severity.info.border.color}}",
          style: "{{primitives.variant.primary.state.active.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      warning: {
        background: "{{primitives.variant.primary.state.active.severity.warning.bg}}",
        color: "{{primitives.variant.primary.state.active.severity.warning.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.active.severity.warning.border.color}}",
          style: "{{primitives.variant.primary.state.active.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      help: {
        background: "{{primitives.variant.primary.state.active.severity.help.bg}}",
        color: "{{primitives.variant.primary.state.active.severity.help.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.active.severity.help.border.color}}",
          style: "{{primitives.variant.primary.state.active.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      danger: {
        background: "{{primitives.variant.primary.state.active.severity.danger.bg}}",
        color: "{{primitives.variant.primary.state.active.severity.danger.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.active.severity.danger.border.color}}",
          style: "{{primitives.variant.primary.state.active.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      contrast: {
        background: "{{primitives.variant.primary.state.active.severity.contrast.bg}}",
        color: "{{primitives.variant.primary.state.active.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.active.severity.contrast.border.color}}",
          style: "{{primitives.variant.primary.state.active.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
    },
  },
  focus: {
    background: "{{primitives.variant.primary.state.focus.defaultSeverity.bg}}",
    color: "{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}",
    border: {
      color: "{{primitives.variant.primary.state.focus.defaultSeverity.border.color}}",
      style: "{{primitives.variant.primary.state.focus.defaultSeverity.border.style}}",
      width: "{{primitives.border.width.sm}}",
    },
    focusRing: {
      width: "{{primitives.focusRing.width.sm}}",
      style: "{{primitives.focusRing.style}}",
      color: "{{primitives.variant.primary.state.focus.defaultSeverity.focusRing.color}}",
      offset: "{{primitives.focusRing.offset.sm}}",
      shadow: "{{primitives.variant.primary.state.focus.defaultSeverity.focusRing.shadow}}",
    },
    severity: {
      secondary: {
        background: "{{primitives.variant.primary.state.focus.severity.secondary.bg}}",
        color: "{{primitives.variant.primary.state.focus.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.focus.severity.secondary.border.color}}",
          style: "{{primitives.variant.primary.state.focus.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.variant.primary.state.focus.severity.secondary.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.variant.primary.state.focus.severity.secondary.focusRing.shadow}}",
        },
      },
      success: {
        background: "{{primitives.variant.primary.state.focus.severity.success.bg}}",
        color: "{{primitives.variant.primary.state.focus.severity.success.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.focus.severity.success.border.color}}",
          style: "{{primitives.variant.primary.state.focus.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.variant.primary.state.focus.severity.success.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.variant.primary.state.focus.severity.success.focusRing.shadow}}",
        },
      },
      info: {
        background: "{{primitives.variant.primary.state.focus.severity.info.bg}}",
        color: "{{primitives.variant.primary.state.focus.severity.info.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.focus.severity.info.border.color}}",
          style: "{{primitives.variant.primary.state.focus.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.variant.primary.state.focus.severity.info.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.variant.primary.state.focus.severity.info.focusRing.shadow}}",
        },
      },
      warning: {
        background: "{{primitives.variant.primary.state.focus.severity.warning.bg}}",
        color: "{{primitives.variant.primary.state.focus.severity.warning.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.focus.severity.warning.border.color}}",
          style: "{{primitives.variant.primary.state.focus.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.variant.primary.state.focus.severity.warning.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.variant.primary.state.focus.severity.warning.focusRing.shadow}}",
        },
      },
      help: {
        background: "{{primitives.variant.primary.state.focus.severity.help.bg}}",
        color: "{{primitives.variant.primary.state.focus.severity.help.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.focus.severity.help.border.color}}",
          style: "{{primitives.variant.primary.state.focus.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.variant.primary.state.focus.severity.help.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.variant.primary.state.focus.severity.help.focusRing.shadow}}",
        },
      },
      danger: {
        background: "{{primitives.variant.primary.state.focus.severity.danger.bg}}",
        color: "{{primitives.variant.primary.state.focus.severity.danger.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.focus.severity.danger.border.color}}",
          style: "{{primitives.variant.primary.state.focus.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.variant.primary.state.focus.severity.danger.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.variant.primary.state.focus.severity.danger.focusRing.shadow}}",
        },
      },
      contrast: {
        background: "{{primitives.variant.primary.state.focus.severity.contrast.bg}}",
        color: "{{primitives.variant.primary.state.focus.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.focus.severity.contrast.border.color}}",
          style: "{{primitives.variant.primary.state.focus.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.variant.primary.state.focus.severity.contrast.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.variant.primary.state.focus.severity.contrast.focusRing.shadow}}",
        },
      },
    },
  },
  disabled: {
    background: "{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}",
    color: "{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}",
    border: {
      color: "{{primitives.variant.primary.state.disabled.defaultSeverity.border.color}}",
      style: "{{primitives.variant.primary.state.disabled.defaultSeverity.border.style}}",
      width: "{{primitives.border.width.sm}}",
    },
    severity: {
      secondary: {
        background: "{{primitives.variant.primary.state.disabled.severity.secondary.bg}}",
        color: "{{primitives.variant.primary.state.disabled.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.disabled.severity.secondary.border.color}}",
          style: "{{primitives.variant.primary.state.disabled.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      success: {
        background: "{{primitives.variant.primary.state.disabled.severity.success.bg}}",
        color: "{{primitives.variant.primary.state.disabled.severity.success.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.disabled.severity.success.border.color}}",
          style: "{{primitives.variant.primary.state.disabled.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      info: {
        background: "{{primitives.variant.primary.state.disabled.severity.info.bg}}",
        color: "{{primitives.variant.primary.state.disabled.severity.info.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.disabled.severity.info.border.color}}",
          style: "{{primitives.variant.primary.state.disabled.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      warning: {
        background: "{{primitives.variant.primary.state.disabled.severity.warning.bg}}",
        color: "{{primitives.variant.primary.state.disabled.severity.warning.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.disabled.severity.warning.border.color}}",
          style: "{{primitives.variant.primary.state.disabled.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      help: {
        background: "{{primitives.variant.primary.state.disabled.severity.help.bg}}",
        color: "{{primitives.variant.primary.state.disabled.severity.help.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.disabled.severity.help.border.color}}",
          style: "{{primitives.variant.primary.state.disabled.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      danger: {
        background: "{{primitives.variant.primary.state.disabled.severity.danger.bg}}",
        color: "{{primitives.variant.primary.state.disabled.severity.danger.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.disabled.severity.danger.border.color}}",
          style: "{{primitives.variant.primary.state.disabled.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
      contrast: {
        background: "{{primitives.variant.primary.state.disabled.severity.contrast.bg}}",
        color: "{{primitives.variant.primary.state.disabled.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.variant.primary.state.disabled.severity.contrast.border.color}}",
          style: "{{primitives.variant.primary.state.disabled.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}",
        },
      },
    },
  },
};

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

export const button = z.object({
  sizes: (buttonSizes as typeof buttonSizes).optional(),
  transition: (buttonTransition as typeof buttonTransition).default({
    duration: '{{primitives.transition.duration}}',
  }),
  fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
  disabledOpacity: withRef(z.string()).default("0.6"),
  roundedBorderRadius: withRef(z.string()).default("{{primitives.radius.full}}"),
  raisedShadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
  badgeSize: withRef(z.string()).default("{{primitives.space.lg}}"),
  border: (border as typeof border).default({
    width: "{{primitives.border.width.sm}}",
    radius: "{{primitives.radius.md}}",
  }),
  layout: buttonDisplayVariant.shape.layout.default({
    gap: "{{primitives.space.xs}}",
    paddingX: "{{primitives.space.md}}",
    paddingY: "{{primitives.space.sm}}",
    iconOnlyWidth: "{{primitives.space.lg}}",
  }),
  focusRing: (borderWithShadow as typeof borderWithShadow).default({
    width: "{{primitives.focusRing.width.sm}}",
    style: "{{primitives.focusRing.style}}",
    color: "{{primitives.variant.primary.defaultState.defaultSeverity.focusRing.color}}",
    offset: "{{primitives.focusRing.offset.sm}}",
    shadow: "{{primitives.variant.primary.defaultState.defaultSeverity.focusRing.shadow}}",
  }),
  text: (buttonDisplayVariant.shape.text as any).default({
    fontWeight: "{{primitives.font.weight}}",
  }),
  icon: buttonDisplayVariant.shape.icon.optional(),
  state: buttonStateVariant.default(buttonStateDefaults),
  link: (buttonLinkVariant as typeof buttonLinkVariant).default(buttonLinkDefaults).optional(),
  textVariant: buttonDisplayVariant.default(buttonTextVariantDefaults).optional(),
  outlined: buttonDisplayVariant.default(buttonOutlinedDefaults).optional(),
  rounded: buttonDisplayVariant.default(buttonRoundedDefaults).optional(),
  raised: buttonDisplayVariant.default(buttonRaisedDefaults).optional(),
})
  .register(themeSchemaRegistry, { id: "button" });
