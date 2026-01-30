import { inject, Injectable, InjectionToken } from '@angular/core'
import { SLOT_SERVICE, SlotComponentConfiguration } from '@onecx/angular-remote-components'
import { Observable, Subject, map } from 'rxjs'

export interface SlotServiceMockAssignments {
  [slot_key: string]: SlotComponentConfiguration[]
}

export const SLOT_SERVICE_MOCK_ASSIGNMENTS: InjectionToken<SlotServiceMockAssignments> = new InjectionToken(
  'SLOT_SERVICE_MOCK_ASSIGNMENTS'
)

export function provideSlotServiceMock(initialAssignments?: { [slot_key: string]: SlotComponentConfiguration[] }) {
  return [
    { provide: SLOT_SERVICE_MOCK_ASSIGNMENTS, useValue: initialAssignments },
    {
      provide: SLOT_SERVICE,
      useClass: SlotServiceMock,
    },
  ]
}

@Injectable()
export class SlotServiceMock {
  _componentsDefinedForSlot = new Subject<SlotServiceMockAssignments>()
  initialAssignments = inject(SLOT_SERVICE_MOCK_ASSIGNMENTS, { optional: true })

  constructor() {
    if (this.initialAssignments) {
      this._componentsDefinedForSlot.next(this.initialAssignments)
    }
  }

  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean> {
    return this._componentsDefinedForSlot.pipe(
      map((assignments) => {
        return slotName in assignments && assignments[slotName].length > 0
      })
    )
  }

  getComponentsForSlot(slotName: string) {
    return this._componentsDefinedForSlot.pipe(
      map((assignments) => {
        return Object.keys(assignments).includes(slotName) ? assignments[slotName] : []
      })
    )
  }

  assignComponents(componentConfigurations: SlotServiceMockAssignments) {
    this._componentsDefinedForSlot.next(componentConfigurations)
  }
}
