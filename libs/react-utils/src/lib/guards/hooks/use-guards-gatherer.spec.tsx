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

describe('useGuardsGatherer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns a GuardsGatherer instance', async () => {
    let result: any
    function TestComponent() {
      result = useGuardsGatherer()
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(result).toBeDefined()
    expect(typeof result.activate).toBe('function')
    root.unmount()
  })

  it('calls activate on mount when activate option is true (default)', async () => {
    function TestComponent() {
      useGuardsGatherer()
      return null
    }

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
    function TestComponent() {
      useGuardsGatherer()
      return null
    }

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
    function TestComponent() {
      useGuardsGatherer({ activate: false })
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestComponent />)
      await flushPromises()
    })

    expect(mockActivate).not.toHaveBeenCalled()
    root.unmount()
  })
})
