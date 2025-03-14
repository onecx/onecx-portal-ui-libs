import { Inject, Injectable, InjectionToken, Optional } from '@angular/core'
import { UseStyle } from 'primeng/usestyle'
import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-remote-components'
import { AppStateService } from '@onecx/angular-integration-interface'
import { firstValueFrom, map, ReplaySubject } from 'rxjs'
import { THEME_OVERRIDES, ThemeOverridesCssVariables } from '../theme/application-config'

export const SKIP_STYLE_SCOPING = new InjectionToken<boolean>('SKIP_STYLE_SCOPING')
const notCharacterOrDashRegex = /[^a-zA-Z0-9\-]/g

@Injectable({ providedIn: 'any' })
export class CustomUseStyle extends UseStyle {
  constructor(
    private appStateService: AppStateService,
    @Optional() @Inject(SKIP_STYLE_SCOPING) private skipStyleScoping?: boolean,
    @Optional() @Inject(REMOTE_COMPONENT_CONFIG) private remoteComponentConfig?: ReplaySubject<RemoteComponentConfig>,
    @Optional() @Inject(THEME_OVERRIDES) private themeOverrides?: ThemeOverridesCssVariables
  ) {
    super()
  }
  override use(css: any, options?: any): { id: any; name: any; el: any; css: any } {
    css = this.applyOverrides(css)
    this.getStyleIdentifier().then((scopedStyleId) => {
      css = this.replacePrefix(css, scopedStyleId)

      if (!(options.name as string).endsWith('-variables')) {
        css = this.scopeStyle(css, scopedStyleId)
      }

      options = {
        ...options,
        name: (options.name ?? '') + (scopedStyleId === '' ? scopedStyleId : '-' + scopedStyleId),
      }
      super.use(css, options)
    })
    return this.createFakeUseResponse(css, options)
  }

  private applyOverrides(css: string): string {
    if (!this.themeOverrides) return css

    let cssWithOverrides = css
    for (const override of this.themeOverrides) {
      const [variable, value] = override.split(':')
      const regex = new RegExp(`(${variable}:)\\s*[^;]+;`, 'g')
      cssWithOverrides = cssWithOverrides.replace(regex, `$1 ${value}`)
    }
    return cssWithOverrides
  }

  private scopeStyle(css: string, styleId: string) {
    if (styleId === '') {
      return `
      @scope([data-style-id="shell-ui"]) to ([data-style-isolation]) {
              ${css}
          }
      `
    } else {
      return `
      @scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
              ${css}
          }
      `
    }
  }

  private replacePrefix(css: string, styleId: string) {
    if (styleId === '') {
      return css
    }

    return css.replaceAll('--p-', this.styleIdentifierToVariablePrefix(styleId))
  }

  private async getStyleIdentifier() {
    let scopedStyleId = ''
    if (!this.skipStyleScoping) {
      if (this.remoteComponentConfig) {
        const rcConfig = await firstValueFrom(this.remoteComponentConfig)
        scopedStyleId = `${rcConfig.productName}|${rcConfig.appId}`
      } else {
        scopedStyleId = await firstValueFrom(
          this.appStateService.currentMfe$.pipe(map((mfeInfo) => `${mfeInfo.productName}|${mfeInfo.appId}`))
        )
      }
    }
    return scopedStyleId
  }

  private createFakeUseResponse(css: any, options: any) {
    const returnObject: {
      id: any
      css: any
      name: any
      el: any
    } = {
      id: options.id ?? undefined,
      css: css,
      name: undefined,
      el: undefined,
    }

    Object.defineProperties(returnObject, {
      name: {
        get() {
          console.error('Unexpected read of CustomUseStyle.use return value name')
          return undefined
        },
      },
      el: {
        get() {
          console.error('Unexpected read of CustomUseStyle.use return value el')
          return undefined
        },
      },
    })
    return returnObject
  }

  private styleIdentifierToVariablePrefix(styleId: string) {
    return '--' + styleId.replace(notCharacterOrDashRegex, '-') + '-'
  }
}
