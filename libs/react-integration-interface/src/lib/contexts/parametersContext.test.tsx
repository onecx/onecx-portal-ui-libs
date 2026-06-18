/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { ParametersProvider, useParameters } from './parametersContext'
import { AppStateProvider } from './appStateContext'
import { FakeTopic } from '@onecx/accelerator'
import type { ParametersTopic } from '@onecx/integration-interface'
import type { ReactNode } from 'react'

describe('ParametersProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AppStateProvider>
      <ParametersProvider>{children}</ParametersProvider>
    </AppStateProvider>
  )

  it('provides parameters context', () => {
    const { result } = renderHook(() => useParameters(), { wrapper })

    expect(result.current.parameters$).toBeTruthy()
    expect(result.current.get).toBeInstanceOf(Function)
  })

  it('allows overriding parameters$ via value prop', () => {
    const customParameters$ = FakeTopic.create() as unknown as ParametersTopic

    const { result } = renderHook(() => useParameters(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AppStateProvider>
          <ParametersProvider value={{ parameters$: customParameters$ }}>{children}</ParametersProvider>
        </AppStateProvider>
      ),
    })

    expect(result.current.parameters$).toBe(customParameters$)
  })
})
