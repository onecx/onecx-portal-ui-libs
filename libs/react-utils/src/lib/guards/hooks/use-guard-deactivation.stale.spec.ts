import type { Location } from 'react-router'
import { useLocation } from 'react-router'
import { renderHook, waitFor } from '@testing-library/react'
import type { WrappedGuards } from '../utils/wrap-guards.utils'
import { useGuardDeactivation } from './use-guard-deactivation'
import { useWrappedGuards } from './use-wrapped-guards'

jest.mock('react-router', () => ({
  useLocation: jest.fn(() => ({ key: 'a', pathname: '/', search: '', hash: '', state: null })),
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
    createLogger: () => mockLogger,
    __mockLogger: mockLogger,
  }
})

const mockError = (jest.requireMock('../utils/logger.utils') as { __mockLogger: { error: jest.Mock } }).__mockLogger
  .error

const useLocationMock = useLocation as jest.Mock
const useWrappedGuardsMock = useWrappedGuards as jest.Mock

function location(key: string): Location {
  return { pathname: '/', search: '', hash: '', state: null, key }
}

function makeWrappedGuards(canDeactivate: jest.Mock): WrappedGuards {
  return {
    canMatch: jest.fn(async () => true),
    canActivateChild: jest.fn(async () => true),
    canActivate: jest.fn(async () => true),
    canDeactivate,
    guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
  }
}

const nextLocation: Location = location('next')

function resetLocation(key: string): void {
  mockError.mockClear()
  useLocationMock.mockReturnValue(location(key))
}

describe('useGuardDeactivation (stale check)', () => {
  beforeEach(() => {
    resetLocation('a')
  })

  it('given a check for an earlier location that resolves after a newer check, when the stale check resolves, then its result is not reported', async () => {
    let resolveStale: (result: boolean) => void = (result) => {
      void result
    }
    const staleCheck = new Promise<boolean>((resolve) => {
      resolveStale = resolve
    })
    const canDeactivate = jest
      .fn()
      .mockImplementationOnce(() => staleCheck)
      .mockResolvedValue(false)
    useWrappedGuardsMock.mockReturnValue(makeWrappedGuards(canDeactivate))
    const onGuardCheck = jest.fn()

    const { result, rerender } = renderHook(() => useGuardDeactivation(nextLocation, { onGuardCheck }))
    useLocationMock.mockReturnValue(location('b'))
    rerender()

    await waitFor(() => {
      expect(canDeactivate).toHaveBeenCalledTimes(2)
    })

    resolveStale(true)
    await new Promise((resolve) => {
      setTimeout(resolve, 0)
    })

    expect(onGuardCheck).not.toHaveBeenCalledWith(true)
    expect(onGuardCheck).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.lastResult).toBe(false)
    })
  })
})

describe('useGuardDeactivation (failing and default checks)', () => {
  beforeEach(() => {
    resetLocation('a')
  })

  it('given a rejecting deactivation check, when the hook runs, then the error is logged and no result is reported', async () => {
    useWrappedGuardsMock.mockReturnValue(
      makeWrappedGuards(
        jest.fn(async () => {
          throw new Error('deactivation failed')
        })
      )
    )
    const onGuardCheck = jest.fn()

    const { result } = renderHook(() => useGuardDeactivation(nextLocation, { onGuardCheck }))

    await waitFor(() => {
      expect(mockError).toHaveBeenCalled()
    })

    expect(onGuardCheck).not.toHaveBeenCalled()
    expect(result.current.lastResult).toBeNull()
  })

  it('given a deactivation check without options, when the check resolves, then the last result is the check result', async () => {
    useWrappedGuardsMock.mockReturnValue(makeWrappedGuards(jest.fn(async () => true)))

    const { result } = renderHook(() => useGuardDeactivation(nextLocation))

    await waitFor(() => {
      expect(result.current.lastResult).toBe(true)
    })
  })
})
