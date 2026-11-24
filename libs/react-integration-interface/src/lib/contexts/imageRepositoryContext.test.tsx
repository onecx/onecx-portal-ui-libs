/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { ImageRepositoryProvider, useImageRepositoryService } from './imageRepositoryContext'
import type { ReactNode } from 'react'

describe('ImageRepositoryProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => <ImageRepositoryProvider>{children}</ImageRepositoryProvider>

  it('provides image repository service', () => {
    const { result } = renderHook(() => useImageRepositoryService(), { wrapper })

    expect(result.current.imageRepositoryService).toBeTruthy()
  })

  it('allows overriding imageRepositoryService via value prop', () => {
    const customService = { destroy: jest.fn() } as any

    const { result } = renderHook(() => useImageRepositoryService(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <ImageRepositoryProvider value={{ imageRepositoryService: customService }}>{children}</ImageRepositoryProvider>
      ),
    })

    expect(result.current.imageRepositoryService).toBe(customService)
  })
})
