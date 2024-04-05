import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AppStateService, ConfigurationService, CONFIG_KEY, ThemeService } from '@onecx/angular-integration-interface'
import { ImageLogoUrlUtils } from '@onecx/portal-integration-angular'
import { combineLatest, concat, map, Observable, of, withLatestFrom } from 'rxjs'
import { SHELL_BFF_PREFIX } from '../../model/constants'

@Component({
  selector: 'ocx-shell-footer',
  templateUrl: './portal-footer.component.html',
  styleUrls: ['./portal-footer.component.scss'],
})
export class PortalFooterComponent implements OnInit {
  logoUrl$: Observable<string | undefined>
  copyrightMsg$: Observable<string> | undefined
  versionInfo$: Observable<string | undefined>

  constructor(
    private configurationService: ConfigurationService,
    public router: Router,
    private appState: AppStateService,
    private themeService: ThemeService
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
      this.appState.currentWorkspace$.asObservable(),
    ]).pipe(
      map(([theme, portalData]) => ImageLogoUrlUtils.createLogoUrl(SHELL_BFF_PREFIX, theme.logoUrl || portalData.logoUrl))
    )
  }

  ngOnInit(): void {
    this.copyrightMsg$ = concat(
      of('Capgemini. All rights reserved.'),
      this.appState.currentWorkspace$.pipe(
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
  }

  public onErrorHandleSrc(): void {
    this.logoUrl$ = of(undefined)
  }
}
