import { createRoot } from 'react-dom/client'
import { act } from 'react'
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

const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

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
      await flushPromises()
    })

    expect(result).toBeDefined()
    expect(typeof result.activate).toBe('function')
    root.unmount()
  })

  it('calls activate on mount when activate option is true (default)', async () => {
    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(mockActivate).toHaveBeenCalled()
    root.unmount()
  })

  it('calls deactivate on unmount', async () => {
    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    await act(async () => {
      root.unmount()
    })

    expect(mockDeactivate).toHaveBeenCalled()
  })

  it('does not call activate when activate option is false', async () => {
    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent activate={false} />)
      await flushPromises()
    })

    expect(mockActivate).not.toHaveBeenCalled()
    root.unmount()
  })
})
