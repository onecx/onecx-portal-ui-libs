import { render, waitFor } from '@testing-library/react'
import type { WrappedGuards } from '../utils/wrap-guards.utils'
import * as GuardsHooks from './use-guard-deactivation'
import { useWrappedGuards } from './use-wrapped-guards'

jest.mock('react-router', () => ({
  useLocation: jest.fn(() => ({ key: 'loc', pathname: '/', search: '', hash: '', state: null })),
  useMatches: jest.fn(() => []),
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('./use-wrapped-guards', () => ({
  useWrappedGuards: jest.fn(),
}))

function makeWrappedGuards(canDeactivate: jest.Mock): WrappedGuards {
  return {
    canMatch: jest.fn(async () => true),
    canActivateChild: jest.fn(async () => true),
    canActivate: jest.fn(async () => true),
    canDeactivate,
    guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
  }
}

function TestComponent({
  onGuardCheck,
  enabled,
}: {
  onGuardCheck?: jest.Mock
  enabled?: boolean
} = {}) {
  GuardsHooks.useGuardDeactivation({ pathname: '/next' } as any, { onGuardCheck, enabled })
  return null
}

describe('useGuardDeactivation', () => {
  it('runs canDeactivate for next location', async () => {
    const canDeactivate = jest.fn(async () => true)
    ;(useWrappedGuards as jest.Mock).mockReturnValue(makeWrappedGuards(canDeactivate))

    render(<TestComponent />)

    await waitFor(() => {
      expect(canDeactivate).toHaveBeenCalled()
    })

    jest.restoreAllMocks()
  })

  it('calls onGuardCheck with deactivation result', async () => {
    const canDeactivate = jest.fn(async () => false)
    ;(useWrappedGuards as jest.Mock).mockReturnValue(makeWrappedGuards(canDeactivate))
    const onGuardCheck = jest.fn()

    render(<TestComponent onGuardCheck={onGuardCheck} />)

    await waitFor(() => {
      expect(onGuardCheck).toHaveBeenCalledWith(false)
    })
  })

  it('does not run canDeactivate when disabled', async () => {
    const canDeactivate = jest.fn(async () => true)
    ;(useWrappedGuards as jest.Mock).mockReturnValue(makeWrappedGuards(canDeactivate))

    render(<TestComponent enabled={false} />)

    await waitFor(() => {
      expect(canDeactivate).not.toHaveBeenCalled()
    })
  })
})
