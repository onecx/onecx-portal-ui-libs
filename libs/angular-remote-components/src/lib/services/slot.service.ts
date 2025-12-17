import { loadRemoteModule } from '@angular-architects/module-federation'
import { Injectable, InjectionToken, OnDestroy, Type, inject } from '@angular/core'
import { RemoteComponent, RemoteComponentsTopic, Technologies } from '@onecx/integration-interface'
import { Observable, map, shareReplay } from 'rxjs'
import { PermissionService } from './permission.service'

export const SLOT_SERVICE: InjectionToken<SlotService> = new InjectionToken('SLOT_SERVICE')

export type RemoteComponentInfo = {
  appId: string
  productName: string
  baseUrl: string
  technology: Technologies
  elementName?: string
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

  private async loadComponent(component: {
    remoteEntryUrl: string
    exposedModule: string
    productName: string
    remoteName: string
    technology: string
  }): Promise<Type<unknown> | undefined> {
    try {
      const exposedModule = component.exposedModule.startsWith('./')
        ? component.exposedModule.slice(2)
        : component.exposedModule
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
      console.log('Failed to load remote module ', component.exposedModule, component.remoteEntryUrl, e)
      return undefined
    }
  }
}
