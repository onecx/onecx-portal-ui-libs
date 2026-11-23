/**
 * @jest-environment jsdom
 */

import { StrictMode } from 'react'
import type { ReactNode } from 'react'
import { render, renderHook } from '@testing-library/react'
import { PortalMessageProvider, usePortalMessage } from './portalMessageContext'
import { FakeTopic } from '@onecx/accelerator'
import { MessageTopic } from '@onecx/integration-interface'

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const Consumer = () => {
  usePortalMessage()
  return null
}

describe('PortalMessageProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => <PortalMessageProvider>{children}</PortalMessageProvider>

  afterEach(async () => {
    await wait()
    jest.restoreAllMocks()
  })

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

  it('does not destroy the internal message$ under a StrictMode mount', async () => {
    const destroySpy = jest.spyOn(MessageTopic.prototype, 'destroy')

    const { unmount } = render(
      <StrictMode>
        <PortalMessageProvider>
          <Consumer />
        </PortalMessageProvider>
      </StrictMode>
    )
    await wait()

    expect(destroySpy).not.toHaveBeenCalled()
    unmount()
    await wait()
  })

  it('destroys the internal message$ on a real unmount', async () => {
    const destroySpy = jest.spyOn(MessageTopic.prototype, 'destroy')

    const { unmount } = render(
      <PortalMessageProvider>
        <Consumer />
      </PortalMessageProvider>
    )
    await wait()
    expect(destroySpy).not.toHaveBeenCalled()

    unmount()
    await wait()

    expect(destroySpy).toHaveBeenCalledTimes(1)
  })

  it('never destroys a supplied message$', async () => {
    const supplied = new MessageTopic()
    const suppliedDestroy = jest.spyOn(supplied, 'destroy')

    const { unmount } = render(
      <PortalMessageProvider value={{ message$: supplied }}>
        <Consumer />
      </PortalMessageProvider>
    )
    unmount()
    await wait()

    expect(suppliedDestroy).not.toHaveBeenCalled()
  })
})
