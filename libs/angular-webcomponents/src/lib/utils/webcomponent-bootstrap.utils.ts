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
import { EventsTopic } from '@onecx/integration-interface'
import { filter } from 'rxjs'

/**
 * Implementation inspired by @angular-architects/module-federation-plugin https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf-tools/src/lib/web-components/bootstrap-utils.ts
 */

export type AppType = 'shell' | 'microfrontend'

export function bootstrapModule<M>(module: Type<M>, appType: AppType, production: boolean): Promise<NgModuleRef<M>> {
  return cachePlatform(production)
    .bootstrapModule(module, {
      ngZone: getNgZone(),
    })
    .then((ref) => {
      if (appType === 'shell') {
        setShellZone(ref.injector)
      } else if (appType === 'microfrontend') {
        connectMicroFrontendRouter(ref.injector)
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
  connectMicroFrontendRouter(app.injector, false)

  const myRemoteComponentAsWebComponent = createCustomElement(component, {
    injector: app.injector,
  })

  customElements.define(elementName, myRemoteComponentAsWebComponent)
}

function adaptRemoteComponentRoutes(injector: Injector) {
  const router = injector.get(Router)

  if (!router) {
    return
  }

  if(!router.config.find((val) => val.path === '**')) {
    router.resetConfig(
      router.config.concat({
        path: '**',
        children: []
      })
    )
  }
}

function getWindowState(): any {
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

function getNgZone(): NgZone {
  return getWindowState().ngZone
}

function cachePlatform(production: boolean): PlatformRef {
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

function connectMicroFrontendRouter(injector: Injector, warn: boolean = true) {
  const router = injector.get(Router)

  if (!router) {
    if (warn) {
      console.warn('No router to connect found')
    }
    return
  }

  connectRouter(router)
}

function connectRouter(router: Router): void {
  const initialUrl = `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}`
  router.navigateByUrl(initialUrl)
  const observer = new EventsTopic();
  observer.pipe(filter((e) => e.type === 'navigated')).subscribe(() => {
    const routerUrl = `${location.pathname.substring(
      getLocation().deploymentPath.length
    )}${location.search}`;
    router.navigateByUrl(routerUrl);
  });
}
