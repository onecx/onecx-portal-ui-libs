import { createRoot } from 'react-dom/client'
import type { WrappedGuards } from '../utils/wrap-guards.utils'
import * as GuardsHooks from './use-guard-check'
import { useWrappedGuards } from './use-wrapped-guards'
import { act } from 'react'

jest.mock('react-router', () => ({
  useLocation: jest.fn(() => ({ key: 'loc', pathname: '/', search: '', hash: '', state: null })),
  useMatches: jest.fn(() => []),
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('./use-wrapped-guards', () => ({
  useWrappedGuards: jest.fn(),
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

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

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(canMatch).toHaveBeenCalled()
    expect(canActivateChild).toHaveBeenCalled()
    expect(canActivate).toHaveBeenCalled()
    expect(onGuardCheck).toHaveBeenCalledWith(true)

    root.unmount()
    jest.restoreAllMocks()
  })
})
