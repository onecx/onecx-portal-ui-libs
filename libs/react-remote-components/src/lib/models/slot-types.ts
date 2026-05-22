import type { Observable } from 'rxjs'
import type { RemoteComponent, RemoteComponentsTopic, Technologies } from '@onecx/integration-interface'

export type RemoteComponentInfo = {
  appId: string
  productName: string
  baseUrl: string
  technology: Technologies
  elementName?: string
}

export type SlotComponentConfiguration = {
  componentType: Promise<unknown | undefined> | unknown | undefined
  remoteComponent: RemoteComponentInfo
  permissions: Promise<string[]> | string[]
}

export interface SlotServiceInterface {
  remoteComponents$: RemoteComponentsTopic
  getComponentsForSlot(slotName: string): Observable<SlotComponentConfiguration[]>
  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean>
  loadComponent(component: RemoteComponent): Promise<unknown> | undefined
}
