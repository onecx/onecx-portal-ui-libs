import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone'
setupZoneTestEnv()

let forcedColorsActive = false
// Shared listener store for the full Jest runtime. Tests/components are expected
// to remove listeners they register to avoid cross-test leakage.
const forcedColorsListeners = new Set<(event: MediaQueryListEvent) => void>()

// Minimal MediaQueryList mock for '(forced-colors: active)'. It supports the
// listener APIs used in tests, but does not try to emulate full browser behavior.
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

// Global monkey patch for matchMedia used by all tests in this project.
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

// Test helper to toggle contrast mode and notify current listeners.
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

async function withMockedDocument<T>(
  value: Document | null | undefined,
  callback: () => T | Promise<T>
): Promise<T> {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document')

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    writable: true,
    value,
  })

  try {
    return await callback()
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(globalThis, 'document', originalDescriptor)
    }
  }
}

export async function withDocumentUndefined<T>(callback: () => T | Promise<T>): Promise<T> {
  return withMockedDocument(undefined, callback)
}