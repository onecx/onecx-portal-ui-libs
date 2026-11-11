import { expectDefaultsMatchShape } from './test-utils'

import { textarea, textareaDefaults } from './textarea'

describe('textarea schema', () => {
  const parsed = textarea.parse({})

  it('parses an empty object', () => {
    expect(textarea.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(textarea, textareaDefaults)
  })
})
