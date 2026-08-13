import { button } from './button'
import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import {
  primaryBorderDefaults,
  primaryFocusRingDefaults,
  primaryButtonHover,
  primaryButtonActive,
  primaryButtonFocus,
  primaryButtonDisabled,
  primaryButtonRounded,
  primaryButtonIconOnly,
  primaryButtonRaised,
  primaryButtonText,
  primaryButtonTextRaised,
  primaryButtonOutlined,
} from './button/primary'
import {
  secondaryButton,
  secondaryButtonHover,
  secondaryButtonActive,
  secondaryButtonFocus,
  secondaryButtonDisabled,
  secondaryButtonRounded,
  secondaryButtonIconOnly,
  secondaryButtonRaised,
  secondaryButtonText,
  secondaryButtonTextRaised,
  secondaryButtonOutlined,
} from './button/secondary'

describe('button schema', () => {
  it('parses an empty object', () => {
    const result = button.safeParse({})
    expect(result.success).toBe(true)
  })

  describe('button tokens', () => {
    it('should apply root defaults', () => {
      const result = button.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, button.shape, [])
      expectExactTokens(value, {
        background: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.contrast}}',
        font: {
          weight: '{{primitives.font.weight}}',
          lineHeight: '{{primitives.font.lineHeight}}',
          letterSpacing: '{{primitives.font.letterSpacing}}',
          style: '{{primitives.font.style}}',
        },
        border: {
          ...primaryBorderDefaults,
        },
        paddingX: '{{primitives.space.md}}',
        paddingY: '{{primitives.space.sm}}',
        focusRing: {
          ...primaryFocusRingDefaults,
        },
        hover: expect.any(Object),
        active: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        rounded: expect.any(Object),
        iconOnly: expect.any(Object),
        raised: expect.any(Object),
        text: expect.any(Object),
        textRaised: expect.any(Object),
        outlined: expect.any(Object),
        secondary: expect.any(Object),
        sm: {
          font: { size: '{{primitives.font.size.sm}}' },
          paddingX: '{{primitives.space.sm}}',
          paddingY: '{{primitives.space.xs}}',
        },
        md: {
          font: { size: '{{primitives.font.size.md}}' },
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.sm}}',
        },
        lg: {
          font: { size: '{{primitives.font.size.lg}}' },
          paddingX: '{{primitives.space.lg}}',
          paddingY: '{{primitives.space.md}}',
        },
        success: expect.any(Object),
        info: expect.any(Object),
        warning: expect.any(Object),
        danger: expect.any(Object),
        contrast: expect.any(Object),
      })
    })

    describe('severity defaults', () => {
      it('should apply info severity defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data as any
        expectExactTokens(value.info, {
          background: '{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.bg}}',
          color: '{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.border.color}}',
            style: '{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
        })
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.hover, primaryButtonHover.shape, [])
        expectExactTokens(value?.hover, {
          background: '{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('active state', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.active, primaryButtonActive.shape, [])
        expectExactTokens(value?.active, {
          background: '{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.focus, primaryButtonFocus.shape, [])
        expectExactTokens(value?.focus, {
          background: '{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('disabled state', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.disabled, primaryButtonDisabled.shape, [])
        expectExactTokens(value?.disabled, {
          background: '{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('rounded variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.rounded, primaryButtonRounded.shape, [])
        expectExactTokens(value?.rounded, {
          background: '{{primitives.defaultVariant.variant.rounded.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.variant.rounded.defaultState.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.full}}',
            shadow: '{{primitives.shadow.none}}',
          },
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('iconOnly variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.iconOnly, primaryButtonIconOnly.shape, ['width'])
        expectExactTokens(value?.iconOnly, {
          background: '{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.contrast}}',
          border: primaryBorderDefaults,
          icon: {
            color: '{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.contrast}}',
            size: '{{primitives.icon.size.sm}}',
          },
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('raised variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.raised, primaryButtonRaised.shape, [])
        expectExactTokens(value?.raised, {
          background: '{{primitives.defaultVariant.variant.raised.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.variant.raised.defaultState.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.md}}',
          },
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('text variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.text, primaryButtonText.shape, [])
        expectExactTokens(value?.text, {
          background: '{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.contrast}}',
          border: primaryBorderDefaults,
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('textRaised variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.textRaised, primaryButtonTextRaised.shape, [])
        expectExactTokens(value?.textRaised, {
          background: '{{primitives.defaultVariant.variant.raisedText.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.variant.raisedText.defaultState.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.md}}',
          },
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('outlined variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.outlined, primaryButtonOutlined.shape, [])
        expectExactTokens(value?.outlined, {
          background: '{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.contrast}}',
          border: primaryBorderDefaults,
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })
    })

    describe('secondary button', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.secondary, secondaryButton.shape, [])
        expectExactTokens(value?.secondary, {
          background: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.contrast}}',
          font: {
            weight: '{{primitives.font.weight}}',
            lineHeight: '{{primitives.font.lineHeight}}',
            letterSpacing: '{{primitives.font.letterSpacing}}',
            style: '{{primitives.font.style}}',
          },
          border: {
            color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.sm}}',
          focusRing: {
            color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
            style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          rounded: expect.any(Object),
          iconOnly: expect.any(Object),
          raised: expect.any(Object),
          text: expect.any(Object),
          textRaised: expect.any(Object),
          outlined: expect.any(Object),
          sm: {
            font: { size: '{{primitives.font.size.sm}}' },
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.xs}}',
          },
          md: {
            font: { size: '{{primitives.font.size.md}}' },
            paddingX: '{{primitives.space.md}}',
            paddingY: '{{primitives.space.sm}}',
          },
          lg: {
            font: { size: '{{primitives.font.size.lg}}' },
            paddingX: '{{primitives.space.lg}}',
            paddingY: '{{primitives.space.md}}',
          },
          success: expect.any(Object),
          info: expect.any(Object),
          warning: expect.any(Object),
          danger: expect.any(Object),
          contrast: expect.any(Object),
        })
      })

      describe('severity defaults', () => {
        it('should apply info severity defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data as any
          expectExactTokens(value.secondary.info, {
            background: '{{primitives.variant.primary.defaultVariant.defaultState.severity.info.bg}}',
            color: '{{primitives.variant.primary.defaultVariant.defaultState.severity.info.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.defaultState.severity.info.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.defaultState.severity.info.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
          })
        })
      })

      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.hover, secondaryButtonHover.shape, [])
          expectExactTokens(value?.secondary?.hover, {
            background: '{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })

      describe('active state', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.active, secondaryButtonActive.shape, [])
          expectExactTokens(value?.secondary?.active, {
            background: '{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.focus, secondaryButtonFocus.shape, [])
          expectExactTokens(value?.secondary?.focus, {
            background: '{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })

      describe('disabled state', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.disabled, secondaryButtonDisabled.shape, [])
          expectExactTokens(value?.secondary?.disabled, {
            background: '{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })

      describe('rounded variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.rounded, secondaryButtonRounded.shape, [])
          expectExactTokens(value?.secondary?.rounded, {
            background: '{{primitives.variant.primary.variant.rounded.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.variant.rounded.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.full}}',
              shadow: '{{primitives.shadow.none}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })

      describe('iconOnly variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.iconOnly, secondaryButtonIconOnly.shape, ['width'])
          expectExactTokens(value?.secondary?.iconOnly, {
            background: '{{primitives.variant.primary.variant.iconOnly.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.variant.iconOnly.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })

      describe('raised variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.raised, secondaryButtonRaised.shape, [])
          expectExactTokens(value?.secondary?.raised, {
            background: '{{primitives.variant.primary.variant.raised.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.variant.raised.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.md}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })

      describe('text variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.text, secondaryButtonText.shape, [])
          expectExactTokens(value?.secondary?.text, {
            background: '{{primitives.variant.primary.variant.text.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.variant.text.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })

      describe('textRaised variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.textRaised, secondaryButtonTextRaised.shape, [])
          expectExactTokens(value?.secondary?.textRaised, {
            background: '{{primitives.variant.primary.variant.raisedText.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.variant.raisedText.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.md}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })

      describe('outlined variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.secondary?.outlined, secondaryButtonOutlined.shape, [])
          expectExactTokens(value?.secondary?.outlined, {
            background: '{{primitives.variant.primary.variant.outlined.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.variant.outlined.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            success: expect.any(Object),
            info: expect.any(Object),
            warning: expect.any(Object),
            danger: expect.any(Object),
            contrast: expect.any(Object),
          })
        })
      })
    })
  })
})
