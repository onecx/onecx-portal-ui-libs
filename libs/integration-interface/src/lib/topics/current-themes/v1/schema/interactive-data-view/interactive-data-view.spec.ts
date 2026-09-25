import { expectDefaultsMatchShape } from '../test-utils'
import { interactiveDataView, interactiveDataViewDefaults } from './interactive-data-view'

describe('interactive-data-view schema', () => {
  const parsed = interactiveDataView.parse({})

  it('parses an empty object', () => {
    expect(interactiveDataView.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(interactiveDataView, interactiveDataViewDefaults)
  })
})