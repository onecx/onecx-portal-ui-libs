import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy } from '@angular/core'
import { CurrentThemeTopic } from '@onecx/integration-interface'
import { tap } from 'rxjs'
import { Theme } from '../model/theme'
import { ConfigurationService } from './configuration.service'

const defaultThemeServerUrl = 'http://portal-theme-management:8080'

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  themeServerUrl: string
  baseUrlV1 = './portal-api'
  currentTheme$ = new CurrentThemeTopic()

  constructor(private configservice: ConfigurationService, private http: HttpClient) {
    this.themeServerUrl = this.configservice.getProperty('TKIT_PORTAL_THEME_SERVER_URL') || defaultThemeServerUrl
  }

  getThemeHref(themeId: string): string {
    return `${this.themeServerUrl}/themes/${themeId}/${themeId}.min.css`
  }

  public loadAndApplyTheme(themeName: string) {
    return this.http.get<Theme>(`${this.baseUrlV1}/internal/themes/${encodeURI(themeName)}`).pipe(
      tap((theme) => {
        this.apply(theme)
        this.currentTheme$.publish(theme)
      })
    )
  }

  public apply(theme: Theme) {
    console.log(`🎨 Applying theme: ${theme.name}`)
    if (theme.properties) {
      Object.values(theme.properties).forEach((group) => {
        for (const [key, value] of Object.entries(group)) {
          document.documentElement.style.setProperty(`--${key}`, value)
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.currentTheme$.destroy()
  }
}
