import { loadRemoteModule } from '@angular-architects/module-federation'
import { Injectable, InjectionToken, Type } from '@angular/core'
import { RemoteComponent, RemoteComponentsTopic } from '@onecx/integration-interface'
import { Observable, map, shareReplay } from 'rxjs'
import { PermissionService } from './permission.service'

export const SLOT_SERVICE: InjectionToken<SlotService> = new InjectionToken('SLOT_SERVICE')

export type RemoteComponentInfo = { appId: string; productName: string; baseUrl: string }

export type SlotComponentConfiguration = {
  componentType: Promise<Type<unknown> | undefined> | Type<unknown> | undefined
  remoteComponent: RemoteComponentInfo
  permissions: Promise<string[]> | string[]
}

export interface SlotService {
  init(): Promise<void>
  getComponentsForSlot(slotName: string): Observable<SlotComponentConfiguration[]>
  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean>
}

@Injectable({ providedIn: 'root' })
export class SlotService implements SlotService {
  remoteComponents$ = new RemoteComponentsTopic()

  constructor(private permissionsService: PermissionService) {}

  async init(): Promise<void> {
    return Promise.resolve()
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
        infos.map((remoteComponent) => ({
          componentType: this.loadComponent(remoteComponent),
          remoteComponent,
          permissions: this.permissionsService.getPermissions(remoteComponent.appId, remoteComponent.productName),
        }))
      ),
      shareReplay()
    )
  }

  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean> {
    return this.remoteComponents$.pipe(
      map((remoteComponentsInfo) => remoteComponentsInfo.slots.some((slotMapping) => slotMapping.name === slotName))
    )
  }

  private async loadComponent(component: {
    remoteEntryUrl: string
    exposedModule: string
    productName: string
  }): Promise<Type<unknown> | undefined> {
    try {
      const exposedModule = component.exposedModule.startsWith('./')
        ? component.exposedModule.slice(2)
        : component.exposedModule
      if (!(component as any).technology || (component as any).technology === 'Angular') {
        const m = await loadRemoteModule({
          type: 'module',
          remoteEntry: component.remoteEntryUrl,
          exposedModule: './' + exposedModule,
        })
        return m[exposedModule]
      }
      await loadRemoteModule({
        type: 'script',
        remoteName: component.productName,
        remoteEntry: component.remoteEntryUrl,
        exposedModule: './' + exposedModule,
      });
      return undefined
    } catch (e) {
      console.log('Failed to load remote module ', component.exposedModule, component.remoteEntryUrl, e)
      return undefined
    }
  }
}
