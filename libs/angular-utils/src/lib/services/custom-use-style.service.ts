import { Inject, Injectable, InjectionToken, Optional } from '@angular/core'
import { UseStyle } from 'primeng/usestyle'
import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-remote-components'
import { AppStateService } from '@onecx/angular-integration-interface'
import { firstValueFrom, map, ReplaySubject } from 'rxjs'

export const SKIP_STYLE_SCOPING = new InjectionToken<boolean>('SKIP_STYLE_SCOPING')

@Injectable({ providedIn: 'any' })
export class CustomUseStyle extends UseStyle {
  constructor(
    private appStateService: AppStateService,
    @Optional() @Inject(SKIP_STYLE_SCOPING) private skipStyleScoping?: boolean,
    @Optional() @Inject(REMOTE_COMPONENT_CONFIG) private remoteComponentConfig?: ReplaySubject<RemoteComponentConfig>
  ) {
    super()
  }
  override use(css: any, options?: any): { id: any; name: any; el: any; css: any } {
    this.getStyleIdentifier().then((scopedStyleId) => {
      if (scopedStyleId !== '' && !(options.name as string).endsWith('-variables')) {
        css = `
    [data-style-id="${scopedStyleId}"] {
                ${css}
            }
        `
      }
      options = {
        ...options,
        name: (options.name ?? '') + (scopedStyleId === '' ? scopedStyleId : '-' + scopedStyleId),
      }
      super.use(css, options)
    })
    return this.createFakeUseResponse(css, options)
  }

  async getStyleIdentifier() {
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

  createFakeUseResponse(css: any, options: any) {
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
}
