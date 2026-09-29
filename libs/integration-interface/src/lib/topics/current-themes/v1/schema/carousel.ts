/**
 * This file defines the schema for carousel theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from 'zod'
import { bg, bgContrast, border, borderWithShadow, color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

export const carouselSettings = z
  .object({
    orientation: withRef(z.enum(['horizontal', 'vertical'])).default('horizontal'),
    showIndicators: withRef(z.boolean()).default(true),
    showNavigators: withRef(z.boolean()).default(true),
    circular: withRef(z.boolean()).default(false),
    autoplayInterval: withRef(z.number()).default(0),
  })
  .register(themeSchemaRegistry, { id: 'carouselSettings' })

export const carouselTransition = z
  .object({
    duration: withRef(z.string()).default('{{primitives.transition.duration}}'),
  })
  .register(themeSchemaRegistry, { id: 'carouselTransition' })

export const carouselContainer = bgContrast
  .extend({
    bg: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'
    ),
    contrast: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'carouselContainer' })

export const carouselContent = z
  .object({
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
  })
  .register(themeSchemaRegistry, { id: 'carouselContent' })

// Navigation button hover state — same tokens as default (bg, contrast, border)
export const carouselNavigationButtonHover = z
  .object({
    bg: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'
    ),
    contrast: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'carouselNavigationButtonHover' })

// Navigation button active state — same tokens as default (bg, contrast, border)
export const carouselNavigationButtonActive = z
  .object({
    bg: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}'
    ),
    contrast: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'carouselNavigationButtonActive' })

// Navigation button focus state — same tokens as default (bg, contrast, border)
export const carouselNavigationButtonFocus = z
  .object({
    bg: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'
    ),
    contrast: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'carouselNavigationButtonFocus' })

// Navigation button — default state tokens + nested states (hover, active, focus)
// focusRing is at the variant level, NOT inside state objects.
export const carouselNavigationButton = bgContrast
  .extend({
    bg: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'
    ),
    contrast: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.sm}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
    focusRing: borderWithShadow.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    hover: (carouselNavigationButtonHover as typeof carouselNavigationButtonHover).prefault({}),
    active: (carouselNavigationButtonActive as typeof carouselNavigationButtonActive).prefault({}),
    focus: (carouselNavigationButtonFocus as typeof carouselNavigationButtonFocus).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'carouselNavigationButton' })

// Indicator hover state — same tokens as default (bg, contrast, border)
export const carouselIndicatorHover = z
  .object({
    bg: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'
    ),
    contrast: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'carouselIndicatorHover' })

// Indicator active state — same tokens as default (bg, contrast, border)
export const carouselIndicatorActive = z
  .object({
    bg: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}'
    ),
    contrast: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'carouselIndicatorActive' })

// Indicator focus state — same tokens as default (bg, contrast, border)
export const carouselIndicatorFocus = z
  .object({
    bg: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'
    ),
    contrast: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'carouselIndicatorFocus' })

// Indicator — default state tokens (bg, contrast, border, width, height, focusRing) + nested states
// focusRing is at the variant level, NOT inside state objects.
export const carouselIndicator = bgContrast
  .extend({
    bg: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'
    ),
    contrast: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    width: withRef(z.string()).default('{{primitives.space.md}}'),
    height: withRef(z.string()).default('{{primitives.space.md}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.none}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
    focusRing: borderWithShadow.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    hover: (carouselIndicatorHover as typeof carouselIndicatorHover).prefault({}),
    active: (carouselIndicatorActive as typeof carouselIndicatorActive).prefault({}),
    focus: (carouselIndicatorFocus as typeof carouselIndicatorFocus).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'carouselIndicator' })

export const carousel = z
  .object({
    settings: (carouselSettings as typeof carouselSettings).optional(),
    transition: (carouselTransition as typeof carouselTransition).prefault({}),
    container: (carouselContainer as typeof carouselContainer).prefault({}),
    content: (carouselContent as typeof carouselContent).prefault({}),
    navigationButton: (carouselNavigationButton as typeof carouselNavigationButton).prefault({}),
    indicator: (carouselIndicator as typeof carouselIndicator).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'carousel' })