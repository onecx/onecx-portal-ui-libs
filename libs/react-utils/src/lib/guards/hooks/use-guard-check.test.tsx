import { render, waitFor } from '@testing-library/react'
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

function TestComponent({
  onGuardCheck,
  enabled,
  onResult,
}: {
  onGuardCheck?: jest.Mock
  enabled?: boolean
  onResult?: (r: any) => void
} = {}) {
  const result = useGuardCheck({ onGuardCheck, enabled })
  onResult?.(result)
  return null
}

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

    render(<TestComponent onGuardCheck={onGuardCheck} />)

    await waitFor(() => {
      expect(onGuardCheck).toHaveBeenCalledWith(true)
    })

    expect(wrapped.canMatch).toHaveBeenCalled()
    expect(wrapped.canActivateChild).toHaveBeenCalled()
    expect(wrapped.canActivate).toHaveBeenCalled()
  })

  it('skips guard execution when enabled is false', async () => {
    const wrapped = makeWrapped()
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)

    render(<TestComponent enabled={false} />)

    await waitFor(() => {
      expect(wrapped.canMatch).not.toHaveBeenCalled()
    })
  })

  it('stops sequence and returns false when canMatch returns false', async () => {
    const wrapped = makeWrapped({ canMatch: jest.fn(async () => false) })
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)
    const onGuardCheck = jest.fn()

    render(<TestComponent onGuardCheck={onGuardCheck} />)

    await waitFor(() => {
      expect(onGuardCheck).toHaveBeenCalledWith(false)
    })

    expect(wrapped.canMatch).toHaveBeenCalled()
    expect(wrapped.canActivateChild).not.toHaveBeenCalled()
  })

  it('stops sequence and returns false when canActivateChild returns false', async () => {
    const wrapped = makeWrapped({ canActivateChild: jest.fn(async () => false) })
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)
    const onGuardCheck = jest.fn()

    render(<TestComponent onGuardCheck={onGuardCheck} />)

    await waitFor(() => {
      expect(onGuardCheck).toHaveBeenCalledWith(false)
    })

    expect(wrapped.canActivateChild).toHaveBeenCalled()
    expect(wrapped.canActivate).not.toHaveBeenCalled()
  })

  it('returns wrapped guards and lastResult from the hook', async () => {
    const wrapped = makeWrapped()
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)

    let hookResult: any
    render(
      <TestComponent
        onResult={(r) => {
          hookResult = r
        }}
      />
    )

    await waitFor(() => {
      expect(hookResult).toBeDefined()
      expect(hookResult.lastResult).not.toBeNull()
    })

    expect(hookResult.wrapped).toBe(wrapped)
  })
})
