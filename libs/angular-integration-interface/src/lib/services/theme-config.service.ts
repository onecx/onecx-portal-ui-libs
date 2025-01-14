import { Injectable, Inject, APP_INITIALIZER } from '@angular/core'
import { ThemeService } from './theme.service'
import { PrimeNGConfig } from 'primeng/api'
import { CurrentThemeTopic, Theme } from '@onecx/integration-interface'

@Injectable({
  providedIn: 'root',
})
export class ThemeConfigService {
  private currentThemeTopic$ = new CurrentThemeTopic()
  constructor(
    private themeService: ThemeService,
    private primengConfig: PrimeNGConfig
  ) {
    this.currentThemeTopic$.subscribe((theme) => {
      this.applyThemeVariables(theme)
    })
  }

  private applyThemeVariables(themeVariables: Theme): void {
    // TODO: Theme Service Variables are put into primengs theme configuration
    const themeConfig = {
      // TODO
    }
  }
}
