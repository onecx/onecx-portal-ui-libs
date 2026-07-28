import { picklist } from './picklist'

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

describe('picklist schema', () => {
  it('parses an empty object', () => {
    const result = picklist.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('picklist tokens', () => {
    it('should apply defaults', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expect(value?.settings).toBeUndefined()
      expectExactTokens(value, {
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        gap: '{{primitives.space.md}}',
        panel: expect.any(Object),
        sourceControlButtons: expect.any(Object),
        transferControlButtons: expect.any(Object),
        targetControlButtons: expect.any(Object),
      })
    })
  })

  describe('picklist panel', () => {
    it('should apply defaults', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.panel, {
        header: expect.any(Object),
        items: expect.any(Object),
      })
    })

    describe('picklist panel header', () => {
      it('should apply defaults', () => {
        const result = picklist.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.panel?.header, {
          background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.sm}}',
          border: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.sm}}',
            radius: '{{primitives.border.radius.none}}',
          },
          font: {
            weight: '{{primitives.font.weight}}',
          },
        })
      })
    })

    describe('picklist panel items', () => {
      it('should apply defaults', () => {
        const result = picklist.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.panel?.items, {
          background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          paddingX: '{{primitives.space.sm}}',
          paddingY: '{{primitives.space.sm}}',
          gap: '{{primitives.space.none}}',
          item: expect.any(Object),
        })
      })

      describe('picklist panel item', () => {
        it('should apply defaults for default state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.panel?.items?.item, {
            background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
            hover: expect.any(Object),
            selected: expect.any(Object),
            focused: expect.any(Object),
            disabled: expect.any(Object),
          })
        })

        it('should apply defaults for hover state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.panel?.items?.item?.hover, {
            background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
          })
        })

        it('should apply defaults for selected state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.panel?.items?.item?.selected, {
            background: '{{primitives.primary.state.selected.defaultSeverity.bg}}',
            color: '{{primitives.primary.state.selected.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.primary.state.selected.defaultSeverity.border.color}}',
              style: '{{primitives.primary.state.selected.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
          })
        })

        it('should apply defaults for focused state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.panel?.items?.item?.focused, {
            background: '{{primitives.defaultVariant.state.focused.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.focused.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.defaultVariant.state.focused.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.focused.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
          })
        })

        it('should apply defaults for disabled state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.panel?.items?.item?.disabled, {
            background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
          })
        })
      })
    })
  })
})

describe('picklist control buttons', () => {
  it('should apply defaults', () => {
    const result = picklist.safeParse({})

    expect(result.success).toBe(true)

    const value = result.data
    expectTokens(value, {
      sourceControlButtons: expect.any(Object),
      transferControlButtons: expect.any(Object),
      targetControlButtons: expect.any(Object),
    })
  })

  describe('picklist control button', () => {
    it('should apply defaults for source', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expect(value?.sourceControlButtons).toBeDefined()
    })

    it('should apply defaults for transfer', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expect(value?.transferControlButtons).toBeDefined()
    })

    it('should apply defaults for target', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expect(value?.targetControlButtons).toBeDefined()
    })
  })
})
