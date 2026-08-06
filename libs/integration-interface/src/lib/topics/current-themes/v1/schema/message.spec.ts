import { message } from './message'
import { expectExactTokens, expectExactUndefinedTokens, expectTokens } from './test-utils'

const BASE_TOKENS = {
  border: {
    radius: '{{primitives.radius.md}}',
    width: '{{primitives.border.width.md}}',
  },
  transition: {
    duration: '{{primitives.transition.duration}}',
  },
  padding: '{{primitives.space.md}}',
  gap: '{{primitives.space.md}}',
  icon: {
    size: '{{primitives.icon.size.md}}',
  },
  font: {
    size: '{{primitives.font.size.md}}',
    weight: '{{primitives.font.weight.md}}',
  },
}

const BASE_TEXT_VARIANT_TOKENS = {
  transition: { duration: '{{primitives.transition.duration}}' },
  padding: '{{primitives.space.md}}',
  gap: '{{primitives.space.md}}',
  font: { size: '{{primitives.font.size.md}}', weight: '{{primitives.font.weight.md}}' },
  icon: { size: '{{primitives.icon.size.md}}' },
}

const BASE_FILLED_OUTLINED_VARIANT_TOKENS = {
  ...BASE_TEXT_VARIANT_TOKENS,
  border: { radius: '{{primitives.radius.md}}', width: '{{primitives.border.width.md}}' },
  shadow: '{{primitives.shadow.none}}',
}

