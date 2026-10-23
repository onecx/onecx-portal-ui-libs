import {
  contrastRatio,
  ensureGraphicsContrast,
  getThemeColor,
  MIN_GRAPHICS_CONTRAST,
  parseColor,
} from './diagram-contrast-utils'

describe('diagram-contrast-utils', () => {
  describe('parseColor', () => {
    it('should parse short and long hex colors', () => {
      expect(parseColor('#fff')).toEqual([255, 255, 255])
      expect(parseColor('#1E1e1e')).toEqual([30, 30, 30])
    })

    it('should parse rgb and rgba colors', () => {
      expect(parseColor('rgb(1, 2, 3)')).toEqual([1, 2, 3])
      expect(parseColor('rgba(10 20 30 / 50%)')).toEqual([10, 20, 30])
    })

    it('should return undefined for other formats', () => {
      expect(parseColor('red')).toBeUndefined()
      expect(parseColor('')).toBeUndefined()
    })
  })

  describe('contrastRatio', () => {
    it('should follow the WCAG formula', () => {
      expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21)
      expect(contrastRatio([255, 255, 255], [0, 0, 0])).toBeCloseTo(21)
      expect(contrastRatio([118, 118, 118], [255, 255, 255])).toBeCloseTo(4.54, 2)
    })
  })

  describe('ensureGraphicsContrast', () => {
    it('should keep colors that already reach 3:1', () => {
      expect(ensureGraphicsContrast('#0000ff', '#ffffff', '#000000')).toBe('#0000ff')
    })

    it('should mix too light colors towards the contrast color until they reach 3:1', () => {
      const result = ensureGraphicsContrast('#6efa96', '#ffffff', '#212529')

      expect(result).toMatch(/^rgb\(/)
      expect(contrastRatio(parseColor(result) as [number, number, number], [255, 255, 255])).toBeGreaterThanOrEqual(
        MIN_GRAPHICS_CONTRAST
      )
    })

    it('should stop after fully mixing when the contrast color cannot reach 3:1', () => {
      expect(ensureGraphicsContrast('#ffffff', '#ffffff', '#eeeeee')).toBe('rgb(238, 238, 238)')
    })

    it('should return the color unchanged when a color cannot be parsed', () => {
      expect(ensureGraphicsContrast('red', '#ffffff', '#000000')).toBe('red')
      expect(ensureGraphicsContrast('#ffffff', '', '#000000')).toBe('#ffffff')
      expect(ensureGraphicsContrast('#ffffff', '#ffffff', '')).toBe('#ffffff')
    })
  })

  describe('getThemeColor', () => {
    it('should read a trimmed theme variable', () => {
      document.documentElement.style.setProperty('--content-bg-color', ' #123456 ')
      expect(getThemeColor('--content-bg-color')).toBe('#123456')
      document.documentElement.style.removeProperty('--content-bg-color')
      expect(getThemeColor('--content-bg-color')).toBe('')
    })
  })
})
