/**
 * @jest-environment jsdom
 */

import { render, renderHook } from '@testing-library/react'
import { AppStateProvider, useAppState } from './appStateContext'
import { FakeTopic } from '@onecx/accelerator'
import type {
  GlobalErrorTopic,
  GlobalLoadingTopic,
  CurrentMfeTopic,
  CurrentLocationTopic,
  CurrentPageTopic,
  CurrentWorkspaceTopic,
  IsAuthenticatedTopic,
} from '@onecx/integration-interface'
import type { ReactNode } from 'react'

describe('AppStateProvider', () => {
  it('provides all default app state topics', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: ({ children }: { children: ReactNode }) => <AppStateProvider>{children}</AppStateProvider>,
    })

    expect(result.current.globalError$).toBeTruthy()
    expect(result.current.globalLoading$).toBeTruthy()
    expect(result.current.currentMfe$).toBeTruthy()
    expect(result.current.currentLocation$).toBeTruthy()
    expect(result.current.currentPage$).toBeTruthy()
    expect(result.current.currentWorkspace$).toBeTruthy()
    expect(result.current.isAuthenticated$).toBeTruthy()
  })

  it('allows overriding topics via value prop', () => {
    const customGlobalError$ = FakeTopic.create() as unknown as GlobalErrorTopic
    const customGlobalLoading$ = FakeTopic.create(false) as unknown as GlobalLoadingTopic
    const customCurrentMfe$ = FakeTopic.create() as unknown as CurrentMfeTopic
    const customCurrentLocation$ = FakeTopic.create() as unknown as CurrentLocationTopic
    const customCurrentPage$ = FakeTopic.create() as unknown as CurrentPageTopic
    const customCurrentWorkspace$ = FakeTopic.create() as unknown as CurrentWorkspaceTopic
    const customIsAuthenticated$ = FakeTopic.create() as unknown as IsAuthenticatedTopic

    const { result } = renderHook(() => useAppState(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AppStateProvider
          value={{
            globalError$: customGlobalError$,
            globalLoading$: customGlobalLoading$,
            currentMfe$: customCurrentMfe$,
            currentLocation$: customCurrentLocation$,
            currentPage$: customCurrentPage$,
            currentWorkspace$: customCurrentWorkspace$,
            isAuthenticated$: customIsAuthenticated$,
          }}
        >
          {children}
        </AppStateProvider>
      ),
    })

    expect(result.current.globalError$).toBe(customGlobalError$)
    expect(result.current.globalLoading$).toBe(customGlobalLoading$)
    expect(result.current.currentMfe$).toBe(customCurrentMfe$)
    expect(result.current.currentLocation$).toBe(customCurrentLocation$)
    expect(result.current.currentPage$).toBe(customCurrentPage$)
    expect(result.current.currentWorkspace$).toBe(customCurrentWorkspace$)
    expect(result.current.isAuthenticated$).toBe(customIsAuthenticated$)
  })

  it('renders children correctly', () => {
    const TestChild = () => <div data-testid="child">Child</div>

    const { getByTestId } = render(
      <AppStateProvider>
        <TestChild />
      </AppStateProvider>
    )

    expect(getByTestId('child')).toBeTruthy()
  })
})
