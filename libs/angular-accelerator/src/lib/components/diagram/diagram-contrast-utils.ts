const mediaQueryForHighContrast = window.matchMedia('(forced-colors: active)')

export function isHighContrast(): boolean {
  return mediaQueryForHighContrast.matches
}

export function getLabelColor(highContrast: boolean): string {
  if (highContrast) return '#ffffff'
  return getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
}

export function addHighContrastListener(handler: () => void): void {
  mediaQueryForHighContrast.addEventListener('change', handler)
}

export function removeHighContrastListener(handler: () => void): void {
  mediaQueryForHighContrast.removeEventListener('change', handler)
}
