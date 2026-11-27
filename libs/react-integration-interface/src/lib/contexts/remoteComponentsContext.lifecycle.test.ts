/**
 * @jest-environment jsdom
 */

import { createElement, StrictMode } from 'react'
import { render } from '@testing-library/react'
import { RemoteComponentsProvider, useRemoteComponents } from './remoteComponentsContext'
import { RemoteComponentsTopic } from '@onecx/integration-interface'

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const Consumer = () => {
  useRemoteComponents()
  return null
}

describe('RemoteComponentsProvider lifecycle', () => {
  afterEach(async () => {
    await wait()
    jest.restoreAllMocks()
  })

  it('does not destroy the internal remoteComponents$ under a StrictMode mount', async () => {
    const destroySpy = jest.spyOn(RemoteComponentsTopic.prototype, 'destroy')

    const { unmount } = render(
      createElement(StrictMode, null, createElement(RemoteComponentsProvider, null, createElement(Consumer)))
    )
    await wait()

    expect(destroySpy).not.toHaveBeenCalled()
    unmount()
    await wait()
  })

  it('destroys the internal remoteComponents$ on a real unmount', async () => {
    const destroySpy = jest.spyOn(RemoteComponentsTopic.prototype, 'destroy')

    const { unmount } = render(createElement(RemoteComponentsProvider, null, createElement(Consumer)))
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
      createElement(RemoteComponentsProvider, {
        value: { remoteComponents$: supplied },
        children: createElement(Consumer),
      })
    )
    unmount()
    await wait()

    expect(suppliedDestroy).not.toHaveBeenCalled()
  })
})
