/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { TopicPublisher } from './topic-publisher'
import { acceleratorState } from '../declarations'
import { BroadcastChannelMock } from './mocks/broadcast-channel.mock'
import * as loggerUtils from '../utils/logger.utils'
import { ensureProperty } from '../utils/ensure-property.utils'
import type { ComponentLogger } from '../utils/create-logger.utils'

describe('TopicPublisher', () => {
  const originalBroadcastChannel = Reflect.get(globalThis, 'BroadcastChannel')
  const originalPostMessage = Reflect.get(globalThis, 'postMessage')

  afterEach(() => {
    Reflect.set(globalThis, 'BroadcastChannel', originalBroadcastChannel)
    Reflect.set(globalThis, 'postMessage', originalPostMessage)
    BroadcastChannelMock.listeners = {}
    jest.restoreAllMocks()
  })

  it('disables BroadcastChannel when not supported (createBroadcastChannel branch)', () => {
    const infoFn = jest.fn()
    const mockLogger: ComponentLogger = {
      debug: jest.fn() as unknown as ComponentLogger['debug'],
      info: infoFn as unknown as ComponentLogger['info'],
      warn: jest.fn() as unknown as ComponentLogger['warn'],
      error: jest.fn() as unknown as ComponentLogger['error'],
    }
    jest.spyOn(loggerUtils, 'createLogger').mockReturnValue(mockLogger)

    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], true as const)
    g['@onecx/accelerator'].topic.useBroadcastChannel = true

    Reflect.set(globalThis, 'BroadcastChannel', undefined)

    const p = new TopicPublisher<string>('pub-no-bc', 1)
    ;(p as unknown as { sendMessage: (message: { type: string }) => void }).sendMessage({ type: 'x' })

    expect(infoFn).toHaveBeenCalled()
    expect(acceleratorState['@onecx/accelerator'].topic.useBroadcastChannel).toBe(false)
  })

  it('throws when postMessage is not available and BroadcastChannel is disabled', () => {
    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], false as const)
    g['@onecx/accelerator'].topic.useBroadcastChannel = false

    Reflect.set(globalThis, 'postMessage', undefined)

    const p = new TopicPublisher<string>('pub-no-postmessage', 1)
    expect(() => (p as unknown as { sendMessage: (message: { type: string }) => void }).sendMessage({ type: 'x' })).toThrow(
      'postMessage is not available in this environment'
    )
  })

  it('uses V2 broadcast channel when configured', () => {
    Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannelMock)

    const postSpy = jest.spyOn(BroadcastChannelMock.prototype, 'postMessage')

    const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'tabId'], 7)
    g['@onecx/accelerator'].topic.useBroadcastChannel = 'V2'
    g['@onecx/accelerator'].topic.tabId = 7

    const p = new TopicPublisher<string>('pub-v2', 1)
    ;(p as unknown as { sendMessage: (message: { type: string }) => void }).sendMessage({ type: 'x' })

    expect(postSpy).toHaveBeenCalledTimes(1)
    const instance = postSpy.mock.instances[0] as unknown as BroadcastChannelMock
    expect(instance.name).toBe('TopicV2-pub-v2|1-7')
  })
})
