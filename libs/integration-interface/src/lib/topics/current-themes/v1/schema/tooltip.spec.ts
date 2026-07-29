import { tooltip, tooltipSettings } from './tooltip'
import { border } from './primitives'

export function expectTokenAmount(o: Object | undefined, numberOfTokens: number, keysToUnpack?: string[]) {
  let tokens = 0
  let objectsToProcess: object[] = [o ?? {}]
  while (objectsToProcess.length > 0) {
    const currentObject = objectsToProcess.pop() as object
    const objectKeys = Object.keys(currentObject)
    tokens += objectKeys.length
    for (const keyToUnpack of keysToUnpack ?? []) {
      if (objectKeys.includes(keyToUnpack)) {
        const value = (currentObject as any)[keyToUnpack]
        if (typeof value === 'object' && value !== null) {
          objectsToProcess.push(value)
        }
      }
    }
  }

  expect(tokens).toBe(numberOfTokens)
}

export function expectTokens(o: Object | undefined, expectedTokens: Record<string, any>) {
  for (const [key, expected] of Object.entries(expectedTokens)) {
    const actual = (o as any)[key]
    expect(actual).toStrictEqual(expected)
  }
}

export function expectExactTokens(o: Object | undefined, expectedTokens: Record<string, any>) {
  expect(Object.keys(o ?? {}).length).toEqual(Object.keys(expectedTokens).length)
  expectTokens(o, expectedTokens)
}

export function expectExactUndefinedTokens(o: Object | undefined, schemaShape: any, expectedUndefinedTokens: string[]) {
  const undefinedTokens = Object.keys(schemaShape).filter((key) => (o as any)[key] === undefined)
  for (const key of undefinedTokens) {
    expect(expectedUndefinedTokens).toContain(key)
  }
  expect(undefinedTokens.length).toEqual(expectedUndefinedTokens.length)
  expectUndefinedTokens(o, expectedUndefinedTokens)
}

export function expectUndefinedTokens(o: Object | undefined, expectedUndefinedTokens: string[]) {
  for (const key of expectedUndefinedTokens) {
    const actual = (o as any)[key]
    expect(actual).toBeUndefined()
  }
}

describe('tooltip schema', () => {
  it('parses an empty object', () => {
    const result = tooltip.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('tooltip tokens', () => {
    it('should apply defaults', () => {
      const result = tooltip.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, tooltip.shape, ['settings'])
      expectExactTokens(value, {
        maxWidth: '{{primitives.layout.overlayMaxWidth}}',
        gutter: '{{primitives.space.sm}}',
        shadow: '{{primitives.shadow.md}}',
        padding: '{{primitives.space.md}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultVariant.defaulSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultVariant.defaulSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.sm}}',
          radius: '{{primitives.border.radius.md}}',
        },
        background: '{{primitives.area.overlay.defaultState.defaultVariant.bg}}',
        color: '{{primitives.area.overlay.defaultState.defaultVariant.contrast}}',
      })
    })
  })

  describe('tooltip settings', () => {
    it('should apply defaults when settings are provided', () => {
      const result = tooltip.safeParse({ settings: {} })

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.settings, tooltipSettings.shape, [])
      expectExactTokens(value?.settings, {
        position: 'top',
        showDelay: 0,
        hideDelay: 0,
      })
    })

    it('should allow custom settings values', () => {
      const result = tooltip.safeParse({
        settings: {
          position: 'bottom',
          showDelay: 100,
          hideDelay: 200,
        },
      })

      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.settings, {
        position: 'bottom',
        showDelay: 100,
        hideDelay: 200,
      })
    })
  })
})
