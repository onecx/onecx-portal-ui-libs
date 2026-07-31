import { message } from './index'

export function expectTokens(o: object | undefined, expectedTokens: Record<string, any>) {
  for (const [key, expected] of Object.entries(expectedTokens)) {
    const actual = (o as any)[key]
    expect(actual).toStrictEqual(expected)
  }
}

export function expectExactTokens(o: object | undefined, expectedTokens: Record<string, any>) {
  expect(Object.keys(o ?? {}).length).toEqual(Object.keys(expectedTokens).length)
  expectTokens(o, expectedTokens)
}

describe('message schema', () => {
  it('parses an empty object', () => {
    const result = message.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('message tokens', () => {
    it('should apply root defaults', () => {
      const result = message.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      console.log(JSON.stringify(result.data, null, 2))

      expectExactTokens(value, {
        border: expect.any(Object),
        transition: expect.any(Object),
        padding: '{{primitives.space.md}}',
        gap: '{{primitives.space.md}}',
        icon: expect.any(Object),
        font: expect.any(Object),
        settings: expect.any(Object),
        primary: expect.any(Object),
        secondary: expect.any(Object),
        size: expect.any(Object),
        close: expect.any(Object),
      })
    })
  })

  describe('message settings', () => {
    it('should apply defaults', () => {
      const result = message.safeParse({})

      const value = result.data

      expectExactTokens(value?.settings, {
        closable: false,
        delay: 300,
        showMultiple: true,
      })
    })
  })

  describe('message base styles', () => {
    it('should apply border defaults', () => {
      const result = message.safeParse({})

      const value = result.data

      expectExactTokens(value?.border, {
        radius: '{{primitives.radius.md}}',
        width: '{{primitives.border.width.md}}',
      })
    })

    it('should apply icon defaults', () => {
      const result = message.safeParse({})

      const value = result.data

      expectExactTokens(value?.icon, {
        size: '{{primitives.icon.size.md}}',
      })
    })

    it('should apply font defaults', () => {
      const result = message.safeParse({})

      const value = result.data

      expectExactTokens(value?.font, {
        size: '{{primitives.font.size.md}}',
        weight: '{{primitives.font.weight.md}}',
      })
    })
  })

  describe('message size', () => {
    it('should apply xs defaults', () => {
      const result = message.safeParse({})

      const value = result.data
      console.log(JSON.stringify(result.data, null, 2))
      expectExactTokens(value?.size?.xs, {
        padding: '{{primitives.space.xs}}',
        font: expect.any(Object),
        icon: expect.any(Object),
        close: expect.any(Object),
      })
    })

    it('should apply md defaults', () => {
      const result = message.safeParse({})

      const value = result.data
      console.log(JSON.stringify(result.data, null, 2))
      expectExactTokens(value?.size?.md, {
        padding: '{{primitives.space.md}}',
        font: expect.any(Object),
        icon: expect.any(Object),
        close: expect.any(Object),
      })
    })
  })

  describe('message close', () => {
    it('should apply defaults', () => {
      const result = message.safeParse({})

      const value = result.data

      expectTokens(value?.close, {
        font: expect.any(Object),
        icon: expect.any(Object),
        border: expect.any(Object),
        width: '1.75rem',
        height: '1.75rem',
        focusRing: expect.any(Object),
        default: expect.any(Object),
        primary: expect.any(Object),
        secondary: expect.any(Object),
      })
    })

    it('should apply focus ring defaults', () => {
      const result = message.safeParse({})

      const value = result.data

      expectExactTokens(value?.close?.focusRing, {
        width: '{{primitives.focusRing.width}}',
        offset: '{{primitives.focusRing.offset}}',
        radius: '{{primitives.focusRing.radius.md}}',
        style: '{{primitives.focusRing.style}}',
      })
    })
  })

  describe('primary text message', () => {
    it('should apply defaults', () => {
      const result = message.safeParse({})

      const value = result.data
      console.log(JSON.stringify(result.data, null, 2))
      expectExactTokens(value?.primary?.text?.default, {
        default: expect.any(Object),
        info: expect.any(Object),
        success: expect.any(Object),
        warning: expect.any(Object),
        error: expect.any(Object),
        contrast: expect.any(Object),
      })
    })

    it('should apply info defaults', () => {
      const result = message.safeParse({})

      const value = result.data
      console.log(JSON.stringify(result.data, null, 2))
      expectExactTokens(value?.primary?.text?.default?.info, {
        color: '{{primitives.variant.primary.defaultState.severity.info.contrast}}',
      })
    })
  })

  describe('primary filled message', () => {
    it('should apply info defaults', () => {
      const result = message.safeParse({})

      const value = result.data
      console.log(JSON.stringify(value?.primary?.filled, null, 2))
      expectExactTokens(value?.primary?.filled?.default?.info, {
        backgroundColor: '{{primitives.variant.primary.defaultState.severity.info.bg.color}}',
        color: '{{primitives.variant.primary.defaultState.severity.info.contrast}}',
        border: expect.any(Object),
        shadow: expect.any(Object),
      })
    })
  })

  describe('secondary filled message', () => {
    it('should apply success defaults', () => {
      const result = message.safeParse({})

      const value = result.data

      expectExactTokens(value?.secondary?.filled?.default?.success, {
        backgroundColor: '{{primitives.variant.secondary.defaultState.severity.success.bg.color}}',
        color: '{{primitives.variant.secondary.defaultState.severity.success.contrast}}',
        border: expect.any(Object),
        shadow: expect.any(Object),
      })
    })
  })
})
