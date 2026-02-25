import { MULTI_LANGUAGE_IDENTIFIER } from '../injection-tokens/multi-language-identifier'
import { provideMultiLanguageIdentifier } from './multi-language-identifier.provider'

describe('provideMultiLanguageIdentifier', () => {
  it('should create provider with default type when only name is provided', () => {
    const provider = provideMultiLanguageIdentifier('my-app')

    expect(provider).toEqual({
      provide: MULTI_LANGUAGE_IDENTIFIER,
      useValue: {
        name: 'my-app',
        version: undefined,
        type: 'app',
      },
      multi: true,
    })
  })

  it('should create provider with default type when name and version are provided', () => {
    const provider = provideMultiLanguageIdentifier('my-lib', '1.2.3')

    expect(provider).toEqual({
      provide: MULTI_LANGUAGE_IDENTIFIER,
      useValue: {
        name: 'my-lib',
        version: '1.2.3',
        type: 'app',
      },
      multi: true,
    })
  })

  it('should create provider with explicit type', () => {
    const provider = provideMultiLanguageIdentifier('shared-lib', '2.0.0', 'lib')

    expect(provider).toEqual({
      provide: MULTI_LANGUAGE_IDENTIFIER,
      useValue: {
        name: 'shared-lib',
        version: '2.0.0',
        type: 'lib',
      },
      multi: true,
    })
  })
})
