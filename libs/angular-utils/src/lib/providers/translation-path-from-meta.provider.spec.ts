import { TRANSLATION_PATH } from '../injection-tokens/translation-path'
import { provideTranslationPathFromMeta } from './translation-path-from-meta.providers'
import { isTest } from '@onecx/accelerator'

// Mock the isTest function and Topic class
jest.mock('@onecx/accelerator', () => ({
  isTest: jest.fn(),
  Topic: class MockTopic {},
}))

const mockIsTest = isTest as jest.MockedFunction<typeof isTest>

describe('provideTranslationPathFromMeta', () => {
  beforeEach(() => {
    mockIsTest.mockReset()
    // Default to non-test environment
    mockIsTest.mockReturnValue(false)
  })

  it('should remove file name and append custom path', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url, 'assets/pathName/')
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/',
      multi: true,
    })
  })

  it('should default to /i18n/ if path is undefined', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url)
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/i18n/',
      multi: true,
    })
  })

  it('should handle URLs with no file name', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/'
    const provider = provideTranslationPathFromMeta(url, 'assets/pathName/')
    expect(provider).toEqual(
      expect.objectContaining({ useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/' })
    )
  })

  it('should throw error for local file URLs', () => {
    mockIsTest.mockReturnValue(false)
    expect(() => {
      provideTranslationPathFromMeta('file:///some/local/file.js', 'assets/i18n/')
    }).toThrow(
      'Cannot construct translation path from local file path. Please check whether the webpack configuration for importMeta is correct: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta'
    )
  })

  it('should add trailing slash if path does not end with slash', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url, 'assets/i18n')
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/i18n/',
      multi: true,
    })
  })

  it('should return relative path for local file URLs in test environment', () => {
    mockIsTest.mockReturnValue(true)
    const provider = provideTranslationPathFromMeta('file:///some/local/file.js', 'assets/i18n/')

    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'assets/i18n/',
      multi: true,
    })
  })

  it('should return relative path for undefined URL in test environment', () => {
    mockIsTest.mockReturnValue(true)
    const provider = provideTranslationPathFromMeta(undefined, 'assets/i18n/')

    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'assets/i18n/',
      multi: true,
    })
  })
})
