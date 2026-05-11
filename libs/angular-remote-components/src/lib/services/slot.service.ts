import { Injectable, InjectionToken, OnDestroy, Type, inject } from '@angular/core'
import { RemoteComponent, RemoteComponentsTopic, Technologies } from '@onecx/integration-interface'
import { Observable, map, shareReplay } from 'rxjs'
import { PermissionService } from './permission.service'
import { createLogger } from '../utils/logger.utils'
import { toLoadRemoteEntryOptions } from '@onecx/angular-utils'

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
  private readonly logger = createLogger('SlotService')

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
    const exposedModule = component.exposedModule.startsWith('./')
      ? component.exposedModule.slice(2)
      : component.exposedModule
    try {
      const remoteEntryOptions = await toLoadRemoteEntryOptions(component)
      const shellMfInstance = this.getShellMfInstance()
      if (!shellMfInstance) {
        this.logger.error(
          'Failed to find shell module federation instance',
          component.exposedModule,
          component.remoteEntryUrl
        )
        return undefined
      }
      shellMfInstance.registerRemotes([remoteEntryOptions])
      const m = await shellMfInstance.loadRemote<any>(remoteEntryOptions.name + '/' + exposedModule)
      if (component.technology === Technologies.Angular) {
        return m[exposedModule]
      }
      return undefined
    } catch (e) {
      this.logger.error('Failed to load remote module ', component.exposedModule, component.remoteEntryUrl, e)
      return undefined
    }
  }

  // Temporary solution until its released
  // https://github.com/module-federation/core/blob/6c9d2ee15757be80f0721e1db443b8b526107015/packages/runtime/src/index.ts#L119
  private getShellMfInstance() {
    return globalThis.__FEDERATION__.__INSTANCES__.find((instance) => instance.name === 'onecx_shell_ui')
  }
}
