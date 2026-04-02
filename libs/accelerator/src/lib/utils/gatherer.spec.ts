/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { TopicPublisher } from '../topic/topic-publisher'
import { Gatherer } from './gatherer'
import * as loggerUtils from './logger.utils'
import { acceleratorState } from '../declarations'
import { ensureProperty } from './ensure-property.utils'
import type { ComponentLogger } from './create-logger.utils'

import { BroadcastChannelMock } from '../topic/mocks/broadcast-channel.mock'

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

describe('Gatherer', () => {
  const originalLocalStorageDebug = localStorage.getItem('debug')
  const origAddEventListener = globalThis.addEventListener
  const origRemoveEventListener = globalThis.removeEventListener
  const origPostMessage = globalThis.postMessage

  type MessageListener = (event: MessageEvent<unknown>) => void

  let listeners: MessageListener[] = []
  globalThis.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === 'message' && typeof listener === 'function') {
      listeners.push(listener as unknown as MessageListener)
    }
  }) as unknown as typeof globalThis.addEventListener

  globalThis.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === 'message' && typeof listener === 'function') {
      listeners = listeners.filter((l) => l !== (listener as unknown as MessageListener))
    }
  }) as unknown as typeof globalThis.removeEventListener

  globalThis.postMessage = ((message: unknown) => {
    const event = {
      data: message,
      stopImmediatePropagation: () => {},
      stopPropagation: () => {},
    } as unknown as MessageEvent<unknown>
    listeners.forEach((l) => l(event))
  }) as unknown as typeof globalThis.postMessage

  afterAll(() => {
    globalThis.addEventListener = origAddEventListener
    globalThis.removeEventListener = origRemoveEventListener
    globalThis.postMessage = origPostMessage
    if (originalLocalStorageDebug === null) {
      localStorage.removeItem('debug')
    } else {
      localStorage.setItem('debug', originalLocalStorageDebug)
    }
  })

  let gatherer1: Gatherer<string, string>
  let gatherer2: Gatherer<string, string>

  const loggerDebugFn = jest.fn()
  const loggerWarnFn = jest.fn()

  beforeEach(() => {
    const mockLogger: ComponentLogger = {
      debug: loggerDebugFn as unknown as ComponentLogger['debug'],
      info: jest.fn() as unknown as ComponentLogger['info'],
      warn: loggerWarnFn as unknown as ComponentLogger['warn'],
      error: jest.fn() as unknown as ComponentLogger['error'],
    }
    jest.spyOn(loggerUtils, 'createLogger').mockReturnValue(mockLogger)

    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'initDate'], Date.now() - 1000000)
    g['@onecx/accelerator'].topic.initDate = Date.now() - 1000000

    listeners = []

    gatherer1 = new Gatherer<string, string>('test', 1, async (request) => `responseGatherer1: ${request}`)
    gatherer2 = new Gatherer<string, string>('test', 1, async (request) => `responseGatherer2: ${request}`)
  })

  afterEach(() => {
    gatherer1.destroy()
    gatherer2.destroy()
    jest.restoreAllMocks()
    loggerDebugFn.mockClear()
    loggerWarnFn.mockClear()
  })

  it('should gather responses from all instances', async () => {
    const responses = await gatherer1.gather('request1')

    expect(responses).toEqual(['responseGatherer2: request1'])
  })

  it('should not gather responses if destroyed', async () => {
    gatherer2.destroy()

    const responses = await gatherer1.gather('request2')

    expect(responses).toEqual([])
  })

  it('should throw an error if gatherer is not initialized', async () => {
    const g = ensureProperty(
      acceleratorState,
      ['@onecx/accelerator', 'gatherer', 'promises'],
      {} as Record<number, Array<Promise<unknown>>>
    )
    const gathererState = g['@onecx/accelerator'].gatherer as unknown as {
      promises?: Record<number, Array<Promise<unknown>>>
    }
    Reflect.deleteProperty(gathererState, 'promises')

    await expect(gatherer1.gather('request3')).rejects.toThrow('Gatherer is not initialized')
    // Ensure that promises are reset for the next test
    gathererState.promises = {}
  })

  it('should log received and answered requests if debug is enabled', async () => {
    await gatherer1.gather('request4')

    expect(loggerDebugFn).toHaveBeenCalledWith('Gatherer test: 1 received request request4')
    expect(loggerDebugFn).toHaveBeenCalledWith(
      'Gatherer test: 1 answered request request4 with response',
      'responseGatherer2: request4'
    )
  })

  it('should warn if array was not initialized', () => {
    gatherer2['isOwnerOfRequest'] = () => false
    new TopicPublisher('test', 1).publish({ id: 999, request: 'test' })

    expect(loggerWarnFn).toHaveBeenCalledWith(
      'Expected an array of promises to gather for id ',
      999,
      ' but the id was not present'
    )
  })

  it('should clean up promises on destroy', () => {
    gatherer1['ownIds'].add(1)
    const g = ensureProperty(
      acceleratorState,
      ['@onecx/accelerator', 'gatherer', 'promises'],
      {} as Record<number, Array<Promise<unknown>>>
    )
    g['@onecx/accelerator'].gatherer.promises[1] = []

    gatherer1.destroy()

    expect(g['@onecx/accelerator'].gatherer.promises[1]).toBeUndefined()
  })
})
