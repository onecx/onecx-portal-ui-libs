import { createRoot } from 'react-dom/client'
import type { WrappedGuards } from '../utils/wrap-guards.utils'
import * as GuardsHooks from './use-guard-deactivation'
import { useWrappedGuards } from './use-wrapped-guards'
import { act } from 'react'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(() => ({ key: 'loc' })),
  useMatches: jest.fn(() => []),
  useNavigate: jest.fn(),
}))

jest.mock('./use-wrapped-guards', () => ({
  useWrappedGuards: jest.fn(),
}))

const flushPromises = () => new Promise((resolve) => setImmediate(resolve))

describe('useGuardDeactivation', () => {
  it('runs canDeactivate for next location', async () => {
    const canDeactivate = jest.fn(async () => true)

    const wrapped: WrappedGuards = {
      canMatch: jest.fn(async () => true),
      canActivateChild: jest.fn(async () => true),
      canActivate: jest.fn(async () => true),
      canDeactivate,
      guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
    }

    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)

    function TestComponent() {
      GuardsHooks.useGuardDeactivation({ pathname: '/next' } as any)
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(canDeactivate).toHaveBeenCalled()

    root.unmount()
    jest.restoreAllMocks()
  })
})
