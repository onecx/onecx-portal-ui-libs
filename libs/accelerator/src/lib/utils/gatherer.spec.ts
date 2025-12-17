/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { TopicPublisher } from '../topic/topic-publisher'
import { Gatherer } from './gatherer'

import {
  BroadcastChannel
} from "../topic/mocks/broadcast-channel"

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannel)

describe('Gatherer', () => {
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

  let gatherer1: Gatherer<string, string>
  let gatherer2: Gatherer<string, string>

  beforeEach(() => {
    listeners = []

    gatherer1 = new Gatherer<string, string>('test', 1, async (request) => `responseGatherer1: ${request}`)
    gatherer2 = new Gatherer<string, string>('test', 1, async (request) => `responseGatherer2: ${request}`)
  })

  afterEach(() => {
    gatherer1.destroy()
    gatherer2.destroy()
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
    delete (window as any)['@onecx/accelerator'].gatherer.promises

    await expect(gatherer1.gather('request3')).rejects.toThrow('Gatherer is not initialized')
    // Ensure that promises are reset for the next test
    ;(window as any)['@onecx/accelerator'].gatherer.promises = {}
  })

  it('should log received and answered requests if debug is enabled', async () => {
    ;(window as any)['@onecx/accelerator'].gatherer.debug = ['test']
    const consoleLogSpy = jest.spyOn(console, 'log')

    await gatherer1.gather('request4')

    expect(consoleLogSpy).toHaveBeenCalledWith('Gatherer test: 1 received request request4')
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Gatherer test: 1 answered request request4 with response',
      'responseGatherer2: request4'
    )

    consoleLogSpy.mockRestore()
  })

  it('should warn if array was not initialized', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    gatherer2['isOwnerOfRequest'] = () => false
    new TopicPublisher('test', 1).publish({ id: 999, request: 'test' })

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Expected an array of promises to gather for id ',
      999,
      ' but the id was not present'
    )
  })

  it('should clean up promises on destroy', () => {
    gatherer1['ownIds'].add(1)
    ;(window as any)['@onecx/accelerator'].gatherer.promises[1] = []

    gatherer1.destroy()

    expect((window as any)['@onecx/accelerator'].gatherer.promises[1]).toBeUndefined()
  })
})
