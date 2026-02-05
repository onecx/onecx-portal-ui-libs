import type { PrimeReactScoperOptions } from './types'
import { normalizeForHash, hash, getStyleFromNode, shouldInclude, scopeCss } from './functions'

/**
 * Attaches a per-app MutationObserver that writes scoped copies of
 * PrimeReact style blocks to a dedicated <style data-app-primereact-style="...">.
 * It NEVER edits PrimeReact’s own style tags.
 *
 * Returns a disposer to disconnect the observer (it does not remove the app style tag).
 */

export function attachPrimeReactScoper({
  id,
  scopeRootSelector,
  scopeLimitSelector = '[data-style-isolation]',
  target = document.head,
  bootstrapExisting = true,
  captureWindowMs = Number.POSITIVE_INFINITY,
  freezeAfterFirstUpdate = false,
  mode = 'replace-per-styleId',
  prefixFilter,
  alwaysIncludeStyleIds = ['base', 'global', 'common'],
  normalizeBeforeHash = true,
  blockFurtherUpdatesForCapturedIds = false,
  dataPrimereactStyleName = 'app',
  productName,
  themeStyleId,
  enableThemeCaptureOnce = true,
}: PrimeReactScoperOptions) {
  /**
   * Changes the data-style-id in @scope selector to match the current app's scope
   * @param css - CSS content that may contain @scope wrapper
   * @returns CSS content with updated scope selector
   */
  const adjustScopeIdToRemote = (css: string): string => {
    const scopeRegex = /@scope\(\[data-style-id="[^"]+"\]/g
    const newScopeSelector = `@scope([data-style-id="${id}"]`

    const cssWithScopedCorrectly = css.replace(scopeRegex, newScopeSelector)

    if (cssWithScopedCorrectly !== css) return cssWithScopedCorrectly

    console.log('⚠️ No @scope data-style-id found to update')
    return css
  }

  const styleTag = document.createElement('style')
  styleTag.setAttribute('type', 'text/css')
  styleTag.setAttribute(`data-${dataPrimereactStyleName}-primereact-style`, id)
  target.appendChild(styleTag)

  const start = performance.now()

  const lastHashById = new Map<string, string>()
  const chunkById = new Map<string, Text>()
  const capturedIds = new Set<string>()

  const inCaptureWindow = () => performance.now() - start <= captureWindowMs

  let didUpdateOnce = false

  const writeChunk = (styleId: string, scopedCss: string) => {
    const banner = `/* ==== app:${id} | primereact:${styleId} ==== */\n`

    console.log(`[writeChunk] writing scoped CSS for styleId=${styleId}`, styleTag, scopedCss)

    if (mode === 'replace-per-styleId') {
      const existing = chunkById.get(styleId)
      if (existing) {
        existing.textContent = banner + scopedCss
      } else {
        const tn = document.createTextNode(banner + scopedCss)
        styleTag.appendChild(tn)
        chunkById.set(styleId, tn)
      }
    } else {
      const tn = document.createTextNode(banner + scopedCss)
      styleTag.appendChild(tn)
    }

    capturedIds.add(styleId)

    if (!didUpdateOnce && freezeAfterFirstUpdate) {
      didUpdateOnce = true
      observer.disconnect()
    }
  }

  const upsertScopedBlock = (styleId: string, rawCss: string) => {
    if (!rawCss) return
    // Global per-style lock
    if (blockFurtherUpdatesForCapturedIds && capturedIds.has(styleId)) {
      console.log('[upsertScopedBlock] skip: global lock; ignoring further updates', styleId)
      return
    }
    // Theme-only one-time capture
    if (enableThemeCaptureOnce && themeStyleId && styleId === themeStyleId && capturedIds.has(styleId)) {
      console.log('[upsertScopedBlock] skip: theme captured once; ignoring further updates', styleId)
      return
    }
    if (!inCaptureWindow()) return

    const normalized = normalizeForHash(rawCss, normalizeBeforeHash)
    const h = hash(normalized)

    if (lastHashById.get(styleId) === h) return
    if (!shouldInclude(styleId, rawCss, alwaysIncludeStyleIds, prefixFilter)) return

    // Skip additional scoping if CSS already has @scope wrapper
    const hasExistingScope = rawCss.includes('@scope')
    const scoped = hasExistingScope ? rawCss : scopeCss(rawCss, scopeRootSelector, scopeLimitSelector)

    if (hasExistingScope) {
      console.log('⚡ Skipping additional scoping - CSS already has @scope wrapper')
    }

    writeChunk(styleId, scoped)
    lastHashById.set(styleId, h)
  }

  const processStyleElement = (styleEl: HTMLStyleElement, attrName = 'data-primereact-style-id') => {
    const styleId = styleEl.getAttribute(attrName) || styleEl.id || 'unknown'
    let cssContent = styleEl.textContent || ''

    if (cssContent && attrName !== 'data-primereact-style-id') cssContent = adjustScopeIdToRemote(cssContent)

    upsertScopedBlock(styleId, cssContent)
  }

  const observer = new MutationObserver((records) => {
    console.log('MutationObserver records:', records)

    for (const record of records) {
      if (record.type === 'childList') {
        record.addedNodes.forEach((node) => {
          const style = getStyleFromNode(node)
          if (style) processStyleElement(style)
          // Theme style capture path
          else if (
            node.parentElement instanceof HTMLStyleElement &&
            (node.parentElement.hasAttribute('data-app-styles') ||
              (productName &&
                typeof node.parentElement.id === 'string' &&
                node.parentElement.id.startsWith(`${productName}|${productName}-ui`)))
          ) {
            const attrName = node.parentElement.hasAttribute('data-app-styles') ? 'data-app-styles' : 'id'
            processStyleElement(node.parentElement as HTMLStyleElement, attrName)
          }
        })
      } else if (record.type === 'characterData') {
        const style = getStyleFromNode(record.target)
        if (style) processStyleElement(style)
      }
    }
  })

  observer.observe(document.head, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  if (bootstrapExisting) {
    const attrName = 'data-app-styles'

    document.head
      .querySelectorAll(`style[${attrName}], style[id^="${productName}|${productName}-ui"]`)
      .forEach((el) => processStyleElement(el as HTMLStyleElement, attrName))
  }

  return () => {
    observer.disconnect()
  }
}
