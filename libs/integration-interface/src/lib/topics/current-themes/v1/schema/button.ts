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
    defaultSeverity: buttonSeverityStyles.optional(),
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
    defaultState: buttonLinkState.optional(),
    hover: buttonLinkState.optional(),
    active: buttonLinkState.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonLinkVariant" });

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
        link: buttonLinkVariant.optional(),
        text: buttonDisplayVariant.optional(),
        outlined: buttonDisplayVariant.optional(),
        rounded: buttonDisplayVariant.optional(),
        raised: buttonDisplayVariant.optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonTopVariant" });

const defaultVariantDefault: z.input<typeof buttonDisplayVariant> = {
  border: {
    width: "{{primitives.border.width.sm}}",
    radius: "{{primitives.radius.md}}"
  },
  layout: {
    gap: "{{primitives.space.xs}}",
    paddingX: "{{primitives.space.md}}",
    paddingY: "{{primitives.space.sm}}",
    iconOnlyWidth: "{{primitives.space.lg}}"
  },
  focusRing: {
    width: "{{primitives.focusRing.width.sm}}",
    style: "{{primitives.focusRing.style}}",
    color: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.color}}",
    offset: "{{primitives.focusRing.offset.sm}}",
    shadow: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.shadow}}"
  },
  text: {
    fontWeight: "{{primitives.font.weight}}"
  },
  defaultState: {
    defaultSeverity: {
      background: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color}}",
        style: "{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}"
      }
    },
    severity: {
      secondary: {
        background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.secondary.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.secondary.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      success: {
        background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.success.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.success.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.success.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      info: {
        background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      warning: {
        background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.warning.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.warning.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.warning.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      help: {
        background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.help.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.help.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.help.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      danger: {
        background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.danger.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.danger.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.danger.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      contrast: {
        background: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.contrast.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.contrast.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.defaultState.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      }
    }
  },
  state: {
    hover: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.success.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.info.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.help.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.hover.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    },
    active: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.defaultVariant.state.active.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.active.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.defaultVariant.state.active.severity.success.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.active.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.defaultVariant.state.active.severity.info.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.active.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.defaultVariant.state.active.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.active.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.defaultVariant.state.active.severity.help.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.active.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.defaultVariant.state.active.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.active.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.defaultVariant.state.active.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.active.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.active.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    },
    focus: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.secondary.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.secondary.focusRing.shadow}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.success.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.success.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.success.focusRing.shadow}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.info.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.info.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.info.focusRing.shadow}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.warning.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.warning.focusRing.shadow}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.help.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.help.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.help.focusRing.shadow}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.danger.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.danger.focusRing.shadow}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.contrast.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.defaultVariant.state.focus.severity.contrast.focusRing.shadow}}"
          }
        }
      }
    },
    disabled: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.success.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.info.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.help.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.defaultVariant.state.disabled.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    }
  }
};

const linkVariantDefault: z.input<typeof buttonLinkVariant> = {
  defaultState: {
    color: "{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}"
  },
  hover: {
    color: "{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}"
  },
  active: {
    color: "{{primitives.variant.primary.state.active.defaultSeverity.contrast}}"
  }
};

