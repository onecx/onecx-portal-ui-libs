import { Inject, Injectable, Optional } from '@angular/core'
import { Router } from '@angular/router'
import { APP_BASE_HREF, PlatformLocation } from '@angular/common'
import { MenuItem } from 'primeng/api'
import { map, Observable, of, shareReplay, Subject, withLatestFrom } from 'rxjs'
import { UserService, ConfigurationService, CONFIG_KEY } from '@onecx/angular-integration-interface'
import { PortalMenuItem } from '../model/menu-item.model'
import { MenuApiService } from './menu-api.service'

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
    @Inject(APP_BASE_HREF) @Optional() private baseURL: string,
    private userService: UserService
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
      const portalId = this.config.getProperty(CONFIG_KEY.TKIT_PORTAL_ID)
      if (portalId) {
        this.menuItems$ = this.api.getMenuItems(portalId).pipe(
          withLatestFrom(this.userService.lang$),
          map(([data, userLang]) => this.constructMenuItems(data, userLang)),
          shareReplay()
        )
      } else {
        console.error('No portal defined - set one in your app configuration')
        return of([])
      }
    }
    return this.menuItems$
  }

  private constructMenuItems(portalMenuItems: PortalMenuItem[], userLang: string): MenuItem[] {
    const menuItems = portalMenuItems.filter((item) => {
      return item
    })
    if (menuItems) {
      return menuItems
        .sort((a, b) => a.position - b.position)
        .filter((i) => i)
        .map((item) => this.mapMenuItem(item, userLang))
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
    if (
      this.router.config.some((r) => {
        return this.toRouteUrl(path) === this.toRouteUrl(this.baseURL + r.path)
      })
    ) {
      return true
    }

    return false
  }

  private stripBaseHref(url: string): string {
    if (this.baseURL && url) {
      return url.replace(this.baseURL, '')
    } else {
      return url
    }
  }

  private mapMenuItem(item: PortalMenuItem, userLang: string): MenuItem {
    const isLocal = this.isLocal(item.url)
    const label = item.i18n[userLang] || item.name
    return {
      id: item.key,
      items:
        item.children && item.children.length > 0
          ? item.children
              .sort((a, b) => a.position - b.position)
              .filter((i) => i)
              .map((i) => this.mapMenuItem(i, userLang))
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
