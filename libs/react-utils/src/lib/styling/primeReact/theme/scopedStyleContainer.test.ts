import { extractComponentName, getOrCreateScopedStyleContainer, getRealStyleContainer } from './scopedStyleContainer'

// Each test uses a unique productId so the module-level proxy cache
// (Map<productId, Proxy>) never serves a stale proxy between tests.
let _counter = 0
const nextId = () => {
  _counter++
  return `test-product-${_counter}|test-product-${_counter}`
}

// ─── extractComponentName ────────────────────────────────────────────────────
// This is the core algorithm that makes multi-app MF isolation work.
// It strips ANY existing app suffix before the caller adds its own,
// which prevents double-suffixing when a shared PrimeReact singleton was
// originally built by AppA and is now being used by AppB.

describe('extractComponentName', () => {
  it('returns unchanged name when no suffix present', () => {
    expect(extractComponentName('button')).toBe('button')
    expect(extractComponentName('datatable')).toBe('datatable')
    expect(extractComponentName('base')).toBe('base')
  })

  it('strips ProductName|ProductName suffix', () => {
    expect(extractComponentName('button-AppA|AppA')).toBe('button')
    expect(extractComponentName('dialog-AppA|AppA')).toBe('dialog')
  })

  it('strips undefined- prefix (malformed context ID before app fully boots)', () => {
    expect(extractComponentName('undefined-button')).toBe('button')
    expect(extractComponentName('undefined-dialog')).toBe('dialog')
  })

  it('strips both undefined- prefix and ProductName|ProductName suffix', () => {
    expect(extractComponentName('undefined-button-AppA|AppA')).toBe('button')
  })

  it('handles product names containing hyphens', () => {
    // This is the real-world case: product = "onecx-react-module-test"
    expect(extractComponentName('datatable-onecx-react-module-test|onecx-react-module-test')).toBe('datatable')

    expect(extractComponentName('button-onecx-react-module-test|onecx-react-module-test')).toBe('button')
  })

  it('is idempotent — stripping twice gives same result as stripping once', () => {
    const once = extractComponentName('button-AppA|AppA')
    const twice = extractComponentName(once)
    expect(twice).toBe(once)
  })

  it('returns input unchanged when pipe is present but suffix pattern is not found', () => {
    // Line 65 true branch: if (suffixStart === -1) return cleaned
    // "myapp|myapp" has a pipe but "-myapp|myapp" is not found before the pipe
    expect(extractComponentName('myapp|myapp')).toBe('myapp|myapp')
    expect(extractComponentName('name|other-name')).toBe('name|other-name')
  })
})

// ─── getOrCreateScopedStyleContainer ────────────────────────────────────────

describe('getOrCreateScopedStyleContainer', () => {
  it('returns the same Proxy for the same productId (cache hit)', () => {
    const id = nextId()
    expect(getOrCreateScopedStyleContainer(id)).toBe(getOrCreateScopedStyleContainer(id))
  })

  it('returns distinct Proxies for different productIds', () => {
    expect(getOrCreateScopedStyleContainer(nextId())).not.toBe(getOrCreateScopedStyleContainer(nextId()))
  })
})

// ─── getRealStyleContainer ───────────────────────────────────────────────────

describe('getRealStyleContainer', () => {
  it('returns document.head', () => {
    expect(getRealStyleContainer()).toBe(document.head)
  })
})

// ─── querySelector transformation ────────────────────────────────────────────
// The Proxy rewrites every data-primereact-style-id selector so PrimeReact's
// dedup check looks for the correctly suffixed element in document.head.

