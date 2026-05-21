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
  let container: HTMLDivElement
  let root: ReturnType<typeof createRoot>

  beforeEach(() => {
    container = document.createElement('div')
    root = createRoot(container)
  })

  afterEach(() => {
    root.unmount()
  })

  it('runs canDeactivate for next location', async () => {
    const canDeactivate = jest.fn(async () => true)
    ;(useWrappedGuards as jest.Mock).mockReturnValue(makeWrappedGuards(canDeactivate))

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(canDeactivate).toHaveBeenCalled()
    jest.restoreAllMocks()
  })

  it('calls onGuardCheck with deactivation result', async () => {
    const canDeactivate = jest.fn(async () => false)
    ;(useWrappedGuards as jest.Mock).mockReturnValue(makeWrappedGuards(canDeactivate))
    const onGuardCheck = jest.fn()

    await act(async () => {
      root.render(<TestComponent onGuardCheck={onGuardCheck} />)
      await flushPromises()
    })

    expect(onGuardCheck).toHaveBeenCalledWith(false)
  })

  it('does not run canDeactivate when disabled', async () => {
    const canDeactivate = jest.fn(async () => true)
    ;(useWrappedGuards as jest.Mock).mockReturnValue(makeWrappedGuards(canDeactivate))

    await act(async () => {
      root.render(<TestComponent enabled={false} />)
      await flushPromises()
    })

    expect(canDeactivate).not.toHaveBeenCalled()
  })
})
