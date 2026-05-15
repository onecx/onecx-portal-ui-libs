import { createElement } from 'react'
import { render } from '@testing-library/react'
import { PortalPage } from './portalPage'

jest.mock('@onecx/react-integration-interface', () => ({
  useAppState: jest.fn(() => ({
    currentPage$: { publish: jest.fn() },
  })),
  useUserService: jest.fn(() => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
  })),
}))

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: jest.fn((key: string) => key),
  })),
}))

describe('PortalPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children when no permission is required', () => {
    const { container } = render(createElement(PortalPage, null, 'Page Content'))
    expect(container.textContent).toContain('Page Content')
  })

  it('should render unauthorized message when permission is denied', async () => {
    const { useUserService } = require('@onecx/react-integration-interface')
    useUserService.mockReturnValue({ hasPermission: jest.fn(() => Promise.resolve(false)) })

    const { container, findByText } = render(
      createElement(PortalPage, { permission: 'admin' }, 'Secret Content')
    )
    const unauthorized = await findByText('OCX_PORTAL_PAGE.UNAUTHORIZED_TITLE')
    expect(unauthorized).toBeDefined()
    expect(container.textContent).not.toContain('Secret Content')
  })

  it('should deny access when permission check throws', async () => {
    const { useUserService } = require('@onecx/react-integration-interface')
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    useUserService.mockReturnValue({ hasPermission: jest.fn(() => Promise.reject(new Error('fail'))) })

    const { findByText } = render(
      createElement(PortalPage, { permission: 'admin' }, 'Secret Content')
    )
    const unauthorized = await findByText('OCX_PORTAL_PAGE.UNAUTHORIZED_TITLE')
    expect(unauthorized).toBeDefined()
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should publish current page info', () => {
    const { useAppState } = require('@onecx/react-integration-interface')
    const mockPublish = jest.fn()
    useAppState.mockReturnValue({ currentPage$: { publish: mockPublish } })

    render(
      createElement(
        PortalPage,
        { helpArticleId: 'help-123', pageName: 'Test Page', applicationId: 'app-1', permission: 'read' },
        'Content'
      )
    )

    expect(mockPublish).toHaveBeenCalledWith(
      expect.objectContaining({
        helpArticleId: 'help-123',
        pageName: 'Test Page',
        applicationId: 'app-1',
        permission: 'read',
      })
    )
  })

  it('should join permission array with comma', () => {
    const { useAppState } = require('@onecx/react-integration-interface')
    const mockPublish = jest.fn()
    useAppState.mockReturnValue({ currentPage$: { publish: mockPublish } })

    render(
      createElement(PortalPage, { permission: ['read', 'write'] }, 'Content')
    )

    expect(mockPublish).toHaveBeenCalledWith(
      expect.objectContaining({ permission: 'read,write' })
    )
  })

  it('should apply custom className and style', () => {
    const { container } = render(
      createElement(PortalPage, { className: 'custom-class', style: { color: 'red' } }, 'Content')
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('custom-class')
    expect(wrapper.style.color).toBe('red')
  })

  it('should warn when helpArticleId is not set', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    render(createElement(PortalPage, null, 'Content'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('helpArticleId'))
    consoleSpy.mockRestore()
  })
})
