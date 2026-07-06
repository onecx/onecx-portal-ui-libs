import { render } from '@testing-library/react'
import { TranslationBridge, __resetI18nInitialized } from './translationBridge'

const mockChangeLanguage = jest.fn()
const mockInit = jest.fn()

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    i18n: { changeLanguage: mockChangeLanguage, isInitialized: true, init: mockInit },
  })),
}))

jest.mock('i18next', () => ({
  __esModule: true,
  default: {
    isInitialized: true,
    init: mockInit,
  },
}))

jest.mock('@onecx/react-integration-interface', () => ({
  useUserService: jest.fn(() => ({
    lang$: {
      subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
    },
  })),
}))

describe('TranslationBridge', () => {
  const { useTranslation } = require('react-i18next') as { useTranslation: jest.Mock }
  const { useUserService } = require('@onecx/react-integration-interface') as { useUserService: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()
    __resetI18nInitialized()
    useTranslation.mockReturnValue({
      i18n: { changeLanguage: mockChangeLanguage, isInitialized: true, init: mockInit },
    })
    useUserService.mockReturnValue({
      lang$: { subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) },
    })
  })

  it('should render null', () => {
    const { container } = render(<TranslationBridge />)
    expect(container.innerHTML).toBe('')
  })

  it('should subscribe to lang$ on mount', () => {
    const mockSubscribe = jest.fn(() => ({ unsubscribe: jest.fn() }))
    useUserService.mockReturnValue({ lang$: { subscribe: mockSubscribe } })

    render(<TranslationBridge />)
    expect(mockSubscribe).toHaveBeenCalled()
  })

  it('should unsubscribe from lang$ on unmount', () => {
    const mockUnsubscribe = jest.fn()
    useUserService.mockReturnValue({
      lang$: { subscribe: jest.fn(() => ({ unsubscribe: mockUnsubscribe })) },
    })

    const { unmount } = render(<TranslationBridge />)
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('should call i18n.changeLanguage when lang emits', () => {
    let capturedCallback!: (lang: string) => void

    useUserService.mockReturnValue({
      lang$: {
        subscribe: jest.fn((cb: (lang: string) => void) => {
          capturedCallback = cb
          return { unsubscribe: jest.fn() }
        }),
      },
    })

    render(<TranslationBridge />)
    capturedCallback('de')
    expect(mockChangeLanguage).toHaveBeenCalledWith('de')
  })

  it('should initialize i18n when not already initialized', () => {
    useTranslation.mockReturnValue({
      i18n: { changeLanguage: mockChangeLanguage, isInitialized: false, init: mockInit },
    })

    render(<TranslationBridge />)

    expect(mockInit).toHaveBeenCalledWith({
      fallbackLng: 'en',
      resources: {},
      interpolation: { escapeValue: false },
    })
  })

  it('should not initialize i18n when i18n.isInitialized is true', () => {
    useTranslation.mockReturnValue({
      i18n: { changeLanguage: mockChangeLanguage, isInitialized: true, init: mockInit },
    })

    render(<TranslationBridge />)

    expect(mockInit).not.toHaveBeenCalled()
  })

  it('should not initialize i18n when module flag is already set from prior render', () => {
    useTranslation.mockReturnValue({
      i18n: { changeLanguage: mockChangeLanguage, isInitialized: false, init: mockInit },
    })

    render(<TranslationBridge />)
    expect(mockInit).toHaveBeenCalledTimes(1)

    render(<TranslationBridge />)
    expect(mockInit).toHaveBeenCalledTimes(1)
  })

  it('should re-subscribe when lang$ reference changes', () => {
    const mockSubscribe1 = jest.fn(() => ({ unsubscribe: jest.fn() }))
    const mockSubscribe2 = jest.fn(() => ({ unsubscribe: jest.fn() }))

    useUserService.mockReturnValue({ lang$: { subscribe: mockSubscribe1 } })

    const { rerender } = render(<TranslationBridge />)
    expect(mockSubscribe1).toHaveBeenCalledTimes(1)

    useUserService.mockReturnValue({ lang$: { subscribe: mockSubscribe2 } })
    rerender(<TranslationBridge />)

    expect(mockSubscribe2).toHaveBeenCalledTimes(1)
  })
})
