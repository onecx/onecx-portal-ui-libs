/**
 * @jest-environment jsdom
 */

import { createElement, StrictMode } from 'react'
import { render } from '@testing-library/react'
import { ImageRepositoryProvider, useImageRepositoryService } from './imageRepositoryContext'
import { ImageRepositoryService } from '@onecx/integration-interface'

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const Consumer = () => {
  useImageRepositoryService()
  return null
}

describe('ImageRepositoryProvider lifecycle', () => {
  afterEach(async () => {
    await wait()
    jest.restoreAllMocks()
  })

  it('does not destroy the internal imageRepositoryService under a StrictMode mount', async () => {
    const destroySpy = jest.spyOn(ImageRepositoryService.prototype, 'destroy')

    const { unmount } = render(
      createElement(StrictMode, null, createElement(ImageRepositoryProvider, null, createElement(Consumer)))
    )
    await wait()

    expect(destroySpy).not.toHaveBeenCalled()
    unmount()
    await wait()
  })

  it('destroys the internal imageRepositoryService on a real unmount', async () => {
    const destroySpy = jest.spyOn(ImageRepositoryService.prototype, 'destroy')

    const { unmount } = render(createElement(ImageRepositoryProvider, null, createElement(Consumer)))
    await wait()
    expect(destroySpy).not.toHaveBeenCalled()

    unmount()
    await wait()

    expect(destroySpy).toHaveBeenCalledTimes(1)
  })

  it('never destroys a supplied imageRepositoryService', async () => {
    const supplied = new ImageRepositoryService()
    const suppliedDestroy = jest.spyOn(supplied, 'destroy')

    const { unmount } = render(
      createElement(ImageRepositoryProvider, {
        value: { imageRepositoryService: supplied },
        children: createElement(Consumer),
      })
    )
    unmount()
    await wait()

    expect(suppliedDestroy).not.toHaveBeenCalled()
  })
})
