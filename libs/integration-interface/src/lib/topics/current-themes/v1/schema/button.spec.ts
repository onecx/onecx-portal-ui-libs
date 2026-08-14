import { button } from './button'
import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import {
  buttonFont,
  borderDefaults,
  focusRingDefaults,
  defaultButtonHover,
  defaultButtonActive,
  defaultButtonFocus,
  defaultButtonDisabled,
  defaultButtonRounded,
  defaultButtonIconOnly,
  defaultButtonRaised,
  defaultButtonText,
  defaultButtonTextRaised,
  defaultButtonOutlined,
} from './button/default'
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
import {
  primaryVariantButton,
  primaryVariantButtonHover,
  primaryVariantButtonActive,
  primaryVariantButtonFocus,
  primaryVariantButtonDisabled,
  primaryVariantButtonRounded,
  primaryVariantButtonIconOnly,
  primaryVariantButtonRaised,
  primaryVariantButtonText,
  primaryVariantButtonTextRaised,
  primaryVariantButtonOutlined,
} from './button/primary-variant'

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
          ...borderDefaults,
        },
        paddingX: '{{primitives.space.md}}',
        paddingY: '{{primitives.space.sm}}',
        focusRing: {
          ...focusRingDefaults,
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
        primary: expect.any(Object),
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
        severity: expect.any(Object),
      })
    })

    describe('severity defaults', () => {
      it('should apply info severity defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data as any
        expectExactTokens(value.severity?.info, {
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
        expectExactUndefinedTokens(value?.hover, defaultButtonHover.shape, [])
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
          severity: expect.any(Object),
        })
      })
    })

    describe('active state', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.active, defaultButtonActive.shape, [])
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
          severity: expect.any(Object),
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.focus, defaultButtonFocus.shape, [])
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
          severity: expect.any(Object),
        })
      })
    })

    describe('disabled state', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.disabled, defaultButtonDisabled.shape, [])
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
          severity: expect.any(Object),
        })
      })
    })

    describe('rounded variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.rounded, defaultButtonRounded.shape, [])
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
          severity: expect.any(Object),
        })
      })
    })

    describe('iconOnly variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.iconOnly, defaultButtonIconOnly.shape, ['width'])
        expectExactTokens(value?.iconOnly, {
          background: '{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.contrast}}',
          border: borderDefaults,
          icon: {
            color: '{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.contrast}}',
            size: '{{primitives.icon.size.sm}}',
          },
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          severity: expect.any(Object),
        })
      })
    })

    describe('raised variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.raised, defaultButtonRaised.shape, [])
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
          severity: expect.any(Object),
        })
      })
    })

    describe('text variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.text, defaultButtonText.shape, [])
        expectExactTokens(value?.text, {
          background: '{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.contrast}}',
          border: borderDefaults,
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          severity: expect.any(Object),
        })
      })
    })

    describe('textRaised variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.textRaised, defaultButtonTextRaised.shape, [])
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
          severity: expect.any(Object),
        })
      })
    })

    describe('outlined variant', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.outlined, defaultButtonOutlined.shape, [])
        expectExactTokens(value?.outlined, {
          background: '{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.contrast}}',
          border: borderDefaults,
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          severity: expect.any(Object),
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
          background: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.contrast}}',
          font: {
            weight: '{{primitives.font.weight}}',
            lineHeight: '{{primitives.font.lineHeight}}',
            letterSpacing: '{{primitives.font.letterSpacing}}',
            style: '{{primitives.font.style}}',
          },
          border: {
            color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.sm}}',
          focusRing: {
            color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
            style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
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
          severity: expect.any(Object),
        })
      })

      describe('severity defaults', () => {
        it('should apply info severity defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data as any
          expectExactTokens(value.secondary?.severity?.info, {
            background: '{{primitives.variant.secondary.defaultVariant.defaultState.severity.info.bg}}',
            color: '{{primitives.variant.secondary.defaultVariant.defaultState.severity.info.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.defaultState.severity.info.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.defaultState.severity.info.border.style}}',
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
            background: '{{primitives.variant.secondary.defaultVariant.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.defaultVariant.state.hover.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            severity: expect.any(Object),
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
            background: '{{primitives.variant.secondary.defaultVariant.state.active.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.defaultVariant.state.active.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.state.active.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.state.active.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            severity: expect.any(Object),
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
            background: '{{primitives.variant.secondary.defaultVariant.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.defaultVariant.state.focus.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            severity: expect.any(Object),
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
            background: '{{primitives.variant.secondary.defaultVariant.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.defaultVariant.state.disabled.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.state.disabled.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.state.disabled.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            severity: expect.any(Object),
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
            background: '{{primitives.variant.secondary.variant.rounded.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.variant.rounded.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.full}}',
              shadow: '{{primitives.shadow.none}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            severity: expect.any(Object),
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
            background: '{{primitives.variant.secondary.variant.iconOnly.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.variant.iconOnly.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            severity: expect.any(Object),
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
            background: '{{primitives.variant.secondary.variant.raised.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.variant.raised.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.md}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            severity: expect.any(Object),
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
            background: '{{primitives.variant.secondary.variant.text.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.variant.text.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            severity: expect.any(Object),
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
            background: '{{primitives.variant.secondary.variant.raisedText.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.variant.raisedText.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.md}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            severity: expect.any(Object),
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
            background: '{{primitives.variant.secondary.variant.outlined.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.secondary.variant.outlined.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
            hover: expect.any(Object),
            active: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
            severity: expect.any(Object),
          })
        })
      })
    })

    describe('primary button', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.primary, primaryVariantButton.shape, [])
        expectExactTokens(value?.primary, {
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
          severity: expect.any(Object),
        })
      })

      describe('severity defaults', () => {
        it('should apply info severity defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data as any
          expectExactTokens(value.primary?.severity?.info, {
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
          expectExactUndefinedTokens(value?.primary?.hover, primaryVariantButtonHover.shape, [])
          expectExactTokens(value?.primary?.hover, {
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
            severity: expect.any(Object),
          })
        })
      })

      describe('active state', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.primary?.active, primaryVariantButtonActive.shape, [])
          expectExactTokens(value?.primary?.active, {
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
            severity: expect.any(Object),
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.primary?.focus, primaryVariantButtonFocus.shape, [])
          expectExactTokens(value?.primary?.focus, {
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
            severity: expect.any(Object),
          })
        })
      })

      describe('disabled state', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.primary?.disabled, primaryVariantButtonDisabled.shape, [])
          expectExactTokens(value?.primary?.disabled, {
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
            severity: expect.any(Object),
          })
        })
      })

      describe('rounded variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.primary?.rounded, primaryVariantButtonRounded.shape, [])
          expectExactTokens(value?.primary?.rounded, {
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
            severity: expect.any(Object),
          })
        })
      })

      describe('iconOnly variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.primary?.iconOnly, primaryVariantButtonIconOnly.shape, ['width'])
          expectExactTokens(value?.primary?.iconOnly, {
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
            severity: expect.any(Object),
          })
        })
      })

      describe('raised variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.primary?.raised, primaryVariantButtonRaised.shape, [])
          expectExactTokens(value?.primary?.raised, {
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
            severity: expect.any(Object),
          })
        })
      })

      describe('text variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.primary?.text, primaryVariantButtonText.shape, [])
          expectExactTokens(value?.primary?.text, {
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
            severity: expect.any(Object),
          })
        })
      })

      describe('textRaised variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.primary?.textRaised, primaryVariantButtonTextRaised.shape, [])
          expectExactTokens(value?.primary?.textRaised, {
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
            severity: expect.any(Object),
          })
        })
      })

      describe('outlined variant', () => {
        it('should apply defaults', () => {
          const result = button.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.primary?.outlined, primaryVariantButtonOutlined.shape, [])
          expectExactTokens(value?.primary?.outlined, {
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
            severity: expect.any(Object),
          })
        })
      })
    })
  })
})
