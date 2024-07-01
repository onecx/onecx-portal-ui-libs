import { createCustomElement } from '@angular/elements'
import { createApplication } from '@angular/platform-browser'
import { EnvironmentProviders, NgZone, PlatformRef, Provider, Type, VERSION, Version, getPlatform } from '@angular/core'

export async function bootstrapRemoteComponent(
  component: Type<any>,
  elementName: string,
  providers: (Provider | EnvironmentProviders)[]
): Promise<void> {
  const app = await createApplication({
    providers: [
      (window as any)['@angular-architects/module-federation-tools'].ngZone
        ? {
            provide: NgZone,
            useValue: (window as any)['@angular-architects/module-federation-tools'].ngZone,
          }
        : [],
      ...providers,
    ],
  })

  const platform = getPlatform()
  let platformCache: Map<Version, PlatformRef> = (window as any)['@angular-architects/module-federation-tools']
    .platformCache
  if (!platformCache) {
    platformCache = new Map<Version, PlatformRef>()
    ;(window as any)['@angular-architects/module-federation-tools'].platformCache = platformCache
  }
  const version = VERSION
  platform && platformCache.set(version, platform)

  const myRemoteComponentAsWebComponent = createCustomElement(component, {
    injector: app.injector,
  })

  customElements.define(elementName, myRemoteComponentAsWebComponent)
}
