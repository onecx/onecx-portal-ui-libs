/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { ConfigurationProvider, useConfiguration } from './configurationContext'
import type { ReactNode } from 'react'

jest.mock('ts-semaphore', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    use: jest.fn((fn) => fn()),
  })),
}))

describe('ConfigurationProvider', () => {
  const createWrapper = (defaultConfig?: Parameters<typeof ConfigurationProvider>[0]['defaultConfig']) => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return <ConfigurationProvider defaultConfig={defaultConfig}>{children}</ConfigurationProvider>
    }
  }

  it('provides configuration context with default values', async () => {
    const { result } = renderHook(() => useConfiguration(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.config).toBeNull()
      expect(result.current.config$).toBeTruthy()
      expect(result.current.init).toBeInstanceOf(Function)
      expect(result.current.getConfig).toBeInstanceOf(Function)
      expect(result.current.getProperty).toBeInstanceOf(Function)
      expect(result.current.setProperty).toBeInstanceOf(Function)
    })
  })

  it('accepts custom defaultConfig', async () => {
    const customConfig = {
      appId: 'test-app',
      portalId: 'test-portal',
      skipRemoteConfigLoad: true,
      remoteConfigURL: 'custom/env.json',
    }

    const { result } = renderHook(() => useConfiguration(), {
      wrapper: createWrapper(customConfig),
    })

    await waitFor(() => {
      expect(result.current.config$).toBeTruthy()
    })
  })

  it('init resolves configuration and publishes it', async () => {
    const { result } = renderHook(() => useConfiguration(), {
      wrapper: createWrapper({
        appId: 'test',
        portalId: 'portal',
        skipRemoteConfigLoad: true,
        remoteConfigURL: '',
      }),
    })

    let initResult: boolean | undefined
    await act(async () => {
      initResult = await result.current.init()
    })

    expect(initResult).toBe(true)
    await waitFor(() => {
      expect(result.current.config).not.toBeNull()
    })
  })

  it('getConfig returns current config after init', async () => {
    const { result } = renderHook(() => useConfiguration(), {
      wrapper: createWrapper({
        appId: 'test',
        portalId: 'portal',
        skipRemoteConfigLoad: true,
        remoteConfigURL: '',
      }),
    })

    await act(async () => {
      await result.current.init()
    })

    const config = await act(() => result.current.getConfig())
    expect(config).toBeDefined()
    expect(config?.appId).toBe('test')
    expect(config?.portalId).toBe('portal')
  })

  it('setProperty updates config value', async () => {
    const { result } = renderHook(() => useConfiguration(), {
      wrapper: createWrapper({
        appId: 'test',
        portalId: 'portal',
        skipRemoteConfigLoad: true,
        remoteConfigURL: '',
      }),
    })

    await act(async () => {
      await result.current.init()
    })

    await act(async () => {
      await result.current.setProperty('APP_BASE_HREF', '/new-base')
    })

    const config = await act(() => result.current.getConfig())
    expect(config?.APP_BASE_HREF).toBe('/new-base')
  })

  it('getProperty returns value for valid key', async () => {
    const { result } = renderHook(() => useConfiguration(), {
      wrapper: createWrapper({
        appId: 'test',
        portalId: 'portal',
        skipRemoteConfigLoad: true,
        remoteConfigURL: '',
      }),
    })

    await act(async () => {
      await result.current.init()
    })

    await act(async () => {
      await result.current.setProperty('TKIT_PORTAL_ID', 'portal123')
    })

    const appId = await act(() => result.current.getProperty('TKIT_PORTAL_ID' as any))
    expect(appId).toBe('portal123')
  })

  it('exposes isInitialized promise', async () => {
    const { result } = renderHook(() => useConfiguration(), {
      wrapper: createWrapper({
        appId: 'test',
        portalId: 'portal',
        skipRemoteConfigLoad: true,
        remoteConfigURL: '',
      }),
    })

    expect(result.current.isInitialized).toBeInstanceOf(Promise)
    await expect(result.current.isInitialized).resolves.toBeUndefined()
  })
})
