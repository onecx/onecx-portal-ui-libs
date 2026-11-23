/**
 * @jest-environment jsdom
 */

import { StrictMode } from 'react'
import type { ReactNode } from 'react'
import { render, renderHook } from '@testing-library/react'
import { RemoteComponentsProvider, useRemoteComponents } from './remoteComponentsContext'
import { FakeTopic } from '@onecx/accelerator'
import { RemoteComponentsTopic } from '@onecx/integration-interface'

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const Consumer = () => {
  useRemoteComponents()
  return null
}

describe('RemoteComponentsProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <RemoteComponentsProvider>{children}</RemoteComponentsProvider>
  )

  afterEach(async () => {
    await wait()
    jest.restoreAllMocks()
  })

  it('provides remote components context', () => {
    const { result } = renderHook(() => useRemoteComponents(), { wrapper })

    expect(result.current.remoteComponents$).toBeTruthy()
  })

  it('allows overriding remoteComponents$ via value prop', () => {
    const customRemoteComponents$ = FakeTopic.create() as unknown as RemoteComponentsTopic

    const { result } = renderHook(() => useRemoteComponents(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <RemoteComponentsProvider value={{ remoteComponents$: customRemoteComponents$ }}>
          {children}
        </RemoteComponentsProvider>
      ),
    })

    expect(result.current.remoteComponents$).toBe(customRemoteComponents$)
  })

  it('does not destroy the internal remoteComponents$ under a StrictMode mount', async () => {
    const destroySpy = jest.spyOn(RemoteComponentsTopic.prototype, 'destroy')

    const { unmount } = render(
      <StrictMode>
        <RemoteComponentsProvider>
          <Consumer />
        </RemoteComponentsProvider>
      </StrictMode>
    )
    await wait()

    expect(destroySpy).not.toHaveBeenCalled()
    unmount()
    await wait()
  })

  it('destroys the internal remoteComponents$ on a real unmount', async () => {
    const destroySpy = jest.spyOn(RemoteComponentsTopic.prototype, 'destroy')

    const { unmount } = render(
      <RemoteComponentsProvider>
        <Consumer />
      </RemoteComponentsProvider>
    )
    await wait()
    expect(destroySpy).not.toHaveBeenCalled()

    unmount()
    await wait()

    expect(destroySpy).toHaveBeenCalledTimes(1)
  })

  it('never destroys a supplied remoteComponents$', async () => {
    const supplied = new RemoteComponentsTopic()
    const suppliedDestroy = jest.spyOn(supplied, 'destroy')

    const { unmount } = render(
      <RemoteComponentsProvider value={{ remoteComponents$: supplied }}>
        <Consumer />
      </RemoteComponentsProvider>
    )
    unmount()
    await wait()

    expect(suppliedDestroy).not.toHaveBeenCalled()
  })
})
