import { createCustomElement } from '@angular/elements'
import { createApplication, platformBrowser } from '@angular/platform-browser'
import {
  APP_ID,
  EnvironmentProviders,
  Injector,
  NgModuleRef,
  NgZone,
  PlatformRef,
  Provider,
  Type,
  VERSION,
  Version,
  enableProdMode,
  getPlatform,
} from '@angular/core'
import { Router } from '@angular/router'
import { dataNoPortalLayoutStylesKey } from '@onecx/angular-utils'
import { WebcomponentConnector } from './webcomponent-connector.utils'
import { DynamicAppId } from './dynamic-app-id.utils'

/**
 * Implementation inspired by @angular-architects/module-federation-plugin https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf-tools/src/lib/web-components/bootstrap-utils.ts
 */

export type AppType = 'shell' | 'microfrontend'
export type EntrypointType = 'microfrontend' | 'component'

export interface AppOptions {
  /**
   * @deprecated Don't provide anymore since portal layout styles is not available anymore. Providing the value will not change the behavior.
   */
  usePortalLayoutStyles?: boolean
}

export function bootstrapModule<M>(module: Type<M>, appType: AppType, production: boolean): Promise<NgModuleRef<M>> {
  replaceOrAddAppId((module as any)['ɵinj'].providers)

  return cachePlatform(production)
    .bootstrapModule(module, {
      ngZone: getNgZone(),
    })
    .then((ref) => {
      if (appType === 'shell') {
        setShellZone(ref.injector)
      }
      return ref
    })
}

export async function bootstrapRemoteComponent(
  component: Type<any>,
  elementName: string,
  production: boolean,
  providers: (Provider | EnvironmentProviders)[],
  options?: AppOptions
): Promise<void> {
  replaceOrAddAppId(providers)

  const app = await createApplication({
    providers: [
      getNgZone()
        ? {
            provide: NgZone,
            useValue: getNgZone(),
          }
        : [],
      ...providers,
    ],
  })

  cachePlatform(production)
  adaptRemoteComponentRoutes(app.injector)
  createEntrypoint(component, elementName, app.injector, 'component', options)
}

export function createAppEntrypoint(
  component: Type<any>,
  elementName: string,
  injector: Injector,
  options?: AppOptions
) {
  createEntrypoint(component, elementName, injector, 'microfrontend', options)
}

/**
 * Adds or replaces APP_ID provider with DynamicAppId. DynamicAppId is a wrapper around the APP_ID that adds application context.
 */
function replaceOrAddAppId(providers: Array<any>) {
  const existingProvider = findAndReplaceAppId(providers)
  if (existingProvider === null) {
    providers.push({
      provide: APP_ID,
      useValue: new DynamicAppId(),
    })
  }
}

function findAndReplaceAppId(providers: Array<any>): any {
  if (providers.length === 0) return null
  for (const provider of providers) {
    if (provider.provide === APP_ID) {
      let id = 'ng'
      if (typeof provider.useValue === 'string') {
        id = provider.useValue
      } else {
        console.warn(
          "APP_ID provider in the application was not done via useValue. Will fallback to 'ng' as the APP_ID"
        )
      }
      provider.useValue = new DynamicAppId(id)
      return provider
    }

    const subProviderResult = findAndReplaceAppId(provider.ɵproviders ?? [])
    if (subProviderResult !== null) {
      return subProviderResult
    }
  }

  return null
}

function createEntrypoint(
  component: Type<any>,
  elementName: string,
  injector: Injector,
  entrypointType: EntrypointType,
  _?: AppOptions
) {
  const webcomponentConnector = new WebcomponentConnector(injector, entrypointType)
  // Save element name in DynamicAppId for later use in SharedStylesHost
  const appId = injector.get(APP_ID) as any as DynamicAppId
  appId.appElementName = elementName

  const originalNgInit = component.prototype.ngOnInit

  component.prototype.ngOnInit = function () {
    webcomponentConnector.connect()
    if (originalNgInit !== undefined) {
      originalNgInit.call(this)
    }
  }
  const originalNgDestroy = component.prototype.ngOnDestroy
  component.prototype.ngOnDestroy = function () {
    webcomponentConnector.disconnect()
    if (originalNgDestroy !== undefined) {
      originalNgDestroy.call(this)
    }
  }

  const myRemoteComponentAsWebComponent = createCustomElement(component, {
    injector: injector,
  })

  const originalConnectedCallback = myRemoteComponentAsWebComponent.prototype.connectedCallback

  myRemoteComponentAsWebComponent.prototype.connectedCallback = function () {
    this.dataset[dataNoPortalLayoutStylesKey] = ''
    originalConnectedCallback.call(this)
  }

  customElements.define(elementName, myRemoteComponentAsWebComponent)
}

export function getWindowState(): any {
  const state = window as any
  state['@onecx/angular-webcomponents'] ??= {} as unknown
  return state['@onecx/angular-webcomponents']
}

function setShellZone(injector: Injector) {
  const ngZone = injector.get(NgZone, null)
  if (!ngZone) {
    console.warn('No NgZone to share found')
    return
  }
  setNgZone(ngZone)
}

function setNgZone(ngZone: NgZone): void {
  getWindowState().ngZone = ngZone
}

export function getNgZone(): NgZone {
  return getWindowState().ngZone
}

export function cachePlatform(production: boolean): PlatformRef {
  let platformCache: Map<Version, PlatformRef> = getWindowState().platformCache
  if (!platformCache) {
    platformCache = new Map<Version, PlatformRef>()
    getWindowState().platformCache = platformCache
  }
  const version = VERSION
  let platform: any = platformCache.get(version)
  if (!platform) {
    platform = getPlatform() ?? platformBrowser()
    if (platform) {
      platformCache.set(version, platform)
    }
    if (production) {
      enableProdMode()
    }
  }
  return platform
}

function adaptRemoteComponentRoutes(injector: Injector) {
  const router = injector.get(Router)

  if (!router) {
    return
  }

  // Fallback route is needed to make sure that router is activatable
  // and to always respond for guards scattered requests
  if (!router.config.find((val) => val.path === '**')) {
    router.resetConfig(
      router.config.concat({
        path: '**',
        children: [],
      })
    )
  }
}
