import { render, waitFor } from '@testing-library/react'
import { PrimeReactStyleProvider } from './index'

const mockDetach = jest.fn()

jest.mock('../../scopingFunctionality', () => ({
  attachPrimeReactScoper: jest.fn(),
}))

jest.mock('../../../../utils/withAppGlobals', () => ({
  useAppGlobals: jest.fn(() => ({ PRODUCT_NAME: 'my-product' })),
}))

describe('PrimeReactStyleProvider (remotes)', () => {
  const scopingModule = jest.requireMock('../../scopingFunctionality')

  beforeEach(() => {
    jest.clearAllMocks()
    scopingModule.attachPrimeReactScoper.mockReturnValue(mockDetach)
  })

  it('renders children after scoper attach', async () => {
    const { getByText } = render(
      <PrimeReactStyleProvider>
        <span>remote-content</span>
      </PrimeReactStyleProvider>
    )

    await waitFor(() => {
      expect(getByText('remote-content')).toBeDefined()
    })

    expect(scopingModule.attachPrimeReactScoper).toHaveBeenCalledTimes(1)
  })

  it('attaches and detaches scoper with expected remote id', async () => {
    const { unmount, getByText } = render(
      <PrimeReactStyleProvider>
        <span>remote-content</span>
      </PrimeReactStyleProvider>
    )

    await waitFor(() => {
      expect(getByText('remote-content')).toBeDefined()
    })

    expect(scopingModule.attachPrimeReactScoper).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'my-product|my-product',
        scopeRootSelector: '[data-style-id="my-product|my-product"]',
        bootstrapExisting: true,
        blockFurtherUpdatesForCapturedIds: true,
        dataPrimereactStyleName: 'remote',
        freezeAfterFirstUpdate: true,
        productName: 'my-product',
      })
    )

    unmount()
    expect(mockDetach).toHaveBeenCalled()
  })
})
