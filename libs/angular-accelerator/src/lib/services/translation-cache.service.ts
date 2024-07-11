import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, Observable, filter, first, map, of, race, tap, withLatestFrom } from 'rxjs'
import { SyncableTopic } from '@onecx/accelerator'

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
  private id = ''
  private translationTopic$ = new TranslationCacheTopic()
  private translations$ = new BehaviorSubject<any>({})
  constructor() {
    this.translationTopic$
      .pipe(
        filter((message) => message['id'] === this.id),
        withLatestFrom(this.translations$),
        map(([topicTranslations, translations]) => {
          let foundValueOthersDoNotKnow = false
          const newTranslations = { ...translations }
          Object.keys(topicTranslations).forEach((k) => {
            if (!topicTranslations[k] && translations[k] && k !== this.id) {
              foundValueOthersDoNotKnow = true
            }
            newTranslations[k] ??= topicTranslations[k]
          })
          return [newTranslations, foundValueOthersDoNotKnow]
        }),
        tap(([newTranslations, foundValueOthersDoNotKnow]) => {
          if (foundValueOthersDoNotKnow) {
            this.translationTopic$.publish(newTranslations)
          }
        }),
        map(([newTranslations]) => newTranslations)
      )
      .subscribe(this.translations$)
  }
  ngOnDestroy(): void {
    this.translationTopic$.destroy()
  }

  setId(id: string) {
    this.id = 'translation-'.concat(id)
  }

  getTranslationFile(url: string, cacheMissFunction: () => Observable<any>): Observable<any> {
    if (this.translations$.value[url]) {
      return of(this.translations$.value[url])
    }
    this.translationTopic$.publish({ ...this.translations$.value, [url]: null, id: this.id })
    return race(
      this.translations$.pipe(
        filter((t) => t[url]),
        map((t) => t[url])
      ),
      cacheMissFunction().pipe(
        tap((t) => {
          this.translationTopic$.publish({ ...this.translations$.value, [url]: t, id: this.id })
        })
      )
    ).pipe(first())
  }
}
