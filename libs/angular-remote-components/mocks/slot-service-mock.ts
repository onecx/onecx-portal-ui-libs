import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, map } from 'rxjs'

@Injectable()
export class SlotServiceMock {
  _componentsDefinedForSlot: BehaviorSubject<{
    [slot_key: string]: string[]
  }> = new BehaviorSubject({})
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

  assignComponentToSlot(componentName: string, slotName: string) {
    const currentAssignments = this._componentsDefinedForSlot.getValue()
    this._componentsDefinedForSlot.next({
      ...currentAssignments,
      [slotName]: slotName in currentAssignments ? currentAssignments[slotName].concat(componentName) : [componentName],
    })
  }
}
