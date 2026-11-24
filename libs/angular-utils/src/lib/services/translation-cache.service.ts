import { Injectable, OnDestroy } from '@angular/core'
import { Observable, catchError, filter, first, map, of, tap } from 'rxjs'
import { Topic } from '@onecx/accelerator'
import { createLogger } from '../utils/logger.utils'

const logger = createLogger('TranslationCacheService')

// This topic is defined here and not in integration-interface, because
// it is not used as framework independent integration but for improving
// angular specific things
class TranslationCacheTopic extends Topic<string> {
  constructor() {
    super('translationCache', 2)
  }
}

// Reserved failure marker key (ADR 0001): a translation file that failed to load with a
// definitive 404 (the file does not exist) is stored in the shared translation cache as
// `{ __onecxTranslationLoadFailed: true }` instead of being deleted, so no app on the page
// requests the missing file again until the page is reloaded. A transient failure (5xx,
// timeout, network) does NOT write the marker: the entry is left deleted so a later request
// re-fetches and can recover within the page session.
//
// The key is a contract between apps on the same page and must not be renamed: apps
// may bundle different library versions, and older versions treat any truthy cache
// entry as a loaded translation file, so the object shape is harmless to them.
const FAILURE_MARKER_KEY = '__onecxTranslationLoadFailed'

const isFailureMarker = (entry: any): boolean =>
  entry != null && entry[FAILURE_MARKER_KEY] === true

declare global {
  interface Window {
    onecxTranslations: Record<string, any>
  }
}

@Injectable({ providedIn: 'root' })
export class TranslationCacheService implements OnDestroy {
  private _translationTopic$: TranslationCacheTopic | undefined
  get translationTopic$() {
    this._translationTopic$ ??= new TranslationCacheTopic()
    return this._translationTopic$
  }
  set translationTopic$(source: TranslationCacheTopic) {
    this._translationTopic$ = source
  }
  constructor() {
    window['onecxTranslations'] ??= {}
  }
  ngOnDestroy(): void {
    this._translationTopic$?.destroy()
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
   * If the translation file previously failed to load with a definitive 404, the cache entry
   * is a failure marker (`{ __onecxTranslationLoadFailed: true }`): requests for the URL then
   * immediately return an empty translation set without issuing a request, until the page is
   * reloaded. A transient failure (5xx, timeout, network) leaves the entry deleted instead, so
   * a later request re-fetches and can recover within the page session.
   *
   * In case of a definitive not-found failure it logs an error, writes the failure marker to the
   * cache, and publishes the URL to notify other subscribers about the failure. In case of any
   * other failure it logs the error, deletes the entry (so the URL can be retried), and publishes
   * the URL as well. Callers already waiting for the URL always finish with an empty translation set.
   * @param url
   * @param cacheMissFunction
   * @returns
   */
  getTranslationFile(url: string, cacheMissFunction: () => Observable<any>): Observable<any> {
    if (isFailureMarker(window['onecxTranslations'][url])) {
      return of({})
    }

    if (window['onecxTranslations'][url]) {
      return of(window['onecxTranslations'][url])
    }

    if (window['onecxTranslations'][url] === null) {
      return this.translationTopic$.pipe(
        filter((messageUrl) => messageUrl === url),
        map(() => (isFailureMarker(window['onecxTranslations'][url]) ? {} : window['onecxTranslations'][url] ?? {})),
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
      catchError((error) => {
        logger.error(`Failed to load translation file: ${url}`)
        if (error.status === 404) {
          // Definitive not-found: no app on the page will request this URL again until the page
          // is reloaded, so a missing file is not requested over and over.
          window['onecxTranslations'][url] = { [FAILURE_MARKER_KEY]: true }
        } else {
          // Transient failure (5xx, timeout, network error, ...): leave the entry deleted so a
          // later request re-fetches and can recover within the page session.
          delete window['onecxTranslations'][url]
        }
        this.translationTopic$.publish(url)
        return of({})
      }),
      first()
    )
  }
}
