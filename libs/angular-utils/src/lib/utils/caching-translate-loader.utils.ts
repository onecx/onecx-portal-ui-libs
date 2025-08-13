import { HttpClient } from '@angular/common/http'
import { TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { Observable, retry } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'

export class CachingTranslateLoader implements TranslateLoader {
  private translateLoader: TranslateHttpLoader

  constructor(
    private translationCache: TranslationCacheService,
    private http: HttpClient,
    private prefix?: string,
    private suffix?: string
  ) {
    this.translateLoader = new TranslateHttpLoader(this.http, this.prefix, this.suffix)
  }

  getTranslation(lang: string): Observable<any> {
    const url = `${this.prefix}${lang}${this.suffix}`

    return this.translationCache.getTranslationFile(url, () =>
      this.translateLoader.getTranslation(lang).pipe(retry({ delay: 50, count: 2 }))
    )
  }
}
