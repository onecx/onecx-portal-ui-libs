import { InjectionToken, Type } from '@angular/core'
import { Observable } from 'rxjs'

export const SLOT_SERVICE: InjectionToken<SlotService> = new InjectionToken('SLOT_SERVICE')

export type RemoteComponentInfo = { appId: string; productName: string; baseUrl: string }

export interface SlotService {
  init(): Promise<void>
  getComponentsForSlot(
    slotName: string
  ): Observable<
    { componentType: Type<unknown> | undefined; remoteComponent: RemoteComponentInfo; permissions: string[] }[]
  >
}
