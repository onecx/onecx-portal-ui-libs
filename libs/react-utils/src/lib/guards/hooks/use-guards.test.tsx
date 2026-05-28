import { render, waitFor } from '@testing-library/react'
import type { WrappedGuards } from '../utils/wrap-guards.utils'
import * as GuardsHooks from './use-guard-check'
import { useWrappedGuards } from './use-wrapped-guards'

jest.mock('react-router', () => ({
  useLocation: jest.fn(() => ({ key: 'loc', pathname: '/', search: '', hash: '', state: null })),
  useMatches: jest.fn(() => []),
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('./use-wrapped-guards', () => ({
  useWrappedGuards: jest.fn(),
}))

describe('useGuardCheck', () => {
  it('runs canMatch -> canActivateChild -> canActivate sequence', async () => {
    const canMatch = jest.fn(async () => true)
    const canActivateChild = jest.fn(async () => true)
    const canActivate = jest.fn(async () => true)

    const wrapped: WrappedGuards = {
      canMatch,
      canActivateChild,
      canActivate,
      canDeactivate: jest.fn(async () => true),
      guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
    }

    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)

    const onGuardCheck = jest.fn()

    function TestComponent() {
      GuardsHooks.useGuardCheck({ onGuardCheck })
      return null
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(onGuardCheck).toHaveBeenCalledWith(true)
    })

    expect(canMatch).toHaveBeenCalled()
    expect(canActivateChild).toHaveBeenCalled()
    expect(canActivate).toHaveBeenCalled()
    expect(onGuardCheck).toHaveBeenCalledWith(true)

    jest.restoreAllMocks()
  })
})
