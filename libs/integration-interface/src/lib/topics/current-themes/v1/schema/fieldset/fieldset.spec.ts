import { fieldset } from '../fieldset'
import { expectExactTokens, expectExactUndefinedTokens } from '../test-utils'
import { LegendSchema } from './legend'
import { FieldsetSettingsSchema } from './settings'

const FIELDSET_BASE_TOKENS = {
  backgroundColor: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
  },
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  padding: '{{primitives.space.md}}',
  transition: { duration: '{{primitives.transition.duration}}' },
  font: {
    family: '{{primitives.font.family}}',
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
  },
}

const FIELDSET_LEGEND_BASE_TOKENS = {
  backgroundColor: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  border: {
    radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
    width: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    offset: '{{primitives.border.offset.sm}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  },
  padding: '{{primitives.space.md}}',
  gap: '{{primitives.space.md}}',
  font: {
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
    family: '{{primitives.font.family}}',
  },
  focusRing: {
    width: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.width}}',
    style: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.style}}',
    offset: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.offset}}',
    shadow: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}',
  },
}

const FIELDSET_LEGEND_HOVER_TOKENS = {
  backgroundColor: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}',
  color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
  },
}

const FIELDSET_LEGEND_ACTIVE_TOKENS = {
  backgroundColor: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}',
  color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
  },
}

const FIELDSET_LEGEND_DISABLED_TOKENS = {
  backgroundColor: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}',
  color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
  },
  opacity: '0.5',
}

const FIELDSET_LEGEND_FOCUS_TOKENS = {
  backgroundColor: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}',
  color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
  },
  focusRing: {
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}',
  },
}

const FIELDSET_LEGEND_TOGGLE_ICON_TOKENS = {
  size: '{{primitives.icon.size}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  hover: {
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
  },
  width: '{{primitives.icon.size}}',
  height: '{{primitives.icon.size}}',
}

describe('fieldset schema', () => {
  it('should test parsing an empty object', () => {
    const result = fieldset.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('fieldset tokens', () => {
    it('should apply base tokens', () => {
      const result = fieldset.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, fieldset.shape, [])
      expectExactTokens(value, {
        ...FIELDSET_BASE_TOKENS,
        settings: { toggleable: true, collapsed: true },
        legend: {
          ...FIELDSET_LEGEND_BASE_TOKENS,
          hover: FIELDSET_LEGEND_HOVER_TOKENS,
          focus: FIELDSET_LEGEND_FOCUS_TOKENS,
          active: FIELDSET_LEGEND_ACTIVE_TOKENS,
          disabled: FIELDSET_LEGEND_DISABLED_TOKENS,
          toggleIcon: FIELDSET_LEGEND_TOGGLE_ICON_TOKENS,
        },
      })
    })
  })

  it('should test fieldset settings', () => {
    const result = fieldset.safeParse({})

    expect(result.success).toBe(true)

    const value = result.data
    expectExactUndefinedTokens(value?.settings, FieldsetSettingsSchema.schema.shape, [])
    expectExactTokens(value?.settings, {
      toggleable: true,
      collapsed: true,
    })
  })

  describe('fieldset legends', () => {
    it('should test base tokens', () => {
      const result = fieldset.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data

      expectExactUndefinedTokens(value?.legend, LegendSchema.schema.shape, [])
      expectExactTokens(value?.legend, {
        ...FIELDSET_LEGEND_BASE_TOKENS,
        hover: FIELDSET_LEGEND_HOVER_TOKENS,
        focus: FIELDSET_LEGEND_FOCUS_TOKENS,
        active: FIELDSET_LEGEND_ACTIVE_TOKENS,
        disabled: FIELDSET_LEGEND_DISABLED_TOKENS,
        toggleIcon: FIELDSET_LEGEND_TOGGLE_ICON_TOKENS,
      })
    })

    it('should test hover tokens', () => {
      const result = fieldset.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data

      expectExactUndefinedTokens(value?.legend.hover, LegendSchema.hoverTokens.shape, [])
      expectExactTokens(value?.legend.hover, FIELDSET_LEGEND_HOVER_TOKENS)
    })

    it('should test active tokens', () => {
      const result = fieldset.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data

      expectExactUndefinedTokens(value?.legend.active, LegendSchema.activeTokens.shape, [])
      expectExactTokens(value?.legend.active, FIELDSET_LEGEND_ACTIVE_TOKENS)
    })

    it('should test disabled tokens', () => {
      const result = fieldset.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data

      expectExactUndefinedTokens(value?.legend.disabled, LegendSchema.disabledTokens.shape, [])
      expectExactTokens(value?.legend.disabled, FIELDSET_LEGEND_DISABLED_TOKENS)
    })

    it('should test focus tokens', () => {
      const result = fieldset.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data

      expectExactUndefinedTokens(value?.legend.focus, LegendSchema.focusTokens.shape, [])
      expectExactTokens(value?.legend.focus, FIELDSET_LEGEND_FOCUS_TOKENS)
    })

    it('should test toggle icon tokens', () => {
      const result = fieldset.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data

      expectExactUndefinedTokens(value?.legend.toggleIcon, LegendSchema.iconTokens.shape, [])
      expectExactTokens(value?.legend.toggleIcon, FIELDSET_LEGEND_TOGGLE_ICON_TOKENS)
    })

    it('should test toggle icon hover tokens', () => {
      const result = fieldset.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.legend.toggleIcon.hover, {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      })
    })
  })
})
