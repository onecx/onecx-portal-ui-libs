import { accordion } from './accordion'
import { AccordionContentSchema } from './accordion/content'
import { AccordionHeaderSchema } from './accordion/header'
import { AccordionPanelSchema } from './accordion/panel'
import { AccordionSettingsSchema } from './accordion/settings'
import { expectExactUndefinedTokens, expectExactTokens, expectTokens } from './test-utils'

describe('accordion schema', () => {
  it('parses an empty object', () => {
    const result = accordion.safeParse({})
    expect(result.success).toBe(true)
  })

  describe('accordion settings', () => {
    it('should apply defaults', () => {
      const result = accordion.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.settings, AccordionSettingsSchema.schema.shape, [])
      expectExactTokens(value?.settings, {
        defaultExpanded: false,
        expandMultiple: false,
        expandIconName: 'chevron-down',
        collapseIconName: 'chevron-up',
      })
    })
  })

  describe('accordion panel', () => {
    it('should apply defaults', () => {
      const result = accordion.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel, AccordionPanelSchema.schema.shape, [])
      expectExactTokens(value?.panel, {
        padding: '{{primitives.space.md}}',
        border: {
          width: '{{primitives.border.width.md}}',
          style: '{{primitives.border.style.solid}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        },
      })
    })
  })

  describe('accordion header', () => {
    it('should apply base tokens', () => {
      const result = accordion.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header, AccordionHeaderSchema.schema.shape, [])
      expectTokens(value?.header, {
        padding: '{{primitives.space.md}}',
        font: {
          weight: '{{primitives.font.weight.bold}}',
          size: '{{primitives.font.size.md}}',
        },
        border: {
          radius: '{{primitives.radius.md}}',
          width: '{{primitives.border.width.md}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        },
        toggleIcon: expect.any(Object),
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
      })
    })

    it('should apply tokens with states', () => {
      const result = accordion.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.header
      expectExactUndefinedTokens(value?.hover, {
        color: true,
        background: true,
      }, [])
      expectExactTokens(value?.hover, {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}',
      })

      expectExactUndefinedTokens(value?.active, {
        color: true,
        background: true,
        hover: true,
      }, [])
      expectExactTokens(value?.active, {
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
        background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}',
        hover: {
          color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}',
        },
      })

      expectExactUndefinedTokens(value?.focus, {
        color: true,
        background: true,
      }, [])
      expectExactTokens(value?.focus, {
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}',
      })
    })

    it('should apply focusRing tokens', () => {
      const result = accordion.safeParse({})

      expect(result.success).toBe(true)

      
      const value = result.data?.header
      expectExactUndefinedTokens(value?.focusRing, {
        width: true,
        style: true,
        shadow: true,
        offset: true,
        color: true,
      }, [])
      expectExactTokens(value?.focusRing, {
        width: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.width}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
        shadow: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.shadow}}',
        offset: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.offset}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      })
    })

    it('should apply toggleIcon tokens with states', () => {
      const result = accordion.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.header?.toggleIcon
      expectExactTokens(value, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        hover: {
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        },
        active: {
          color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          hover: {
            color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          },
        },
        focus: {
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        },
      })
    })
  })

  describe('accordion content', () => {
    it('should apply defaults', () => {
      const result = accordion.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content, AccordionContentSchema.schema.shape, [])
      expectExactTokens(value?.content, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
        border: {
          width: '{{primitives.border.width.md}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
        },
        padding: '{{primitives.space.md}}',
      })
    })
  })
})
