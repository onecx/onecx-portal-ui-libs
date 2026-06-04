import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone'
setupZoneTestEnv()

let forcedColorsActive = false
const forcedColorsListeners = new Set<(event: MediaQueryListEvent) => void>()

const forcedColorsMediaQuery = {
  media: '(forced-colors: active)',
  get matches() {
    return forcedColorsActive
  },
  onchange: null,
  addListener: jest.fn((listener: (event: MediaQueryListEvent) => void) => {
    forcedColorsListeners.add(listener)
  }),
  removeListener: jest.fn((listener: (event: MediaQueryListEvent) => void) => {
    forcedColorsListeners.delete(listener)
  }),
  addEventListener: jest.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
    if (type === 'change') forcedColorsListeners.add(listener)
  }),
  removeEventListener: jest.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
    if (type === 'change') forcedColorsListeners.delete(listener)
  }),
  dispatchEvent: jest.fn((event: Event) => {
    forcedColorsListeners.forEach((listener) => listener(event as MediaQueryListEvent))
    return true
  }),
} as unknown as MediaQueryList

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => {
    if (query === '(forced-colors: active)') return forcedColorsMediaQuery
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }
  }),
})

Object.defineProperty(globalThis, '__setForcedColorsActive', {
  writable: true,
  value: (active: boolean) => {
    forcedColorsActive = active
    const event = {
      media: '(forced-colors: active)',
      matches: forcedColorsActive,
    } as MediaQueryListEvent
    forcedColorsListeners.forEach((listener) => listener(event))
  },
})
