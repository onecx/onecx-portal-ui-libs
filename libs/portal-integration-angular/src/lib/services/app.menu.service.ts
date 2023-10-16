import { Inject, Injectable, Optional } from '@angular/core'
import { Router } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { map, Observable, of, shareReplay, Subject } from 'rxjs'
import { PortalMenuItem } from '../model/menu-item.model'
import { ConfigurationService } from './configuration.service'
import { MenuApiService } from './menu-api.service'
import { APP_BASE_HREF, PlatformLocation } from '@angular/common'

@Injectable({ providedIn: 'root' })
export class MenuService {
  private menuSource = new Subject<string>()
  private resetSource = new Subject()
  private menuItems$: Observable<MenuItem[]> | undefined

  menuSource$ = this.menuSource.asObservable()
  resetSource$ = this.resetSource.asObservable()

  constructor(
    private api: MenuApiService,
    private config: ConfigurationService,
    private router: Router,
    private platformLoc: PlatformLocation,
    @Inject(APP_BASE_HREF) @Optional() private baseURL: string
  ) {
    if (!this.baseURL) {
      this.baseURL = this.platformLoc.getBaseHrefFromDOM()
    }
  }

  public init(items: MenuItem[]) {
    this.menuItems$ = of(items)
  }

  onMenuStateChange(key: string) {
    this.menuSource.next(key)
  }

  reset() {
    this.resetSource.next(undefined)
  }

  getMenuItems(forceReload = false): Observable<MenuItem[]> {
    if (!this.menuItems$ || forceReload) {
      const portalId = this.config.getPortalId()
      if (portalId) {
        this.menuItems$ = this.api.getMenuItems(portalId).pipe(
          map((data) => this.constructMenuItems(data)),
          // tap((data) => console.log(`menu tap 1`)),
          shareReplay()
          // tap((data) => console.log(`menu tap 2 ${JSON.stringify(data, null, 2)}`))
        )
      } else {
        console.error('No portal defined - set one in your app configuration')
        return of([])
      }
    }

    return this.menuItems$
  }

  private constructMenuItems(portalMenuItems: PortalMenuItem[]): MenuItem[] {
    const menuItems = portalMenuItems.filter((item) => {
      return item
    })
    if (menuItems) {
      return menuItems
        .sort((a, b) => a.position - b.position)
        .filter((i) => i)
        .map((item) => this.mapMenuItem(item))
    } else {
      return []
    }
  }

  private toRouteUrl(url: string | undefined) {
    if (!url) {
      return url
    }
    if (url?.startsWith('/')) {
      url = url.substring(1)
    }
    if (url.endsWith('/')) {
      url = url.substring(0, url.length - 1)
    }
    return url
  }

  private isLocal(url: string) {
    if (url && url.startsWith('http')) {
      return false
    }
    const path = url?.trim().split('?')[0]
    //route is local if it matches built in routes in our shell
    if (
      this.router.config.some((r) => {
        // console.log(`comparing ${this.toRouteUrl(path)} to ${this.toRouteUrl(this.baseURL + r.path)}`)
        return this.toRouteUrl(path) === this.toRouteUrl(this.baseURL + r.path)
      })
    ) {
      return true
    }

    return false
  }

  // private isLocal(url: string) {
  //   if (url && url.startsWith('http')) {
  //     return false
  //   }
  //   let menuUrl = url?.trim().split('?')[0]
  //   menuUrl = menuUrl?.endsWith('/') ? menuUrl.slice(0, -1) : menuUrl
  //   //route is local if it matches built in routes in our shell

  //   const basePathPrefix = this.baseURL?.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL
  //   if (
  //     this.router.config.some((r) => {
  //       // console.log(
  //       //   `Compare ${basePathPrefix}/${r.path} to ${menuUrl} : result : ` +
  //       //     `${basePathPrefix}/${r.path}`.startsWith(menuUrl)
  //       // )
  //       return `${basePathPrefix}/${r.path}`.startsWith(menuUrl)
  //     })
  //   ) {
  //     return true
  //   }

  //   return false
  // }

  private stripBaseHref(url: string): string {
    if (this.baseURL && url) {
      return url.replace(this.baseURL, '')
    } else {
      return url
    }
  }

  private mapMenuItem(item: PortalMenuItem): MenuItem {
    const isLocal = this.isLocal(item.url)
    const label = item.i18n[this.config.lang] || item.name
    return {
      id: item.key,
      items:
        item.children && item.children.length > 0
          ? item.children
              .sort((a, b) => a.position - b.position)
              .filter((i) => i)
              .map((i) => this.mapMenuItem(i))
          : undefined,
      label,
      icon: item.badge || undefined,
      routerLink: isLocal ? this.stripBaseHref(item.url) : undefined,
      routerLinkActiveOptions: [{ exact: false }],
      url: isLocal ? undefined : item.url,
      badge: isLocal ? 'mf' : 'ext',
    }
  }
}
