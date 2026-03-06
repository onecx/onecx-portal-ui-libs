import { Injectable, OnDestroy, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, catchError, filter, first, map, of, tap } from 'rxjs'
import { Topic, ensureProperty } from '@onecx/accelerator'
import { createLogger } from '../utils/logger.utils'
import { Manifest } from '../model/manifest'

const logger = createLogger('ManifestCacheService')

class ManifestCacheTopic extends Topic<{
  url: string
}> {
  constructor() {
    super('manifestCache', 1)
  }
}

declare global {
  interface Window {
    onecxManifests: Record<string, Manifest | undefined | null>
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

  cache = ensureProperty(globalThis, ['onecxManifests'], {} as Record<string, Manifest | undefined | null>)[
    'onecxManifests'
  ]

  ngOnDestroy(): void {
    this._manifestTopic$?.destroy()
  }

  getManifest(url: string): Observable<Manifest | {}> {
    // If value is !undefined, it means the manifest has already been loaded (successfully or with error)
    if (this.cache[url] !== undefined) {
      return of(this.cache[url] ?? {})
    }

    // If someone is already loading the manifest, we wait for the result instead of triggering another HTTP request
    if (url in this.cache && this.cache[url] === undefined) {
      return this.manifestTopic$.pipe(
        filter((message) => message.url === url),
        map(() => this.cache[url] ?? {}),
        first()
      )
    }

    // If manifest is not in cache and not currently being loaded, we trigger the HTTP request to load it and store the result in cache (or store null in case of error)
    this.cache[url] = undefined
    return this.http.get<Manifest>(url).pipe(
      tap((m) => {
        this.cache[url] = m
        this.manifestTopic$.publish({ url })
      }),
      catchError((error) => {
        logger.error(`Failed to load manifest file: ${url}`, error)
        this.cache[url] = null
        this.manifestTopic$.publish({ url })
        return of({})
      }),
      first()
    )
  }
}
