/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

describe('Message', () => {
  const originalDateNow = Date.now
  const originalMessageId = Reflect.get(globalThis, 'onecxMessageId')

  afterEach(() => {
    Date.now = originalDateNow

    if (originalMessageId === undefined) {
      Reflect.deleteProperty(globalThis, 'onecxMessageId')
    } else {
      Reflect.set(globalThis, 'onecxMessageId', originalMessageId)
    }

    jest.resetModules()
    jest.restoreAllMocks()
  })

  it('uses performance.now when available', () => {
    jest.resetModules()
    Reflect.deleteProperty(globalThis, 'onecxMessageId')

    jest.spyOn(globalThis.performance, 'now').mockReturnValue(123)

    const { Message } = require('./message')
    const msg = new Message('x')

    expect(msg.timestamp).toBe(123)
    expect(msg.id).toBe(1)
  })

  it('falls back to Date.now when performance.now is not available', () => {
    jest.resetModules()
    Reflect.deleteProperty(globalThis, 'onecxMessageId')

    jest.spyOn(globalThis.performance, 'now').mockImplementation(() => undefined as unknown as number)
    Date.now = jest.fn(() => 456) as unknown as typeof Date.now

    const { Message } = require('./message')
    const msg = new Message('x')

    expect(msg.timestamp).toBe(456)
    expect(msg.id).toBe(1)
  })
})
