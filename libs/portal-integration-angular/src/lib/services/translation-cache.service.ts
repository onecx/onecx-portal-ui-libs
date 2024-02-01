import { Injectable, OnDestroy } from '@angular/core'
import { SyncableTopic } from '@onecx/accelerator'
import { Observable, concat, first, from, map, mergeMap, of } from 'rxjs'

// This topic is defined here and not in integration-interface, because
// it is not used as framework independent integration but for improving
// angular specific things
class TranslationCacheTopic extends SyncableTopic<Record<string, any>> {
  constructor() {
    super('translationCache', 1)
  }
}

@Injectable({ providedIn: 'root' })
export class TranslationCacheService implements OnDestroy {
  translationCache$ = new TranslationCacheTopic()

  constructor() {}

  ngOnDestroy(): void {
    this.translationCache$.destroy()
  }

  getTranslationFile(url: string): Observable<any> {
    return this.getCache().pipe(map((t) => t[url]))
  }

  updateTranslationFile(url: string, translations: any): Observable<any> {
    return this.getCache().pipe(
      first(),
      mergeMap((t) => {
        return from(this.translationCache$.publish({ ...t, [url]: translations })).pipe(map(() => translations))
      })
    )
  }

  private getCache(): Observable<Record<string, any>> {
    if (this.translationCache$.getValue()) {
      return this.translationCache$.asObservable()
    }
    return concat(of({}), this.translationCache$.asObservable())
  }
}
