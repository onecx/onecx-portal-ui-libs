type Rgb = { r: number; g: number; b: number }

export class ColorAccessibilityUtils {
  private static readonly HEX_SHORT = /^#([0-9a-f]{3})$/i
  private static readonly HEX_LONG = /^#([0-9a-f]{6})$/i
  private static readonly RGB = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i

  /**
   * Calculates the WCAG contrast ratio between two colors.
   *
   * The ratio is computed as:
   * (Llighter + 0.05) / (Ldarker + 0.05)
   * where L is the relative luminance in the range [0, 1].
   *
   * A value of 1 means no contrast and 21 is the maximum possible contrast.
   *
   * @param foreground Foreground color in supported formats (#rgb, #rrggbb, rgb(), rgba()).
   * @param background Background color in supported formats (#rgb, #rrggbb, rgb(), rgba()).
   * @returns Contrast ratio as a number in the range [1, 21].
   */
  static contrastRatio(foreground: string, background: string): number {
    const l1 = this.relativeLuminance(foreground)
    const l2 = this.relativeLuminance(background)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * Checks whether a foreground/background pair meets non-text contrast requirements.
   *
   * For chart segments and similar visual indicators, WCAG non-text guidance typically
   * uses a minimum threshold of 3:1.
   *
   * @param foreground Foreground color to validate.
   * @param background Background color to validate against.
   * @param minRatio Minimum required contrast ratio. Defaults to 3.
   * @returns true when the ratio is greater than or equal to `minRatio`, otherwise false.
   */
  static isAccessibleNonText(foreground: string, background: string, minRatio = 3): boolean {
    return this.contrastRatio(foreground, background) >= minRatio
  }

  /**
   * Returns an accessible color for a given background.
   *
   * The function first tries to keep the original color. If it doesn't meet contrast requirements,
   * it attempts to adjust the lightness while preserving hue to find an accessible shade.
   * Only if adjustment fails does it fall back to predefined candidate colors.
   *
   * @param color Preferred input color.
   * @param background Background color used for contrast validation.
   * @param fallbackCandidates Ordered list of candidate fallback colors.
   * @param minRatio Minimum required contrast ratio. Defaults to 3.
   * @returns The original color (if accessible), an adjusted shade, or a fallback color.
   */
  static ensureAccessible(
    color: string,
    background: string,
    fallbackCandidates: string[] = ['#1f2937', '#0f766e', '#4338ca', '#9a3412'],
    minRatio = 3
  ): string {
    if (this.isParseable(color) && this.isAccessibleNonText(color, background, minRatio)) return color

    if (this.isParseable(color)) {
      const adjusted = this.adjustColorForContrast(color, background, minRatio)
      if (adjusted && this.isAccessibleNonText(adjusted, background, minRatio)) {
        return adjusted
      }
    }

    return (
      fallbackCandidates.find((c) => this.isParseable(c) && this.isAccessibleNonText(c, background, minRatio)) ??
      '#1f2937'
    )
  }

  /**
   * Converts a color to relative luminance according to WCAG.
   *
   * RGB channels are first transformed from sRGB to linear RGB and then combined
   * with luminance coefficients (0.2126, 0.7152, 0.0722).
   *
   * @param color Color in supported string format.
   * @returns Relative luminance in the range [0, 1].
   */
  private static relativeLuminance(color: string): number {
    const { r, g, b } = this.parseColor(color)
    const [rs, gs, bs] = [r, g, b].map((v) => {
      const c = v / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  /**
   * Validates whether a color string can be parsed by this utility.
   *
   * @param color Color string to validate.
   * @returns true if parsing succeeds, otherwise false.
   */
  private static isParseable(color: string): boolean {
    try {
      this.parseColor(color)
      return true
    } catch {
      return false
    }
  }

  /**
   * Parses a color string into numeric RGB channels.
   *
   * Supported formats:
   * - #rgb
   * - #rrggbb
   * - rgb(r, g, b)
   * - rgba(r, g, b, a) (alpha is accepted but ignored for luminance/contrast)
   *
   * @param color Input color string.
   * @returns RGB object with channel values in [0, 255].
   * @throws Error when the format is unsupported.
   */
  private static parseColor(color: string): Rgb {
    const value = color.trim()

    const short = value.match(this.HEX_SHORT)
    if (short) {
      const [r, g, b] = short[1].split('')
      return this.hexToRgb(`#${r}${r}${g}${g}${b}${b}`)
    }

    if (this.HEX_LONG.test(value)) return this.hexToRgb(value)

    const rgb = value.match(this.RGB)
    if (rgb) {
      return {
        r: Math.min(255, Number(rgb[1])),
        g: Math.min(255, Number(rgb[2])),
        b: Math.min(255, Number(rgb[3])),
      }
    }

    throw new Error(`Unsupported color format: ${color}`)
  }

  /**
   * Converts a 6-digit hex color (#rrggbb) into RGB channels.
   *
   * @param hex Hex color string in 6-digit format.
   * @returns RGB object with channel values in [0, 255].
   */
  private static hexToRgb(hex: string): Rgb {
    const n = Number.parseInt(hex.slice(1), 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  }

  /**
   * Adjusts a color's lightness to meet contrast requirements while preserving hue.
   *
   * @param color Original color to adjust.
   * @param background Background color for contrast validation.
   * @param minRatio Minimum required contrast ratio.
   * @returns Adjusted color as hex string, or null if adjustment fails.
   */
  private static adjustColorForContrast(color: string, background: string, minRatio: number): string | null {
    try {
      const rgb = this.parseColor(color)
      const bgLuminance = this.relativeLuminance(background)

      const hsl = this.rgbToHsl(rgb)
      const needsDarker = bgLuminance > 0.5

      for (let i = 1; i <= 20; i++) {
        const adjustedL = needsDarker ? hsl.l - i * 0.05 : hsl.l + i * 0.05

        if (adjustedL < 0 || adjustedL > 1) break

        const adjustedRgb = this.hslToRgb({ h: hsl.h, s: hsl.s, l: adjustedL })
        const adjustedHex = this.rgbToHex(adjustedRgb)

        if (this.isAccessibleNonText(adjustedHex, background, minRatio)) {
          return adjustedHex
        }
      }

      return null
    } catch {
      return null
    }
  }

  /**
   * Converts RGB to HSL color space.
   */
  private static rgbToHsl(rgb: Rgb): { h: number; s: number; l: number } {
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min

    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

      if (max === r) {
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6
      } else if (max === g) {
        h = ((b - r) / delta + 2) / 6
      } else {
        h = ((r - g) / delta + 4) / 6
      }
    }

    return { h, s, l }
  }

  /**
   * Converts HSL to RGB color space.
   */
  private static hslToRgb(hsl: { h: number; s: number; l: number }): Rgb {
    const { h, s, l } = hsl

    if (s === 0) {
      const gray = Math.round(l * 255)
      return { r: gray, g: gray, b: gray }
    }

    const hueToRgb = (p: number, q: number, t: number): number => {
      let tAdjusted = t
      if (tAdjusted < 0) tAdjusted += 1
      if (tAdjusted > 1) tAdjusted -= 1
      if (tAdjusted < 1 / 6) return p + (q - p) * 6 * tAdjusted
      if (tAdjusted < 1 / 2) return q
      if (tAdjusted < 2 / 3) return p + (q - p) * (2 / 3 - tAdjusted) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    return {
      r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hueToRgb(p, q, h) * 255),
      b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
    }
  }

  /**
   * Converts RGB to hex string.
   */
  private static rgbToHex(rgb: Rgb): string {
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
  }
}