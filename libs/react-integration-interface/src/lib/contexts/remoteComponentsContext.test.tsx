/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { RemoteComponentsProvider, useRemoteComponents } from './remoteComponentsContext'
import { FakeTopic } from '@onecx/accelerator'
import type { RemoteComponentsTopic } from '@onecx/integration-interface'
import type { ReactNode } from 'react'

describe('RemoteComponentsProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <RemoteComponentsProvider>{children}</RemoteComponentsProvider>
  )

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
})
