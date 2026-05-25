import type { ReactNode } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import StyleRegistry from './StyleRegistry'
import applyThemeVariables from './applyThemeVariables'
import { setupPrimeStyleDeduplication, setupPrimeStyleIdTagging } from './primeStyleRegistry'

let emitTheme: ((theme: unknown) => void) | undefined
const unsubscribeSpy = jest.fn()
const cleanupDedupSpy = jest.fn()
const cleanupTagSpy = jest.fn()

jest.mock('primereact/api', () => ({
  PrimeReactProvider: ({ children }: { children?: ReactNode }) => <>{children}</>,
}))

jest.mock('@onecx/integration-interface', () => ({
  CurrentThemeTopic: class {
    subscribe(callback: (theme: unknown) => void) {
      emitTheme = callback
      return {
        unsubscribe: unsubscribeSpy,
      }
    }
  },
}))

jest.mock('./applyThemeVariables', () => ({
  default: jest.fn(),
}))

jest.mock('./primeStyleRegistry', () => ({
  setupPrimeStyleDeduplication: jest.fn(() => cleanupDedupSpy),
  setupPrimeStyleIdTagging: jest.fn(() => cleanupTagSpy),
}))

jest.mock('../../../utils/withAppGlobals', () => ({
  useAppGlobals: () => ({
    PRODUCT_NAME: 'demo-app',
  }),
}))

describe('StyleRegistry', () => {
  beforeEach(() => {
    emitTheme = undefined
    unsubscribeSpy.mockReset()
    cleanupDedupSpy.mockReset()
    cleanupTagSpy.mockReset()
    jest.mocked(applyThemeVariables).mockReset()
    jest.mocked(setupPrimeStyleDeduplication).mockClear()
    jest.mocked(setupPrimeStyleIdTagging).mockClear()
  })

  it('subscribes to theme, applies variables, and renders children once themed', async () => {
    const theme = { properties: { colors: { primary: '#111' } } }

    render(
      <StyleRegistry>
        <div>content</div>
      </StyleRegistry>
    )

    expect(screen.queryByText('content')).toBeNull()
    expect(setupPrimeStyleDeduplication).toHaveBeenCalledTimes(1)
    expect(setupPrimeStyleIdTagging).toHaveBeenCalledWith('demo-app|demo-app')

    act(() => {
      emitTheme?.(theme)
    })

    await waitFor(() => {
      expect(screen.queryByText('content')).not.toBeNull()
    })

    expect(applyThemeVariables).toHaveBeenCalledWith(theme, 'demo-app|demo-app')
  })

  it('cleans up style observers and theme subscription on unmount', () => {
    const { unmount } = render(
      <StyleRegistry>
        <div>content</div>
      </StyleRegistry>
    )

    unmount()

    expect(cleanupTagSpy).toHaveBeenCalledTimes(1)
    expect(cleanupDedupSpy).toHaveBeenCalledTimes(1)
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1)
  })
})
