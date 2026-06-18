/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { ThemeProvider, useTheme } from './themeContext'
import { FakeTopic } from '@onecx/accelerator'
import type { CurrentThemeTopic } from '@onecx/integration-interface'
import type { ReactNode } from 'react'

describe('ThemeProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>

  it('provides theme context with currentTheme$', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.currentTheme$).toBeTruthy()
  })

  it('allows overriding currentTheme$ via value prop', () => {
    const customTheme$ = FakeTopic.create() as unknown as CurrentThemeTopic

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <ThemeProvider value={{ currentTheme$: customTheme$ }}>{children}</ThemeProvider>
      ),
    })

    expect(result.current.currentTheme$).toBe(customTheme$)
  })
})
