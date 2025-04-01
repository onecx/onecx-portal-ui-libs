import { Inject, Injectable, InjectionToken, Optional } from '@angular/core'
import { UseStyle } from 'primeng/usestyle'
import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-remote-components'
import { AppStateService } from '@onecx/angular-integration-interface'
import { ReplaySubject } from 'rxjs'
import { THEME_OVERRIDES, ThemeOverrides } from '../theme/application-config'
import { toVariables } from '@primeuix/styled'
import { getScopeIdentifier } from '../utils/scope.utils'

export const SKIP_STYLE_SCOPING = new InjectionToken<boolean>('SKIP_STYLE_SCOPING')
const everythingNotACharacterOrNumberRegex = /[^a-zA-Z0-9-]/g

@Injectable({ providedIn: 'any' })
export class CustomUseStyle extends UseStyle {
  constructor(
    private appStateService: AppStateService,
    @Optional() @Inject(SKIP_STYLE_SCOPING) private skipStyleScoping?: boolean,
    @Optional() @Inject(REMOTE_COMPONENT_CONFIG) private remoteComponentConfig?: ReplaySubject<RemoteComponentConfig>,
    @Optional() @Inject(THEME_OVERRIDES) private themeOverrides?: ThemeOverrides
  ) {
    super()
  }
  // PrimeNg defines CSS variables and styles globally in <style> elements
  // Each Application needs to isolate the CSS variables and styles from others
  override use(css: any, options?: any): { id: any; name: any; el: any; css: any } {
    getScopeIdentifier(this.appStateService, this.skipStyleScoping, this.remoteComponentConfig).then((scopeId) => {
      css = this.replacePrefix(css, scopeId)
      css = this.isStyle(options.name as string) ? this.scopeStyle(css, scopeId) : css

      options = {
        ...options,
        name: (options.name ?? '') + (scopeId === '' ? scopeId : '-' + scopeId),
      }
      super.use(css, options)
      return this.applyOverrides(scopeId)
    })
    // Result of this call is not used at the moment
    // Fake response ensures its possible to detect future usages of the result of this call
    return this.createFakeUseResponse(css, options)
  }

  private applyOverrides(scopeId: string): Promise<any> {
    if (!this.themeOverrides) return Promise.resolve()

    const overrides = Promise.resolve(
      typeof this.themeOverrides === 'function' ? this.themeOverrides() : this.themeOverrides
    )
    return overrides.then((resolvedOverrides) => {
      const variablesData = toVariables(resolvedOverrides)
      if (variablesData.value.length === 0) return

      const styleRef = this.createOrRetrieveOverrideElement(scopeId ? scopeId : 'shell-ui')
      const prefixedOverrides = this.replacePrefix(variablesData.css, scopeId)
      styleRef.textContent = prefixedOverrides
      // Always make sure it is the last child of the document head
      this.document.head.appendChild(styleRef)
    })
  }

  private createOrRetrieveOverrideElement(overrideId: string): Element {
    const styleRef =
      this.document.querySelector(`style[data-variable-override-id="${overrideId}"]`) ||
      this.document.createElement('style')
    if (!styleRef.isConnected) {
      styleRef.setAttribute('data-variable-override-id', overrideId)
    }
    return styleRef
  }

  private scopeStyle(css: string, scopeId: string) {
    const isScopeSupported = (typeof CSSScopeRule !== 'undefined')
    if (scopeId === '') {
      return isScopeSupported ? `
      @scope([data-style-id="shell-ui"]) to ([data-style-isolation]) {
              ${css}
          }
      ` : `
      @supports (@scope([data-style-id="shell-ui"]) to ([data-style-isolation])) {
              ${css}
          }
      `
    } else {
      return isScopeSupported ? `
      @scope([data-style-id="${scopeId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
              ${css}
          }
      ` : `
      @supports (@scope([data-style-id="${scopeId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
              ${css}
          }
      `
    }
  }

  private replacePrefix(css: string, scopeId: string) {
    if (scopeId === '') {
      return css
    }

    return css.replaceAll('--p-', this.scopeIdentifierToVariablePrefix(scopeId))
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

  private scopeIdentifierToVariablePrefix(scopeId: string) {
    return '--' + scopeId.replace(everythingNotACharacterOrNumberRegex, '-') + '-'
  }

  private isVariables(cssName: string) {
    return cssName.endsWith('-variables')
  }

  private isStyle(cssName: string) {
    return !this.isVariables(cssName)
  }
}
