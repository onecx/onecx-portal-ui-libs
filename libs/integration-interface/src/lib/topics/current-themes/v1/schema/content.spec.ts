import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { content, contentTitle } from './content'

describe('content schema', () => {
  it('parses an empty object', () => {
    const result = content.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('content tokens', () => {
    it('should apply defaults', () => {
      const result = content.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, content.shape, [])
      expectExactTokens(value, {
        background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
          lineHeight: '{{primitives.font.lineHeight}}',
          letterSpacing: '{{primitives.font.letterSpacing}}',
          style: '{{primitives.font.style}}',
        },
        padding: '{{primitives.space.md}}',
        margin: '{{primitives.space.xl}}',
        border: {
          color: '{{primitives.area.surface.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.surface.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          radius: '{{primitives.border.radius.md}}',
          offset: '{{primitives.border.offset.none}}',
        },
        shadow: '{{primitives.shadow.md}}',
        title: expect.any(Object),
      })
    })

    describe('title', () => {
      it('should apply defaults', () => {
        const result = content.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.title, contentTitle.shape, [])
        expectExactTokens(value?.title, {
          color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
          font: {
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size.lg}}',
            weight: '{{primitives.font.weight.medium}}',
            lineHeight: '{{primitives.font.lineHeight}}',
            letterSpacing: '{{primitives.font.letterSpacing}}',
            style: '{{primitives.font.style}}',
          },
        })
      })
    })
  })
})
