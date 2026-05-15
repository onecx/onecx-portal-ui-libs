import { render, act } from '@testing-library/react'

const mockDetach = jest.fn()
const mockAttach: jest.Mock = jest.fn(() => mockDetach)

jest.mock('../scopingFunctionality', () => ({
  attachPrimeReactScoper: (opts: any) => mockAttach(opts),
}))

jest.mock('../../../utils/withAppGlobals', () => ({
  useAppGlobals: jest.fn(() => ({ PRODUCT_NAME: 'test-product' })),
}))

describe('PrimeReactStyleProvider (app context)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAttach.mockReturnValue(mockDetach)
  })

  it('renders children in a scoped div', () => {
    const { PrimeReactStyleProvider } = require('./app')
    const { getByText } = render(
      <PrimeReactStyleProvider>
        <span>child</span>
      </PrimeReactStyleProvider>
    )
    expect(getByText('child')).toBeDefined()
  })

  it('calls attachPrimeReactScoper with correct id', () => {
    const { PrimeReactStyleProvider } = require('./app')
    render(
      <PrimeReactStyleProvider>
        <span>child</span>
      </PrimeReactStyleProvider>
    )
    expect(mockAttach).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-product|test-product-ui',
        bootstrapExisting: true,
      })
    )
  })

  it('detaches scoper on unmount', () => {
    const { PrimeReactStyleProvider } = require('./app')
    const { unmount } = render(
      <PrimeReactStyleProvider>
        <span>child</span>
      </PrimeReactStyleProvider>
    )
    act(() => {
      unmount()
    })
    expect(mockDetach).toHaveBeenCalled()
  })
})

describe('PrimeReactStyleProvider (remotes context)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAttach.mockReturnValue(mockDetach)
  })

  it('renders children after scoping is set', () => {
    const { PrimeReactStyleProvider } = require('./remotes')
    const { getByText } = render(
      <PrimeReactStyleProvider>
        <span>remote child</span>
      </PrimeReactStyleProvider>
    )
    expect(getByText('remote child')).toBeDefined()
  })

  it('calls attachPrimeReactScoper with blockFurtherUpdatesForCapturedIds: true', () => {
    const { PrimeReactStyleProvider } = require('./remotes')
    render(
      <PrimeReactStyleProvider>
        <span>child</span>
      </PrimeReactStyleProvider>
    )
    expect(mockAttach).toHaveBeenCalledWith(
      expect.objectContaining({
        blockFurtherUpdatesForCapturedIds: true,
        freezeAfterFirstUpdate: true,
      })
    )
  })

  it('detaches scoper on unmount', () => {
    const { PrimeReactStyleProvider } = require('./remotes')
    const { unmount } = render(
      <PrimeReactStyleProvider>
        <span>child</span>
      </PrimeReactStyleProvider>
    )
    act(() => {
      unmount()
    })
    expect(mockDetach).toHaveBeenCalled()
  })
})
