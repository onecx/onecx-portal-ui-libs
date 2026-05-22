import { render, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import applyThemeVariables from './applyThemeVariables'

const flushMutations = async () => {
  await Promise.resolve()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

const mockUnsubscribe = jest.fn()
const mockSubscribe = jest.fn((cb) => {
  cb({ properties: { cat: { key: 'val' } } })
  return { unsubscribe: mockUnsubscribe }
})

jest.mock('@onecx/integration-interface', () => ({
  CurrentThemeTopic: jest.fn(() => ({ subscribe: mockSubscribe })),
}))

jest.mock('primereact/api', () => ({
  PrimeReactProvider: ({ children }: { children?: ReactNode }) => (
    <div data-testid="primereact-provider">{children}</div>
  ),
}))

jest.mock('../../../utils/withAppGlobals', () => ({
  useAppGlobals: jest.fn(() => ({ PRODUCT_NAME: 'test-app' })),
}))

jest.mock('./applyThemeVariables', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('StyleRegistry', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    jest.clearAllMocks()
    mockSubscribe.mockImplementation((cb) => {
      cb({ properties: { cat: { key: 'val' } } })
      return { unsubscribe: mockUnsubscribe }
    })
  })

  it('renders children inside PrimeReactProvider after theme is applied', async () => {
    const { default: StyleRegistry } = await import('./StyleRegistry')
    const { getByTestId, getByText } = render(
      <StyleRegistry>
        <span>child content</span>
      </StyleRegistry>
    )
    expect(getByTestId('primereact-provider')).toBeDefined()
    expect(getByText('child content')).toBeDefined()
    expect(applyThemeVariables).toHaveBeenCalledWith(
      expect.objectContaining({ properties: expect.any(Object) }),
      'test-app|test-app'
    )
  })

  it('renders null before theme is applied', async () => {
    mockSubscribe.mockImplementation(() => ({ unsubscribe: mockUnsubscribe }))
    const { default: StyleRegistry } = await import('./StyleRegistry')
    const { container } = render(
      <StyleRegistry>
        <span>hidden</span>
      </StyleRegistry>
    )
    expect(container.textContent).not.toContain('hidden')
  })

  it('unsubscribes on unmount', async () => {
    const { default: StyleRegistry } = await import('./StyleRegistry')
    const { unmount } = render(<StyleRegistry />)
    act(() => {
      unmount()
    })
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('tags existing PrimeReact style ids in head during bootstrap', async () => {
    const style = document.createElement('style')
    style.dataset.primereactStyleId = 'base'
    document.head.appendChild(style)

    const { default: StyleRegistry } = await import('./StyleRegistry')
    render(<StyleRegistry />)

    expect(style.dataset.primereactStyleId).toBe('base-test-app|test-app')
  })

  it('does not retag PrimeReact style ids that already include app suffix', async () => {
    const style = document.createElement('style')
    style.dataset.primereactStyleId = 'base|other-app'
    document.head.appendChild(style)

    const { default: StyleRegistry } = await import('./StyleRegistry')
    render(<StyleRegistry />)

    expect(style.dataset.primereactStyleId).toBe('base|other-app')
  })

  it('tags PrimeReact style appended to head after mount', async () => {
    const { default: StyleRegistry } = await import('./StyleRegistry')
    render(<StyleRegistry />)

    const style = document.createElement('style')
    style.dataset.primereactStyleId = 'dynamic'
    document.head.appendChild(style)

    await flushMutations()

    expect(style.dataset.primereactStyleId).toBe('dynamic-test-app|test-app')
  })

  it('tags nested PrimeReact styles inside appended node', async () => {
    const { default: StyleRegistry } = await import('./StyleRegistry')
    render(<StyleRegistry />)

    const wrapper = document.createElement('div')
    const nestedStyle = document.createElement('style')
    nestedStyle.dataset.primereactStyleId = 'nested'
    wrapper.appendChild(nestedStyle)
    document.head.appendChild(wrapper)

    await flushMutations()

    expect(nestedStyle.dataset.primereactStyleId).toBe('nested-test-app|test-app')
  })
})
