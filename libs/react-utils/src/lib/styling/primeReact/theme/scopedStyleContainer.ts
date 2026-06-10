// One Proxy per product ID — wraps document.head with per-product ID translation.
const proxies = new Map<string, HTMLElement>()

// Populated in Proxy.appendChild; consumed in the patched setAttribute.
const elementProductId = new WeakMap<HTMLStyleElement, string>()

/**
 * Extracts the bare PrimeReact component name from a style ID that may already carry
 * an app suffix baked in by a build-time plugin or a previous runtime rename.
 *
 * @example
 * extractComponentName('button-AppA|AppA') // → 'button'
 * extractComponentName('undefined-button') // → 'button'
 */
export function extractComponentName(id: string): string {
  const cleaned = id.startsWith('undefined-') ? id.slice('undefined-'.length) : id

  const pipeIdx = cleaned.indexOf('|')
  if (pipeIdx === -1) return cleaned

  // The part after "|" repeats verbatim before "|" preceded by "-".
  // e.g. "button-AppA|AppA" → rightHalf="AppA", suffixPattern="-AppA|AppA"
  const rightHalf = cleaned.slice(pipeIdx + 1)
  const suffixPattern = `-${rightHalf}|${rightHalf}`
  const suffixStart = cleaned.indexOf(suffixPattern)

  if (suffixStart === -1) return cleaned
  return cleaned.slice(0, suffixStart)
}

const PRIME_ATTR_RE = /\[data-primereact-style-id="([^"]+)"\]/g

function transformSelector(selector: string, productId: string): string {
  return selector.replace(
    PRIME_ATTR_RE,
    (_, id) => `[data-primereact-style-id="${extractComponentName(id)}-${productId}"]`
  )
}

function installSetAttributePatch(): void {
  if ((HTMLStyleElement.prototype.setAttribute as { __primeScoped?: true }).__primeScoped) return

  const originalSetAttribute = HTMLStyleElement.prototype.setAttribute

  function patchedSetAttribute(this: HTMLStyleElement, name: string, value: string): void {
    if (name === 'data-primereact-style-id') {
      const productId = elementProductId.get(this)
      if (productId) {
        value = `${extractComponentName(value)}-${productId}`
      }
    }
    return originalSetAttribute.call(this, name, value)
  }

  ;(patchedSetAttribute as { __primeScoped?: true }).__primeScoped = true
  HTMLStyleElement.prototype.setAttribute = patchedSetAttribute
}

function createScopedProxy(productId: string): HTMLElement {
  installSetAttributePatch()

  return new Proxy(document.head, {
    get(target, prop, receiver) {
      if (prop === 'querySelector') {
        return (selector: string) => target.querySelector(transformSelector(selector, productId))
      }
      if (prop === 'querySelectorAll') {
        return (selector: string) => target.querySelectorAll(transformSelector(selector, productId))
      }
      if (prop === 'appendChild') {
        return <T extends Node>(child: T): T => {
          // Register the element before it lands in the DOM so the patched setAttribute
          // (called synchronously right after appendChild by PrimeReact) can look up its owner productId.
          if (child instanceof HTMLStyleElement) {
            elementProductId.set(child, productId)
          }
          return target.appendChild(child)
        }
      }
      const value = Reflect.get(target, prop, receiver)
      return typeof value === 'function' ? value.bind(target) : value
    },
  })
}

/**
 * Returns the Proxy-wrapped document.head for a product.
 * Pass the return value to PrimeReactProvider as styleContainer.
 */
export function getOrCreateScopedStyleContainer(productId: string): HTMLElement {
  const cached = proxies.get(productId)
  if (cached) return cached
  const proxy = createScopedProxy(productId)
  proxies.set(productId, proxy)
  return proxy
}

/**
 * Returns document.head — the real Node that backs every product's Proxy.
 * Provided for APIs that require an actual Node (e.g. MutationObserver.observe).
 */
export function getRealStyleContainer(): HTMLElement {
  return document.head
}
