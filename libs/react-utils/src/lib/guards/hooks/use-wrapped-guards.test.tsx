import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { useWrappedGuards } from './use-wrapped-guards'
import { wrapGuards } from '../utils/wrap-guards.utils'

const mockLocation = { key: 'test', pathname: '/test', search: '', hash: '', state: null, unstable_mask: undefined }
const mockMatches = [{ params: {}, handle: {}, pathname: '/', data: null, id: '1' }]

jest.mock('react-router', () => ({
  useLocation: jest.fn(() => mockLocation),
  useMatches: jest.fn(() => mockMatches),
}))

jest.mock('../utils/wrap-guards.utils', () => ({
  wrapGuards: jest.fn(() => ({
    canMatch: jest.fn(async () => true),
    canActivateChild: jest.fn(async () => true),
    canActivate: jest.fn(async () => true),
    canDeactivate: jest.fn(async () => true),
    guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
  })),
}))

function TestComponent({
  guardsNavigationState,
  guardsGatherer,
  onResult,
}: {
  guardsNavigationState?: any
  guardsGatherer?: any
  onResult?: (r: any) => void
} = {}) {
  const result = useWrappedGuards({ guardsNavigationState, guardsGatherer })
  onResult?.(result)
  return null
}

describe('useWrappedGuards', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(wrapGuards as jest.Mock).mockReturnValue({
      canMatch: jest.fn(async () => true),
      canActivateChild: jest.fn(async () => true),
      canActivate: jest.fn(async () => true),
      canDeactivate: jest.fn(async () => true),
      guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
    })
  })

  it('returns a WrappedGuards object with all required methods', async () => {
    let result: any
    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(
        <TestComponent
          onResult={(r) => {
            result = r
          }}
        />
      )
    })

    expect(result).toBeDefined()
    expect(typeof result.canMatch).toBe('function')
    expect(typeof result.canActivateChild).toBe('function')
    expect(typeof result.canActivate).toBe('function')
    expect(typeof result.canDeactivate).toBe('function')
    root.unmount()
  })

  it('calls wrapGuards with current matches and location', async () => {
    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
    })

    expect(wrapGuards).toHaveBeenCalledWith(
      expect.objectContaining({
        matches: mockMatches,
        location: mockLocation,
      })
    )
    root.unmount()
  })

  it('passes guardsNavigationState and guardsGatherer options to wrapGuards', async () => {
    const guardsNavigationState = { guardCheck: true }
    const guardsGatherer = {} as any

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent guardsNavigationState={guardsNavigationState} guardsGatherer={guardsGatherer} />)
    })

    expect(wrapGuards).toHaveBeenCalledWith(expect.objectContaining({ guardsNavigationState, guardsGatherer }))
    root.unmount()
  })
})
