/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { map } from 'rxjs'
import { Topic } from './topic'
import { TopicMessageType } from './topic-message-type'
import { TopicDataMessage } from './topic-data-message'
import { BroadcastChannelMock } from './mocks/broadcast-channel.mock'
import * as loggerUtils from '../utils/logger.utils'
import { acceleratorState } from '../declarations'
import { ensureProperty } from '../utils/ensure-property.utils'

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

describe('Topic', () => {
  const originalLocalStorageDebug = localStorage.getItem('debug')
  const origAddEventListener = window.addEventListener
  const origRemoveEventListener = window.removeEventListener
  const origPostMessage = window.postMessage

  type MessageListener = (event: MessageEvent<unknown>) => void
  let listeners: MessageListener[] = []
  window.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === 'message' && typeof listener === 'function') {
      listeners.push(listener as unknown as MessageListener)
    }
  }) as unknown as typeof window.addEventListener

  window.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === 'message' && typeof listener === 'function') {
      listeners = listeners.filter((l) => l !== (listener as unknown as MessageListener))
    }
  }) as unknown as typeof window.removeEventListener

  window.postMessage = ((message: unknown) => {
    const event = {
      data: message,
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as MessageEvent<unknown>
    listeners.forEach((l) => l(event))
  }) as unknown as typeof window.postMessage

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.removeEventListener = origRemoveEventListener
    window.postMessage = origPostMessage
    if (originalLocalStorageDebug === null) {
      localStorage.removeItem('debug')
    } else {
      localStorage.setItem('debug', originalLocalStorageDebug)
    }
  })

  let values1: string[]
  let values2: string[]

  let testTopic1: Topic<string>
  let testTopic2: Topic<string>

  const loggerDebugFn = jest.fn()
  const loggerInfoFn = jest.fn()
  const loggerWarnFn = jest.fn()
  const loggerErrorFn = jest.fn()

  type ComponentLogger = ReturnType<typeof loggerUtils.createLogger>

  beforeEach(() => {
    const mockLogger: ComponentLogger = {
      debug: loggerDebugFn as unknown as ComponentLogger['debug'],
      info: loggerInfoFn as unknown as ComponentLogger['info'],
      warn: loggerWarnFn as unknown as ComponentLogger['warn'],
      error: loggerErrorFn as unknown as ComponentLogger['error'],
    }
    jest.spyOn(loggerUtils, 'createLogger').mockReturnValue(mockLogger)

    const g = ensureProperty(acceleratorState, ['@onecx/accelerator','topic','statsEnabled'], false)
    g['@onecx/accelerator'].topic.statsEnabled = true
    g['@onecx/accelerator'].topic.initDate = Date.now() - 1000000
    g['@onecx/accelerator'].topic.useBroadcastChannel = true

    BroadcastChannelMock.asyncCalls = false

    listeners = []

    values1 = []
    values2 = []

    testTopic1 = new Topic<string>('test', 1)
    testTopic2 = new Topic<string>('test', 1)

    testTopic1.subscribe((v) => values1.push(v))
    testTopic2.subscribe((v) => values2.push(v))
  })

  afterEach(() => {
    testTopic1.destroy()
    testTopic2.destroy()
    BroadcastChannelMock.listeners = {}
    BroadcastChannelMock.asyncCalls = false
    jest.restoreAllMocks()
    loggerDebugFn.mockClear()
    loggerInfoFn.mockClear()
    loggerWarnFn.mockClear()
    loggerErrorFn.mockClear()
  })

  it('should have correct value for 2 topics after first topic publishes', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])
  })

  it('should have correct value for 2 topics after second topic publishes', () => {
    testTopic2.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])
  })

  it('should have same value for a new initialized topic like the already existing topics', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: string[] = []
    const testTopic3 = new Topic<string>('test', 1)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual(['value1'])
  })

  it('should have same values for both topics after one topic publishes 2 values', () => {
    testTopic1.publish('value1')
    testTopic2.publish('value2')

    expect(values1).toEqual(['value1', 'value2'])
    expect(values2).toEqual(['value1', 'value2'])
  })

  it('should have no value if message name is different', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: string[] = []
    const testTopic3 = new Topic<string>('test123', 1)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual([])
  })

  it('should have no value if message version is different', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: string[] = []
    const testTopic3 = new Topic<string>('test', 2)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual([])
  })

  it('should have no value if message is undefined', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: undefined[] = []
    const testTopic3 = new Topic<undefined>('', 0)
    testTopic3.subscribe((v) => values3.push(v))
    testTopic3.publish(undefined)

    expect(values3).toEqual([])
  })

  it('should remove event listener', () => {
    testTopic1.destroy()
    testTopic2.publish('value1')

    expect(values1).toEqual([])
    expect(values2).toEqual(['value1'])
  })

  it('should pipe to get the length of the value', () => {
    let v = 0
    testTopic1.pipe(map((v) => v.length)).subscribe((s) => (v = s))
    testTopic1.publish('value1')

    expect(v).toEqual(6)
    expect(values1).toEqual(['value1'])
  })

  it('should check isInitialized', (done) => {
    let initialized = false
    testTopic1.isInitialized.then(() => (initialized = true))

    expect(initialized).toBe(false)

    testTopic1.publish('test')
    setTimeout(() => {
      expect(initialized).toBe(true)
      done()
    })
  })

  it('should have no values if publish is not awaited', async () => {
    const original = window.postMessage
    window.postMessage = ((message: unknown) => {
      const event = {
        data: message,
        stopImmediatePropagation: jest.fn(),
        stopPropagation: jest.fn(),
      } as unknown as MessageEvent<unknown>

      listeners.forEach((l) => {
        setTimeout(() => l(event), 0)
      })
    }) as unknown as typeof window.postMessage
    BroadcastChannelMock.asyncCalls = true

    const val1: number[] = []
    const val2: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => val2.push(val))

    const promise = testTopic1.publish(321)

    expect(val1).toEqual([])
    expect(val2).toEqual([])

    await promise

    window.postMessage = original
  })

  it('should have values if publish is awaited', async () => {
    BroadcastChannelMock.asyncCalls = true

    const val1: number[] = []
    const val2: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => {
      val2.push(val)
    })

    await testTopic1.publish(123)

    expect(val1).toEqual([123])
    expect(val2).toEqual([123])
  })

  it('should have all values if publish is awaited on first created topic', async () => {
    BroadcastChannelMock.asyncCalls = true

    const val1: number[] = []
    const val2: number[] = []
    const val3: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic3 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => val2.push(val))
    testTopic3.subscribe((val) => val3.push(val))

    await testTopic1.publish(123)

    expect(val1).toEqual([123])
    expect(val2).toEqual([123])
    expect(val3).toEqual([123])
  })

  it('should have values if publish is awaited for all topics', async () => {
    BroadcastChannelMock.asyncCalls = true

    const val1: number[] = []
    const val2: number[] = []
    const val3: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic3 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => val2.push(val))
    testTopic3.subscribe((val) => val3.push(val))

    await testTopic1.publish(1)

    expect(val1).toEqual([1])
    expect(val2).toEqual([1])
    expect(val3).toEqual([1])

    await testTopic2.publish(2)

    expect(val1).toEqual([1, 2])
    expect(val2).toEqual([1, 2])
    expect(val3).toEqual([1, 2])

    await testTopic3.publish(3)

    expect(val1).toEqual([1, 2, 3])
    expect(val2).toEqual([1, 2, 3])
    expect(val3).toEqual([1, 2, 3])
  })

  it('schedules TopicGet via timeout when recently initialized', () => {
    jest.useFakeTimers()
    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], false)
    g['@onecx/accelerator'].topic.initDate = Date.now() // recent
    g['@onecx/accelerator'].topic.useBroadcastChannel = false

    const spy = jest.spyOn(window, 'postMessage')
    const t = new Topic<string>('timeout-get', 1)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    t.subscribe(() => {})

    // Advance timers to trigger scheduled get
    jest.advanceTimersByTime(150)

    expect(spy).toHaveBeenCalled()
    t.destroy()
    spy.mockRestore()
    jest.useRealTimers()
  })

  it('does not send TopicGet via timeout when initialized before timer fires', () => {
    jest.useFakeTimers()
    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], false)
    g['@onecx/accelerator'].topic.initDate = Date.now()
    g['@onecx/accelerator'].topic.useBroadcastChannel = false

    const t = new Topic<string>('timeout-no-get', 1)
    t.subscribe(jest.fn())

    const tInternal = t as unknown as { sendMessage: (message: { type?: unknown }) => void }
    const sendSpy = jest.spyOn(tInternal, 'sendMessage')

    t.publish('init-now')

    jest.advanceTimersByTime(150)

    const hasTopicGet = sendSpy.mock.calls.some(([message]) => message.type === TopicMessageType.TopicGet)
    expect(hasTopicGet).toBe(false)

    t.destroy()
    jest.useRealTimers()
  })

  it('skips adding window message listener when globalThis.addEventListener is not a function', () => {
    const originalAddEventListener = Reflect.get(globalThis, 'addEventListener')
    try {
      const listenerCountBefore = listeners.length
      Reflect.set(globalThis, 'addEventListener', undefined)

      const t = new Topic<string>('no-addeventlistener', 1, false)
      expect(listeners.length).toBe(listenerCountBefore)
      t.destroy()
    } finally {
      Reflect.set(globalThis, 'addEventListener', originalAddEventListener)
    }
  })

  it('removes window message listener on destroy when globalThis.removeEventListener is a function', () => {
    const originalRemoveEventListener = Reflect.get(globalThis, 'removeEventListener')
    const removeSpy = jest.fn() as unknown as typeof globalThis.removeEventListener
    try {
      Reflect.set(globalThis, 'removeEventListener', removeSpy)

      const t = new Topic<string>('destroy-removes', 1, false)
      t.subscribe(jest.fn())

      t.destroy()

      expect(removeSpy).toHaveBeenCalledWith('message', expect.any(Function), true)
    } finally {
      Reflect.set(globalThis, 'removeEventListener', originalRemoveEventListener)
    }
  })

  it('does not attempt to remove window message listener on destroy when globalThis.removeEventListener is not a function', () => {
    const originalRemoveEventListener = Reflect.get(globalThis, 'removeEventListener')
    try {
      Reflect.set(globalThis, 'removeEventListener', undefined)

      const t = new Topic<string>('destroy-no-remove', 1, false)
      t.subscribe(jest.fn())

      expect(() => t.destroy()).not.toThrow()
    } finally {
      Reflect.set(globalThis, 'removeEventListener', originalRemoveEventListener)
    }
  })

  it('does not respond to TopicGet when no value is present (handleTopicGetMessage false branch)', () => {
    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], false)
    g['@onecx/accelerator'].topic.useBroadcastChannel = false

    const t = new Topic<string>('get-no-value', 1, false)

    const tInternal = t as unknown as {
      sendMessage: (message: unknown) => void
      handleTopicGetMessage: (message: MessageEvent<unknown>) => void
    }
    const sendSpy = jest.spyOn(tInternal, 'sendMessage')
    const stopImmediatePropagation = jest.fn()
    const stopPropagation = jest.fn()

    const event = {
      data: { type: TopicMessageType.TopicGet, name: 'get-no-value', version: 1 },
      stopImmediatePropagation,
      stopPropagation,
    } as unknown as MessageEvent<unknown>

    tInternal.handleTopicGetMessage(event)

    expect(sendSpy).not.toHaveBeenCalled()
    expect(stopImmediatePropagation).not.toHaveBeenCalled()
    expect(stopPropagation).not.toHaveBeenCalled()

    t.destroy()
  })

  it('logs window message when debug enabled and handles TopicGet on window path', () => {
    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], false)
    g['@onecx/accelerator'].topic.useBroadcastChannel = false

    const t = new Topic<string>('win-topic', 1, false)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    t.subscribe(() => {})
    // initialize with a value so TopicGet will respond
    t.publish('init')

    const tInternal = t as unknown as { sendMessage: (message: unknown) => void }
    const sendSpy = jest.spyOn(tInternal, 'sendMessage')

    // Send TopicGet via window to trigger handleTopicGetMessage through onWindowMessage
    const getMsg = {
      data: { type: TopicMessageType.TopicGet, name: 'win-topic', version: 1 },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopImmediatePropagation: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopPropagation: () => {},
    } as unknown as MessageEvent<unknown>
    listeners.forEach((l) => l(getMsg))

    expect(sendSpy).toHaveBeenCalled()
    t.destroy()
    sendSpy.mockRestore()
  })

  it('handles error in TopicResolve processing (catch branch)', () => {
    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], false)
    g['@onecx/accelerator'].topic.useBroadcastChannel = false

    const t = new Topic<string>('resolve-error', 1, false)
    // inject a throwing resolver
    const tInternal = t as unknown as { publishPromiseResolver: Record<number, () => void> }
    tInternal.publishPromiseResolver[123] = () => {
      throw new Error('boom')
    }


    const resolveMsg = {
      data: { type: TopicMessageType.TopicResolve, name: 'resolve-error', version: 1, resolveId: 123 },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopImmediatePropagation: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopPropagation: () => {},
    } as unknown as MessageEvent<unknown>

    listeners.forEach((l) => l(resolveMsg))

    expect(loggerErrorFn).toHaveBeenCalled()
    t.destroy()
  })

  describe('integration with older versions of library', () => {
    type TopicDataMessageWithOptionalId<T> = Omit<TopicDataMessage<T>, 'id'> & { id?: number }
    let previousMessage: TopicDataMessageWithOptionalId<string>
    let incomingMessage: MessageEvent<TopicDataMessageWithOptionalId<string>>

    beforeEach(() => {
      previousMessage = {
        type: TopicMessageType.TopicNext,
        name: testTopic1.name,
        version: testTopic1.version,
        data: '',
        timestamp: 0,
        id: 0,
      }
      incomingMessage = {
        data: {
          type: TopicMessageType.TopicNext,
          name: testTopic1.name,
          version: testTopic1.version,
          data: '',
          timestamp: 0,
          id: 0,
        },
      } as unknown as MessageEvent<TopicDataMessageWithOptionalId<string>>

      // initialize topic
      testTopic1.publish('initMsg')

      jest.resetAllMocks()
    })

    it('should have value if incoming id is greater than previous id', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = 0
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      const topicInternal = testTopic1 as unknown as {
        data: { next: (message: TopicDataMessage<string>) => void }
        onWindowMessage: (message: MessageEvent<TopicDataMessage<string>>) => void
      }
      topicInternal.data.next(previousMessage as unknown as TopicDataMessage<string>)
      topicInternal.onWindowMessage(incomingMessage as unknown as MessageEvent<TopicDataMessage<string>>)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have value if incoming timestamp is greater than previous timestamp with no ids provided', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = undefined
      previousMessage.timestamp = 1
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = undefined
      incomingMessage.data.timestamp = 3
      const topicInternal = testTopic1 as unknown as {
        data: { next: (message: TopicDataMessage<string>) => void }
        onWindowMessage: (message: MessageEvent<TopicDataMessage<string>>) => void
      }
      topicInternal.data.next(previousMessage as unknown as TopicDataMessage<string>)
      topicInternal.onWindowMessage(incomingMessage as unknown as MessageEvent<TopicDataMessage<string>>)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have value if incoming timestamp is greater than previous timestamp when current message has id', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = 1
      previousMessage.timestamp = 1
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = undefined
      incomingMessage.data.timestamp = 3
      const topicInternal = testTopic1 as unknown as {
        data: { next: (message: TopicDataMessage<string>) => void }
        onWindowMessage: (message: MessageEvent<TopicDataMessage<string>>) => void
      }
      topicInternal.data.next(previousMessage as unknown as TopicDataMessage<string>)
      topicInternal.onWindowMessage(incomingMessage as unknown as MessageEvent<TopicDataMessage<string>>)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have value if incoming timestamp is greater than previous timestamp when incoming message has id', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = undefined
      previousMessage.timestamp = 1
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      incomingMessage.data.timestamp = 3
      const topicInternal = testTopic1 as unknown as {
        data: { next: (message: TopicDataMessage<string>) => void }
        onWindowMessage: (message: MessageEvent<TopicDataMessage<string>>) => void
      }
      topicInternal.data.next(previousMessage as unknown as TopicDataMessage<string>)
      topicInternal.onWindowMessage(incomingMessage as unknown as MessageEvent<TopicDataMessage<string>>)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have no value if incoming timestamp is equal to the previous timestamp with no ids provided', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = undefined
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = undefined
      incomingMessage.data.timestamp = 3
      const topicInternal = testTopic1 as unknown as {
        data: { next: (message: TopicDataMessage<string>) => void }
        onWindowMessage: (message: MessageEvent<TopicDataMessage<string>>) => void
      }
      topicInternal.data.next(previousMessage as unknown as TopicDataMessage<string>)
      topicInternal.onWindowMessage(incomingMessage as unknown as MessageEvent<TopicDataMessage<string>>)

      expect(values1).toEqual(['initMsg', 'msg1'])
    })

    it('should have no value if incoming timestamp is equal to the previous timestamp when current message has id', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = 1
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = undefined
      incomingMessage.data.timestamp = 3
      const topicInternal = testTopic1 as unknown as {
        data: { next: (message: TopicDataMessage<string>) => void }
        onWindowMessage: (message: MessageEvent<TopicDataMessage<string>>) => void
      }
      topicInternal.data.next(previousMessage as unknown as TopicDataMessage<string>)
      topicInternal.onWindowMessage(incomingMessage as unknown as MessageEvent<TopicDataMessage<string>>)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(loggerWarnFn).toHaveBeenLastCalledWith(
        'Message was dropped because of equal timestamps, because there was an old style message in the system. Please upgrade all libraries to the latest version.'
      )
    })

    it('should have no value if incoming timestamp is equal to previous timestamp when incoming message has id', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = undefined
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      incomingMessage.data.timestamp = 3
      const topicInternal = testTopic1 as unknown as {
        data: { next: (message: TopicDataMessage<string>) => void }
        onWindowMessage: (message: MessageEvent<TopicDataMessage<string>>) => void
      }
      topicInternal.data.next(previousMessage as unknown as TopicDataMessage<string>)
      topicInternal.onWindowMessage(incomingMessage as unknown as MessageEvent<TopicDataMessage<string>>)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(loggerWarnFn).toHaveBeenLastCalledWith(
        'Message was dropped because of equal timestamps, because there was an old style message in the system. Please upgrade all libraries to the latest version.'
      )
    })

    it('should have no value and no warning if incoming timestamp is equal to previous timestamp when incoming message has smaller id then current', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = 2
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      incomingMessage.data.timestamp = 3
      const topicInternal = testTopic1 as unknown as {
        data: { next: (message: TopicDataMessage<string>) => void }
        onWindowMessage: (message: MessageEvent<TopicDataMessage<string>>) => void
      }
      topicInternal.data.next(previousMessage as unknown as TopicDataMessage<string>)
      topicInternal.onWindowMessage(incomingMessage as unknown as MessageEvent<TopicDataMessage<string>>)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(loggerWarnFn).toHaveBeenCalledTimes(0)
    })
  })

  describe('for compatibility with older versions and browsers', () => {
    it('disables BroadcastChannel when not supported (TopicPublisher constructor branch)', () => {
      const originalBC = Reflect.get(globalThis, 'BroadcastChannel')
      Reflect.set(globalThis, 'BroadcastChannel', undefined)

      const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], true)
      g['@onecx/accelerator'].topic.useBroadcastChannel = true

      // Creating a topic triggers TopicPublisher constructor branch
      const t = new Topic<string>('no-bc', 1, false)
      t.destroy()

      expect(acceleratorState['@onecx/accelerator'].topic.useBroadcastChannel).toBe(false)
      Reflect.set(globalThis, 'BroadcastChannel', originalBC)
    })

    it('uses window.postMessage when BroadcastChannel is disabled (sendMessage else path)', () => {
      const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], false)
      g['@onecx/accelerator'].topic.useBroadcastChannel = false

      const spy = jest.spyOn(window, 'postMessage')

      const t = new Topic<string>('window-path', 1, false)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      t.subscribe(() => {})
      t.publish('x')

      expect(spy).toHaveBeenCalled()
      t.destroy()
      spy.mockRestore()
    })

    it('covers deprecated helpers: source, operator, lift, forEach, toPromise', async () => {
      const t = new Topic<number>('helpers', 1, false)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      t.subscribe(() => {})

      // Access deprecated properties
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ;(t as unknown as { source: unknown }).source
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ;(t as unknown as { operator: unknown }).operator

      // lift with identity map
      const lifted = (t as unknown as { lift: (operator: (source: unknown) => unknown) => unknown }).lift((s) => s)
      expect(lifted).toBeTruthy()

      // forEach: invoke without awaiting completion (never completes)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      t.forEach(() => {})
      t.publish(7)

      // toPromise: invoke to cover method without awaiting resolution
      const p2 = (t as unknown as { toPromise?: () => unknown }).toPromise?.()
      if (p2) {
        t.publish(9)
      }
      t.destroy()
    })
  })
    describe('broadcastChannelV2', () => {
    it('sends messages via BroadcastChannel V2 when enabled', () => {
      const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'tabId'], 1)
      g['@onecx/accelerator'].topic.useBroadcastChannel = 'V2'
      g['@onecx/accelerator'].topic.tabId = 1

      const postSpy = jest.spyOn(window, 'postMessage')
      const t = new Topic<string>('v2-send', 1, false)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      t.subscribe(() => {})

      const v2Channel = `TopicV2-v2-send|1-1`
      const received: Array<{ type?: unknown }> = []
      BroadcastChannelMock.listeners[v2Channel] ??= []
      BroadcastChannelMock.listeners[v2Channel].push((m: { data: { type?: unknown } }) => received.push(m.data))

      t.publish('hello')

      expect(postSpy).not.toHaveBeenCalled()
      expect(received.some((m) => m.type === TopicMessageType.TopicNext)).toBe(true)
      t.destroy()
      postSpy.mockRestore()
    })

    it('falls back from V2 when message arrives on legacy BroadcastChannel', () => {
      const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], 'V2')
      g['@onecx/accelerator'].topic.useBroadcastChannel = 'V2'

      const t = new Topic<string>('v2-fallback', 1, false)

      const msg = {
        data: { type: TopicMessageType.TopicNext, name: 'v2-fallback', version: 1, data: 'x', timestamp: 1, id: 1 },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stopImmediatePropagation: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stopPropagation: () => {},
      } as unknown as MessageEvent<unknown>

      ;(t as unknown as { onBroadcastChannelMessage: (message: MessageEvent<unknown>) => void }).onBroadcastChannelMessage(msg)

      expect(acceleratorState['@onecx/accelerator'].topic.useBroadcastChannel).toBe(true)
      t.destroy()
    })

    it('isolates messages per tab in V2 channels', async () => {
      const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'tabId'], 1)
      g['@onecx/accelerator'].topic.useBroadcastChannel = 'V2'

      g['@onecx/accelerator'].topic.tabId = 1
      const val1: string[] = []
      const t1 = new Topic<string>('v2-tab', 1, false)
      t1.subscribe((v) => val1.push(v))

      g['@onecx/accelerator'].topic.tabId = 2
      const val2: string[] = []
      const t2 = new Topic<string>('v2-tab', 1, false)
      t2.subscribe((v) => val2.push(v))

      g['@onecx/accelerator'].topic.tabId = 1
      await t1.publish('only-tab-1')

      expect(val1).toEqual(['only-tab-1'])
      expect(val2).toEqual([])

      t1.destroy()
      t2.destroy()
    })
  })
})
