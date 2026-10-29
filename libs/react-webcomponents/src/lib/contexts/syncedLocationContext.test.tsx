import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TextDecoder, TextEncoder } from 'node:util'
import { CurrentLocationTopic, type CurrentLocationTopicPayload } from '@onecx/integration-interface'

const loggerError = jest.fn()

Object.assign(globalThis, { TextDecoder, TextEncoder })

const { Route, Routes, useLocation, useNavigate } = require('react-router') as typeof import('react-router')
const { SyncedRouterProvider } = require('./syncedLocationContext') as {
  SyncedRouterProvider: typeof import('./syncedLocationContext').SyncedRouterProvider
}

const appBase = '/app/sample-app'
const mockLocationListeners: ((location: CurrentLocationTopicPayload) => void)[] = []
const mockPublishedLocations: CurrentLocationTopicPayload[] = []
let shouldPublishReject = false

jest.mock('@onecx/integration-interface', () => ({
  CurrentLocationTopic: class {
    subscribe(callback: (location: CurrentLocationTopicPayload) => void) {
      mockLocationListeners.push(callback)
      return { unsubscribe: jest.fn() }
    }

    publish(location: CurrentLocationTopicPayload) {
      mockPublishedLocations.push(location)
      return shouldPublishReject ? Promise.reject(new Error('publish failed')) : Promise.resolve()
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
}))

jest.mock('../utils/logger.utils', () => ({
  createLogger: () => ({ error: loggerError }),
}))

Object.assign(globalThis, { TextDecoder, TextEncoder })

const RouterContent = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <output data-testid="location">
        {location.pathname}
        {location.search}
        {location.hash}
      </output>
      <button onClick={() => navigate(`${appBase}/subpage/record-1?tab=details#summary`)}>Navigate in React</button>
      <Routes>
        <Route path={appBase} element={<div>Root page</div>} />
        <Route path={`${appBase}/subpage/:id`} element={<div>Subpage</div>} />
      </Routes>
    </>
  )
}

const renderRouter = () =>
  render(
    <SyncedRouterProvider>
      <RouterContent />
    </SyncedRouterProvider>
  )

const publishLocation = (payload: CurrentLocationTopicPayload) => {
  act(() => {
    if (payload.url) window.history.pushState({}, '', payload.url)
    mockLocationListeners[0](payload)
  })
}

describe('SyncedRouterProvider', () => {
  beforeEach(() => {
    mockLocationListeners.length = 0
    mockPublishedLocations.length = 0
    shouldPublishReject = false
    loggerError.mockClear()
    document.querySelector('base')?.remove()
    const base = document.createElement('base')
    base.setAttribute('href', '/app/')
    document.head.append(base)
    window.history.replaceState({}, '', appBase)
  })

  it('updates the React route when the shell navigates to a subpage', async () => {
    renderRouter()

    await waitFor(() => expect(mockLocationListeners).toHaveLength(1))
    publishLocation({ url: `${appBase}/subpage/record-1?tab=details#summary`, isFirst: false })

    expect(await screen.findByText('Subpage')).toBeTruthy()
    expect(screen.getByTestId('location').textContent).toBe(`${appBase}/subpage/record-1?tab=details#summary`)
    expect(mockPublishedLocations).toEqual([])
  })

  it('handles consecutive shell navigations between subpages and back to the root', async () => {
    renderRouter()

    await waitFor(() => expect(mockLocationListeners).toHaveLength(1))
    publishLocation({ url: `${appBase}/subpage/record-1`, isFirst: false })
    expect(await screen.findByText('Subpage')).toBeTruthy()

    publishLocation({ url: `${appBase}/subpage/record-2`, isFirst: false })
    expect(screen.getByTestId('location').textContent).toBe(`${appBase}/subpage/record-2`)

    publishLocation({ url: appBase, isFirst: false })
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
    publishLocation({ url: '/elsewhere/page', isFirst: false })

    expect(screen.getByTestId('location').textContent).toBe(appBase)
    expect(screen.getByText('Root page')).toBeTruthy()
  })

  it('ignores topic events with an undefined URL', async () => {
    renderRouter()

    await waitFor(() => expect(mockLocationListeners).toHaveLength(1))
    publishLocation({ url: undefined, isFirst: false })

    expect(screen.getByTestId('location').textContent).toBe(appBase)
    expect(screen.getByText('Root page')).toBeTruthy()
  })

  it('ignores topic events that match the current React Router location', async () => {
    renderRouter()

    await waitFor(() => expect(mockLocationListeners).toHaveLength(1))
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState')
    publishLocation({ url: appBase, isFirst: false })

    expect(screen.getByTestId('location').textContent).toBe(appBase)
    expect(replaceStateSpy).not.toHaveBeenCalled()
    replaceStateSpy.mockRestore()
  })

  it('marks topic-driven navigation as isRouterSync to suppress shell echo', async () => {
    renderRouter()

    await waitFor(() => expect(mockLocationListeners).toHaveLength(1))
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState')
    publishLocation({ url: `${appBase}/subpage/record-1`, isFirst: false })

    expect(await screen.findByText('Subpage')).toBeTruthy()
    const calls = replaceStateSpy.mock.calls
    const lastCall = calls[calls.length - 1]
    expect(lastCall[0]).toMatchObject({ isRouterSync: true })
    replaceStateSpy.mockRestore()
  })

  it('publishes React navigation with the pathname, query, and hash', async () => {
    renderRouter()

    fireEvent.click(screen.getByText('Navigate in React'))

    await waitFor(() => {
      expect(mockPublishedLocations).toContainEqual({
        url: `${appBase}/subpage/record-1?tab=details#summary`,
        isFirst: false,
      })
    })

    expect(screen.getByTestId('location').textContent).toBe(`${appBase}/subpage/record-1?tab=details#summary`)
  })

  it('logs an error when publishing an internal navigation fails', async () => {
    renderRouter()
    shouldPublishReject = true

    fireEvent.click(screen.getByText('Navigate in React'))

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toBe(`${appBase}/subpage/record-1?tab=details#summary`)
    )
    await waitFor(() => expect(loggerError).toHaveBeenCalled())
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
