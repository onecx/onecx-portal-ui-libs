/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { SyncableTopic } from './syncable-topic'

describe('Syncable Topic', () => {
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

  let testSyncableTopic1: SyncableTopic<string>
  let testSyncableTopic2: SyncableTopic<string>

  beforeEach(() => {
    listeners = []

    testSyncableTopic1 = new SyncableTopic<string>('test', 1)
    testSyncableTopic2 = new SyncableTopic<string>('test', 1)

  })

  it('should get correct value', async () => {
    expect(testSyncableTopic1.getValue()).toEqual(undefined)

    await testSyncableTopic1.publish('value1')

    expect(testSyncableTopic1.getValue()).toEqual('value1')
    expect(testSyncableTopic2.getValue()).toEqual('value1')
  })
})
