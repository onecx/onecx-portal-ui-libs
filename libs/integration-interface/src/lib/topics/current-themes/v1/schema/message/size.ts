import z from 'zod'
import { font, icon, withRef } from '../primitives'

const MESSAGE_XS_DEFAULTS = {
  padding: '{{primitives.space.xs}}',
  font: {
    size: '{{primitives.font.size.xs}}',
  },
  icon: {
    size: '{{primitives.icon.size.xs}}',
  },
  close: {
    icon: {
      size: '{{primitives.icon.size.xs}}',
    },
  },
}

const MESSAGE_SM_DEFAULTS = {
  padding: '{{primitives.space.sm}}',
  font: {
    size: '{{primitives.font.size.sm}}',
  },
  icon: {
    size: '{{primitives.icon.size.sm}}',
  },
  close: {
    icon: {
      size: '{{primitives.icon.size.sm}}',
    },
  },
}

const MESSAGE_MD_DEFAULTS = {
  padding: '{{primitives.space.md}}',
  font: {
    size: '{{primitives.font.size.md}}',
  },
  icon: {
    size: '{{primitives.icon.size.md}}',
  },
  close: {
    icon: {
      size: '{{primitives.icon.size.md}}',
    },
  },
}

const MESSAGE_LG_DEFAULTS = {
  padding: '{{primitives.space.lg}}',
  font: {
    size: '{{primitives.font.size.lg}}',
  },
  icon: {
    size: '{{primitives.icon.size.lg}}',
  },
  close: {
    icon: {
      size: '{{primitives.icon.size.lg}}',
    },
  },
}

const MESSAGE_XL_DEFAULTS = {
  padding: '{{primitives.space.xl}}',
  font: {
    size: '{{primitives.font.size.xl}}',
  },
  icon: {
    size: '{{primitives.icon.size.xl}}',
  },
  close: {
    icon: {
      size: '{{primitives.icon.size.xl}}',
    },
  },
}
export class MessageSizeSchema {
  static readonly sizeTokens = {
    xs: z
      .object({
        padding: withRef(z.string()).default(MESSAGE_XS_DEFAULTS.padding).optional(),
        font: font.pick({ size: true }).default({ size: MESSAGE_XS_DEFAULTS.font.size }),
        icon: icon.pick({ size: true }).default({ size: MESSAGE_XS_DEFAULTS.icon.size }),
        close: z.object({
          icon: icon.pick({ size: true }).default({ size: MESSAGE_XS_DEFAULTS.close.icon.size }),
        }),
      })
      .default(MESSAGE_XS_DEFAULTS),
    sm: z
      .object({
        padding: withRef(z.string()).default(MESSAGE_SM_DEFAULTS.padding).optional(),
        font: font.pick({ size: true }).default({ size: MESSAGE_SM_DEFAULTS.font.size }),
        icon: icon.pick({ size: true }).default({ size: MESSAGE_SM_DEFAULTS.icon.size }),
        close: z.object({
          icon: icon.pick({ size: true }).default({ size: MESSAGE_SM_DEFAULTS.close.icon.size }),
        }),
      })
      .default(MESSAGE_SM_DEFAULTS),
    md: z
      .object({
        padding: withRef(z.string()).default(MESSAGE_MD_DEFAULTS.padding).optional(),
        font: font.pick({ size: true }).default({ size: MESSAGE_MD_DEFAULTS.font.size }),
        icon: icon.pick({ size: true }).default({ size: MESSAGE_MD_DEFAULTS.icon.size }),
        close: z.object({
          icon: icon.pick({ size: true }).default({ size: MESSAGE_MD_DEFAULTS.close.icon.size }),
        }),
      })
      .default(MESSAGE_MD_DEFAULTS),
    lg: z
      .object({
        padding: withRef(z.string()).default(MESSAGE_LG_DEFAULTS.padding).optional(),
        font: font.pick({ size: true }).default({ size: MESSAGE_LG_DEFAULTS.font.size }),
        icon: icon.pick({ size: true }).default({ size: MESSAGE_LG_DEFAULTS.icon.size }),
        close: z.object({
          icon: icon.pick({ size: true }).default({ size: MESSAGE_LG_DEFAULTS.close.icon.size }),
        }),
      })
      .default(MESSAGE_LG_DEFAULTS),
    xl: z
      .object({
        padding: withRef(z.string()).default(MESSAGE_XL_DEFAULTS.padding).optional(),
        font: font.pick({ size: true }).default({ size: MESSAGE_XL_DEFAULTS.font.size }),
        icon: icon.pick({ size: true }).default({ size: MESSAGE_XL_DEFAULTS.icon.size }),
        close: z.object({
          icon: icon.pick({ size: true }).default({ size: MESSAGE_XL_DEFAULTS.close.icon.size }),
        }),
      })
      .default(MESSAGE_XL_DEFAULTS),
  }
}
