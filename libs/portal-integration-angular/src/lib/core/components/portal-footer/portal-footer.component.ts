import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { ConfigurationService } from '../../../services/configuration.service'
import { Router } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { MenuService } from '../../../services/app.menu.service'
import { AppStateService } from '../../../services/app-state.service'
import { map, Observable } from 'rxjs'
import { ThemeService } from '../../../services/theme.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { ImageLogoUrlUtils } from '../../utils/image-logo-url.utils'

@Component({
  selector: 'ocx-footer',
  templateUrl: './portal-footer.component.html',
  styleUrls: ['./portal-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class PortalFooterComponent implements OnInit {
  copyrightMsg = 'Capgemini. All rights reserved.'
  @Input() logoUrl$: Observable<string | undefined> | undefined
  currentYear = new Date().getFullYear()
  portalMenuItems: MenuItem[] = []
  versionInfo$: Observable<string | undefined>

  constructor(
    private configurationService: ConfigurationService,
    public router: Router,
    private appState: AppStateService,
    private menuService: MenuService,
    private themeService: ThemeService,
    private ref: ChangeDetectorRef
  ) {
    this.versionInfo$ = this.appState.currentMfe$.pipe(untilDestroyed(this)).pipe(
      map((mfe) => {
        const mfeInfoVersion = mfe?.version || ''
        const mfeName = mfe?.displayName
        const hostVersion = this.configurationService.getProperty('APP_VERSION') || 'DEV-LOCAL'
        const mfInfoText = mfeName ? `MF ${mfeName} v${mfeInfoVersion}` : ''
        return `Portal: ${this.configurationService.getPortal().portalName} v${hostVersion} ${mfInfoText}`
      })
    )
  }
  ngOnInit(): void {
    const portalData = this.configurationService.getPortal()
    this.logoUrl$ = this.themeService.currentTheme$.pipe(untilDestroyed(this), map((theme) => {
      return ImageLogoUrlUtils.setImageLogoUrl(theme.logoUrl || portalData.logoUrl)
    }))

    if (
      !(portalData.footerLabel === '' || portalData.footerLabel === 'string' || portalData.footerLabel === undefined)
    ) {
      this.copyrightMsg = portalData.companyName || portalData.footerLabel || 'All rights reserved.'
    }

    this.menuService
      .getMenuItems()
      .subscribe((el) =>
        el.find((item) => (item.id === 'PORTAL_FOOTER_MENU' ? this.createMenu(item as MenuItem) : null))
      )
  }
  public onErrorHandleSrc(): void {
    this.logoUrl$ = undefined
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
}
