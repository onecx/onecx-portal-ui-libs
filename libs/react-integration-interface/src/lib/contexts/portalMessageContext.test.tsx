/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { PortalMessageProvider, usePortalMessage } from './portalMessageContext'
import { FakeTopic } from '@onecx/accelerator'
import type { MessageTopic } from '@onecx/integration-interface'
import type { ReactNode } from 'react'

describe('PortalMessageProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => <PortalMessageProvider>{children}</PortalMessageProvider>

  it('provides portal message context', () => {
    const { result } = renderHook(() => usePortalMessage(), { wrapper })

    expect(result.current.message$).toBeTruthy()
    expect(result.current.success).toBeInstanceOf(Function)
    expect(result.current.info).toBeInstanceOf(Function)
    expect(result.current.error).toBeInstanceOf(Function)
    expect(result.current.warning).toBeInstanceOf(Function)
  })

  it('allows overriding message$ via value prop', () => {
    const customMessage$ = FakeTopic.create() as unknown as MessageTopic

    const { result } = renderHook(() => usePortalMessage(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <PortalMessageProvider value={{ message$: customMessage$ }}>{children}</PortalMessageProvider>
      ),
    })

    expect(result.current.message$).toBe(customMessage$)
  })
})
