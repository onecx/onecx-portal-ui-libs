import { Injectable, Type } from '@angular/core'
import { Observable, of } from 'rxjs'
import { StandaloneMenuComponent } from '../components/standalone-menu/standalone-menu.component'
import { RemoteComponentInfo, SlotService } from '@onecx/angular-remote-components'

@Injectable()
export class StandaloneSlotService implements SlotService {
  private slotConfig: Record<string, { componentType: Type<unknown>; remoteComponent: RemoteComponentInfo, permissions: string[] }[]> = {
    menu: [
      {
        componentType: StandaloneMenuComponent,
        remoteComponent: {
          appId: '',
          bffUrl: '',
          productName: '',
        },
        permissions: [] //TODO
      },
    ],
  }

  async init(): Promise<void> {
    return Promise.resolve()
  }

  getComponentsForSlot(
    slotName: string
  ): Observable<{ componentType: Type<unknown>; remoteComponent: RemoteComponentInfo, permissions: string[] }[]> {
    return of(this.slotConfig[slotName] ?? [])
  }
}
