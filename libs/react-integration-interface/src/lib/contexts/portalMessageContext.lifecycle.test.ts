/**
 * @jest-environment jsdom
 */

import { createElement, StrictMode } from 'react'
import { render } from '@testing-library/react'
import { PortalMessageProvider, usePortalMessage } from './portalMessageContext'
import { MessageTopic } from '@onecx/integration-interface'

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const Consumer = () => {
  usePortalMessage()
  return null
}

describe('PortalMessageProvider lifecycle', () => {
  afterEach(async () => {
    await wait()
    jest.restoreAllMocks()
  })

  it('does not destroy the internal message$ under a StrictMode mount', async () => {
    const destroySpy = jest.spyOn(MessageTopic.prototype, 'destroy')

    const { unmount } = render(
      createElement(StrictMode, null, createElement(PortalMessageProvider, null, createElement(Consumer)))
    )
    await wait()

    expect(destroySpy).not.toHaveBeenCalled()
    unmount()
    await wait()
  })

  it('destroys the internal message$ on a real unmount', async () => {
    const destroySpy = jest.spyOn(MessageTopic.prototype, 'destroy')

    const { unmount } = render(createElement(PortalMessageProvider, null, createElement(Consumer)))
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
      createElement(PortalMessageProvider, { value: { message$: supplied }, children: createElement(Consumer) })
    )
    unmount()
    await wait()

    expect(suppliedDestroy).not.toHaveBeenCalled()
  })
})
