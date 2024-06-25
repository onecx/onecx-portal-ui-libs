import { Injectable, OnDestroy } from '@angular/core'
import { ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, ParamMap, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, filter } from 'rxjs'
import { MenuItem } from 'primeng/api'
import { BreadCrumbMenuItem } from '../model/breadcrumb-menu-item.model'

@Injectable({ providedIn: 'any' })
export class BreadcrumbService implements OnDestroy {
  private itemsSource = new BehaviorSubject<MenuItem[]>([])
  generatedItemsSource = new BehaviorSubject<MenuItem[]>([])

  itemsHandler = this.itemsSource.asObservable()

  constructor(private router: Router, private activeRoute: ActivatedRoute, private translateService: TranslateService) {
    this.generateBreadcrumbs(this.activeRoute.snapshot)
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const root = this.router.routerState.snapshot.root
      this.generateBreadcrumbs(root)
    })
  }
  ngOnDestroy(): void {
    this.itemsSource.unsubscribe()
    this.generatedItemsSource.unsubscribe()
  }

  private generateBreadcrumbs(route: ActivatedRouteSnapshot | null) {
    if (route && route.url) {
      if (route.data['mfeInfo']) {
        const breadcrumbs: MenuItem[] = [
          {
            label: route.data['mfeInfo'].productName,
            routerLink: route.data['mfeInfo'].baseHref,
          },
        ]
        const baseUrl: string[] = (route.data['mfeInfo'].baseHref as string).split('/').filter((value) => value)
        const parentUrl: string[] = route.url.map((url) => url.path)
        const isUsingMatcher = !parentUrl.every((item) => baseUrl.includes(item))
        if (isUsingMatcher) {
          this.createBreadcrumb(route, parentUrl, breadcrumbs)
        }
        this.addBreadcrumb(route.firstChild, parentUrl, breadcrumbs)
        this.generatedItemsSource.next(breadcrumbs)
      } else {
        this.generateBreadcrumbs(route.firstChild)
      }
    }
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot | null, parentUrl: string[], breadcrumbs: MenuItem[]) {
    if (route && route.url) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path))
      if (route.routeConfig?.path) {
        this.createBreadcrumb(route, routeUrl, breadcrumbs)
      }

      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs)
    }
  }

  private createBreadcrumb(route: ActivatedRouteSnapshot, routeUrl: string[], breadcrumbs: MenuItem[]) {
    if (route.data['breadcrumb']) {
      const breadcrumb: MenuItem = {
        label: this.getLabel(route.data, route.paramMap),
        routerLink: '/' + routeUrl.join('/'),
      }
      breadcrumbs.push(breadcrumb)
    } else {
      const breadcrumb: MenuItem = {
        label: 'NA',
        routerLink: '/' + routeUrl.join('/'),
      }
      breadcrumbs.push(breadcrumb)
    }
  }

  private getLabel(data: Data, params: ParamMap) {
    if (typeof data['breadcrumbFn'] === 'function') {
      return data['breadcrumbFn'](data, params)
    }
    return data['breadcrumb']
  }

  setItems(items: BreadCrumbMenuItem[]) {
    const translationKeys = [
      ...items.map((i) => i.labelKey || '').filter((l) => !!l),
      ...items.map((i) => i.titleKey || '').filter((l) => !!l),
    ]
    if (translationKeys.length) {
      this.translateService.get(translationKeys).subscribe((translations: any) => {
        this.itemsSource.next(
          items.map((i) => ({
            ...i,
            label: translations[i.labelKey || ''] || i.label,
            title: translations[i.titleKey || ''] || i.title,
          }))
        )
      })
    } else {
      this.itemsSource.next(items)
    }
  }
}
