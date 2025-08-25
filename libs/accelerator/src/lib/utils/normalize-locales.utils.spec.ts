import { normalizeLocales } from './normalize-locales.utils'

describe('normalizeLocales', () => {
  it('should return an empty array if input is undefined', () => {
    expect(normalizeLocales(undefined)).toEqual([])
  })

  it('should return an empty array if input is an empty array', () => {
    expect(normalizeLocales([])).toEqual([])
  })

  it('should return array with all locales and their general versions', () => {
    const input = ['en-US', 'fr-FR']
    expect(normalizeLocales(input)).toEqual(['en-US', 'en', 'fr-FR', 'fr'])
  })

  it('should handle locales with different separators', () => {
    const input = ['en_US', 'fr-FR']
    expect(normalizeLocales(input)).toEqual(['en_US', 'en', 'fr-FR', 'fr'])
  })

  it('should handle single language codes', () => {
    const input = ['en', 'fr']
    expect(normalizeLocales(input)).toEqual(['en', 'fr'])
  })

  it('should extend locales only if general locale not present in the array already', () => {
    const input = ['en-US', 'de-DE', 'en-GB', 'en']
    expect(normalizeLocales(input)).toEqual(['en-US', 'de-DE', 'de', 'en-GB', 'en'])
  })
})
