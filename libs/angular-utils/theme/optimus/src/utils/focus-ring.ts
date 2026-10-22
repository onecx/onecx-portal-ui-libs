/**
 * Focus ring token resolver.
 *
 * Resolves the colours of the OneCX focus ring (WCAG 2.4.7, 1.4.11) from the theme colours:
 *  - `color`: ring on light surfaces. At least {@link MIN_RING_CONTRAST}:1 against the content surface and the body background.
 *  - `inverseColor`: ring on dark surfaces such as the top bar and the menu. At least {@link MIN_RING_CONTRAST}:1 against
 *    the top bar background.
 *
 * Algorithm: start at the primary colour; if it does not reach the contrast against all backgrounds, mix it towards
 * black (or towards white) in 5 % steps until it does. If neither direction reaches the contrast, the best of
 * black / white is used.
 */
export const MIN_RING_CONTRAST = 3

export interface FocusRingInput {
  primaryColor: string
  /** Content / surface background, default `#ffffff` */
  surfaceColor?: string | null
  /** Body background, default `#f7f7f7` */
  bodyBgColor?: string | null
  /** Top bar background, default `#0D3650` */
  topbarBgColor?: string | null
}

export interface FocusRingColors {
  color: string
  inverseColor: string
}

type Rgb = [number, number, number]

export function parseColor(color: string | null | undefined): Rgb | undefined {
  if (!color) return undefined
  const c = color.trim()
  let m = /^#([0-9a-f]{3})$/i.exec(c)
  if (m) return [...m[1]].map((h) => parseInt(h + h, 16)) as Rgb
  m = /^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(c)
  if (m) return [0, 2, 4].map((i) => parseInt(m![1].slice(i, i + 2), 16)) as Rgb
  const f = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(c)
  if (f) return [Number(f[1]), Number(f[2]), Number(f[3])]
  return undefined
}

export function toHex(rgb: Rgb): string {
  return (
    '#' +
    rgb
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

/** WCAG 2.x relative luminance */
export function relativeLuminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio of two colours (1..21). Returns NaN for unparsable colours. */
export function contrastRatio(a: string, b: string): number {
  const ca = parseColor(a)
  const cb = parseColor(b)
  if (!ca || !cb) return NaN
  const la = relativeLuminance(ca)
  const lb = relativeLuminance(cb)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

function mix(from: Rgb, to: Rgb, amount: number): Rgb {
  return from.map((v, i) => v + (to[i] - v) * amount) as Rgb
}

function minContrast(color: Rgb, backgrounds: Rgb[]): number {
  const hex = toHex(color)
  return Math.min(...backgrounds.map((bg) => contrastRatio(hex, toHex(bg))))
}

/**
 * Returns the colour closest to `start` (by mixing towards black or white) that reaches the minimum contrast
 * against all backgrounds.
 */
export function findAccessibleColor(start: Rgb, backgrounds: Rgb[], minRatio = MIN_RING_CONTRAST): string {
  if (minContrast(start, backgrounds) >= minRatio) return toHex(start)
  const black: Rgb = [0, 0, 0]
  const white: Rgb = [255, 255, 255]
  let best: { color: Rgb; steps: number } | undefined
  for (const target of [black, white]) {
    for (let steps = 1; steps <= 20; steps++) {
      const candidate = mix(start, target, steps / 20)
      if (minContrast(candidate, backgrounds) >= minRatio) {
        // keep the direction that needs the smaller change
        if (!best || steps < best.steps) best = { color: candidate, steps }
        break
      }
    }
  }
  if (best) return toHex(best.color)
  return minContrast(black, backgrounds) >= minContrast(white, backgrounds) ? toHex(black) : toHex(white)
}

export function resolveFocusRingColors(input: FocusRingInput): FocusRingColors {
  const primary = parseColor(input.primaryColor) ?? [39, 75, 95]
  const surface = parseColor(input.surfaceColor) ?? [255, 255, 255]
  const body = parseColor(input.bodyBgColor) ?? [247, 247, 247]
  const topbar = parseColor(input.topbarBgColor) ?? [13, 54, 80]
  return {
    color: findAccessibleColor(primary, [surface, body]),
    // starts at white: the inverse ring should be as neutral as possible on dark surfaces
    inverseColor: findAccessibleColor([255, 255, 255], [topbar]),
  }
}
