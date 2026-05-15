import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { useGuardCheck } from './use-guard-check'
import { useWrappedGuards } from './use-wrapped-guards'
import type { WrappedGuards } from '../utils/wrap-guards.utils'

jest.mock('react-router', () => ({
  useLocation: jest.fn(() => ({ key: 'loc', pathname: '/', search: '', hash: '', state: null })),
  useMatches: jest.fn(() => []),
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('./use-wrapped-guards', () => ({
  useWrappedGuards: jest.fn(),
}))

const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const makeWrapped = (overrides: Partial<WrappedGuards> = {}): WrappedGuards => ({
  canMatch: jest.fn(async () => true),
  canActivateChild: jest.fn(async () => true),
  canActivate: jest.fn(async () => true),
  canDeactivate: jest.fn(async () => true),
  guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
  ...overrides,
})

describe('useGuardCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('runs canMatch → canActivateChild → canActivate and calls onGuardCheck with true', async () => {
    const wrapped = makeWrapped()
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)
    const onGuardCheck = jest.fn()

    function TestComponent() {
      useGuardCheck({ onGuardCheck })
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(wrapped.canMatch).toHaveBeenCalled()
    expect(wrapped.canActivateChild).toHaveBeenCalled()
    expect(wrapped.canActivate).toHaveBeenCalled()
    expect(onGuardCheck).toHaveBeenCalledWith(true)

    root.unmount()
  })

  it('skips guard execution when enabled is false', async () => {
    const wrapped = makeWrapped()
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)

    function TestComponent() {
      useGuardCheck({ enabled: false })
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(wrapped.canMatch).not.toHaveBeenCalled()
    root.unmount()
  })

  it('stops sequence and returns false when canMatch returns false', async () => {
    const wrapped = makeWrapped({ canMatch: jest.fn(async () => false) })
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)
    const onGuardCheck = jest.fn()

    function TestComponent() {
      useGuardCheck({ onGuardCheck })
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(wrapped.canMatch).toHaveBeenCalled()
    expect(wrapped.canActivateChild).not.toHaveBeenCalled()
    expect(onGuardCheck).toHaveBeenCalledWith(false)

    root.unmount()
  })

  it('stops sequence and returns false when canActivateChild returns false', async () => {
    const wrapped = makeWrapped({ canActivateChild: jest.fn(async () => false) })
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)
    const onGuardCheck = jest.fn()

    function TestComponent() {
      useGuardCheck({ onGuardCheck })
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(wrapped.canActivateChild).toHaveBeenCalled()
    expect(wrapped.canActivate).not.toHaveBeenCalled()
    expect(onGuardCheck).toHaveBeenCalledWith(false)

    root.unmount()
  })

  it('returns wrapped guards and lastResult from the hook', async () => {
    const wrapped = makeWrapped()
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)

    let hookResult: any
    function TestComponent() {
      hookResult = useGuardCheck()
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
    })

    expect(hookResult.wrapped).toBe(wrapped)
    expect(hookResult.lastResult).not.toBeUndefined()

    root.unmount()
  })
})
