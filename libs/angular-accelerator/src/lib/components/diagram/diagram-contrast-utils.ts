const highContrastSelector = globalThis.matchMedia('(forced-colors: active)')

export function hasHighContrast(): boolean {
  return highContrastSelector.matches
}

export function getLabelColor(highContrast: boolean): string {
  if (highContrast) return '#ffffff'
  return getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
}

export function addHighContrastListener(handler: () => void): void {
  highContrastSelector.addEventListener('change', handler)
}

export function removeHighContrastListener(handler: () => void): void {
  highContrastSelector.removeEventListener('change', handler)
}
