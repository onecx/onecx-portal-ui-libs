import { render } from '@testing-library/react'
import { PrimeReactStyleProvider } from './index'

const mockDetach = jest.fn()

jest.mock('../../scopingFunctionality', () => ({
  attachPrimeReactScoper: jest.fn(),
}))

jest.mock('../../../../utils/withAppGlobals', () => ({
  useAppGlobals: jest.fn(() => ({ PRODUCT_NAME: 'my-product' })),
}))

describe('PrimeReactStyleProvider (app)', () => {
  const scopingModule = jest.requireMock('../../scopingFunctionality')

  beforeEach(() => {
    jest.clearAllMocks()
    scopingModule.attachPrimeReactScoper.mockReturnValue(mockDetach)
  })

  it('renders children and scoped wrapper attributes', () => {
    const { getByText, container } = render(
      <PrimeReactStyleProvider>
        <span>content</span>
      </PrimeReactStyleProvider>
    )

    expect(getByText('content')).toBeDefined()
    const wrapper = container.querySelector('div[data-style-id="my-product|my-product"]')
    expect(wrapper).toBeTruthy()
    expect(wrapper?.hasAttribute('data-style-isolation')).toBe(true)
    expect(wrapper?.hasAttribute('data-no-portal-layout-styles')).toBe(true)
  })

  it('attaches and detaches scoper with expected app id', () => {
    const { unmount } = render(
      <PrimeReactStyleProvider>
        <span>content</span>
      </PrimeReactStyleProvider>
    )

    expect(scopingModule.attachPrimeReactScoper).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'my-product|my-product',
        productName: 'my-product',
        scopeRootSelector: '[data-style-id="my-product|my-product"]',
        bootstrapExisting: true,
        blockFurtherUpdatesForCapturedIds: false,
      })
    )

    unmount()
    expect(mockDetach).toHaveBeenCalled()
  })
})
