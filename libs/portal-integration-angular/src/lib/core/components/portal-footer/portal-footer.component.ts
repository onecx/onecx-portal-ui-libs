import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { combineLatest, concat, map, Observable, of, withLatestFrom } from 'rxjs'
import { MenuItem } from 'primeng/api'
import { AppStateService, ConfigurationService, ThemeService, CONFIG_KEY } from '@onecx/angular-integration-interface'
import { MenuService } from '../../../services/app.menu.service'
import { API_PREFIX } from '../../../api/constants'
import { ImageLogoUrlUtils } from '../../utils/image-logo-url.utils'
@Component({
  selector: 'ocx-footer',
  templateUrl: './portal-footer.component.html',
  styleUrls: ['./portal-footer.component.scss'],
})
export class PortalFooterComponent implements OnInit {
  copyrightMsg$: Observable<string> | undefined
  logoUrl$: Observable<string | undefined>
  currentYear = new Date().getFullYear()
  portalMenuItems: MenuItem[] = []
  versionInfo$: Observable<string | undefined>
  apiPrefix: string = API_PREFIX

  constructor(
    private configurationService: ConfigurationService,
    public router: Router,
    private appState: AppStateService,
    private menuService: MenuService,
    private themeService: ThemeService,
    private ref: ChangeDetectorRef
  ) {
    this.versionInfo$ = this.appState.currentMfe$.pipe(
      withLatestFrom(this.appState.currentPortal$.asObservable()),
      map(([mfe, portal]) => {
        const mfeInfoVersion = mfe?.version || ''
        const mfeName = mfe?.displayName
        const hostVersion = this.configurationService.getProperty(CONFIG_KEY.APP_VERSION) || 'DEV-LOCAL'
        const mfInfoText = mfeName ? `MF ${mfeName} v${mfeInfoVersion}` : ''
        return `Portal: ${portal.portalName} v${hostVersion} ${mfInfoText}`
      })
    )
    this.logoUrl$ = combineLatest([
      this.themeService.currentTheme$.asObservable(),
      this.appState.currentPortal$.asObservable(),
    ]).pipe(map(([theme, portalData]) => ImageLogoUrlUtils.createLogoUrl(API_PREFIX, theme.logoUrl || portalData.logoUrl)))
  }
  ngOnInit(): void {
    this.copyrightMsg$ = concat(
      of('All rights reserved.'),
      this.appState.currentPortal$.pipe(
        map((portalData) => {
          if (
            !(
              portalData.footerLabel === '' ||
              portalData.footerLabel === 'string' ||
              portalData.footerLabel === undefined
            )
          ) {
            return portalData.companyName || portalData.footerLabel || 'All rights reserved.'
          }
          return ''
        })
      )
    )

    this.menuService
      .getMenuItems()
      .subscribe((el) =>
        el.find((item) => (item.id === 'PORTAL_FOOTER_MENU' ? this.createMenu(item as MenuItem) : null))
      )
  }
  public onErrorHandleSrc(): void {
    this.logoUrl$ = of(undefined)
  }
  private createMenu(menuItem: MenuItem): void {
    if (menuItem && menuItem.items) {
      this.portalMenuItems = menuItem.items
        .sort((a: any, b: any) => a.position - b.position)
        .filter((m: any, i) => {
          if (i < 4) return m // max 4 entries in footer
        })
        .map((item: MenuItem) => {
          return item
        })
      this.ref.detectChanges()
    } else {
      this.portalMenuItems = []
    }
  }

  private setImageUrl(url?: string): string | undefined {
    //if the url is from the backend, then we insert the apiPrefix
    if (url && !url.match(/^(http|https)/g)) {
      return this.apiPrefix + url
    } else {
      return url
    }
  }
}
