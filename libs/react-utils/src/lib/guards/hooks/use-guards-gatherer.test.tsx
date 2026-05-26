import { render, waitFor } from '@testing-library/react'
import { useGuardsGatherer } from './use-guards-gatherer'

const mockActivate = jest.fn()
const mockDeactivate = jest.fn()

jest.mock('react-router', () => ({
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('../services/guards-gatherer', () => ({
  GuardsGatherer: jest.fn(() => ({
    activate: mockActivate,
    deactivate: mockDeactivate,
  })),
}))

function TestComponent({
  activate,
  onResult,
}: {
  activate?: boolean
  onResult?: (r: any) => void
} = {}) {
  const result = useGuardsGatherer(activate === undefined ? undefined : { activate })
  onResult?.(result)
  return null
}

describe('useGuardsGatherer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns a GuardsGatherer instance', async () => {
    let result: any
    render(
      <TestComponent
        onResult={(r) => {
          result = r
        }}
      />
    )

    await waitFor(() => {
      expect(result).toBeDefined()
    })

    expect(typeof result.activate).toBe('function')
  })

  it('calls activate on mount when activate option is true (default)', async () => {
    render(<TestComponent />)

    await waitFor(() => {
      expect(mockActivate).toHaveBeenCalled()
    })
  })

  it('calls deactivate on unmount', async () => {
    const { unmount } = render(<TestComponent />)

    await waitFor(() => {
      expect(mockActivate).toHaveBeenCalled()
    })

    unmount()

    expect(mockDeactivate).toHaveBeenCalled()
  })

  it('does not call activate when activate option is false', async () => {
    render(<TestComponent activate={false} />)

    await waitFor(() => {
      expect(mockActivate).not.toHaveBeenCalled()
    })
  })
})
