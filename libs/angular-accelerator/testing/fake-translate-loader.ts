import { TranslateLoader, provideTranslateService, TranslationObject } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'

/**
 * This is a workaround for the compatibility issue with ngx-translate-testing v7
 * which uses the deprecated TranslateFakeCompiler that doesn't exist in ngx-translate v17 anymore.
 * 
 * @see https://ngx-translate.org/getting-started/migration-guide/#5-renamed-internal-classes
 * @see https://github.com/mwootendev/ngx-translate-plugins/issues/87
 */
export class FakeTranslateLoader implements TranslateLoader {
  constructor(private readonly translations: { [lang: string]: TranslationObject } = {}) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    return of(this.translations[lang] || {})
  }
}

export function provideTranslateTestingService(translates: Record<string, TranslationObject>) {
  return provideTranslateService({
    loader: { provide: TranslateLoader, useValue: new FakeTranslateLoader(translates) },
  })
}
