import { loadRemoteModule } from '@angular-architects/module-federation'
import { Injectable, InjectionToken, OnDestroy, Type, inject } from '@angular/core'
import { RemoteComponent, RemoteComponentsTopic, Technologies } from '@onecx/integration-interface'
import { Observable, map, shareReplay } from 'rxjs'
import { PermissionService } from './permission.service'

/**
 * Subset of the ModuleFederation instance type from @module-federation/runtime-core,
 * defined locally to avoid a dependency on the enhanced runtime.
 */
type ModuleFederationRemote = {
  name: string
  entry: string
  alias?: string
  shareScope?: string | string[]
  type?: string
  entryGlobalName?: string
}

type ModuleFederationInstance = {
  registerRemotes(remotes: ModuleFederationRemote[], options?: { force?: boolean }): void
  loadRemote<T>(id: string, options?: { loadFactory?: boolean; from: 'build' | 'runtime' }): Promise<T | null>
}

export const SLOT_SERVICE: InjectionToken<SlotService> = new InjectionToken('SLOT_SERVICE')

export type RemoteComponentInfo = {
  appId: string
  productName: string
  baseUrl: string
  technology: Technologies
  elementName?: string
  shareScope?: string
}

export type SlotComponentConfiguration = {
  componentType: Promise<Type<unknown> | undefined> | Type<unknown> | undefined
  remoteComponent: RemoteComponentInfo
  permissions: Promise<string[]> | string[]
}

export interface SlotServiceInterface {
  init(): Promise<void>
  getComponentsForSlot(slotName: string): Observable<SlotComponentConfiguration[]>
  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean>
}

@Injectable({ providedIn: 'root' })
export class SlotService implements SlotServiceInterface, OnDestroy {
  private permissionsService = inject(PermissionService)

  private _remoteComponents$: RemoteComponentsTopic | undefined
  get remoteComponents$() {
    this._remoteComponents$ ??= new RemoteComponentsTopic()
    return this._remoteComponents$
  }
  set remoteComponents$(source: RemoteComponentsTopic) {
    this._remoteComponents$ = source
  }

  async init(): Promise<void> {
    return Promise.resolve()
  }

  ngOnDestroy(): void {
    this._remoteComponents$?.destroy()
  }

  getComponentsForSlot(slotName: string): Observable<SlotComponentConfiguration[]> {
    return this.remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        (remoteComponentsInfo.slots?.find((slotMapping) => slotMapping.name === slotName)?.components ?? [])
          .map((remoteComponentName) => remoteComponentsInfo.components.find((rc) => rc.name === remoteComponentName))
          .filter((remoteComponent): remoteComponent is RemoteComponent => !!remoteComponent)
          .map((remoteComponent) => remoteComponent)
      ),
      map((infos) =>
        infos.map((remoteComponent) => {
          return {
            componentType: this.loadComponent(remoteComponent),
            remoteComponent,
            permissions: this.permissionsService.getPermissions(remoteComponent.appId, remoteComponent.productName),
          }
        })
      ),
      shareReplay()
    )
  }

  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean> {
    return this.remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        remoteComponentsInfo.slots.some(
          (slotMapping) => slotMapping.name === slotName && slotMapping.components.length > 0
        )
      )
    )
  }

  private async loadComponent(component: RemoteComponent): Promise<Type<unknown> | undefined> {
    try {
      const exposedModule = component.exposedModule.startsWith('./')
        ? component.exposedModule.slice(2)
        : component.exposedModule

      if (component.shareScope && component.shareScope !== 'default') {
        return await this.loadComponentWithEnhancedRuntime(component, exposedModule)
      }

      // Preserve the existing loading behavior for legacy remotes.
      if (component.technology === Technologies.Angular || component.technology === Technologies.WebComponentModule) {
        const m = await loadRemoteModule({
          type: 'module',
          remoteEntry: component.remoteEntryUrl,
          exposedModule: './' + exposedModule,
        })

        if (component.technology === Technologies.Angular) {
          return m[exposedModule]
        }

        return undefined
      }

      await loadRemoteModule({
        type: 'script',
        remoteName: component.remoteName,
        remoteEntry: component.remoteEntryUrl,
        exposedModule: './' + exposedModule,
      })

      return undefined
    } catch (e) {
      console.error('Failed to load remote module', component.exposedModule, component.remoteEntryUrl, e)
      return undefined
    }
  }

  private async loadComponentWithEnhancedRuntime(
    component: RemoteComponent,
    exposedModule: string
  ): Promise<Type<unknown> | undefined> {
    const shellGlobal = globalThis as typeof globalThis & {
      onecxFederationInstance?: ModuleFederationInstance
    }

    const instance = shellGlobal.onecxFederationInstance

    if (!instance) {
      throw new Error(
        `Cannot load remote "${component.name}" in share scope ` +
          `"${component.shareScope}": shell federation instance is unavailable.`
      )
    }

    const isModule =
      component.technology === Technologies.Angular || component.technology === Technologies.WebComponentModule

    const remoteName =
      component.technology === Technologies.WebComponentScript
        ? component.remoteName
        : component.productName + '|' + component.appId

    instance.registerRemotes([
      {
        name: remoteName,
        entry: component.remoteEntryUrl,
        type: isModule ? 'module' : 'script',
        shareScope: component.shareScope,
      },
    ])

    const exports = await instance.loadRemote<Record<string, Type<unknown>>>(remoteName + '/' + exposedModule)

    if (!exports) {
      throw new Error(`Remote "${remoteName}" did not return exports for "${exposedModule}".`)
    }

    if (component.technology === Technologies.Angular) {
      const componentType = exports[exposedModule]

      if (!componentType) {
        throw new Error(`Remote "${remoteName}" does not export "${exposedModule}".`)
      }

      return componentType
    }

    return undefined
  }
}