describe('Proxy — querySelector transformation', () => {
  const injected: HTMLStyleElement[] = []

  afterEach(() => {
    injected.splice(0).forEach((el) => el.parentNode?.removeChild(el))
  })

  const seed = (id: string): HTMLStyleElement => {
    const el = document.createElement('style')
    el.setAttribute('data-primereact-style-id', id)
    document.head.appendChild(el)
    injected.push(el)
    return el
  }

  it('finds element whose scoped ID matches the unsuffixed search', () => {
    const productId = nextId()
    const el = seed(`button-${productId}`)
    const container = getOrCreateScopedStyleContainer(productId)

    expect(container.querySelector('style[data-primereact-style-id="button"]')).toBe(el)
  })

  it('finds element when search already carries a DIFFERENT app suffix (AppA built → AppB searches)', () => {
    const productId = nextId()
    const el = seed(`button-${productId}`)
    const container = getOrCreateScopedStyleContainer(productId)

    // AppA baked "button-AppA|AppA" into the shared useStyle call;
    // AppB's Proxy must still resolve to AppB's own element.
    expect(container.querySelector('style[data-primereact-style-id="button-other-app|other-app"]')).toBe(el)
  })

  it("does NOT find another app's element", () => {
    const idA = nextId()
    const idB = nextId()
    seed(`button-${idA}`)
    const containerB = getOrCreateScopedStyleContainer(idB)

    expect(containerB.querySelector('style[data-primereact-style-id="button"]')).toBeNull()
  })

  it('passes through selectors unrelated to data-primereact-style-id', () => {
    const productId = nextId()
    const container = getOrCreateScopedStyleContainer(productId)

    const el = document.createElement('style')
    el.setAttribute('class', 'non-prime-selector')
    document.head.appendChild(el)
    injected.push(el)

    expect(container.querySelector('.non-prime-selector')).toBe(el)
  })

  it('querySelectorAll — transforms value selector and scopes to this app only', () => {
    const idA = nextId()
    const idB = nextId()
    const buttonA = seed(`button-${idA}`)
    const dialogA = seed(`dialog-${idA}`)
    seed(`button-${idB}`) // AppB's button — must NOT appear in AppA results

    const containerA = getOrCreateScopedStyleContainer(idA)

    // querySelectorAll with a specific-value selector is transformed just like querySelector
    const buttons = Array.from(containerA.querySelectorAll('style[data-primereact-style-id="button"]'))
    expect(buttons).toContain(buttonA)
    expect(buttons).not.toContain(dialogA)

    // AppB's button has a different scoped ID and must not appear
    const dialogs = Array.from(containerA.querySelectorAll('style[data-primereact-style-id="dialog"]'))
    expect(dialogs).toContain(dialogA)
    expect(dialogs).not.toContain(buttonA)
  })
})

// ─── setAttribute scoping (the critical interception point) ──────────────────
// PrimeReact calls el.setAttribute('data-primereact-style-id', name) AFTER
// appendChild, bypassing the Proxy. The patched prototype intercepts this
// call for elements registered in the WeakMap via Proxy.appendChild.

describe('Proxy — setAttribute scoping', () => {
  const injected: HTMLStyleElement[] = []

  afterEach(() => {
    injected.splice(0).forEach((el) => el.parentNode?.removeChild(el))
  })

  it('scopes data-primereact-style-id when PrimeReact writes it after appendChild', () => {
    const productId = nextId()
    const container = getOrCreateScopedStyleContainer(productId)

    const el = document.createElement('style')
    container.appendChild(el)
    injected.push(el)

    // PrimeReact's useStyle always calls setAttribute after appendChild
    el.setAttribute('data-primereact-style-id', 'button')

    expect(el.getAttribute('data-primereact-style-id')).toBe(`button-${productId}`)
  })

  // ★ The central test for the "AppA plugin bakes-in AppA suffix → AppB should
  //   still get its own suffix" scenario described in the conversation.
  it('strips AppA suffix and applies AppB suffix (MF shared singleton case)', () => {
    const productIdB = nextId()
    const containerB = getOrCreateScopedStyleContainer(productIdB)

    const el = document.createElement('style')
    containerB.appendChild(el)
    injected.push(el)

    // AppA's build-time plugin already baked "button-AppA|AppA" as the name;
    // the shared PrimeReact singleton passes that value to setAttribute.
    el.setAttribute('data-primereact-style-id', 'button-AppA|AppA')

    expect(el.getAttribute('data-primereact-style-id')).toBe(`button-${productIdB}`)
  })

  it('strips undefined- prefix before applying suffix', () => {
    const productId = nextId()
    const container = getOrCreateScopedStyleContainer(productId)

    const el = document.createElement('style')
    container.appendChild(el)
    injected.push(el)

    el.setAttribute('data-primereact-style-id', 'undefined-dialog')

    expect(el.getAttribute('data-primereact-style-id')).toBe(`dialog-${productId}`)
  })

  it('does NOT scope elements NOT appended via the Proxy', () => {
    const el = document.createElement('style')
    document.head.appendChild(el)
    injected.push(el)

    el.setAttribute('data-primereact-style-id', 'button')

    // No entry in WeakMap → patch is a no-op → original value preserved
    expect(el.getAttribute('data-primereact-style-id')).toBe('button')
  })

  it('appends non-HTMLStyleElement children without registering them', () => {
    // Line 125 false branch: if (child instanceof HTMLStyleElement) when child is not a style element
    const productId = nextId()
    const container = getOrCreateScopedStyleContainer(productId)

    const meta = document.createElement('meta')
    container.appendChild(meta)

    // Non-style element is appended but not registered in elementProductId
    expect(document.head.contains(meta)).toBe(true)
    document.head.removeChild(meta)
  })

  it('does not affect other setAttribute calls on a registered element', () => {
    const productId = nextId()
    const container = getOrCreateScopedStyleContainer(productId)

    const el = document.createElement('style')
    container.appendChild(el)
    injected.push(el)

    el.setAttribute('type', 'text/css')
    el.setAttribute('nonce', 'abc123')

    expect(el.getAttribute('type')).toBe('text/css')
    expect(el.getAttribute('nonce')).toBe('abc123')
  })
})

