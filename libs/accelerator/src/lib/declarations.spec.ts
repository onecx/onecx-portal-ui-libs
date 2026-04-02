/**
 * @jest-environment jsdom
 */

import { ensureProperty } from './utils/ensure-property.utils'

describe('declarations', () => {
  const ACC_KEY = '@onecx/accelerator'

  type AcceleratorState = typeof import('./declarations').acceleratorState

  let originalAcceleratorState: unknown

  beforeEach(() => {
    jest.resetModules()

    originalAcceleratorState = Reflect.get(globalThis, ACC_KEY)
    Reflect.deleteProperty(globalThis, ACC_KEY)
  })

  afterEach(() => {
    jest.restoreAllMocks()

    if (originalAcceleratorState === undefined) {
      Reflect.deleteProperty(globalThis, ACC_KEY)
    } else {
      Reflect.set(globalThis, ACC_KEY, originalAcceleratorState)
    }

    jest.resetModules()
  })

  it('defaults topic.tabId to 0 when performance.now returns undefined', () => {
    jest.spyOn(globalThis.performance, 'now').mockImplementation(() => undefined as unknown as number)

    let acceleratorState!: AcceleratorState
    jest.isolateModules(() => {
      acceleratorState = (require('./declarations') as { acceleratorState: AcceleratorState }).acceleratorState
    })

    const g = ensureProperty(acceleratorState, [ACC_KEY, 'topic', 'tabId'], 0)
    expect(g[ACC_KEY].topic.tabId).toBe(0)
  })

  it('keeps topic.tabId at 0 when performance.now returns 0', () => {
    jest.spyOn(globalThis.performance, 'now').mockReturnValue(0)

    let acceleratorState!: AcceleratorState
    jest.isolateModules(() => {
      acceleratorState = (require('./declarations') as { acceleratorState: AcceleratorState }).acceleratorState
    })

    const g = ensureProperty(acceleratorState, [ACC_KEY, 'topic', 'tabId'], 0)
    expect(g[ACC_KEY].topic.tabId).toBe(0)
  })
})
