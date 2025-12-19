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

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

describe('Topic', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let values1: any[]
  let values2: any[]

  let testTopic1: Topic<string>
  let testTopic2: Topic<string>

  beforeEach(() => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.statsEnabled = true
    window['@onecx/accelerator'].topic.initDate = Date.now() - 1000000
    window['@onecx/accelerator'].topic.useBroadcastChannel = true
    window['@onecx/accelerator'].topic.debug = ['SpecificTestTopic']

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
    if (window['@onecx/accelerator']?.topic?.debug) {
      window['@onecx/accelerator'].topic.debug = undefined
    }
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

    const values3: any[] = []
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

    const values3: any[] = []
    const testTopic3 = new Topic<string>('test123', 1)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual([])
  })

  it('should have no value if message version is different', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: any[] = []
    const testTopic3 = new Topic<string>('test', 2)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual([])
  })

  it('should have no value if message is undefined', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: any[] = []
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
    window.postMessage = (m: any) => {
      listeners.forEach((l) => {
        // Set timeout to simulate async behavior
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setTimeout(() => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }), 0)
      })
    }
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
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate = Date.now() // recent
    window['@onecx/accelerator'].topic.useBroadcastChannel = false

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

  it('logs window message when debug enabled and handles TopicGet on window path', () => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.debug = ['win-topic']
    window['@onecx/accelerator'].topic.useBroadcastChannel = false

    const t = new Topic<string>('win-topic', 1, false)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    t.subscribe(() => {})
    // initialize with a value so TopicGet will respond
    t.publish('init')

    const sendSpy = jest.spyOn(t as any, 'sendMessage')

    // Send TopicGet via window to trigger handleTopicGetMessage through onWindowMessage
    const getMsg = {
      data: { type: TopicMessageType.TopicGet, name: 'win-topic', version: 1 },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopImmediatePropagation: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopPropagation: () => {},
    } as any
    listeners.forEach((l) => l(getMsg))

    expect(sendSpy).toHaveBeenCalled()
    t.destroy()
    sendSpy.mockRestore()
  })

  it('handles error in TopicResolve processing (catch branch)', () => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.useBroadcastChannel = false

    const t = new Topic<string>('resolve-error', 1, false)
    // inject a throwing resolver
    ;(t as any).publishPromiseResolver[123] = () => {
      throw new Error('boom')
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const resolveMsg = {
      data: { type: TopicMessageType.TopicResolve, name: 'resolve-error', version: 1, resolveId: 123 },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopImmediatePropagation: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopPropagation: () => {},
    } as any

    listeners.forEach((l) => l(resolveMsg))

    expect(errSpy).toHaveBeenCalled()
    t.destroy()
    errSpy.mockRestore()
  })

  describe('integration with older versions of library', () => {
    let previousMessage: TopicDataMessage<string>
    let incomingMessage: MessageEvent<TopicDataMessage<string>>

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
      } as any

      // initialize topic
      testTopic1.publish('initMsg')

      jest.resetAllMocks()
    })

    it('should have value if incoming id is greater than previous id', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = 0
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have value if incoming timestamp is greater than previous timestamp with no ids provided', () => {
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = undefined
      previousMessage.timestamp = 1
      incomingMessage.data.data = 'msg2'
      ;(<any>incomingMessage.data).id = undefined
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have value if incoming timestamp is greater than previous timestamp when current message has id', () => {
      previousMessage.data = 'msg1'
      previousMessage.id = 1
      previousMessage.timestamp = 1
      incomingMessage.data.data = 'msg2'
      ;(<any>incomingMessage.data).id = undefined
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have value if incoming timestamp is greater than previous timestamp when incoming message has id', () => {
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = undefined
      previousMessage.timestamp = 1
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1', 'msg2'])
    })

    it('should have no value if incoming timestamp is equal to the previous timestamp with no ids provided', () => {
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = undefined
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      ;(<any>incomingMessage.data).id = undefined
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1'])
    })

    it('should have no value if incoming timestamp is equal to the previous timestamp when current message has id', () => {
      jest.spyOn(console, 'warn')
      previousMessage.data = 'msg1'
      previousMessage.id = 1
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      ;(<any>incomingMessage.data).id = undefined
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(console.warn).toHaveBeenLastCalledWith(
        'Message was dropped because of equal timestamps, because there was an old style message in the system. Please upgrade all libraries to the latest version.'
      )
    })

    it('should have no value if incoming timestamp is equal to previous timestamp when incoming message has id', () => {
      jest.spyOn(console, 'warn')
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = undefined
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(console.warn).toHaveBeenLastCalledWith(
        'Message was dropped because of equal timestamps, because there was an old style message in the system. Please upgrade all libraries to the latest version.'
      )
    })

    it('should have no value and no warning if incoming timestamp is equal to previous timestamp when incoming message has smaller id then current', () => {
      jest.spyOn(console, 'warn')
      previousMessage.data = 'msg1'
      ;(<any>previousMessage).id = 2
      previousMessage.timestamp = 3
      incomingMessage.data.data = 'msg2'
      incomingMessage.data.id = 1
      incomingMessage.data.timestamp = 3
      ;(<any>testTopic1).data.next(previousMessage)
      ;(<any>testTopic1).onWindowMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(console.warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('for compatibility with older versions and browsers', () => {
    it('disables BroadcastChannel when not supported (TopicPublisher constructor branch)', () => {
      const originalBC = (globalThis as any).BroadcastChannel
      ;(globalThis as any).BroadcastChannel = undefined

      window['@onecx/accelerator'] ??= {}
      window['@onecx/accelerator'].topic ??= {}
      window['@onecx/accelerator'].topic.useBroadcastChannel = true

      // Creating a topic triggers TopicPublisher constructor branch
      const t = new Topic<string>('no-bc', 1, false)
      t.destroy()

      expect(window['@onecx/accelerator'].topic.useBroadcastChannel).toBe(false)
      ;(globalThis as any).BroadcastChannel = originalBC
    })

    it('uses window.postMessage when BroadcastChannel is disabled (sendMessage else path)', () => {
      window['@onecx/accelerator'] ??= {}
      window['@onecx/accelerator'].topic ??= {}
      window['@onecx/accelerator'].topic.useBroadcastChannel = false

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
      ;(t as any).source
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ;(t as any).operator

      // lift with identity map
      const lifted = (t as any).lift((obs: any) => obs)
      expect(lifted).toBeTruthy()

      // forEach: invoke without awaiting completion (never completes)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      t.forEach(() => {})
      t.publish(7)

      // toPromise: invoke to cover method without awaiting resolution
      const p2 = (t as any).toPromise?.()
      if (p2) {
        t.publish(9)
      }
      t.destroy()
    })
  })
})
