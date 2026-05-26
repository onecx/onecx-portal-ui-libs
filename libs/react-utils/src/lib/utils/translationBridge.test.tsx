import { createElement } from 'react'
import { render } from '@testing-library/react'
import { TranslationBridge } from './translationBridge'

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    i18n: { changeLanguage: jest.fn() },
  })),
}))

jest.mock('@onecx/react-integration-interface', () => ({
  useUserService: jest.fn(() => ({
    lang$: {
      subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
    },
  })),
}))

describe('TranslationBridge', () => {
  it('should render null', () => {
    const { container } = render(createElement(TranslationBridge))
    expect(container.innerHTML).toBe('')
  })

  it('should subscribe to lang$ on mount', () => {
    const { useUserService } = require('@onecx/react-integration-interface')
    const mockSubscribe = jest.fn(() => ({ unsubscribe: jest.fn() }))
    useUserService.mockReturnValue({ lang$: { subscribe: mockSubscribe } })

    render(createElement(TranslationBridge))
    expect(mockSubscribe).toHaveBeenCalled()
  })

  it('should unsubscribe from lang$ on unmount', () => {
    const { useUserService } = require('@onecx/react-integration-interface')
    const mockUnsubscribe = jest.fn()
    useUserService.mockReturnValue({ lang$: { subscribe: jest.fn(() => ({ unsubscribe: mockUnsubscribe })) } })

    const { unmount } = render(createElement(TranslationBridge))
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('should call i18n.changeLanguage when lang emits', () => {
    const { useUserService } = require('@onecx/react-integration-interface')
    const { useTranslation } = require('react-i18next')
    const mockChangeLanguage = jest.fn()
    let capturedCallback: any

    useTranslation.mockReturnValue({ i18n: { changeLanguage: mockChangeLanguage } })
    useUserService.mockReturnValue({
      lang$: {
        subscribe: jest.fn((cb: any) => {
          capturedCallback = cb
          return { unsubscribe: jest.fn() }
        }),
      },
    })

    render(createElement(TranslationBridge))
    capturedCallback('de')
    expect(mockChangeLanguage).toHaveBeenCalledWith('de')
  })
})
