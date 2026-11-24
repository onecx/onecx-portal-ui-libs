import { act, renderHook } from '@testing-library/react'
import type { WrappedGuards } from '../utils/wrap-guards.utils'
import { useGuardCheck } from './use-guard-check'
import { useWrappedGuards } from './use-wrapped-guards'

jest.mock('react-router', () => ({
  useLocation: jest.fn(),
  useMatches: jest.fn(() => []),
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('./use-wrapped-guards', () => ({
  useWrappedGuards: jest.fn(),
}))

jest.mock('../utils/logger.utils', () => {
  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }
  return {
    createLogger: jest.fn(() => mockLogger),
    __mockLogger: mockLogger,
  }
})

const { useLocation } = require('react-router')
const { __mockLogger: mockLogger } = require('../utils/logger.utils')

const locationA = { key: 'a', pathname: '/a', search: '', hash: '', state: null }
const locationB = { key: 'b', pathname: '/b', search: '', hash: '', state: null }

function makeWrapped(overrides: Partial<WrappedGuards> = {}): WrappedGuards {
  return {
    canMatch: jest.fn(async () => true),
    canActivateChild: jest.fn(async () => true),
    canActivate: jest.fn(async () => true),
    canDeactivate: jest.fn(async () => true),
    guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
    ...overrides,
  }
}

function deferred(): { promise: Promise<boolean>; resolve: (value: boolean) => void } {
  let resolve: (value: boolean) => void = () => undefined
  const promise = new Promise<boolean>((done) => {
    resolve = done
  })
  return { promise, resolve: (value) => resolve(value) }
}

function renderGuardCheck(wrapped: WrappedGuards, onGuardCheck?: jest.Mock) {
  useLocation.mockReturnValue(locationA)
  ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)
  return renderHook(() => useGuardCheck({ onGuardCheck }))
}

describe('useGuardCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('given the hook is used without options and the only guard check resolves true, when it completes, then lastResult is true', async () => {
    const { result } = renderGuardCheck(makeWrapped())

    await act(async () => undefined)

    expect(result.current.lastResult).toBe(true)
  })

  it('given a slow check for location A is pending and the location changes to B whose check finishes false, when the check for A resolves true later, then lastResult stays false and onGuardCheck is never called with true', async () => {
    const pendingA = deferred()
    const wrappedA = makeWrapped({ canMatch: () => pendingA.promise })
    const wrappedB = makeWrapped({ canMatch: jest.fn(async () => false) })
    const onGuardCheck = jest.fn()

    const { result, rerender } = renderGuardCheck(wrappedA, onGuardCheck)

    useLocation.mockReturnValue(locationB)
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrappedB)
    rerender()

    await act(async () => undefined)
    await act(async () => {
      pendingA.resolve(true)
    })

    expect(result.current.lastResult).toBe(false)
    expect(onGuardCheck).toHaveBeenCalledTimes(1)
    expect(onGuardCheck).not.toHaveBeenCalledWith(true)
  })

  it('given a guard check rejects, when the hook runs, then the error is logged and lastResult and onGuardCheck are not updated', async () => {
    const wrapped = makeWrapped({ canMatch: jest.fn(() => Promise.reject(new Error('guard failed'))) })
    const onGuardCheck = jest.fn()

    const { result } = renderGuardCheck(wrapped, onGuardCheck)

    await act(async () => undefined)

    expect(mockLogger.error).toHaveBeenCalledWith('Guard check failed', expect.any(Error))
    expect(onGuardCheck).not.toHaveBeenCalled()
    expect(result.current.lastResult).toBeNull()
  })

  it('given the guard check resolves true and onGuardCheck throws, when the hook runs, then the callback error is logged and lastResult is still true', async () => {
    const onGuardCheck = jest.fn(() => {
      throw new Error('callback failed')
    })

    const { result } = renderGuardCheck(makeWrapped(), onGuardCheck)

    await act(async () => undefined)

    expect(mockLogger.error).toHaveBeenCalledWith('onGuardCheck callback failed', expect.any(Error))
    expect(result.current.lastResult).toBe(true)
  })
})
