import { TranslateLoader } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { AsyncTranslateLoader } from './async-translate-loader.utils'

describe('AsyncTranslateLoader', () => {
  class FakeTranslateLoader implements TranslateLoader {
    public lastLanguage: string | undefined
    constructor(private result: any) {}

    getTranslation(lang: string): Observable<any> {
      this.lastLanguage = lang
      return of(this.result)
    }
  }

  it('should get translations', (done) => {
    const translations = 'my translations'
    const translateLoader = new FakeTranslateLoader(translations)
    const translateLoader$ = of(translateLoader)

    expect(translateLoader.lastLanguage).toBeUndefined()

    const asyncTranslateLoader = new AsyncTranslateLoader(translateLoader$)
    asyncTranslateLoader.getTranslation('en').subscribe((t) => {
      expect(t).toEqual(translations)
      expect(translateLoader.lastLanguage).toEqual('en')
      done()
    })
  })
})