const textVariantDefault: z.input<typeof buttonDisplayVariant> = {
  border: {
    width: "{{primitives.border.width.sm}}",
    radius: "{{primitives.radius.md}}"
  },
  layout: {
    gap: "{{primitives.space.xs}}",
    paddingX: "{{primitives.space.md}}",
    paddingY: "{{primitives.space.sm}}",
    iconOnlyWidth: "{{primitives.space.lg}}"
  },
  defaultState: {
    defaultSeverity: {
      background: "{{primitives.defaultVariant.text.defaultState.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.text.defaultState.defaultSeverity.contrast}}"
    },
    severity: {
      secondary: {
        background: "{{primitives.defaultVariant.text.defaultState.severity.secondary.bg}}",
        color: "{{primitives.defaultVariant.text.defaultState.severity.secondary.contrast}}"
      },
      success: {
        background: "{{primitives.defaultVariant.text.defaultState.severity.success.bg}}",
        color: "{{primitives.defaultVariant.text.defaultState.severity.success.contrast}}"
      },
      info: {
        background: "{{primitives.defaultVariant.text.defaultState.severity.info.bg}}",
        color: "{{primitives.defaultVariant.text.defaultState.severity.info.contrast}}"
      },
      warning: {
        background: "{{primitives.defaultVariant.text.defaultState.severity.warning.bg}}",
        color: "{{primitives.defaultVariant.text.defaultState.severity.warning.contrast}}"
      },
      help: {
        background: "{{primitives.defaultVariant.text.defaultState.severity.help.bg}}",
        color: "{{primitives.defaultVariant.text.defaultState.severity.help.contrast}}"
      },
      danger: {
        background: "{{primitives.defaultVariant.text.defaultState.severity.danger.bg}}",
        color: "{{primitives.defaultVariant.text.defaultState.severity.danger.contrast}}"
      },
      contrast: {
        background: "{{primitives.defaultVariant.text.defaultState.severity.contrast.bg}}",
        color: "{{primitives.defaultVariant.text.defaultState.severity.contrast.contrast}}"
      }
    }
  },
  state: {
    hover: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.text.state.hover.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.text.state.hover.defaultSeverity.contrast}}"
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.text.state.hover.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.text.state.hover.severity.secondary.contrast}}"
        },
        success: {
          background: "{{primitives.defaultVariant.text.state.hover.severity.success.bg}}",
          color: "{{primitives.defaultVariant.text.state.hover.severity.success.contrast}}"
        },
        info: {
          background: "{{primitives.defaultVariant.text.state.hover.severity.info.bg}}",
          color: "{{primitives.defaultVariant.text.state.hover.severity.info.contrast}}"
        },
        warning: {
          background: "{{primitives.defaultVariant.text.state.hover.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.text.state.hover.severity.warning.contrast}}"
        },
        help: {
          background: "{{primitives.defaultVariant.text.state.hover.severity.help.bg}}",
          color: "{{primitives.defaultVariant.text.state.hover.severity.help.contrast}}"
        },
        danger: {
          background: "{{primitives.defaultVariant.text.state.hover.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.text.state.hover.severity.danger.contrast}}"
        },
        contrast: {
          background: "{{primitives.defaultVariant.text.state.hover.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.text.state.hover.severity.contrast.contrast}}"
        }
      }
    },
    active: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.text.state.active.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.text.state.active.defaultSeverity.contrast}}"
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.text.state.active.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.text.state.active.severity.secondary.contrast}}"
        },
        success: {
          background: "{{primitives.defaultVariant.text.state.active.severity.success.bg}}",
          color: "{{primitives.defaultVariant.text.state.active.severity.success.contrast}}"
        },
        info: {
          background: "{{primitives.defaultVariant.text.state.active.severity.info.bg}}",
          color: "{{primitives.defaultVariant.text.state.active.severity.info.contrast}}"
        },
        warning: {
          background: "{{primitives.defaultVariant.text.state.active.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.text.state.active.severity.warning.contrast}}"
        },
        help: {
          background: "{{primitives.defaultVariant.text.state.active.severity.help.bg}}",
          color: "{{primitives.defaultVariant.text.state.active.severity.help.contrast}}"
        },
        danger: {
          background: "{{primitives.defaultVariant.text.state.active.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.text.state.active.severity.danger.contrast}}"
        },
        contrast: {
          background: "{{primitives.defaultVariant.text.state.active.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.text.state.active.severity.contrast.contrast}}"
        }
      }
    },
    focus: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.text.state.focus.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.text.state.focus.defaultSeverity.contrast}}",
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.defaultVariant.text.state.focus.defaultSeverity.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.defaultVariant.text.state.focus.defaultSeverity.focusRing.shadow}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.text.state.focus.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.text.state.focus.severity.secondary.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.text.state.focus.severity.secondary.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.text.state.focus.severity.secondary.focusRing.shadow}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.text.state.focus.severity.success.bg}}",
          color: "{{primitives.defaultVariant.text.state.focus.severity.success.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.text.state.focus.severity.success.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.text.state.focus.severity.success.focusRing.shadow}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.text.state.focus.severity.info.bg}}",
          color: "{{primitives.defaultVariant.text.state.focus.severity.info.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.text.state.focus.severity.info.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.text.state.focus.severity.info.focusRing.shadow}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.text.state.focus.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.text.state.focus.severity.warning.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.text.state.focus.severity.warning.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.text.state.focus.severity.warning.focusRing.shadow}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.text.state.focus.severity.help.bg}}",
          color: "{{primitives.defaultVariant.text.state.focus.severity.help.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.text.state.focus.severity.help.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.text.state.focus.severity.help.focusRing.shadow}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.text.state.focus.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.text.state.focus.severity.danger.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.text.state.focus.severity.danger.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.text.state.focus.severity.danger.focusRing.shadow}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.text.state.focus.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.text.state.focus.severity.contrast.contrast}}",
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.text.state.focus.severity.contrast.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.text.state.focus.severity.contrast.focusRing.shadow}}"
          }
        }
      }
    },
    disabled: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.text.state.disabled.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.text.state.disabled.defaultSeverity.contrast}}"
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.text.state.disabled.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.text.state.disabled.severity.secondary.contrast}}"
        },
        success: {
          background: "{{primitives.defaultVariant.text.state.disabled.severity.success.bg}}",
          color: "{{primitives.defaultVariant.text.state.disabled.severity.success.contrast}}"
        },
        info: {
          background: "{{primitives.defaultVariant.text.state.disabled.severity.info.bg}}",
          color: "{{primitives.defaultVariant.text.state.disabled.severity.info.contrast}}"
        },
        warning: {
          background: "{{primitives.defaultVariant.text.state.disabled.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.text.state.disabled.severity.warning.contrast}}"
        },
        help: {
          background: "{{primitives.defaultVariant.text.state.disabled.severity.help.bg}}",
          color: "{{primitives.defaultVariant.text.state.disabled.severity.help.contrast}}"
        },
        danger: {
          background: "{{primitives.defaultVariant.text.state.disabled.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.text.state.disabled.severity.danger.contrast}}"
        },
        contrast: {
          background: "{{primitives.defaultVariant.text.state.disabled.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.text.state.disabled.severity.contrast.contrast}}"
        }
      }
    }
  }
};

