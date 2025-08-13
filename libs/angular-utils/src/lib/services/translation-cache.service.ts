import { Injectable, OnDestroy } from '@angular/core'
import { Observable, catchError, filter, first, map, of, tap } from 'rxjs'
import { Topic } from '@onecx/accelerator'

// This topic is defined here and not in integration-interface, because
// it is not used as framework independent integration but for improving
// angular specific things
class TranslationCacheTopic extends Topic<string> {
  constructor() {
    super('translationCache', 2)
  }
}

declare global {
  interface Window {
    onecxTranslations: Record<string, any>
  }
}

@Injectable({ providedIn: 'root' })
export class TranslationCacheService implements OnDestroy {
  private translationTopic$ = new TranslationCacheTopic()
  constructor() {
    window['onecxTranslations'] ??= {}
  }
  ngOnDestroy(): void {
    this.translationTopic$.destroy()
  }

  /**
   * Retrieves a translation file from the cache or fetches it if not available.
   *
   * This method checks if the translation file is already cached in `window['onecxTranslations']`.
   * If it is, it returns the cached version. If not, it calls the provided `cacheMissFunction`
   * to fetch the translation file and caches it for future use.
   *
   * If the requested translation file is null, it waits for the translation topic to be published by a different application.
   *
   * In case of failed load, it logs an error, deletes the entry from the cache, and publishes the URL to notify other subscribers about the failure.
   * @param url
   * @param cacheMissFunction
   * @returns
   */
  getTranslationFile(url: string, cacheMissFunction: () => Observable<any>): Observable<any> {
    if (window['onecxTranslations'][url]) {
      return of(window['onecxTranslations'][url])
    }

    if (window['onecxTranslations'][url] === null) {
      return this.translationTopic$.pipe(
        filter((messageUrl) => messageUrl === url),
        map(() => window['onecxTranslations'][url] ?? {}),
        first()
      )
    }

    window['onecxTranslations'][url] = null
    return cacheMissFunction().pipe(
      tap((t) => {
        window['onecxTranslations'][url] = t
        this.translationTopic$.publish(url)
      }),
      map(() => window['onecxTranslations'][url]),
      catchError(() => {
        console.error(`Failed to load translation file: ${url}`)
        delete window['onecxTranslations'][url]
        this.translationTopic$.publish(url)
        return of({})
      }),
      first()
    )
  }
}
