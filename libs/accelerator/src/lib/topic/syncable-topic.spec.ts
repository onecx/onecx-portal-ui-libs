/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { SyncableTopic } from './syncable-topic'
import {
  BroadcastChannelMock
} from "./mocks/broadcast-channel.mock"
import { acceleratorState } from '../declarations'
import { ensureProperty } from '../utils/ensure-property.utils'

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

describe('Syncable Topic', () => {
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
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as MessageEvent<unknown>
    listeners.forEach((l) => l(event))
  }) as unknown as typeof globalThis.postMessage

  afterAll(() => {
    globalThis.addEventListener = origAddEventListener
    globalThis.removeEventListener = origRemoveEventListener
    globalThis.postMessage = origPostMessage
  })

  let testSyncableTopic1: SyncableTopic<string>
  let testSyncableTopic2: SyncableTopic<string>

  beforeEach(() => {
    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'initDate'], Date.now() - 1000000)
    g['@onecx/accelerator'].topic.initDate = Date.now() - 1000000
    g['@onecx/accelerator'].topic.useBroadcastChannel = true

    BroadcastChannelMock.asyncCalls = false

    listeners = []

    testSyncableTopic1 = new SyncableTopic<string>('test', 1)
    testSyncableTopic2 = new SyncableTopic<string>('test', 1)

  })

  afterEach(() => {
    testSyncableTopic1.destroy()
    testSyncableTopic2.destroy()
    BroadcastChannelMock.listeners =  {}
    BroadcastChannelMock.asyncCalls = false
  })

  it('should get correct value', async () => {
    expect(testSyncableTopic1.getValue()).toEqual(undefined)

    await testSyncableTopic1.publish('value1')

    expect(testSyncableTopic1.getValue()).toEqual('value1')
    expect(testSyncableTopic2.getValue()).toEqual('value1')
  })
})