const outlinedVariantDefault: z.input<typeof buttonDisplayVariant> = {
  border: {
    width: "{{primitives.border.width.sm}}",
    radius: "{{primitives.radius.md}}"
  },
  layout: {
    gap: "{{primitives.space.xs}}",
    paddingX: "{{primitives.space.md}}",
    paddingY: "{{primitives.space.sm}}",
    iconOnlyWidth: "{{primitives.space.lg}}"
  },
  defaultState: {
    defaultSeverity: {
      background: "{{primitives.defaultVariant.outlined.defaultState.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.outlined.defaultState.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.defaultVariant.outlined.defaultState.defaultSeverity.border.color}}",
        style: "{{primitives.defaultVariant.outlined.defaultState.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}"
      }
    },
    severity: {
      secondary: {
        background: "{{primitives.defaultVariant.outlined.defaultState.severity.secondary.bg}}",
        color: "{{primitives.defaultVariant.outlined.defaultState.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.defaultState.severity.secondary.border.color}}",
          style: "{{primitives.defaultVariant.outlined.defaultState.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      success: {
        background: "{{primitives.defaultVariant.outlined.defaultState.severity.success.bg}}",
        color: "{{primitives.defaultVariant.outlined.defaultState.severity.success.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.defaultState.severity.success.border.color}}",
          style: "{{primitives.defaultVariant.outlined.defaultState.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      info: {
        background: "{{primitives.defaultVariant.outlined.defaultState.severity.info.bg}}",
        color: "{{primitives.defaultVariant.outlined.defaultState.severity.info.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.defaultState.severity.info.border.color}}",
          style: "{{primitives.defaultVariant.outlined.defaultState.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      warning: {
        background: "{{primitives.defaultVariant.outlined.defaultState.severity.warning.bg}}",
        color: "{{primitives.defaultVariant.outlined.defaultState.severity.warning.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.defaultState.severity.warning.border.color}}",
          style: "{{primitives.defaultVariant.outlined.defaultState.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      help: {
        background: "{{primitives.defaultVariant.outlined.defaultState.severity.help.bg}}",
        color: "{{primitives.defaultVariant.outlined.defaultState.severity.help.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.defaultState.severity.help.border.color}}",
          style: "{{primitives.defaultVariant.outlined.defaultState.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      danger: {
        background: "{{primitives.defaultVariant.outlined.defaultState.severity.danger.bg}}",
        color: "{{primitives.defaultVariant.outlined.defaultState.severity.danger.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.defaultState.severity.danger.border.color}}",
          style: "{{primitives.defaultVariant.outlined.defaultState.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      contrast: {
        background: "{{primitives.defaultVariant.outlined.defaultState.severity.contrast.bg}}",
        color: "{{primitives.defaultVariant.outlined.defaultState.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.defaultState.severity.contrast.border.color}}",
          style: "{{primitives.defaultVariant.outlined.defaultState.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      }
    }
  },
  state: {
    hover: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.outlined.state.hover.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.outlined.state.hover.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.state.hover.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.outlined.state.hover.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.outlined.state.hover.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.hover.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.hover.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.hover.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.outlined.state.hover.severity.success.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.hover.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.hover.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.hover.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.outlined.state.hover.severity.info.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.hover.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.hover.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.hover.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.outlined.state.hover.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.hover.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.hover.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.hover.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.outlined.state.hover.severity.help.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.hover.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.hover.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.hover.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.outlined.state.hover.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.hover.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.hover.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.hover.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.outlined.state.hover.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.hover.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.hover.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.hover.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    },
    active: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.outlined.state.active.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.outlined.state.active.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.state.active.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.outlined.state.active.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.outlined.state.active.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.active.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.active.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.active.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.outlined.state.active.severity.success.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.active.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.active.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.active.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.outlined.state.active.severity.info.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.active.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.active.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.active.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.outlined.state.active.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.active.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.active.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.active.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.outlined.state.active.severity.help.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.active.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.active.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.active.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.outlined.state.active.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.active.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.active.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.active.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.outlined.state.active.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.active.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.active.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.active.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    },
    focus: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.outlined.state.focus.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.outlined.state.focus.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.state.focus.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.outlined.state.focus.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.defaultVariant.outlined.state.focus.defaultSeverity.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.defaultVariant.outlined.state.focus.defaultSeverity.focusRing.shadow}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.outlined.state.focus.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.focus.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.focus.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.secondary.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.outlined.state.focus.severity.secondary.focusRing.shadow}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.outlined.state.focus.severity.success.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.focus.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.focus.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.success.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.outlined.state.focus.severity.success.focusRing.shadow}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.outlined.state.focus.severity.info.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.focus.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.focus.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.info.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.outlined.state.focus.severity.info.focusRing.shadow}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.outlined.state.focus.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.focus.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.focus.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.warning.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.outlined.state.focus.severity.warning.focusRing.shadow}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.outlined.state.focus.severity.help.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.focus.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.focus.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.help.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.outlined.state.focus.severity.help.focusRing.shadow}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.outlined.state.focus.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.focus.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.focus.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.danger.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.outlined.state.focus.severity.danger.focusRing.shadow}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.outlined.state.focus.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.focus.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.focus.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.outlined.state.focus.severity.contrast.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.outlined.state.focus.severity.contrast.focusRing.shadow}}"
          }
        }
      }
    },
    disabled: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.outlined.state.disabled.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.outlined.state.disabled.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.outlined.state.disabled.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.outlined.state.disabled.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.outlined.state.disabled.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.disabled.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.disabled.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.disabled.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.outlined.state.disabled.severity.success.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.disabled.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.disabled.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.disabled.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.outlined.state.disabled.severity.info.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.disabled.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.disabled.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.disabled.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.outlined.state.disabled.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.disabled.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.disabled.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.disabled.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.outlined.state.disabled.severity.help.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.disabled.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.disabled.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.disabled.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.outlined.state.disabled.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.disabled.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.disabled.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.disabled.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.outlined.state.disabled.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.outlined.state.disabled.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.outlined.state.disabled.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.outlined.state.disabled.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    }
  }
};

