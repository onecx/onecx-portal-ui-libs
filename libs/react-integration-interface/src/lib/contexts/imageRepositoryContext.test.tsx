/**
 * @jest-environment jsdom
 */

import { StrictMode } from 'react'
import type { ReactNode } from 'react'
import { render, renderHook } from '@testing-library/react'
import { ImageRepositoryProvider, useImageRepositoryService } from './imageRepositoryContext'
import { ImageRepositoryService } from '@onecx/integration-interface'

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const Consumer = () => {
  useImageRepositoryService()
  return null
}

describe('ImageRepositoryProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ImageRepositoryProvider>{children}</ImageRepositoryProvider>
  )

  afterEach(async () => {
    await wait()
    jest.restoreAllMocks()
  })

  it('provides image repository service', () => {
    const { result } = renderHook(() => useImageRepositoryService(), { wrapper })

    expect(result.current.imageRepositoryService).toBeTruthy()
  })

  it('allows overriding imageRepositoryService via value prop', () => {
    const customService = new ImageRepositoryService()

    const { result } = renderHook(() => useImageRepositoryService(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <ImageRepositoryProvider value={{ imageRepositoryService: customService }}>{children}</ImageRepositoryProvider>
      ),
    })

    expect(result.current.imageRepositoryService).toBe(customService)
  })

  it('does not destroy the internal imageRepositoryService under a StrictMode mount', async () => {
    const destroySpy = jest.spyOn(ImageRepositoryService.prototype, 'destroy')

    const { unmount } = render(
      <StrictMode>
        <ImageRepositoryProvider>
          <Consumer />
        </ImageRepositoryProvider>
      </StrictMode>
    )
    await wait()

    expect(destroySpy).not.toHaveBeenCalled()
    unmount()
    await wait()
  })

  it('destroys the internal imageRepositoryService on a real unmount', async () => {
    const destroySpy = jest.spyOn(ImageRepositoryService.prototype, 'destroy')

    const { unmount } = render(
      <ImageRepositoryProvider>
        <Consumer />
      </ImageRepositoryProvider>
    )
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
      <ImageRepositoryProvider value={{ imageRepositoryService: supplied }}>
        <Consumer />
      </ImageRepositoryProvider>
    )
    unmount()
    await wait()

    expect(suppliedDestroy).not.toHaveBeenCalled()
  })
})
