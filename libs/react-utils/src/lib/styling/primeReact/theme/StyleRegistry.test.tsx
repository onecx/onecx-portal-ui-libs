import { render, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import applyThemeVariables from './applyThemeVariables'

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
})
