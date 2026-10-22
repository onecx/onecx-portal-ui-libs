/**
 * Focus ring colour resolver for the React theme (WCAG 2.4.7, 1.4.11).
 *
 * The ring colour has to be opaque and reach {@link MIN_RING_CONTRAST}:1 against the content surface and the body
 * background. It starts at the theme primary colour and is mixed towards black (or white) in 5 % steps until the
 * contrast is reached. Keep in sync with the resolver of the Angular preset (angular-utils/theme/optimus focus-ring.ts).
 */
export const MIN_RING_CONTRAST = 3

type Rgb = [number, number, number]

const DEFAULT_PRIMARY: Rgb = [39, 75, 95]
const DEFAULT_SURFACE: Rgb = [255, 255, 255]
const DEFAULT_BODY: Rgb = [247, 247, 247]

// INFO: the alpha channel is ignored, colours are treated as opaque. Colours that are not hex/rgb (e.g. var()) are not resolvable.
export function parseColor(color: string | null | undefined): Rgb | undefined {
  if (!color) return undefined
  const c = color.trim()
  let m = /^#([0-9a-f]{3})$/i.exec(c)
  if (m) return [...m[1]].map((h) => Number.parseInt(h + h, 16)) as Rgb
  m = /^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(c)
  if (m) return [0, 2, 4].map((i) => Number.parseInt(m![1].slice(i, i + 2), 16)) as Rgb
  const f = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(c)
  if (f) return [Number(f[1]), Number(f[2]), Number(f[3])]
  return undefined
}

function toHex(rgb: Rgb): string {
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

function relativeLuminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

function mix(from: Rgb, to: Rgb, amount: number): Rgb {
  return from.map((v, i) => v + (to[i] - v) * amount) as Rgb
}

function roundRgb(rgb: Rgb): Rgb {
  return rgb.map((v) => Math.round(v)) as Rgb
}

function minContrast(color: Rgb, backgrounds: Rgb[]): number {
  const rounded = roundRgb(color)
  return Math.min(...backgrounds.map((bg) => contrastRatio(rounded, bg)))
}

/**
 * Returns the colour closest to `start` (mixing towards black or white) that reaches the minimum contrast
 * against all backgrounds as opaque hex colour.
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
        if (!best || steps < best.steps) best = { color: candidate, steps }
        break
      }
    }
  }
  if (best) return toHex(best.color)
  return minContrast(black, backgrounds) >= minContrast(white, backgrounds) ? toHex(black) : toHex(white)
}

export interface FocusRingInput {
  primaryColor?: string | null
  surfaceColor?: string | null
  bodyBgColor?: string | null
}

/** Resolves the opaque focus ring colour (hex) from the theme colours. */
export function resolveFocusRingColor(input: FocusRingInput): string {
  const primary = parseColor(input.primaryColor) ?? DEFAULT_PRIMARY
  const surface = parseColor(input.surfaceColor) ?? DEFAULT_SURFACE
  const body = parseColor(input.bodyBgColor) ?? DEFAULT_BODY
  return findAccessibleColor(primary, [surface, body])
}
