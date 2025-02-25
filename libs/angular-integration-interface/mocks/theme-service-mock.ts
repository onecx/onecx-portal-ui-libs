import { Injectable } from '@angular/core'
import { of, from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { Theme } from '@onecx/integration-interface'
import { FakeTopic } from './fake-topic'

const defaultThemeServerUrl = 'http://portal-theme-management:8080'

@Injectable({ providedIn: 'root' })
export class ThemeServiceMock {
  baseUrlV1 = './portal-api'
  currentTheme$ = new FakeTopic<Theme>()

  getThemeHref(themeId: string): string {
    const themeServerUrl = defaultThemeServerUrl
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
}
