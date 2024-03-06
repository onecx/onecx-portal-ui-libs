import { Injectable } from '@angular/core'
import { ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, ParamMap, Router } from '@angular/router'
import { BehaviorSubject, filter } from 'rxjs'
import { BreadCrumbMenuItem } from '../model/breadcrumb-menu-item.model'
import { MenuItem } from 'primeng/api'
import { TranslateService } from '@ngx-translate/core'

@Injectable({ providedIn: 'any' })
export class BreadcrumbService {
  private itemsSource = new BehaviorSubject<MenuItem[]>([])
  generatedItemsSource = new BehaviorSubject<MenuItem[]>([])

  itemsHandler = this.itemsSource.asObservable()

  constructor(private router: Router, private activeRoute: ActivatedRoute, private translateService: TranslateService) {
    const breadcrumbs: MenuItem[] = []
    this.addBreadcrumb(this.activeRoute.snapshot, [], breadcrumbs)
    this.generatedItemsSource.next(breadcrumbs)
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const root = this.router.routerState.snapshot.root
      const breadcrumbs: MenuItem[] = []
      this.addBreadcrumb(root, [], breadcrumbs)

      this.generatedItemsSource.next(breadcrumbs)
    })
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot | null, parentUrl: string[], breadcrumbs: MenuItem[]) {
    if (route && route.url) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path))
      if (route.routeConfig?.path) {
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

      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs)
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
