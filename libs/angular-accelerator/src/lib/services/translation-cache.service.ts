import { Injectable, OnDestroy } from '@angular/core'
import { Observable, filter, first, map, of, tap } from 'rxjs'
import { SyncableTopic } from '@onecx/accelerator'

// This topic is defined here and not in integration-interface, because
// it is not used as framework independent integration but for improving
// angular specific things
class TranslationCacheTopic extends SyncableTopic<string> {
  constructor() {
    super('translationCache', 2)
  }
}

declare global {
  interface Window {
    onecxTranslations: Record<string, any>
  }
}

/**
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
@Injectable({ providedIn: 'root' })
export class TranslationCacheService implements OnDestroy {
  private translationTopic$ = new TranslationCacheTopic()
  constructor() {
    window['onecxTranslations'] ??= {}
  }
  ngOnDestroy(): void {
    this.translationTopic$.destroy()
  }

  getTranslationFile(url: string, cacheMissFunction: () => Observable<any>): Observable<any> {
    if (window['onecxTranslations'][url]) {
      return of(window['onecxTranslations'][url])
    }

    if (window['onecxTranslations'][url] === null) {
      return this.translationTopic$.pipe(
        filter((messageUrl) => messageUrl === url),
        map(() => window['onecxTranslations'][url]),
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
      first()
    )
  }
}
