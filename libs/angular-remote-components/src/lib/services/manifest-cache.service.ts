import { Injectable, OnDestroy, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, catchError, filter, first, map, of, tap } from 'rxjs'
import { Topic } from '@onecx/accelerator'
import { createLogger } from '../utils/logger.utils'
import { Manifest } from '../model/manifest'

const logger = createLogger('ManifestCacheService')

class ManifestCacheTopic extends Topic<string> {
  constructor() {
    super('manifestCache', 1)
  }
}

declare global {
  interface Window {
    onecxManifests: Record<string, Manifest | null>
  }
}

@Injectable({ providedIn: 'root' })
export class ManifestCacheService implements OnDestroy {
  private http = inject(HttpClient)
  private _manifestTopic$: ManifestCacheTopic | undefined

  get manifestTopic$() {
    this._manifestTopic$ ??= new ManifestCacheTopic()
    return this._manifestTopic$
  }

  set manifestTopic$(source: ManifestCacheTopic) {
    this._manifestTopic$ = source
  }

  constructor() {
    window['onecxManifests'] ??= {}
  }

  ngOnDestroy(): void {
    this._manifestTopic$?.destroy()
  }

  getManifest(url: string): Observable<Manifest | {}> {
    if (window['onecxManifests'][url]) {
      return of(window['onecxManifests'][url])
    }

    if (window['onecxManifests'][url] === null) {
      return this.manifestTopic$.pipe(
        filter((messageUrl) => messageUrl === url),
        map(() => window['onecxManifests'][url] ?? {}),
        first()
      )
    }

    window['onecxManifests'][url] = null
    return this.http.get<Manifest>(url).pipe(
      tap((m) => {
        window['onecxManifests'][url] = m
        this.manifestTopic$.publish(url)
      }),
      catchError((error) => {
        logger.error(`Failed to load manifest file: ${url}`, error)
        delete window['onecxManifests'][url]
        this.manifestTopic$.publish(url)
        return of({})
      }),
      first()
    )
  }
}
