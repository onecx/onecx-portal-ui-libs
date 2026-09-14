import { expectDefaultsMatchShape } from './test-utils'
import { dialog, dialogDefaults } from './dialog'

describe('dialog schema', () => {
  const parsed = dialog.parse({})

  it('parses an empty object', () => {
    expect(dialog.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(dialog, dialogDefaults)
  })
})
