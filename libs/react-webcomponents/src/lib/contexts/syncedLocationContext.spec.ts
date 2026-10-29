import { createElement, Fragment } from 'react'
import { TextDecoder, TextEncoder } from 'node:util'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

const appBase = '/app/sample-app'
const mockLocationListeners: ((location: { url?: string; isFirst: boolean }) => void)[] = []
const mockPublishedLocations: { url?: string; isFirst: boolean }[] = []

jest.mock('@onecx/integration-interface', () => ({
  CurrentLocationTopic: class {
    subscribe(callback: (location: { url?: string; isFirst: boolean }) => void) {
      mockLocationListeners.push(callback)
      return { unsubscribe: jest.fn() }
    }

    publish(location: { url?: string; isFirst: boolean }) {
      mockPublishedLocations.push(location)
      return Promise.resolve()
    }

    destroy = jest.fn()
  },
}))

jest.mock('@onecx/react-integration-interface', () => ({
  useTopic: (_valueTopic: unknown, TopicClass: new () => unknown) => {
    const React = require('react')
    const [topic] = React.useState(() => new TopicClass())
    return topic
  },
  createLogger: () => ({ error: jest.fn() }),
}))

Object.assign(globalThis, { TextDecoder, TextEncoder })

const { Route, Routes, useLocation, useNavigate } = require('react-router')
const { SyncedRouterProvider } = require('./syncedLocationContext')

const RouterContent = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return createElement(
    Fragment,
    null,
    createElement('output', { 'data-testid': 'location' }, location.pathname, location.search, location.hash),
    createElement(
      'button',
      { onClick: () => navigate(`${appBase}/subpage/record-1?tab=details#summary`) },
      'Navigate in React'
    ),
    createElement(
      Routes,
      null,
      createElement(Route, { path: appBase, element: createElement('div', null, 'Root page') }),
      createElement(Route, { path: `${appBase}/subpage/:id`, element: createElement('div', null, 'Subpage') })
    )
  )
}

const renderRouter = () => render(createElement(SyncedRouterProvider, null, createElement(RouterContent)))

const publishLocation = (url: string) => {
  act(() => {
    window.history.pushState({}, '', url)
    mockLocationListeners[0]({ url, isFirst: false })
  })
}

describe('SyncedRouterProvider', () => {
  beforeEach(() => {
    mockLocationListeners.length = 0
    mockPublishedLocations.length = 0
    document.querySelector('base')?.remove()
    const base = document.createElement('base')
    base.setAttribute('href', '/app/')
    document.head.append(base)
    window.history.replaceState({}, '', appBase)
  })

  it('updates the React route when the shell navigates to a subpage', async () => {
    renderRouter()

    await waitFor(() => expect(mockLocationListeners).toHaveLength(1))
    publishLocation(`${appBase}/subpage/record-1?tab=details#summary`)

    expect(await screen.findByText('Subpage')).toBeTruthy()
    expect(screen.getByTestId('location').textContent).toBe(`${appBase}/subpage/record-1?tab=details#summary`)
    expect(mockPublishedLocations).toEqual([])
  })

  it('handles consecutive shell navigations between subpages and back to the root', async () => {
    renderRouter()

    await waitFor(() => expect(mockLocationListeners).toHaveLength(1))
    publishLocation(`${appBase}/subpage/record-1`)
    expect(await screen.findByText('Subpage')).toBeTruthy()

    publishLocation(`${appBase}/subpage/record-2`)
    expect(screen.getByTestId('location').textContent).toBe(`${appBase}/subpage/record-2`)

    publishLocation(appBase)
    expect(await screen.findByText('Root page')).toBeTruthy()
    expect(screen.getByTestId('location').textContent).toBe(appBase)
  })

  it('does not navigate twice for duplicate shell events while a route is pending', async () => {
    renderRouter()

    await waitFor(() => expect(mockLocationListeners).toHaveLength(1))
    const targetUrl = `${appBase}/subpage/record-1`
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState')

    act(() => {
      window.history.pushState({}, '', targetUrl)
      mockLocationListeners[0]({ url: targetUrl, isFirst: false })
      mockLocationListeners[0]({ url: targetUrl, isFirst: false })
    })

    expect(await screen.findByText('Subpage')).toBeTruthy()
    expect(replaceStateSpy).toHaveBeenCalledTimes(1)
    replaceStateSpy.mockRestore()
  })

  it('ignores shell locations outside the deployment base path', async () => {
    renderRouter()

    await waitFor(() => expect(mockLocationListeners).toHaveLength(1))
    publishLocation('/elsewhere/page')

    expect(screen.getByTestId('location').textContent).toBe(appBase)
    expect(screen.getByText('Root page')).toBeTruthy()
  })

  it('does not publish internal React navigation', async () => {
    renderRouter()

    fireEvent.click(screen.getByText('Navigate in React'))

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toBe(`${appBase}/subpage/record-1?tab=details#summary`)
    )

    expect(mockPublishedLocations).toEqual([])
  })

  it('updates the React route on browser back and forward events', async () => {
    renderRouter()

    fireEvent.click(screen.getByText('Navigate in React'))

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toBe(`${appBase}/subpage/record-1?tab=details#summary`)
    )

    act(() => window.history.back())
    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe(appBase))
    expect(await screen.findByText('Root page')).toBeTruthy()

    act(() => window.history.forward())
    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toBe(`${appBase}/subpage/record-1?tab=details#summary`)
    )
    expect(await screen.findByText('Subpage')).toBeTruthy()
  })
})