describe('message schema', () => {
  let value: ReturnType<typeof message.safeParse>['data']

  beforeEach(() => {
    value = message.safeParse({}).data
  })

  it('parses an empty object', () => {
    expect(message.safeParse({}).success).toBe(true)
  })

  describe('base message tokens', () => {
    it('should apply defaults', () => {
      expectExactUndefinedTokens(value, message.shape, ['settings'])
      expectTokens(value, BASE_TOKENS)
    })
  })

  describe('settings', () => {
    it('should apply default settings', () => {
      const settingsValue = message.safeParse({ settings: {} }).data
      expectExactTokens(settingsValue?.settings, {
        closable: false,
        delay: 300,
        showMultiple: true,
      })
    })
  })

  describe('size', () => {
    it.each([
      ['xs', '{{primitives.space.xs}}', '{{primitives.font.size.xs}}', '{{primitives.icon.size.xs}}'],
      ['sm', '{{primitives.space.sm}}', '{{primitives.font.size.sm}}', '{{primitives.icon.size.sm}}'],
      ['md', '{{primitives.space.md}}', '{{primitives.font.size.md}}', '{{primitives.icon.size.md}}'],
      ['lg', '{{primitives.space.lg}}', '{{primitives.font.size.lg}}', '{{primitives.icon.size.lg}}'],
      ['xl', '{{primitives.space.xl}}', '{{primitives.font.size.xl}}', '{{primitives.icon.size.xl}}'],
    ])('should apply %s defaults', (size, padding, fontSize, iconSize) => {
      expectExactTokens((value as any)?.[size], {
        padding,
        font: { size: fontSize },
        icon: { size: iconSize },
        close: { icon: { size: iconSize } },
      })
    })
  })

  describe('close', () => {
    it('should apply base token defaults', () => {
      expectExactTokens(value?.close, {
        width: '{{primitives.icon.size.md}}',
        height: '{{primitives.icon.size.md}}',
        focusRing: {
          width: '{{primitives.focusRing.width}}',
          style: '{{primitives.focusRing.style}}',
          offset: '{{primitives.focusRing.offset}}',
          shadow: '{{primitives.focusRing.shadow}}',
        },
        border: {
          radius: '{{primitives.radius.md}}',
          width: '{{primitives.border.width.md}}',
        },
        primary: expect.any(Object),
        secondary: expect.any(Object),
      })
    })

    describe('primary', () => {
      // 'error' severity key maps to 'danger' token in default/focus state
      const defaultSeverities: [string, string][] = [
        ['info', 'info'],
        ['success', 'success'],
        ['warning', 'warning'],
        ['error', 'danger'],
        ['contrast', 'contrast'],
      ]
      // text hover also maps 'error' → 'danger'; outline/filled hover keeps 'error'
      const textHoverSeverities: [string, string][] = [
        ['info', 'info'],
        ['success', 'success'],
        ['warning', 'warning'],
        ['error', 'danger'],
        ['contrast', 'contrast'],
      ]
      const outlineFilledHoverSeverities: [string, string][] = [
        ['info', 'info'],
        ['success', 'success'],
        ['warning', 'warning'],
        ['error', 'error'],
        ['contrast', 'contrast'],
      ]

      describe('text', () => {
        it.each(defaultSeverities)('should apply %s default state', (severity, token) => {
          expectExactTokens((value?.close?.primary?.text as any)?.[severity], {
            backgroundColor: `{{primitives.variant.primary.defaultState.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.primary.defaultState.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.primary.defaultState.severity.${token}.border.color}}` },
            focusRing: { color: `{{primitives.variant.primary.state.focus.severity.${token}.focusRing.color}}` },
          })
        })
        it.each(textHoverSeverities)('should apply %s hover state', (severity, token) => {
          expectExactTokens((value?.close?.primary?.text?.hover as any)?.[severity], {
            backgroundColor: `{{primitives.variant.primary.state.hover.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.primary.state.hover.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.primary.state.hover.severity.${token}.border.color}}` },
          })
        })
      })

      describe('outline', () => {
        it.each(defaultSeverities)('should apply %s default state', (severity, token) => {
          expectExactTokens((value?.close?.primary?.outline as any)?.[severity], {
            backgroundColor: `{{primitives.variant.primary.defaultState.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.primary.defaultState.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.primary.defaultState.severity.${token}.border.color}}` },
            focusRing: { color: `{{primitives.variant.primary.state.focus.severity.${token}.focusRing.color}}` },
          })
        })
        it.each(outlineFilledHoverSeverities)('should apply %s hover state', (severity, token) => {
          expectExactTokens((value?.close?.primary?.outline?.hover as any)?.[severity], {
            backgroundColor: `{{primitives.variant.primary.state.hover.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.primary.state.hover.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.primary.state.hover.severity.${token}.border.color}}` },
          })
        })
      })

      describe('filled', () => {
        it.each(defaultSeverities)('should apply %s default state', (severity, token) => {
          expectExactTokens((value?.close?.primary?.filled as any)?.[severity], {
            backgroundColor: `{{primitives.variant.primary.defaultState.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.primary.defaultState.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.primary.defaultState.severity.${token}.border.color}}` },
            focusRing: { color: `{{primitives.variant.primary.state.focus.severity.${token}.focusRing.color}}` },
          })
        })
        it.each(outlineFilledHoverSeverities)('should apply %s hover state', (severity, token) => {
          expectExactTokens((value?.close?.primary?.filled?.hover as any)?.[severity], {
            backgroundColor: `{{primitives.variant.primary.state.hover.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.primary.state.hover.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.primary.state.hover.severity.${token}.border.color}}` },
          })
        })
      })
    })

    describe('secondary', () => {
      // 'error' severity key maps to 'danger' token in default/focus state
      const defaultSeverities: [string, string][] = [
        ['info', 'info'],
        ['success', 'success'],
        ['warning', 'warning'],
        ['error', 'danger'],
        ['contrast', 'contrast'],
      ]
      // all hover variants keep literal severity key (error → error)
      const hoverSeverities: [string, string][] = [
        ['info', 'info'],
        ['success', 'success'],
        ['warning', 'warning'],
        ['error', 'error'],
        ['contrast', 'contrast'],
      ]

      describe('text', () => {
        it.each(defaultSeverities)('should apply %s default state', (severity, token) => {
          expectExactTokens((value?.close?.secondary?.text as any)?.[severity], {
            backgroundColor: `{{primitives.variant.secondary.defaultState.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.secondary.defaultState.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.secondary.defaultState.severity.${token}.border.color}}` },
            focusRing: { color: `{{primitives.variant.secondary.state.focus.severity.${token}.focusRing.color}}` },
          })
        })
        it.each(hoverSeverities)('should apply %s hover state', (severity, token) => {
          expectExactTokens((value?.close?.secondary?.text?.hover as any)?.[severity], {
            backgroundColor: `{{primitives.variant.secondary.state.hover.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.secondary.state.hover.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.secondary.state.hover.severity.${token}.border.color}}` },
          })
        })
      })

      describe('outline', () => {
        it.each(defaultSeverities)('should apply %s default state', (severity, token) => {
          expectExactTokens((value?.close?.secondary?.outline as any)?.[severity], {
            backgroundColor: `{{primitives.variant.secondary.defaultState.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.secondary.defaultState.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.secondary.defaultState.severity.${token}.border.color}}` },
            focusRing: { color: `{{primitives.variant.secondary.state.focus.severity.${token}.focusRing.color}}` },
          })
        })
        it.each(hoverSeverities)('should apply %s hover state', (severity, token) => {
          expectExactTokens((value?.close?.secondary?.outline?.hover as any)?.[severity], {
            backgroundColor: `{{primitives.variant.secondary.state.hover.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.secondary.state.hover.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.secondary.state.hover.severity.${token}.border.color}}` },
          })
        })
      })

      describe('filled', () => {
        it.each(defaultSeverities)('should apply %s default state', (severity, token) => {
          expectExactTokens((value?.close?.secondary?.filled as any)?.[severity], {
            backgroundColor: `{{primitives.variant.secondary.defaultState.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.secondary.defaultState.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.secondary.defaultState.severity.${token}.border.color}}` },
            focusRing: { color: `{{primitives.variant.secondary.state.focus.severity.${token}.focusRing.color}}` },
          })
        })
        it.each(hoverSeverities)('should apply %s hover state', (severity, token) => {
          expectExactTokens((value?.close?.secondary?.filled?.hover as any)?.[severity], {
            backgroundColor: `{{primitives.variant.secondary.state.hover.severity.${token}.bg.color}}`,
            color: `{{primitives.variant.secondary.state.hover.severity.${token}.contrast}}`,
            border: { color: `{{primitives.variant.secondary.state.hover.severity.${token}.border.color}}` },
          })
        })
      })
    })
  })

  describe('variants', () => {
    const severities = ['info', 'success', 'warning', 'error', 'contrast'] as const

    describe('primary', () => {
      describe('text', () => {
        it('should apply base token defaults', () => {
          expectTokens(value?.primary?.text, {
            ...BASE_TEXT_VARIANT_TOKENS,
          })
        })
        it.each(severities)('should apply %s severity defaults', (severity) => {
          expectExactTokens((value?.primary?.text as any)?.[severity], {
            color: `{{primitives.variant.primary.defaultState.severity.${severity}.contrast}}`,
            icon: { color: `{{primitives.variant.primary.defaultState.severity.${severity}.contrast}}` },
          })
        })
      })

      describe('outline', () => {
        it('should apply base token defaults', () => {
          expectTokens(value?.primary?.outline, {
            ...BASE_FILLED_OUTLINED_VARIANT_TOKENS,
          })
        })
        it.each(severities)('should apply %s severity defaults', (severity) => {
          expectExactTokens((value?.primary?.outline as any)?.[severity], {
            color: `{{primitives.variant.primary.defaultState.severity.${severity}.contrast}}`,
            icon: { color: `{{primitives.variant.primary.defaultState.severity.${severity}.contrast}}` },
            backgroundColor: `{{primitives.variant.primary.defaultState.severity.${severity}.bg.color}}`,
            border: { color: `{{primitives.variant.primary.defaultState.severity.${severity}.border.color}}` },
            shadowColor: `{{primitives.variant.primary.defaultState.severity.${severity}.shadow.color}}`,
          })
        })
      })

      describe('filled', () => {
        it('should apply base token defaults', () => {
          expectTokens(value?.primary?.filled, {
            ...BASE_FILLED_OUTLINED_VARIANT_TOKENS,
          })
        })
        it.each(severities)('should apply %s severity defaults', (severity) => {
          expectExactTokens((value?.primary?.filled as any)?.[severity], {
            color: `{{primitives.variant.primary.defaultState.severity.${severity}.contrast}}`,
            icon: { color: `{{primitives.variant.primary.defaultState.severity.${severity}.contrast}}` },
            backgroundColor: `{{primitives.variant.primary.defaultState.severity.${severity}.bg.color}}`,
            border: { color: `{{primitives.variant.primary.defaultState.severity.${severity}.border.color}}` },
            shadowColor: `{{primitives.variant.primary.defaultState.severity.${severity}.shadow.color}}`,
          })
        })
      })
    })

    describe('secondary', () => {
      describe('text', () => {
        it('should apply base token defaults', () => {
          expectTokens(value?.secondary?.text, {
            ...BASE_TEXT_VARIANT_TOKENS,
          })
        })
        it.each(severities)('should apply %s severity defaults', (severity) => {
          expectExactTokens((value?.secondary?.text as any)?.[severity], {
            color: `{{primitives.variant.secondary.defaultState.severity.${severity}.contrast}}`,
            icon: { color: `{{primitives.variant.secondary.defaultState.severity.${severity}.contrast}}` },
          })
        })
      })

      describe('outline', () => {
        it('should apply base token defaults', () => {
          expectTokens(value?.secondary?.outline, {
            ...BASE_FILLED_OUTLINED_VARIANT_TOKENS,
          })
        })
        it.each(severities)('should apply %s severity defaults', (severity) => {
          expectExactTokens((value?.secondary?.outline as any)?.[severity], {
            color: `{{primitives.variant.secondary.defaultState.severity.${severity}.contrast}}`,
            icon: { color: `{{primitives.variant.secondary.defaultState.severity.${severity}.contrast}}` },
            backgroundColor: `{{primitives.variant.secondary.defaultState.severity.${severity}.bg.color}}`,
            border: { color: `{{primitives.variant.secondary.defaultState.severity.${severity}.border.color}}` },
            shadowColor: `{{primitives.variant.secondary.defaultState.severity.${severity}.shadow.color}}`,
          })
        })
      })

      describe('filled', () => {
        it('should apply base token defaults', () => {
          expectTokens(value?.secondary?.filled, {
            ...BASE_FILLED_OUTLINED_VARIANT_TOKENS,
          })
        })
        it.each(severities)('should apply %s severity defaults', (severity) => {
          expectExactTokens(value?.secondary?.filled?.[severity], {
            color: `{{primitives.variant.secondary.defaultState.severity.${severity}.contrast}}`,
            icon: { color: `{{primitives.variant.secondary.defaultState.severity.${severity}.contrast}}` },
            backgroundColor: `{{primitives.variant.secondary.defaultState.severity.${severity}.bg.color}}`,
            border: { color: `{{primitives.variant.secondary.defaultState.severity.${severity}.border.color}}` },
            shadowColor: `{{primitives.variant.secondary.defaultState.severity.${severity}.shadow.color}}`,
          })
        })
      })
    })
  })
})
