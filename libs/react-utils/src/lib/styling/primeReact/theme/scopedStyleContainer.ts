/**
 * Per-product singleton Proxy over document.head for PrimeReact style injection —
 * full runtime equivalent of Angular's CustomUseStyle.use() scoping logic:
 *
 *   Angular:  options.name = (options.name ?? '') + '-' + scopeId   (before inject)
 *   React:    1. Proxy intercepts querySelector so dedup looks for the suffixed ID.
 *             2. WeakMap registers each new <style> element with its owner productId
 *                when it passes through Proxy.appendChild.
 *             3. A one-time HTMLStyleElement.prototype.setAttribute patch intercepts
 *                the `data-primereact-style-id` write that PrimeReact makes AFTER
 *                appendChild (on the raw element reference, not via the Proxy).
 *
 * Why we need step 3:
 *   PrimeReact's useStyle hook does:
 *     styleContainer.appendChild(el);           ← Proxy sees this, registers el
 *     el.setAttribute('data-primereact-style-id', name); ← bypasses Proxy entirely
 *   Without intercepting setAttribute the ID is always written unsuffixed.
 *
 * Why a WeakMap instead of a flag on the element:
 *   The WeakMap holds a strong key/weak value relationship per element instance,
 *   letting GC reclaim unmounted elements automatically with no manual cleanup.
 *
 * Why the prototype patch is safe:
 *   - Installed exactly once (guarded by a marker property on the patched fn).
 *   - Only transforms `data-primereact-style-id` values on elements that are
 *     registered in the WeakMap — all other setAttribute calls are untouched.
 */

// One Proxy per product ID — wraps document.head with per-product ID translation.
const proxies = new Map<string, HTMLElement>()

// Tracks which productId "owns" a freshly created PrimeReact style element.
// Populated in Proxy.appendChild; consumed in the patched setAttribute.
const elementProductId = new WeakMap<HTMLStyleElement, string>()

/**
 * Extracts the bare PrimeReact component name from a style ID that may
 * already carry an app suffix baked in by a build-time plugin or a previous
 * runtime rename.
 *
 * Examples:
 *   "button"                                       → "button"
 *   "button-AppA|AppA"                             → "button"
 *   "undefined-button"                             → "button"
 *   "undefined-button-AppA|AppA"                   → "button"
 *   "datatable-onecx-module|onecx-module"          → "datatable"
 *
 * The "|" character is used as an anchor because:
 *   1. PrimeReact component style names never contain "|".
 *   2. Our productId convention is "ProductName|ProductName".
 */
// Exported for unit testing. Not part of the public integration API.
export function extractComponentName(id: string): string {
  const cleaned = id.startsWith('undefined-') ? id.slice('undefined-'.length) : id

  const pipeIdx = cleaned.indexOf('|')
  if (pipeIdx === -1) return cleaned // no MF-style suffix present

  // The part after "|" repeats verbatim before "|" preceded by "-".
  // e.g. "button-AppA|AppA" → rightHalf="AppA", suffixPattern="-AppA|AppA"
  const rightHalf = cleaned.slice(pipeIdx + 1)
  const suffixPattern = `-${rightHalf}|${rightHalf}`
  const suffixStart = cleaned.indexOf(suffixPattern)

  if (suffixStart === -1) return cleaned
  return cleaned.slice(0, suffixStart)
}

const PRIME_ATTR_RE = /\[data-primereact-style-id="([^"]+)"\]/g

/**
 * Rewrites a CSS attribute selector so it targets this app's scoped ID.
 * Called for every querySelector/querySelectorAll on the Proxy, ensuring
 * PrimeReact's dedup check looks for the correctly suffixed element.
 */
function transformSelector(selector: string, productId: string): string {
  return selector.replace(
    PRIME_ATTR_RE,
    (_, id) => `[data-primereact-style-id="${extractComponentName(id)}-${productId}"]`
  )
}

/**
 * Patches HTMLStyleElement.prototype.setAttribute once so that when PrimeReact
 * writes `data-primereact-style-id` on a raw element reference (after appendChild,
 * bypassing the Proxy), we intercept and apply the correct per-app suffix.
 *
 * The patch is a no-op for all elements not registered in `elementProductId`.
 */
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
          // Register the element before it lands in the DOM so the patched
          // setAttribute (called synchronously right after appendChild by
          // PrimeReact) can look up its owner productId.
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
