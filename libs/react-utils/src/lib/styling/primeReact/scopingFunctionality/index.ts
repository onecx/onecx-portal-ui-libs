import type { PrimeReactScoperOptions } from './types'
import { normalizeForHash, hash, getStyleFromNode, shouldInclude, scopeCss } from './functions'

/**
 * Attaches a per-app MutationObserver that writes scoped copies of
 * PrimeReact style blocks to a dedicated <style data-app-primereact-style="...">.
 * Optionally, it can also rewrite PrimeReact source style tags in-place.
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
  scopePrimeReactSourceStyles = false,
  productName,
  themeStyleId,
  enableThemeCaptureOnce = true,
}: PrimeReactScoperOptions) {
  /**
   * Changes the data-style-id in @scope selector to match the current app's scope
   */
  const adjustScopeIdToRemote = (css: string): string => {
    return css.replace(/@scope\(\[data-style-id="[^"]+"\]/g, `@scope([data-style-id="${id}"]`)
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
      return
    }
    // Theme-only one-time capture
    if (enableThemeCaptureOnce && themeStyleId && styleId === themeStyleId && capturedIds.has(styleId)) {
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

  const maybeScopeSourceStyleElement = (
    styleEl: HTMLStyleElement,
    styleId: string,
    rawCss: string,
    attrName: string
  ) => {
    if (!scopePrimeReactSourceStyles) return
    if (attrName !== 'data-primereact-style-id') return
    if (!rawCss) return

    const hasExistingScope = rawCss.includes('@scope')
    const scopedCss = hasExistingScope ? rawCss : scopeCss(rawCss, scopeRootSelector, scopeLimitSelector)

    if (styleEl.textContent !== scopedCss) {
      styleEl.textContent = scopedCss
      styleEl.dataset.appPrimeScoped = 'true'
    }

    const normalizedScoped = normalizeForHash(scopedCss, normalizeBeforeHash)
    lastHashById.set(styleId, hash(normalizedScoped))
  }

  const processStyleElement = (styleEl: HTMLStyleElement, attrName = 'data-primereact-style-id') => {
    const styleId = styleEl.getAttribute(attrName) || styleEl.id || 'unknown'
    let cssContent = styleEl.textContent || ''

    if (cssContent && attrName !== 'data-primereact-style-id') cssContent = adjustScopeIdToRemote(cssContent)

    console.log(
      '[PrimeReactScoper] captured style',
      JSON.stringify({
        styleId,
        attrName,
        productName,
        styleTagId: styleEl.id,
        hasPrimeReactAttr: !!styleEl.dataset.primereactStyleId,
      })
    )

    maybeScopeSourceStyleElement(styleEl, styleId, cssContent, attrName)
    upsertScopedBlock(styleId, cssContent)
  }

  const getCandidateIds = (appId: string, prefix: string): string[] => (prefix ? [appId, prefix] : [appId])

  const appPrefix = productName ? `${productName}|${productName}` : ''

  const observer = new MutationObserver((records) => {
    const expectedIds = getCandidateIds(id, appPrefix)

    const matchesThemeStyleParent = (styleEl: HTMLStyleElement): string | null => {
      if (styleEl.dataset.appPrimeScoped) return null
      const { appStyles } = styleEl.dataset
      if (appStyles && expectedIds.includes(appStyles)) return 'data-app-styles'
      if (appPrefix && styleEl.id.startsWith(appPrefix)) return 'id'
      return null
    }

    for (const record of records) {
      if (record.type === 'childList') {
        record.addedNodes.forEach((node) => {
          const style = getStyleFromNode(node)
          if (style) {
            processStyleElement(style)
          } else if (node.parentElement instanceof HTMLStyleElement) {
            const attrName = matchesThemeStyleParent(node.parentElement)
            if (attrName) processStyleElement(node.parentElement, attrName)
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
    const appAttrName = 'data-app-styles'
    const expectedAppIds = getCandidateIds(id, appPrefix)

    document.head
      .querySelectorAll(`style[${appAttrName}], style[id^="${productName}|${productName}"]`)
      .forEach((el) => {
        const styleEl = el as HTMLStyleElement
        const appStylesValue = styleEl.getAttribute(appAttrName) || ''
        const isExpectedAppStyle = expectedAppIds.includes(appStylesValue)
        const isPrefixedThemeStyle = !!appPrefix && styleEl.id.startsWith(appPrefix)

        if (isExpectedAppStyle) {
          processStyleElement(styleEl, appAttrName)
        } else if (isPrefixedThemeStyle) {
          processStyleElement(styleEl, 'id')
        }
      })

    // Also process already-existing PrimeReact style tags like:
    // <style data-primereact-style-id="base">...</style>
    document.head
      .querySelectorAll('style[data-primereact-style-id]')
      .forEach((el) => processStyleElement(el as HTMLStyleElement))
  }

  return () => {
    observer.disconnect()
  }
}