// ─── Full PrimeReact useStyle flow simulation ────────────────────────────────
// Reproduces the exact sequence from primereact/hooks/hooks.cjs.js:1189-1202.

describe('Full PrimeReact useStyle flow', () => {
  const injected: HTMLStyleElement[] = []

  afterEach(() => {
    injected.splice(0).forEach((el) => el.parentNode?.removeChild(el))
  })

  /** Simulates one PrimeReact useStyle("css", { name }) call */
  const primeInject = (container: HTMLElement, name: string, css = '') => {
    // Step 1: dedup check
    const existing = container.querySelector(`style[data-primereact-style-id="${name}"]`)
    if (existing) {
      ;(existing as HTMLStyleElement).textContent = css
      return existing as HTMLStyleElement
    }
    // Step 2: create + append + setAttribute (the exact PrimeReact order)
    const el = document.createElement('style')
    container.appendChild(el)
    el.setAttribute('data-primereact-style-id', name)
    el.textContent = css
    injected.push(el)
    return el
  }

  it('first injection lands in document.head with scoped ID', () => {
    const productId = nextId()
    const container = getOrCreateScopedStyleContainer(productId)

    const el = primeInject(container, 'button', '.p-button {}')

    expect(el.getAttribute('data-primereact-style-id')).toBe(`button-${productId}`)
    expect(document.head.contains(el)).toBe(true)
  })

  it('second call returns the existing element — no duplicate injection', () => {
    const productId = nextId()
    const container = getOrCreateScopedStyleContainer(productId)

    const first = primeInject(container, 'button')
    const second = primeInject(container, 'button')

    expect(first).toBe(second)
    expect(document.head.querySelectorAll(`[data-primereact-style-id="button-${productId}"]`).length).toBe(1)
  })

  it('two apps inject the same component independently without colliding', () => {
    const idA = nextId()
    const idB = nextId()
    const containerA = getOrCreateScopedStyleContainer(idA)
    const containerB = getOrCreateScopedStyleContainer(idB)

    const elA = primeInject(containerA, 'button')

    // AppB must NOT find AppA's element during its dedup check
    const dedupCheck = containerB.querySelector('style[data-primereact-style-id="button"]')
    expect(dedupCheck).toBeNull()

    const elB = primeInject(containerB, 'button')

    expect(elA).not.toBe(elB)
    expect(elA.getAttribute('data-primereact-style-id')).toBe(`button-${idA}`)
    expect(elB.getAttribute('data-primereact-style-id')).toBe(`button-${idB}`)
  })

  it('handles AppA-plugin singleton: name already contains AppA suffix, AppB re-scopes correctly', () => {
    const idB = nextId()
    const containerB = getOrCreateScopedStyleContainer(idB)

    // The shared PrimeReact singleton (built by AppA) always passes
    // "button-AppA|AppA" as the name — AppB's Proxy must still work.
    const el = primeInject(containerB, 'button-AppA|AppA')

    expect(el.getAttribute('data-primereact-style-id')).toBe(`button-${idB}`)

    // And dedup also works on the next render (same AppA-name passed again)
    const second = primeInject(containerB, 'button-AppA|AppA')
    expect(second).toBe(el)
  })
})

// ─── Proxy — passthrough for non-intercepted properties ──────────────────────
// Lines 131-132 in createScopedProxy: Reflect.get fallback for any property
// other than querySelector, querySelectorAll, and appendChild.

describe('Proxy — passthrough for non-intercepted properties', () => {
  const injected: HTMLStyleElement[] = []

  afterEach(() => {
    injected.splice(0).forEach((el) => el.parentNode?.removeChild(el))
  })

  it('returns a non-function property value directly from document.head', () => {
    // Access a non-function property — Proxy returns the value unchanged (line 132, false branch)
    const productId = nextId()
    const container = getOrCreateScopedStyleContainer(productId)

    expect(container.innerHTML).toBe(document.head.innerHTML)
  })

  it('returns a bound function for non-intercepted methods', () => {
    // Access a function property not handled by Proxy — returns value.bind(target) (line 132, true branch)
    const productId = nextId()
    const container = getOrCreateScopedStyleContainer(productId)

    const el = document.createElement('style')
    document.head.appendChild(el)
    injected.push(el)

    // removeChild is not intercepted; Proxy returns it as a bound function
    expect(container.removeChild(el)).toBe(el)
    expect(document.head.contains(el)).toBe(false)
  })
})
