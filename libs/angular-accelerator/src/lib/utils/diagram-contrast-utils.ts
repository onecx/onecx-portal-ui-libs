/* 
Query to check if the user has high contrast mode enabled.
To enable high contrast modes in Windows use left alt + left shift + print screen and confirm the pop-up.
For macOS use ctrl + option + command + 8 to toggle high contrast mode.
For more details refer to https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
*/
const highContrastSelector = globalThis.matchMedia('(forced-colors: active)')

/* Matches flag will return true when high contrast mode is enabled */
export function hasHighContrast(): boolean {
  return highContrastSelector.matches
}

/* This function returns the background color based on the high contrast mode.
When high contrast mode is enabled, all background colors are overidden to black and all text color are overriden to white,
In chart we need to add this behavior manually, so we explicitly return white for high contrast mode, 
otherwise it uses the CSS variable --text-color */
export function getLabelColor(highContrast: boolean): string {
  if (highContrast) return '#ffffff'
  return getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
}

/* Add event listener on high contrast mode change */
export function addHighContrastListener(handler: () => void): void {
  highContrastSelector.addEventListener('change', handler)
}

/* Remove event listener on high contrast mode change */
export function removeHighContrastListener(handler: () => void): void {
  highContrastSelector.removeEventListener('change', handler)
}

/* Returns the current value of a theme CSS variable (e.g. --content-bg-color), or an empty string if it is not set. */
export function getThemeColor(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
}

/* Red, green and blue channels (0-255) of a color. */
export type Rgb = [number, number, number]

/* WCAG 1.4.11: graphical objects need a contrast ratio of at least 3:1 against adjacent colors. */
export const MIN_GRAPHICS_CONTRAST = 3

/* Parses #rgb, #rgba, #rrggbb, #rrggbbaa, rgb() and rgba() colors (alpha is ignored). Returns undefined for any other format. */
export function parseColor(color: string): Rgb | undefined {
  const hex = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.exec(color)
  if (hex) {
    const digits = hex[1].length <= 4 ? hex[1].replace(/./g, '$&$&') : hex[1]
    return [0, 2, 4].map((i) => Number.parseInt(digits.slice(i, i + 2), 16)) as Rgb
  }
  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(color)
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : undefined
}

function relativeLuminance(color: Rgb): number {
  const [r, g, b] = color.map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/* WCAG contrast ratio between two colors (1 to 21). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

/*
Returns a color that reaches at least 3:1 contrast against the background.
The color is mixed towards a theme color that contrasts with the background (e.g. --text-color) in 10% steps,
so the result stays close to the original hue. Colors that already contrast enough, or that cannot be parsed, are returned unchanged.
*/
export function ensureGraphicsContrast(color: string, background: string, towards: string): string {
  const original = parseColor(color)
  const bg = parseColor(background)
  const target = parseColor(towards)
  if (!original || !bg || !target) return color
  let mixed = original
  let step = 0
  while (contrastRatio(mixed, bg) < MIN_GRAPHICS_CONTRAST && step < 10) {
    step++
    mixed = original.map((channel, i) => Math.round(channel + ((target[i] - channel) * step) / 10)) as Rgb
  }
  return step === 0 ? color : `rgb(${mixed.join(', ')})`
}
