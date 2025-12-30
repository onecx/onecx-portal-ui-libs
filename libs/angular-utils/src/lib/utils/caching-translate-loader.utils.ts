import { TranslateLoader } from '@ngx-translate/core'
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader'
import { Observable, retry } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { Injector, runInInjectionContext } from '@angular/core'

export class CachingTranslateLoader implements TranslateLoader {
  private readonly translateLoader: TranslateHttpLoader

  constructor(
    private readonly translationCache: TranslationCacheService,
    private readonly injector: Injector,
    private readonly prefix?: string,
    private readonly suffix?: string
  ) {
    this.translateLoader = runInInjectionContext(
      Injector.create({
        providers: [{ provide: TRANSLATE_HTTP_LOADER_CONFIG, useValue: { resources: [{ prefix, suffix }] } }],

        parent: this.injector,
      }),
      () => new TranslateHttpLoader()
    )
  }

  getTranslation(lang: string): Observable<any> {
    const url = `${this.prefix}${lang}${this.suffix}`

    return this.translationCache.getTranslationFile(url, () =>
      this.translateLoader.getTranslation(lang).pipe(retry({ delay: 50, count: 2 }))
    )
  }
}
