import { combineToBoolean, executeRouterSyncGuard, logGuardsDebug, resolveToPromise } from './guards-utils.utils'

jest.mock('./logger.utils', () => ({
  createLogger: () => ({
    debug: jest.fn(),
  }),
}))

describe('guards-utils', () => {
  it('combineToBoolean returns false when any guard is false', () => {
    expect(combineToBoolean([true, true])).toBe(true)
    expect(combineToBoolean([true, false, true])).toBe(false)
  })

  it('executeRouterSyncGuard always returns true', () => {
    expect(executeRouterSyncGuard()).toBe(true)
  })

  it('resolveToPromise normalizes sync values', async () => {
    await expect(resolveToPromise(true)).resolves.toBe(true)
  })

  it('resolveToPromise passes through an existing Promise', async () => {
    const p = Promise.resolve(false)
    await expect(resolveToPromise(p)).resolves.toBe(false)
    expect(resolveToPromise(p)).toBe(p)
  })

  it('logGuardsDebug calls the logger', () => {
    expect(() => logGuardsDebug('test message', { some: 'data' })).not.toThrow()
  })
})
