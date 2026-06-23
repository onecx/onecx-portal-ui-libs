import type { ReactNode } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import StyleRegistry from './StyleRegistry'
import applyThemeVariables from './applyThemeVariables'

let emitTheme: ((theme: unknown) => void) | undefined
const unsubscribeSpy = jest.fn()
const destroySpy = jest.fn()

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
    destroy() {
      destroySpy()
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
    destroySpy.mockReset()
    jest.mocked(applyThemeVariables).mockReset()
    jest.mocked(getOrCreateScopedStyleContainer).mockReset()
  })

  it('creates scoped style container, renders children immediately, and applies theme variables when theme arrives', async () => {
    const theme = { properties: { colors: { primary: '#111' } } }

    render(
      <StyleRegistry>
        <div>content</div>
      </StyleRegistry>
    )

    expect(screen.queryByText('content')).not.toBeNull()
    expect(jest.mocked(getOrCreateScopedStyleContainer)).toHaveBeenCalledWith('demo-app|demo-app')

    act(() => {
      emitTheme?.(theme)
    })

    await waitFor(() => {
      expect(jest.mocked(applyThemeVariables)).toHaveBeenCalledWith(theme, 'demo-app|demo-app')
    })
  })

  it('unsubscribes and destroys theme topic on unmount', () => {
    const { unmount } = render(
      <StyleRegistry>
        <div>content</div>
      </StyleRegistry>
    )

    unmount()

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1)
    expect(destroySpy).toHaveBeenCalledTimes(1)
  })
})
