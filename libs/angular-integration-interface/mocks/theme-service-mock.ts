import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy } from '@angular/core'
import { of, from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { CurrentThemeTopic, Theme } from '@onecx/integration-interface'
import { ConfigurationService } from '../src/lib/services/configuration.service'
import { CONFIG_KEY } from '../src/lib/model/config-key.model'

const defaultThemeServerUrl = 'http://portal-theme-management:8080'

@Injectable({ providedIn: 'root' })
export class ThemeServiceMock implements OnDestroy {
  baseUrlV1 = './portal-api'
  currentTheme$ = new CurrentThemeTopic()

  constructor(
    private configService: ConfigurationService,
    private http: HttpClient
  ) {}

  getThemeHref(themeId: string): string {
    const themeServerUrl =
      this.configService.getProperty(CONFIG_KEY.TKIT_PORTAL_THEME_SERVER_URL) || defaultThemeServerUrl
    return `${themeServerUrl}/themes/${themeId}/${themeId}.min.css`
  }

  public loadAndApplyTheme(themeName: string) {
    const mockTheme: Theme = { name: themeName, properties: {} }
    return of(mockTheme).pipe(
      mergeMap((theme) => {
        return from(this.apply(theme)).pipe(map(() => theme))
      })
    )
  }

  public async apply(theme: Theme): Promise<void> {
    console.log(`🎨 Applying theme: ${theme.name}`)
    await this.currentTheme$.publish(theme)
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
