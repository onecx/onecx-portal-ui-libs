import { InjectionToken, Type } from '@angular/core'
import { Observable } from 'rxjs'

export const SLOT_SERVICE: InjectionToken<SlotService> = new InjectionToken('SLOT_SERVICE')

export type RemoteComponentInfo = { appId: string; productName: string; baseUrl: string }

export type SlotComponentConfiguration = {
  componentType: Promise<Type<unknown> | undefined> | Type<unknown> | undefined;
  remoteComponent: RemoteComponentInfo;
  permissions: Promise<string[]> | string[];
}

export interface SlotService {
  init(): Promise<void>
  getComponentsForSlot(
    slotName: string
  ): Observable<SlotComponentConfiguration[]>
}
