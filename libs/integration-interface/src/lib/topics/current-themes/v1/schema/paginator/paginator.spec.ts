import { expectDefaultsMatchShape } from '../test-utils'
import { paginator, paginatorDefaults } from './paginator'

describe('paginator schema', () => {
  const parsed = paginator.parse({})

  it('parses an empty object', () => {
    expect(paginator.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(paginator, paginatorDefaults)
  })
})