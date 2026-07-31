import {
  expectExactTokens,
  expectExactUndefinedTokens,
} from './test-utils'
import {
  textarea,
  hoverTextareaStyles,
  activeTextareaStyles,
  focusTextareaStyles,
  disabledTextareaStyles,
  invalidTextareaStyles,
  filledTextareaStyles,
  hoverFilledTextareaStyles,
  activeFilledTextareaStyles,
  focusFilledTextareaStyles,
  disabledFilledTextareaStyles,
  invalidFilledTextareaStyles,
} from './textarea'

describe('textarea schema', () => {
  it('parses an empty object', () => {
    const result = textarea.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('textarea tokens', () => {
    it('should apply defaults', () => {
      const result = textarea.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, textarea.shape, ['settings'])
      expectExactTokens(value, {
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        placeholderColor: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        font: {
          weight: '{{primitives.font.weight}}',
          lineHeight: '{{primitives.font.lineHeight}}',
          letterSpacing: '{{primitives.font.letterSpacing}}',
          style: '{{primitives.font.style}}',
        },
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        },
        transitionDuration: '{{primitives.transition.duration}}',
        sm: {
          font: {
            size: '{{primitives.font.size}}',
          },
          paddingX: '{{primitives.space.xs}}',
          paddingY: '{{primitives.space.xs}}',
        },
        md: {
          font: {
            size: '{{primitives.font.size}}',
          },
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.md}}',
        },
        lg: {
          font: {
            size: '{{primitives.font.size}}',
          },
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.md}}',
        },
        focusRing: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        },
        hover: expect.any(Object),
        active: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        invalid: expect.any(Object),
        filled: expect.any(Object),
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = textarea.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.hover, hoverTextareaStyles.shape, [])
        expectExactTokens(value?.hover, {
          background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          placeholderColor: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          cursor: 'pointer',
          border: {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
        })
      })
    })

    describe('active state', () => {
      it('should apply defaults', () => {
        const result = textarea.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.active, activeTextareaStyles.shape, [])
        expectExactTokens(value?.active, {
          background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          placeholderColor: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = textarea.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.focus, focusTextareaStyles.shape, [])
        expectExactTokens(value?.focus, {
          background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          placeholderColor: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
        })
      })
    })

    describe('disabled state', () => {
      it('should apply defaults', () => {
        const result = textarea.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.disabled, disabledTextareaStyles.shape, [])
        expectExactTokens(value?.disabled, {
          background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
          placeholderColor: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
          cursor: 'pointer',
          border: {
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
        })
      })
    })

    describe('invalid state', () => {
      it('should apply defaults', () => {
        const result = textarea.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.invalid, invalidTextareaStyles.shape, [])
        expectExactTokens(value?.invalid, {
          background: '{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
          placeholderColor: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
        })
      })
    })

    describe('filled variant', () => {
      it('should apply defaults', () => {
        const result = textarea.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.filled, filledTextareaStyles.shape, [])
        expectExactTokens(value?.filled, {
          background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
          placeholderColor: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
          font: {
            weight: '{{primitives.font.weight}}',
            lineHeight: '{{primitives.font.lineHeight}}',
            letterSpacing: '{{primitives.font.letterSpacing}}',
            style: '{{primitives.font.style}}',
          },
          border: {
            color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
          transitionDuration: '{{primitives.transition.duration}}',
          sm: {
            font: {
              size: '{{primitives.font.size}}',
            },
            paddingX: '{{primitives.space.xs}}',
            paddingY: '{{primitives.space.xs}}',
          },
          md: {
            font: {
              size: '{{primitives.font.size}}',
            },
            paddingX: '{{primitives.space.md}}',
            paddingY: '{{primitives.space.md}}',
          },
          lg: {
            font: {
              size: '{{primitives.font.size}}',
            },
            paddingX: '{{primitives.space.md}}',
            paddingY: '{{primitives.space.md}}',
          },
          focusRing: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
            width: '{{primitives.border.width.md}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
          },
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          invalid: expect.any(Object),
        })
      })

      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = textarea.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.filled?.hover, hoverFilledTextareaStyles.shape, [])
          expectExactTokens(value?.filled?.hover, {
            background: '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
            placeholderColor: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
          })
        })
      })

      describe('active state', () => {
        it('should apply defaults', () => {
          const result = textarea.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.filled?.active, activeFilledTextareaStyles.shape, [])
          expectExactTokens(value?.filled?.active, {
            background: '{{primitives.variant.primary.state.active.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.active.defaultSeverity.contrast}}',
            placeholderColor: '{{primitives.variant.primary.state.active.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.state.active.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.state.active.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = textarea.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.filled?.focus, focusFilledTextareaStyles.shape, [])
          expectExactTokens(value?.filled?.focus, {
            background: '{{primitives.variant.primary.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
            placeholderColor: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
          })
        })
      })

      describe('disabled state', () => {
        it('should apply defaults', () => {
          const result = textarea.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.filled?.disabled, disabledFilledTextareaStyles.shape, [])
          expectExactTokens(value?.filled?.disabled, {
            background: '{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
            placeholderColor: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.state.disabled.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.state.disabled.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
          })
        })
      })

      describe('invalid state', () => {
        it('should apply defaults', () => {
          const result = textarea.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.filled?.invalid, invalidFilledTextareaStyles.shape, [])
          expectExactTokens(value?.filled?.invalid, {
            placeholderColor: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.state.invalid.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.state.invalid.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.radius.md}}',
              shadow: '{{primitives.shadow.none}}',
            },
          })
        })
      })
    })
  })
})
