import { createCustomElement } from '@angular/elements'
import { createApplication, platformBrowser } from '@angular/platform-browser'
import {
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
import {
  EventsTopic,
  CurrentLocationTopicPayload,
  TopicEventType,
} from '@onecx/integration-interface'
import { Observable, Subscription, filter } from 'rxjs'
import { ShellCapabilityService, Capability } from '@onecx/angular-utils'
import { AppStateService } from '@onecx/angular-integration-interface'

/**
 * Implementation inspired by @angular-architects/module-federation-plugin https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf-tools/src/lib/web-components/bootstrap-utils.ts
 */

export type AppType = 'shell' | 'microfrontend'
export type EntrypointType = 'microfrontend' | 'component'

export function bootstrapModule<M>(module: Type<M>, appType: AppType, production: boolean): Promise<NgModuleRef<M>> {
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
  providers: (Provider | EnvironmentProviders)[]
): Promise<void> {
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
  createEntrypoint(component, elementName, app.injector, 'component')
}

export function createAppEntrypoint(component: Type<any>, elementName: string, injector: Injector) {
  createEntrypoint(component, elementName, injector, 'microfrontend')
}

function createEntrypoint(
  component: Type<any>,
  elementName: string,
  injector: Injector,
  entrypointType: EntrypointType
) {
  let sub: Subscription | null
  const eventsTopic = new EventsTopic()
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
    eventsTopic.destroy()
    if (originalNgDestroy !== undefined) {
      originalNgDestroy.call(this)
    }
  }

  const myRemoteComponentAsWebComponent = createCustomElement(component, {
    injector: injector,
  })

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

function connectMicroFrontendRouter(injector: Injector, warn = true, eventsTopic: EventsTopic): Subscription | null {
  const router = injector.get(Router)
  const appStateService = injector.get(AppStateService)
  if (!router) {
    if (warn) {
      console.warn('No router to connect found')
    }
    return null
  }

  return connectRouter(router, appStateService, eventsTopic)
}

function connectRouter(router: Router, appStateService: AppStateService, eventsTopic: EventsTopic): Subscription {
  const initialUrl = `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}${location.hash}`
  router.navigateByUrl(initialUrl, {
    replaceUrl: true,
    state: { isRouterSync: true },
  })
  let lastUrl = initialUrl
  const capabilityService = new ShellCapabilityService()
  let observer: Observable<TopicEventType | CurrentLocationTopicPayload> =
    appStateService.currentLocation$.asObservable()
  if (!capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
    observer = eventsTopic.pipe(filter((e) => e.type === 'navigated'))
  }
  return observer.subscribe(() => {
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
