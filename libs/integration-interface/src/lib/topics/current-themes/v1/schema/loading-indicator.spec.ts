import { expectDefaultsMatchShape } from './test-utils'
import { loadingIndicator, loadingIndicatorDefaults } from './loading-indicator'

describe('loadingIndicator schema', () => {
  const parsed = loadingIndicator.parse({})

  it('parses an empty object', () => {
    expect(loadingIndicator.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(loadingIndicator, loadingIndicatorDefaults)
  })
})