const roundedVariantDefault: z.input<typeof buttonDisplayVariant> = {
  border: {
    width: "{{primitives.border.width.sm}}",
    radius: "{{primitives.radius.full}}"
  },
  layout: {
    gap: "{{primitives.space.xs}}",
    paddingX: "{{primitives.space.md}}",
    paddingY: "{{primitives.space.sm}}",
    iconOnlyWidth: "{{primitives.space.lg}}"
  },
  defaultState: {
    defaultSeverity: {
      background: "{{primitives.defaultVariant.rounded.defaultState.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.rounded.defaultState.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.defaultVariant.rounded.defaultState.defaultSeverity.border.color}}",
        style: "{{primitives.defaultVariant.rounded.defaultState.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}"
      }
    },
    severity: {
      secondary: {
        background: "{{primitives.defaultVariant.rounded.defaultState.severity.secondary.bg}}",
        color: "{{primitives.defaultVariant.rounded.defaultState.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.defaultState.severity.secondary.border.color}}",
          style: "{{primitives.defaultVariant.rounded.defaultState.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      success: {
        background: "{{primitives.defaultVariant.rounded.defaultState.severity.success.bg}}",
        color: "{{primitives.defaultVariant.rounded.defaultState.severity.success.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.defaultState.severity.success.border.color}}",
          style: "{{primitives.defaultVariant.rounded.defaultState.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      info: {
        background: "{{primitives.defaultVariant.rounded.defaultState.severity.info.bg}}",
        color: "{{primitives.defaultVariant.rounded.defaultState.severity.info.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.defaultState.severity.info.border.color}}",
          style: "{{primitives.defaultVariant.rounded.defaultState.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      warning: {
        background: "{{primitives.defaultVariant.rounded.defaultState.severity.warning.bg}}",
        color: "{{primitives.defaultVariant.rounded.defaultState.severity.warning.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.defaultState.severity.warning.border.color}}",
          style: "{{primitives.defaultVariant.rounded.defaultState.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      help: {
        background: "{{primitives.defaultVariant.rounded.defaultState.severity.help.bg}}",
        color: "{{primitives.defaultVariant.rounded.defaultState.severity.help.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.defaultState.severity.help.border.color}}",
          style: "{{primitives.defaultVariant.rounded.defaultState.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      danger: {
        background: "{{primitives.defaultVariant.rounded.defaultState.severity.danger.bg}}",
        color: "{{primitives.defaultVariant.rounded.defaultState.severity.danger.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.defaultState.severity.danger.border.color}}",
          style: "{{primitives.defaultVariant.rounded.defaultState.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      contrast: {
        background: "{{primitives.defaultVariant.rounded.defaultState.severity.contrast.bg}}",
        color: "{{primitives.defaultVariant.rounded.defaultState.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.defaultState.severity.contrast.border.color}}",
          style: "{{primitives.defaultVariant.rounded.defaultState.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      }
    }
  },
  state: {
    hover: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.rounded.state.hover.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.rounded.state.hover.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.state.hover.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.rounded.state.hover.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.rounded.state.hover.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.hover.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.hover.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.hover.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.rounded.state.hover.severity.success.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.hover.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.hover.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.hover.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.rounded.state.hover.severity.info.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.hover.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.hover.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.hover.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.rounded.state.hover.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.hover.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.hover.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.hover.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.rounded.state.hover.severity.help.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.hover.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.hover.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.hover.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.rounded.state.hover.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.hover.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.hover.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.hover.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.rounded.state.hover.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.hover.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.hover.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.hover.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    },
    active: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.rounded.state.active.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.rounded.state.active.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.state.active.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.rounded.state.active.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.rounded.state.active.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.active.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.active.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.active.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.rounded.state.active.severity.success.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.active.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.active.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.active.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.rounded.state.active.severity.info.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.active.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.active.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.active.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.rounded.state.active.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.active.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.active.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.active.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.rounded.state.active.severity.help.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.active.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.active.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.active.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.rounded.state.active.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.active.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.active.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.active.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.rounded.state.active.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.active.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.active.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.active.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    },
    focus: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.rounded.state.focus.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.rounded.state.focus.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.state.focus.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.rounded.state.focus.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.defaultVariant.rounded.state.focus.defaultSeverity.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.defaultVariant.rounded.state.focus.defaultSeverity.focusRing.shadow}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.rounded.state.focus.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.focus.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.focus.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.secondary.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.rounded.state.focus.severity.secondary.focusRing.shadow}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.rounded.state.focus.severity.success.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.focus.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.focus.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.success.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.rounded.state.focus.severity.success.focusRing.shadow}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.rounded.state.focus.severity.info.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.focus.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.focus.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.info.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.rounded.state.focus.severity.info.focusRing.shadow}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.rounded.state.focus.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.focus.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.focus.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.warning.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.rounded.state.focus.severity.warning.focusRing.shadow}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.rounded.state.focus.severity.help.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.focus.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.focus.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.help.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.rounded.state.focus.severity.help.focusRing.shadow}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.rounded.state.focus.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.focus.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.focus.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.danger.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.rounded.state.focus.severity.danger.focusRing.shadow}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.rounded.state.focus.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.focus.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.focus.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.rounded.state.focus.severity.contrast.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.rounded.state.focus.severity.contrast.focusRing.shadow}}"
          }
        }
      }
    },
    disabled: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.rounded.state.disabled.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.rounded.state.disabled.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.rounded.state.disabled.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.rounded.state.disabled.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.rounded.state.disabled.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.disabled.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.disabled.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.disabled.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.rounded.state.disabled.severity.success.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.disabled.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.disabled.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.disabled.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.rounded.state.disabled.severity.info.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.disabled.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.disabled.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.disabled.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.rounded.state.disabled.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.disabled.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.disabled.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.disabled.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.rounded.state.disabled.severity.help.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.disabled.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.disabled.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.disabled.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.rounded.state.disabled.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.disabled.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.disabled.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.disabled.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.rounded.state.disabled.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.rounded.state.disabled.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.rounded.state.disabled.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.rounded.state.disabled.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    }
  }
};

