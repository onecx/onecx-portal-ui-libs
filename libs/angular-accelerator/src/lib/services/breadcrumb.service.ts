import { Injectable, OnDestroy, inject } from '@angular/core'
import { ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, ParamMap, Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { Topic } from '@onecx/accelerator'
import { MenuItem } from 'primeng/api'
import { BehaviorSubject, filter, map, Observable } from 'rxjs'
import { BreadCrumbMenuItem } from '../model/breadcrumb-menu-item.model'

interface ManualBreadcrumbs {
  menuItems: MenuItem[]
}

// This topic is defined here and not in integration-interface, because
// it is not used as framework independent integration but for improving
// angular specific things
class ManualBreadcrumbsTopic extends Topic<ManualBreadcrumbs> {
  constructor() {
    super('manualBreadcrumbs', 1)
  }
}

@Injectable({ providedIn: 'any' })
@UntilDestroy()
export class BreadcrumbService implements OnDestroy {
  private readonly router = inject(Router)
  private readonly activeRoute = inject(ActivatedRoute)
  private readonly translateService = inject(TranslateService)

  private _itemSource$: ManualBreadcrumbsTopic | undefined
  private get itemsSource$() {
    this._itemSource$ ??= new ManualBreadcrumbsTopic()
    return this._itemSource$
  }
  generatedItemsSource = new BehaviorSubject<MenuItem[]>([])

  _itemsHandler: Observable<MenuItem[]> | undefined
  get itemsHandler() {
    this._itemsHandler ??= this.itemsSource$.pipe(map((manualBreadcrumbs) => manualBreadcrumbs.menuItems))
    return this._itemsHandler
  }

  constructor() {
    this.generateBreadcrumbs(this.activeRoute.snapshot)
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root
        this.generateBreadcrumbs(root)
      })
  }

  ngOnDestroy(): void {
    this._itemSource$?.destroy()
  }

  private generateBreadcrumbs(route: ActivatedRouteSnapshot | null) {
    if (route?.data['mfeInfo']) {
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
    } else if (route?.data['breadcrumb']) {
      const breadcrumbs: MenuItem[] = []
      this.addBreadcrumb(route, [], breadcrumbs)
      this.generatedItemsSource.next(breadcrumbs)
    } else if (route) {
      this.generateBreadcrumbs(route.firstChild)
    }
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot | null, parentUrl: string[], breadcrumbs: MenuItem[]) {
    if (route?.url) {
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
      ...items.map((i) => i.labelKey ?? '').filter((l) => !!l),
      ...items.map((i) => i.titleKey ?? '').filter((l) => !!l),
    ]
    if (translationKeys.length) {
      this.translateService.get(translationKeys).subscribe((translations: any) => {
        this.itemsSource$.publish({
          menuItems: items.map((i) => ({
            ...i,
            label: translations[i.labelKey ?? ''],
            title: translations[i.titleKey ?? ''],
          })),
        })
      })
    } else {
      this.itemsSource$.publish({
        menuItems: items,
      })
    }
  }
}
