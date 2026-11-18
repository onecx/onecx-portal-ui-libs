import { expectDefaultsMatchShape } from '../test-utils'
import { customGroupColumnSelector, customGroupColumnSelectorDefaults } from './custom-group-column-selector'

describe('custom-group-column-selector schema', () => {
  const parsed = customGroupColumnSelector.parse({})
  type ParsedCustomGroupColumnSelector = {
    button?: {
      defaultState?: { background?: string; color?: string }
      hover?: { background?: string; color?: string }
      active?: { background?: string; color?: string }
      disabled?: { background?: string; color?: string }
    }
  }

  it('parses an empty object', () => {
    expect(customGroupColumnSelector.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  // Parse-time defaults are not merged into an explicitly provided `button`; missing state tokens
  // are resolved at runtime via the state-axis fallback (see custom-group-column-selector-axis-metadata.spec.ts).
  it('keeps only the provided button tokens when button is partially overridden', () => {
    const parsedWithPartialOverride = customGroupColumnSelector.parse({
      button: {
        hover: {
          color: '{{custom.hover.color}}',
        },
      },
    }) as ParsedCustomGroupColumnSelector

    expect(parsedWithPartialOverride.button).toEqual({
      hover: { color: '{{custom.hover.color}}' },
    })
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(customGroupColumnSelector, customGroupColumnSelectorDefaults)
  })
})
