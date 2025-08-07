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
    listeners = []

    values1 = []
    values2 = []

    testTopic1 = new Topic<string>('test', 1)
    testTopic2 = new Topic<string>('test', 1)

    testTopic1.subscribe((v) => values1.push(v))
    testTopic2.subscribe((v) => values2.push(v))
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

  it('should have no values if publish is not awaited', () => {
    const original = window.postMessage
    window.postMessage = (m: any) => {
      listeners.forEach((l) => {
        // Set timeout to simulate async behavior
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setTimeout(() => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }), 0)
      })
    }

    const val1: number[] = []
    const val2: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => val2.push(val))

    testTopic1.publish(123)

    expect(val1).toEqual([])
    expect(val2).toEqual([])

    window.postMessage = original
  })

  it('should have values if publish is awaited', async () => {
    const original = window.postMessage
    window.postMessage = (m: any) => {
      listeners.forEach((l) => {
        // Set timeout to simulate async behavior
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setTimeout(() => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }), 0)
      })
    }

    const val1: number[] = []
    const val2: number[] = []

    const testTopic1 = new Topic<number>('SpecificTestTopic', 1, false)
    const testTopic2 = new Topic<number>('SpecificTestTopic', 1, false)
    testTopic1.subscribe((val) => {
      val1.push(val)
    })
    testTopic2.subscribe((val) => val2.push(val))

    await testTopic1.publish(123)

    expect(val1).toEqual([123])
    expect(val2).toEqual([123])

    window.postMessage = original
  })

  it('should have all values if publish is awaited on first created topic', async () => {
    const original = window.postMessage
    window.postMessage = (m: any) => {
      listeners.forEach((l) => {
        // Set timeout to simulate async behavior
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setTimeout(() => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }), 0)
      })
    }

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

    window.postMessage = original
  })

  it('should have values if publish is awaited for all topics', async () => {
    const original = window.postMessage
    window.postMessage = (m: any) => {
      listeners.forEach((l) => {
        // Set timeout to simulate async behavior
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setTimeout(() => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }), 0)
      })
    }

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

    window.postMessage = original
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
      ;(<any>testTopic1).onMessage(incomingMessage)

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
      ;(<any>testTopic1).onMessage(incomingMessage)

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
      ;(<any>testTopic1).onMessage(incomingMessage)

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
      ;(<any>testTopic1).onMessage(incomingMessage)

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
      ;(<any>testTopic1).onMessage(incomingMessage)

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
      ;(<any>testTopic1).onMessage(incomingMessage)

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
      ;(<any>testTopic1).onMessage(incomingMessage)

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
      ;(<any>testTopic1).onMessage(incomingMessage)

      expect(values1).toEqual(['initMsg', 'msg1'])
      expect(console.warn).toHaveBeenCalledTimes(0)
    })
  })
})
