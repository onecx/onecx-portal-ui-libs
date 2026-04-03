/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 *
 * @jest-environment node
 */

import { getLocation } from './path.utils'

describe('getLocation (node environment)', () => {
  it('throws when document/location are not available', () => {
    expect(() => getLocation()).toThrow('getLocation() is only available in browser environments')
  })
})
