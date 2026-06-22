import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone'
setupZoneTestEnv()

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
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