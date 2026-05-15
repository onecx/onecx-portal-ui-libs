import { createRoot } from 'react-dom/client'
import type { WrappedGuards } from '../utils/wrap-guards.utils'
import * as GuardsHooks from './use-guard-deactivation'
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

  it('calls onGuardCheck with deactivation result', async () => {
    const canDeactivate = jest.fn(async () => false)
    const wrapped: WrappedGuards = {
      canMatch: jest.fn(async () => true),
      canActivateChild: jest.fn(async () => true),
      canActivate: jest.fn(async () => true),
      canDeactivate,
      guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
    }
    ;(useWrappedGuards as jest.Mock).mockReturnValue(wrapped)
    const onGuardCheck = jest.fn()

    function TestComponent() {
      GuardsHooks.useGuardDeactivation({ pathname: '/next' } as any, { onGuardCheck })
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(onGuardCheck).toHaveBeenCalledWith(false)
    root.unmount()
  })

  it('does not run canDeactivate when disabled', async () => {
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
      GuardsHooks.useGuardDeactivation({ pathname: '/next' } as any, { enabled: false })
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(canDeactivate).not.toHaveBeenCalled()
    root.unmount()
  })
})
