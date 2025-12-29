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
import { getLocation } from '@onecx/accelerator'

import { EventsTopic, CurrentLocationTopicPayload, TopicEventType } from '@onecx/integration-interface'
import { Observable, Subscription, filter } from 'rxjs'
import { dataNoPortalLayoutStylesKey } from '@onecx/angular-utils'
import { ShellCapabilityService, Capability } from '@onecx/angular-integration-interface'
import { AppStateService } from '@onecx/angular-integration-interface'
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
  const appId = injector.get(APP_ID) as any as DynamicAppId
  appId.appElementName = elementName
  let sub: Subscription | null
  const capabilityService = new ShellCapabilityService()
  const currentLocationCapabilityAvailable = capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)
  const eventsTopic = currentLocationCapabilityAvailable ? undefined : new EventsTopic()
  const originalNgInit = component.prototype.ngOnInit
  component.prototype.ngOnInit = function () {
    sub = connectMicroFrontendRouter(injector, entrypointType === 'microfrontend', eventsTopic)
    if (originalNgInit !== undefined) {
      originalNgInit.call(this)
    }
  }
  const originalNgDestroy = component.prototype.ngOnDestroy
  component.prototype.ngOnDestroy = function () {
    sub?.unsubscribe()
    if (currentLocationCapabilityAvailable && eventsTopic) {
      eventsTopic.destroy()
    }
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

function adaptRemoteComponentRoutes(injector: Injector) {
  const router = injector.get(Router)

  if (!router) {
    return
  }

  if (!router.config.find((val) => val.path === '**')) {
    router.resetConfig(
      router.config.concat({
        path: '**',
        children: [],
      })
    )
  }
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
    platform && platformCache.set(version, platform)
    production ?? enableProdMode()
  }
  return platform
}

function connectMicroFrontendRouter(
  injector: Injector,
  warnOnMissingRouter: boolean,
  eventsTopic: EventsTopic | undefined
): Subscription | null {
  const router = injector.get(Router, null)
  const appStateService = injector.get(AppStateService, null)
  if (!router) {
    if (warnOnMissingRouter) {
      console.warn('No router to connect found')
    }
    return null
  }

  if (!appStateService) {
    console.warn('No appStateService found')
    return null
  }

  return connectRouter(router, appStateService, eventsTopic)
}

function connectRouter(
  router: Router,
  appStateService: AppStateService,
  eventsTopic: EventsTopic | undefined
): Subscription {
  const initialUrl = `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}${location.hash}`
  router.navigateByUrl(initialUrl, {
    replaceUrl: true,
    state: { isRouterSync: true },
  })
  let lastUrl = initialUrl
  let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
    appStateService.currentLocation$.asObservable()
  if (eventsTopic !== undefined) {
    observable = eventsTopic.pipe(filter((e) => e.type === 'navigated'))
  }
  return observable.subscribe(() => {
    const routerUrl = `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}${location.hash}`
    if (routerUrl !== lastUrl) {
      lastUrl = routerUrl
      router.navigateByUrl(routerUrl, {
        replaceUrl: true,
        state: { isRouterSync: true },
      })
    }
  })
}
