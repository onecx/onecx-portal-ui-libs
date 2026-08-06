import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import {
  carousel,
  carouselContainer,
  carouselContent,
  carouselNavigationButton,
  carouselNavigationButtonHover,
  carouselNavigationButtonActive,
  carouselNavigationButtonFocus,
  carouselIndicator,
  carouselIndicatorHover,
  carouselIndicatorActive,
  carouselIndicatorFocus,
} from './carousel'

describe('carousel schema', () => {
  it('parses an empty object', () => {
    const result = carousel.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('carousel tokens', () => {
    it('should apply defaults', () => {
      const result = carousel.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, carousel.shape, ['settings'])
      expectExactTokens(value, {
        transition: {
          duration: '{{primitives.transition.duration}}',
        },
        container: expect.any(Object),
        content: expect.any(Object),
        navigationButton: expect.any(Object),
        indicator: expect.any(Object),
      })
    })

    describe('container', () => {
      it('should apply defaults', () => {
        const result = carousel.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.container, carouselContainer.shape, [])
        expectExactTokens(value?.container, {
          bg: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          contrast: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          padding: '{{primitives.space.md}}',
          border: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            radius: '{{primitives.border.radius.md}}',
            offset: '{{primitives.border.offset.none}}',
          },
        })
      })
    })

    describe('content', () => {
      it('should apply defaults', () => {
        const result = carousel.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.content, carouselContent.shape, [])
        expectExactTokens(value?.content, {
          gap: '{{primitives.space.md}}',
        })
      })
    })

    describe('navigationButton', () => {
      it('should apply defaults', () => {
        const result = carousel.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.navigationButton, carouselNavigationButton.shape, [])
        expectExactTokens(value?.navigationButton, {
          bg: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          contrast: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          padding: '{{primitives.space.sm}}',
          border: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            radius: '{{primitives.border.radius.md}}',
            offset: '{{primitives.border.offset.none}}',
          },
          focusRing: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
            width: '{{primitives.border.width.md}}',
            radius: '{{primitives.border.radius.md}}',
            offset: '{{primitives.border.offset.none}}',
            shadow: '{{primitives.shadow.none}}',
          },
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
        })
      })

      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = carousel.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.navigationButton?.hover, carouselNavigationButtonHover.shape, [])
          expectExactTokens(value?.navigationButton?.hover, {
            bg: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
            contrast: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              radius: '{{primitives.border.radius.md}}',
              offset: '{{primitives.border.offset.none}}',
            },
          })
        })
      })

      describe('active state', () => {
        it('should apply defaults', () => {
          const result = carousel.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.navigationButton?.active, carouselNavigationButtonActive.shape, [])
          expectExactTokens(value?.navigationButton?.active, {
            bg: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
            contrast: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              radius: '{{primitives.border.radius.md}}',
              offset: '{{primitives.border.offset.none}}',
            },
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = carousel.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.navigationButton?.focus, carouselNavigationButtonFocus.shape, [])
          expectExactTokens(value?.navigationButton?.focus, {
            bg: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
            contrast: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              radius: '{{primitives.border.radius.md}}',
              offset: '{{primitives.border.offset.none}}',
            },
          })
        })
      })
    })

    describe('indicator', () => {
      it('should apply defaults', () => {
        const result = carousel.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.indicator, carouselIndicator.shape, [])
        expectExactTokens(value?.indicator, {
          bg: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          contrast: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          width: '{{primitives.space.md}}',
          height: '{{primitives.space.md}}',
          border: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            radius: '{{primitives.border.radius.md}}',
            offset: '{{primitives.border.offset.none}}',
          },
          focusRing: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
            width: '{{primitives.border.width.md}}',
            radius: '{{primitives.border.radius.md}}',
            offset: '{{primitives.border.offset.none}}',
            shadow: '{{primitives.shadow.none}}',
          },
          hover: expect.any(Object),
          active: expect.any(Object),
          focus: expect.any(Object),
        })
      })

      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = carousel.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.indicator?.hover, carouselIndicatorHover.shape, [])
          expectExactTokens(value?.indicator?.hover, {
            bg: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
            contrast: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              radius: '{{primitives.border.radius.md}}',
              offset: '{{primitives.border.offset.none}}',
            },
          })
        })
      })

      describe('active state', () => {
        it('should apply defaults', () => {
          const result = carousel.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.indicator?.active, carouselIndicatorActive.shape, [])
          expectExactTokens(value?.indicator?.active, {
            bg: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
            contrast: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              radius: '{{primitives.border.radius.md}}',
              offset: '{{primitives.border.offset.none}}',
            },
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = carousel.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.indicator?.focus, carouselIndicatorFocus.shape, [])
          expectExactTokens(value?.indicator?.focus, {
            bg: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
            contrast: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              radius: '{{primitives.border.radius.md}}',
              offset: '{{primitives.border.offset.none}}',
            },
          })
        })
      })
    })
  })
})
