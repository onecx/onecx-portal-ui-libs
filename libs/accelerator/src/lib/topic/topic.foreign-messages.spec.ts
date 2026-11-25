/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { Topic } from './topic'
import { TopicMessageType } from './topic-message-type'
import { TopicDataMessage } from './topic-data-message'
import { BroadcastChannelMock } from './mocks/broadcast-channel.mock'
import * as loggerUtils from '../utils/logger.utils'
import { acceleratorState } from '../declarations'
import { ensureProperty } from '../utils/ensure-property.utils'

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

type MessageListener = (event: MessageEvent<unknown>) => void
type ComponentLogger = ReturnType<typeof loggerUtils.createLogger>

const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener
let listeners: MessageListener[] = []

function installMessageListenerCapture(): void {
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
}

function createTestTopic(): { topic: Topic<string>; values: string[] } {
  const loggerDebugFn = jest.fn()
  const logger: ComponentLogger = {
    debug: loggerDebugFn as unknown as ComponentLogger['debug'],
    info: jest.fn() as unknown as ComponentLogger['info'],
    warn: jest.fn() as unknown as ComponentLogger['warn'],
    error: jest.fn() as unknown as ComponentLogger['error'],
  }
  jest.spyOn(loggerUtils, 'createLogger').mockReturnValue(logger)

  const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], false)
  g['@onecx/accelerator'].topic.useBroadcastChannel = false
  g['@onecx/accelerator'].topic.initDate = Date.now() - 1000000

  const values: string[] = []
  const topic = new Topic<string>('foreign-topic', 1)
  topic.subscribe((v) => values.push(v))
  return { topic, values }
}

function foreignMessage(data: unknown): MessageEvent<unknown> {
  return { data, stopImmediatePropagation: jest.fn(), stopPropagation: jest.fn() } as unknown as MessageEvent<unknown>
}

function topicNextMessage(topic: Topic<string>): MessageEvent<TopicDataMessage<string>> {
  const data = {
    type: TopicMessageType.TopicNext,
    name: topic.name,
    version: topic.version,
    data: 'value1',
    timestamp: Date.now(),
    id: 1,
  } as unknown as TopicDataMessage<string>
  return { data, stopImmediatePropagation: jest.fn(), stopPropagation: jest.fn() } as unknown as MessageEvent<
    TopicDataMessage<string>
  >
}

function deliver(event: MessageEvent<unknown>): void {
  listeners.forEach((l) => l(event))
}

function expectForeignMessageIgnored(data: unknown): void {
  const { topic, values } = createTestTopic()
  expect(() => deliver(foreignMessage(data))).not.toThrow()
  expect(values).toEqual([])
  topic.destroy()
}

describe('Topic (foreign window messages)', () => {
  beforeEach(() => {
    installMessageListenerCapture()
    listeners = []
  })

  afterEach(() => {
    BroadcastChannelMock.listeners = {}
    jest.restoreAllMocks()
  })

  afterAll(() => {
    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
    listeners = []
  })

  it('given a topic, when the window receives a message with null data, then no error is raised and no value is delivered', () => {
    expectForeignMessageIgnored(null)
  })

  it('given a topic, when the window receives a message with undefined data, then no error is raised and no value is delivered', () => {
    expectForeignMessageIgnored(undefined)
  })

  it('given a topic, when the window receives a message with primitive data, then no error is raised and no value is delivered', () => {
    expectForeignMessageIgnored('hello')
  })

  it('given a foreign message arrived, when a valid TopicNext message arrives, then the subscriber receives its value', () => {
    const { topic, values } = createTestTopic()
    deliver(foreignMessage(null))
    deliver(topicNextMessage(topic))
    expect(values).toEqual(['value1'])
    topic.destroy()
  })
})
