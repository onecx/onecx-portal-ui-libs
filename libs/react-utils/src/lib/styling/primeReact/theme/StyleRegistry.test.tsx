import type { ReactNode } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import StyleRegistry from './StyleRegistry'
import applyThemeVariables from './applyThemeVariables'

let emitTheme: ((theme: unknown) => void) | undefined
const unsubscribeSpy = jest.fn()

jest.mock('primereact/api', () => ({
  PrimeReactProvider: ({ children, value }: { children?: ReactNode; value?: unknown }) => (
    <div data-testid="prime-react-provider" data-value={JSON.stringify(value)}>
      {children}
    </div>
  ),
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

jest.mock('./scopedStyleContainer', () => ({
  getOrCreateScopedStyleContainer: jest.fn(() => ({
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    appendChild: jest.fn(),
  })),
}))

jest.mock('../../../utils/withAppGlobals', () => ({
  useAppGlobals: () => ({
    PRODUCT_NAME: 'demo-app',
  }),
}))

const { getOrCreateScopedStyleContainer } = jest.requireMock('./scopedStyleContainer')

describe('StyleRegistry', () => {
  beforeEach(() => {
    emitTheme = undefined
    unsubscribeSpy.mockReset()
    jest.mocked(applyThemeVariables).mockReset()
    jest.mocked(getOrCreateScopedStyleContainer).mockReset()
  })

  it('creates scoped style container, subscribes to theme, and renders children once themed', async () => {
    const theme = { properties: { colors: { primary: '#111' } } }

    render(
      <StyleRegistry>
        <div>content</div>
      </StyleRegistry>
    )

    expect(screen.queryByText('content')).toBeNull()
    expect(jest.mocked(getOrCreateScopedStyleContainer)).toHaveBeenCalledWith('demo-app|demo-app')

    act(() => {
      emitTheme?.(theme)
    })

    await waitFor(() => {
      expect(screen.queryByText('content')).not.toBeNull()
    })

    expect(jest.mocked(applyThemeVariables)).toHaveBeenCalledWith(theme, 'demo-app|demo-app')
  })

  it('unsubscribes from theme topic on unmount', () => {
    const { unmount } = render(
      <StyleRegistry>
        <div>content</div>
      </StyleRegistry>
    )

    unmount()

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1)
  })
})
