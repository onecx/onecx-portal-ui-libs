import { isStyleSheet } from './is-file-style-sheet.utils'

describe('is-file-style-sheet.utils', () => {
  describe('isStyleSheet', () => {
    it('should return true for CSS files', () => {
      expect(isStyleSheet('styles.css')).toBe(true)
      expect(isStyleSheet('src/app/component.css')).toBe(true)
    })

    it('should return true for SCSS files', () => {
      expect(isStyleSheet('styles.scss')).toBe(true)
      expect(isStyleSheet('src/app/component.scss')).toBe(true)
    })

    it('should return false for non-stylesheet files', () => {
      expect(isStyleSheet('component.ts')).toBe(false)
      expect(isStyleSheet('template.html')).toBe(false)
      expect(isStyleSheet('data.json')).toBe(false)
    })

    it('should be case sensitive', () => {
      expect(isStyleSheet('styles.CSS')).toBe(false)
      expect(isStyleSheet('styles.SCSS')).toBe(false)
    })

    it('should handle empty string', () => {
      expect(isStyleSheet('')).toBe(false)
    })

    it('should handle files with only extension', () => {
      expect(isStyleSheet('.css')).toBe(true)
      expect(isStyleSheet('.scss')).toBe(true)
      expect(isStyleSheet('.js')).toBe(false)
    })
  })
})
