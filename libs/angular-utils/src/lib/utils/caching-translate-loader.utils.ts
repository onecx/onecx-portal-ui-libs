import { TranslateLoader, TranslationObject } from '@ngx-translate/core'
import { Observable, retry } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { HttpClient } from '@angular/common/http'

export class CachingTranslateLoader implements TranslateLoader {
  private readonly translateLoader: TranslateHttpLoader

  constructor(
    private translationCache: TranslationCacheService,
    private http: HttpClient,
    private prefix?: string,
    private suffix?: string
  ) {
    this.translateLoader = new TranslateHttpLoader(this.http, this.prefix, this.suffix)
  }

  getTranslation(lang: string): Observable<TranslationObject> {
    const url = `${this.prefix}${lang}${this.suffix}`

    return this.translationCache.getTranslationFile(url, () =>
      this.translateLoader.getTranslation(lang).pipe(retry({ delay: 50, count: 2 }))
    )
  }
}

class TranslateHttpLoader {
  constructor(
    private http: HttpClient,
    private prefix = '/assets/i18n/',
    private suffix = '.json'
  ) {}

  /**
   * Gets the translations from the server
   */
  public getTranslation(lang: string): Observable<TranslationObject> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`) as Observable<TranslationObject>
  }
}
