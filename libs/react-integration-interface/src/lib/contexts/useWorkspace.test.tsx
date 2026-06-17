/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useWorkspace } from './useWorkspace'
import { AppStateProvider } from './appStateContext'
import { FakeTopic } from '@onecx/accelerator'
import type { CurrentWorkspaceTopic, Workspace } from '@onecx/integration-interface'
import { firstValueFrom } from 'rxjs'
import type { ReactNode } from 'react'

describe('useWorkspace', () => {
  const mockWorkspace: Workspace = {
    baseUrl: '/',
    workspaceName: 'test-workspace',
    portalName: 'test-portal',
    microfrontendRegistrations: [
      {
        mfeId: 'testMfe',
        baseUrl: '/test',
        appId: 'testApp',
      },
    ],
  }

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AppStateProvider
      value={{
        currentWorkspace$: FakeTopic.create(mockWorkspace) as unknown as CurrentWorkspaceTopic,
      }}
    >
      {children}
    </AppStateProvider>
  )

  it('returns getUrl and doesUrlExistFor functions', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper })

    expect(result.current.getUrl).toBeInstanceOf(Function)
    expect(result.current.doesUrlExistFor).toBeInstanceOf(Function)
  })

  it('getUrl resolves to an observable', async () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper })

    const url$ = result.current.getUrl('testProduct', 'testApp')
    expect(url$).toBeDefined()

    const url = await firstValueFrom(url$)
    expect(typeof url).toBe('string')
  })

  it('doesUrlExistFor resolves to an observable', async () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper })

    const exists$ = result.current.doesUrlExistFor('testProduct', 'testApp')
    expect(exists$).toBeDefined()

    const exists = await firstValueFrom(exists$)
    expect(typeof exists).toBe('boolean')
  })
})