const raisedVariantDefault: z.input<typeof buttonDisplayVariant> = {
  border: {
    width: "{{primitives.border.width.sm}}",
    radius: "{{primitives.radius.md}}"
  },
  layout: {
    gap: "{{primitives.space.xs}}",
    paddingX: "{{primitives.space.md}}",
    paddingY: "{{primitives.space.sm}}",
    iconOnlyWidth: "{{primitives.space.lg}}"
  },
  defaultState: {
    defaultSeverity: {
      background: "{{primitives.defaultVariant.raised.defaultState.defaultSeverity.bg}}",
      color: "{{primitives.defaultVariant.raised.defaultState.defaultSeverity.contrast}}",
      border: {
        color: "{{primitives.defaultVariant.raised.defaultState.defaultSeverity.border.color}}",
        style: "{{primitives.defaultVariant.raised.defaultState.defaultSeverity.border.style}}",
        width: "{{primitives.border.width.sm}}"
      },
      shadow: "{{primitives.shadow.md}}"
    },
    severity: {
      secondary: {
        background: "{{primitives.defaultVariant.raised.defaultState.severity.secondary.bg}}",
        color: "{{primitives.defaultVariant.raised.defaultState.severity.secondary.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.defaultState.severity.secondary.border.color}}",
          style: "{{primitives.defaultVariant.raised.defaultState.severity.secondary.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        shadow: "{{primitives.shadow.md}}"
      },
      success: {
        background: "{{primitives.defaultVariant.raised.defaultState.severity.success.bg}}",
        color: "{{primitives.defaultVariant.raised.defaultState.severity.success.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.defaultState.severity.success.border.color}}",
          style: "{{primitives.defaultVariant.raised.defaultState.severity.success.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        shadow: "{{primitives.shadow.md}}"
      },
      info: {
        background: "{{primitives.defaultVariant.raised.defaultState.severity.info.bg}}",
        color: "{{primitives.defaultVariant.raised.defaultState.severity.info.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.defaultState.severity.info.border.color}}",
          style: "{{primitives.defaultVariant.raised.defaultState.severity.info.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        shadow: "{{primitives.shadow.md}}"
      },
      warning: {
        background: "{{primitives.defaultVariant.raised.defaultState.severity.warning.bg}}",
        color: "{{primitives.defaultVariant.raised.defaultState.severity.warning.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.defaultState.severity.warning.border.color}}",
          style: "{{primitives.defaultVariant.raised.defaultState.severity.warning.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        shadow: "{{primitives.shadow.md}}"
      },
      help: {
        background: "{{primitives.defaultVariant.raised.defaultState.severity.help.bg}}",
        color: "{{primitives.defaultVariant.raised.defaultState.severity.help.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.defaultState.severity.help.border.color}}",
          style: "{{primitives.defaultVariant.raised.defaultState.severity.help.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        shadow: "{{primitives.shadow.md}}"
      },
      danger: {
        background: "{{primitives.defaultVariant.raised.defaultState.severity.danger.bg}}",
        color: "{{primitives.defaultVariant.raised.defaultState.severity.danger.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.defaultState.severity.danger.border.color}}",
          style: "{{primitives.defaultVariant.raised.defaultState.severity.danger.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        shadow: "{{primitives.shadow.md}}"
      },
      contrast: {
        background: "{{primitives.defaultVariant.raised.defaultState.severity.contrast.bg}}",
        color: "{{primitives.defaultVariant.raised.defaultState.severity.contrast.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.defaultState.severity.contrast.border.color}}",
          style: "{{primitives.defaultVariant.raised.defaultState.severity.contrast.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        shadow: "{{primitives.shadow.md}}"
      }
    }
  },
  state: {
    hover: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.raised.state.hover.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.raised.state.hover.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.state.hover.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.raised.state.hover.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        shadow: "{{primitives.shadow.lg}}"
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.raised.state.hover.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.raised.state.hover.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.hover.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.hover.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          shadow: "{{primitives.shadow.lg}}"
        },
        success: {
          background: "{{primitives.defaultVariant.raised.state.hover.severity.success.bg}}",
          color: "{{primitives.defaultVariant.raised.state.hover.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.hover.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.hover.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          shadow: "{{primitives.shadow.lg}}"
        },
        info: {
          background: "{{primitives.defaultVariant.raised.state.hover.severity.info.bg}}",
          color: "{{primitives.defaultVariant.raised.state.hover.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.hover.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.hover.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          shadow: "{{primitives.shadow.lg}}"
        },
        warning: {
          background: "{{primitives.defaultVariant.raised.state.hover.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.raised.state.hover.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.hover.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.hover.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          shadow: "{{primitives.shadow.lg}}"
        },
        help: {
          background: "{{primitives.defaultVariant.raised.state.hover.severity.help.bg}}",
          color: "{{primitives.defaultVariant.raised.state.hover.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.hover.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.hover.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          shadow: "{{primitives.shadow.lg}}"
        },
        danger: {
          background: "{{primitives.defaultVariant.raised.state.hover.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.raised.state.hover.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.hover.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.hover.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          shadow: "{{primitives.shadow.lg}}"
        },
        contrast: {
          background: "{{primitives.defaultVariant.raised.state.hover.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.raised.state.hover.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.hover.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.hover.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          shadow: "{{primitives.shadow.lg}}"
        }
      }
    },
    active: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.raised.state.active.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.raised.state.active.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.state.active.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.raised.state.active.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.raised.state.active.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.raised.state.active.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.active.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.active.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.raised.state.active.severity.success.bg}}",
          color: "{{primitives.defaultVariant.raised.state.active.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.active.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.active.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.raised.state.active.severity.info.bg}}",
          color: "{{primitives.defaultVariant.raised.state.active.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.active.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.active.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.raised.state.active.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.raised.state.active.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.active.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.active.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.raised.state.active.severity.help.bg}}",
          color: "{{primitives.defaultVariant.raised.state.active.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.active.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.active.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.raised.state.active.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.raised.state.active.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.active.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.active.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.raised.state.active.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.raised.state.active.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.active.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.active.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    },
    focus: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        },
        focusRing: {
          width: "{{primitives.focusRing.width.sm}}",
          style: "{{primitives.focusRing.style}}",
          color: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.focusRing.color}}",
          offset: "{{primitives.focusRing.offset.sm}}",
          shadow: "{{primitives.defaultVariant.raised.state.focus.defaultSeverity.focusRing.shadow}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.raised.state.focus.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.raised.state.focus.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.focus.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.focus.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.raised.state.focus.severity.secondary.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.raised.state.focus.severity.secondary.focusRing.shadow}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.raised.state.focus.severity.success.bg}}",
          color: "{{primitives.defaultVariant.raised.state.focus.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.focus.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.focus.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.raised.state.focus.severity.success.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.raised.state.focus.severity.success.focusRing.shadow}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.raised.state.focus.severity.info.bg}}",
          color: "{{primitives.defaultVariant.raised.state.focus.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.focus.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.focus.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.raised.state.focus.severity.info.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.raised.state.focus.severity.info.focusRing.shadow}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.raised.state.focus.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.raised.state.focus.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.focus.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.focus.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.raised.state.focus.severity.warning.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.raised.state.focus.severity.warning.focusRing.shadow}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.raised.state.focus.severity.help.bg}}",
          color: "{{primitives.defaultVariant.raised.state.focus.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.focus.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.focus.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.raised.state.focus.severity.help.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.raised.state.focus.severity.help.focusRing.shadow}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.raised.state.focus.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.raised.state.focus.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.focus.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.focus.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.raised.state.focus.severity.danger.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.raised.state.focus.severity.danger.focusRing.shadow}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.raised.state.focus.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.raised.state.focus.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.focus.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.focus.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          },
          focusRing: {
            width: "{{primitives.focusRing.width.sm}}",
            style: "{{primitives.focusRing.style}}",
            color: "{{primitives.defaultVariant.raised.state.focus.severity.contrast.focusRing.color}}",
            offset: "{{primitives.focusRing.offset.sm}}",
            shadow: "{{primitives.defaultVariant.raised.state.focus.severity.contrast.focusRing.shadow}}"
          }
        }
      }
    },
    disabled: {
      defaultSeverity: {
        background: "{{primitives.defaultVariant.raised.state.disabled.defaultSeverity.bg}}",
        color: "{{primitives.defaultVariant.raised.state.disabled.defaultSeverity.contrast}}",
        border: {
          color: "{{primitives.defaultVariant.raised.state.disabled.defaultSeverity.border.color}}",
          style: "{{primitives.defaultVariant.raised.state.disabled.defaultSeverity.border.style}}",
          width: "{{primitives.border.width.sm}}"
        }
      },
      severity: {
        secondary: {
          background: "{{primitives.defaultVariant.raised.state.disabled.severity.secondary.bg}}",
          color: "{{primitives.defaultVariant.raised.state.disabled.severity.secondary.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.disabled.severity.secondary.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.disabled.severity.secondary.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        success: {
          background: "{{primitives.defaultVariant.raised.state.disabled.severity.success.bg}}",
          color: "{{primitives.defaultVariant.raised.state.disabled.severity.success.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.disabled.severity.success.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.disabled.severity.success.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        info: {
          background: "{{primitives.defaultVariant.raised.state.disabled.severity.info.bg}}",
          color: "{{primitives.defaultVariant.raised.state.disabled.severity.info.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.disabled.severity.info.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.disabled.severity.info.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        warning: {
          background: "{{primitives.defaultVariant.raised.state.disabled.severity.warning.bg}}",
          color: "{{primitives.defaultVariant.raised.state.disabled.severity.warning.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.disabled.severity.warning.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.disabled.severity.warning.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        help: {
          background: "{{primitives.defaultVariant.raised.state.disabled.severity.help.bg}}",
          color: "{{primitives.defaultVariant.raised.state.disabled.severity.help.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.disabled.severity.help.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.disabled.severity.help.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        danger: {
          background: "{{primitives.defaultVariant.raised.state.disabled.severity.danger.bg}}",
          color: "{{primitives.defaultVariant.raised.state.disabled.severity.danger.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.disabled.severity.danger.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.disabled.severity.danger.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        },
        contrast: {
          background: "{{primitives.defaultVariant.raised.state.disabled.severity.contrast.bg}}",
          color: "{{primitives.defaultVariant.raised.state.disabled.severity.contrast.contrast}}",
          border: {
            color: "{{primitives.defaultVariant.raised.state.disabled.severity.contrast.border.color}}",
            style: "{{primitives.defaultVariant.raised.state.disabled.severity.contrast.border.style}}",
            width: "{{primitives.border.width.sm}}"
          }
        }
      }
    }
  }
};

export const button = z.object({
  sizes: (buttonSizes as typeof buttonSizes).optional(),
  transition: (buttonTransition as typeof buttonTransition).prefault({}),
  fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
  disabledOpacity: withRef(z.string()).default("0.6"),
  roundedBorderRadius: withRef(z.string()).default("{{primitives.radius.full}}"),
  raisedShadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
  badgeSize: withRef(z.string()).default("{{primitives.space.lg}}"),
  defaultVariant: (buttonDisplayVariant as typeof buttonDisplayVariant).default(defaultVariantDefault),
  variants: z
    .object({
      link: (buttonLinkVariant as typeof buttonLinkVariant).default(linkVariantDefault).optional(),
      text: (buttonDisplayVariant as typeof buttonDisplayVariant).default(textVariantDefault).optional(),
      outlined: (buttonDisplayVariant as typeof buttonDisplayVariant).default(outlinedVariantDefault).optional(),
      rounded: (buttonDisplayVariant as typeof buttonDisplayVariant).default(roundedVariantDefault).optional(),
      raised: (buttonDisplayVariant as typeof buttonDisplayVariant).default(raisedVariantDefault).optional(),
    })
    .prefault({})
    .optional(),
})
  .register(themeSchemaRegistry, { id: "button" });
