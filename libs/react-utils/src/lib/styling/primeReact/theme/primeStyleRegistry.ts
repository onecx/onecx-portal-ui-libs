const PRIME_STYLE_SELECTOR = 'style[data-primereact-style-id]'

/**
 * Removes known invalid prefixes from PrimeReact style ids.
 *
 * @param styleId - Raw PrimeReact style id.
 * @returns Sanitized style id.
 */
function sanitizeStyleId(styleId: string): string {
  if (styleId.startsWith('undefined-')) {
    return styleId.slice('undefined-'.length)
  }

  return styleId
}

/**
 * Normalizes and persists `data-primereact-style-id` on a style element.
 *
 * @param styleElement - PrimeReact style element.
 * @returns Sanitized style id, or null when unavailable.
 */
function sanitizePrimeStyleId(styleElement: HTMLStyleElement): string | null {
  const styleId = styleElement.dataset.primereactStyleId
  if (!styleId) return null

  const sanitizedStyleId = sanitizeStyleId(styleId)
  if (!sanitizedStyleId) return null

  if (styleElement.dataset.primereactStyleId !== sanitizedStyleId) {
    styleElement.dataset.primereactStyleId = sanitizedStyleId
  }

  return sanitizedStyleId
}

/**
 * Visits all PrimeReact style tags within a parent node.
 *
 * @param node - Parent node to inspect.
 * @param visit - Callback invoked for each matched style element.
 * @returns Nothing.
 */
function visitPrimeStyles(node: ParentNode, visit: (styleElement: HTMLStyleElement) => void): void {
  node.querySelectorAll(PRIME_STYLE_SELECTOR).forEach((styleNode) => {
    if (styleNode instanceof HTMLStyleElement) {
      visit(styleNode)
    }
  })
}

/**
 * Processes a mutation node and visits PrimeReact style tags found in it.
 *
 * @param node - Added DOM node.
 * @param visit - Callback invoked for each matched style element.
 * @returns Nothing.
 */
function processPrimeStyleNode(node: Node, visit: (styleElement: HTMLStyleElement) => void): void {
  if (node instanceof HTMLStyleElement) {
    visit(node)
    return
  }

  if (node instanceof Element) {
    visitPrimeStyles(node, visit)
  }
}

/**
 * Observes document head for PrimeReact style tags and applies a visitor.
 *
 * @param visit - Callback invoked for each existing or newly added style tag.
 * @returns Cleanup callback that disconnects the observer.
 */
function observePrimeStyles(visit: (styleElement: HTMLStyleElement) => void): () => void {
  visitPrimeStyles(document.head, visit)

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type !== 'childList') continue
      record.addedNodes.forEach((node) => processPrimeStyleNode(node, visit))
    }
  })

  observer.observe(document.head, {
    childList: true,
    subtree: true,
  })

  return () => {
    observer.disconnect()
  }
}

/**
 * Sets up normalization for PrimeReact style ids to reduce duplicate variants.
 *
 * @returns Cleanup callback that stops DOM observation.
 */
export function setupPrimeStyleDeduplication(): () => void {
  return observePrimeStyles((styleElement) => {
    sanitizePrimeStyleId(styleElement)
  })
}

/**
 * Sets up app-specific suffix tagging for PrimeReact style ids.
 *
 * @param themeStyleId - App-scoped suffix used for style id tagging.
 * @returns Cleanup callback that stops DOM observation.
 */
export function setupPrimeStyleIdTagging(themeStyleId: string): () => void {
  const tagPrimeStyle = (styleElement: HTMLStyleElement) => {
    const styleId = sanitizePrimeStyleId(styleElement)
    if (!styleId || styleId.includes('|')) {
      return
    }

    const suffix = `-${themeStyleId}`
    if (styleId.endsWith(suffix)) {
      return
    }

    styleElement.dataset.primereactStyleId = `${styleId}-${themeStyleId}`
  }

  return observePrimeStyles(tagPrimeStyle)
}
