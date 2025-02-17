export interface ColorAdjustment {
  [key: number]: number
}

export const standardColorAdjustment: ColorAdjustment = {
  50: 210,
  100: 195,
  200: 150,
  300: 98,
  400: 20,
  500: 0,
  600: -25,
  700: -65,
  800: -80,
  900: -110,
  950: -140,
}

/**
 * Adjusts the color by lightening or darkening it based on the provided offset.
 *
 * @param {string} color - A string representing the color in hexadecimal format (e.g., "#RRGGBB").
 * @param {number} channelOffset - A number indicating how much to lighten or darken the color.
 *                                 Positive values lighten the color, while negative values darken it.
 *                                 Valid values range from -255 to 255.
 * @returns {string} - The adjusted color in hexadecimal format.
 */
export function adjustColor(color: string, channelOffSet: number): string {
  let colorBeginsWithHash = false

  if (color[0] === '#') {
    color = color.slice(1)
    colorBeginsWithHash = true
  }

  let num = parseInt(color, 16)

  let r = (num >> 16) + channelOffSet
  if (r > 255) r = 255
  else if (r < 0) r = 0

  let g = ((num >> 8) & 0x00ff) + channelOffSet
  if (g > 255) g = 255
  else if (g < 0) g = 0

  let b = (num & 0x0000ff) + channelOffSet
  if (b > 255) b = 255
  else if (b < 0) b = 0

  return (colorBeginsWithHash ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

export function createPalette(primaryColor: string, adjustments: ColorAdjustment): { [key: number]: string } {
  const palette: { [key: number]: string } = {}
  Object.keys(adjustments).forEach((key) => {
    const entry = parseInt(key, 10)
    palette[entry] = adjustColor(primaryColor, adjustments[entry])
  })
  return palette
}

/**
 * Calculates the Euclidean distance between two colors in RGB space.
 *
 * @param {string} color1 - A string representing the first color in hexadecimal format (e.g., "#RRGGBB").
 * @param {string} color2 - A string representing the second color in hexadecimal format (e.g., "#RRGGBB").
 * @returns {number} - The Euclidean distance between the two colors.
 */
export function colorDelta(color1: string, color2: string): number {
  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    let color = hex.startsWith('#') ? hex.slice(1) : hex
    let bigint = parseInt(color, 16)
    let r = (bigint >> 16) & 255
    let g = (bigint >> 8) & 255
    let b = bigint & 255
    return { r, g, b }
  }

  let rgb1 = hexToRgb(color1)
  let rgb2 = hexToRgb(color2)

  let delta = Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2))

  return delta
}
