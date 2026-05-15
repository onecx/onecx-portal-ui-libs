import { getTranslationPathFromMeta, registerPortalPageTranslations } from './translationResources'

describe('getTranslationPathFromMeta', () => {
  it('should throw when metaUrl is undefined', () => {
    expect(() => getTranslationPathFromMeta(undefined)).toThrow('Cannot construct translation path')
  })

  it('should throw when metaUrl starts with file://', () => {
    expect(() => getTranslationPathFromMeta('file:///some/path/module.js')).toThrow('Cannot construct translation path')
  })

  it('should construct path from a valid URL', () => {
    const result = getTranslationPathFromMeta('https://example.com/app/module.js')
    expect(result).toBe('https://example.com/app/assets/i18n/')
  })

  it('should use custom path when provided', () => {
    const result = getTranslationPathFromMeta('https://example.com/app/module.js', 'custom/i18n/')
    expect(result).toBe('https://example.com/app/custom/i18n/')
  })

  it('should add trailing slash to path if missing', () => {
    const result = getTranslationPathFromMeta('https://example.com/app/module.js', 'custom/i18n')
    expect(result).toBe('https://example.com/app/custom/i18n/')
  })
})

describe('registerPortalPageTranslations', () => {
  it('should return early when metaUrl is undefined', () => {
    const instance = { options: {}, services: {} } as any
    registerPortalPageTranslations(instance, undefined)
    expect(instance.options.backend).toBeUndefined()
  })

  it('should return early when metaUrl starts with file://', () => {
    const instance = { options: {}, services: {} } as any
    registerPortalPageTranslations(instance, 'file:///some/path/module.js')
    expect(instance.options.backend).toBeUndefined()
  })

  it('should set backend loadPath on i18n instance', () => {
    const instance = { options: {}, services: { backendConnector: { backend: { options: {} } } } } as any
    registerPortalPageTranslations(instance, 'https://example.com/app/module.js')
    expect(instance.options.backend).toBeDefined()
    expect(instance.options.backend.loadPath).toContain('onecx-react-utils/assets/i18n/')
  })

  it('should merge with existing backend options', () => {
    const instance = {
      options: { backend: { existingOption: true } },
      services: { backendConnector: { backend: { options: {} } } },
    } as any
    registerPortalPageTranslations(instance, 'https://example.com/app/module.js')
    expect(instance.options.backend.existingOption).toBe(true)
    expect(instance.options.backend.loadPath).toBeDefined()
  })
})
