import { normalizeHref, removeTrailingSlash } from './href.utils'

describe('href utils', () => {
  describe('removeTrailingSlash', () => {
    it('removes a trailing slash when present', () => {
      expect(removeTrailingSlash('/app/')).toBe('/app')
    })

    it('keeps string when no trailing slash', () => {
      expect(removeTrailingSlash('/app')).toBe('/app')
    })
  })

  describe('normalizeHref', () => {
    it('handles empty app base href and base href', () => {
      expect(normalizeHref('', '')).toBe('')
    })

    it('combines app base href with leading/trailing slashes', () => {
      expect(normalizeHref('/app/', '/mfe')).toBe('/app/mfe')
    })

    it('drops trailing slash when base href is empty', () => {
      expect(normalizeHref('/app', '')).toBe('/app')
    })
  })
})
