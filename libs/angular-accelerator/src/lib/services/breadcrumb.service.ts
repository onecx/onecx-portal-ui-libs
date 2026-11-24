import { Injectable, OnDestroy, inject } from '@angular/core'
import { ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, ParamMap, Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { Topic } from '@onecx/accelerator'
import { MenuItem } from '@openng/optimus-ui/api'
import { BehaviorSubject, filter, map, merge, Observable, Subscription } from 'rxjs'
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
  private set itemsSource$(source: ManualBreadcrumbsTopic) {
    this._itemSource$ = source
  }
  private pendingTranslation: Subscription | undefined
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
        this.generateBreadcrumbs(this.router.routerState.snapshot.root)
      })
    // translations may be loaded or merged after the route was resolved
    merge(this.translateService.onLangChange, this.translateService.onTranslationChange)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.generateBreadcrumbs(this.router.routerState.snapshot.root)
      })
  }

  ngOnDestroy(): void {
    this.pendingTranslation?.unsubscribe()
    this._itemSource$?.destroy()
  }

  private generateBreadcrumbs(route: ActivatedRouteSnapshot | null) {
    if (route?.data['mfeInfo']) {
      const breadcrumbs: MenuItem[] = []
      const mfeInfo = route.data['mfeInfo']
      const productLabel = this.toLabel(mfeInfo.displayName || mfeInfo.productName)
      if (productLabel) {
        breadcrumbs.push({ label: productLabel, routerLink: route.data['mfeInfo'].baseHref })
      }
      const baseUrl: string[] = (route.data['mfeInfo'].baseHref as string).split('/').filter((value) => value)
      const parentUrl: string[] = route.url.map((url) => url.path)
      const isUsingMatcher = !parentUrl.every((item) => baseUrl.includes(item))
      if (isUsingMatcher) {
        this.createBreadcrumb(route, parentUrl, breadcrumbs)
      }
      this.addBreadcrumb(route.firstChild, parentUrl, breadcrumbs)
      this.publish(breadcrumbs)
    } else if (route?.data['breadcrumb']) {
      const breadcrumbs: MenuItem[] = []
      this.addBreadcrumb(route, [], breadcrumbs)
      this.publish(breadcrumbs)
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
    // Routes without breadcrumb data have no meaningful name, so they are left out instead of showing a placeholder
    if (route.data['breadcrumb']) {
      const breadcrumb: MenuItem = {
        label: this.toLabel(this.getLabel(route.data, route.paramMap)),
        routerLink: '/' + routeUrl.join('/'),
      }
      breadcrumbs.push(breadcrumb)
    }
  }

  private toLabel(label: unknown): string | undefined {
    return typeof label === 'string' && label ? label : undefined
  }

  /** Emits the breadcrumbs once their labels are translated; a newer call supersedes a pending one. */
  private publish(breadcrumbs: MenuItem[]) {
    this.pendingTranslation?.unsubscribe()
    const labels = [...new Set(breadcrumbs.map((item) => item.label).filter((label): label is string => !!label))]
    if (!labels.length) {
      this.generatedItemsSource.next(breadcrumbs)
      return
    }
    this.pendingTranslation = this.translateService.get(labels).subscribe((translations: Record<string, unknown>) => {
      this.generatedItemsSource.next(
        breadcrumbs.map((item) => {
          const translated = translations[item.label as string]
          return typeof translated === 'string' ? { ...item, label: translated } : item
        })
      )
    })
  }

  private getLabel(data: Data, params: ParamMap) {
    if (typeof data['breadcrumbFn'] === 'function') {
      return data['breadcrumbFn'](data, params)
    }
    return data['breadcrumb']
  }

  /**
   * Sets manual breadcrumb items. The last item should target the current route:
   * aria-current="page" is only set on a routerLink crumb whose routerLink matches the current URL.
   */
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
