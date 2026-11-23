import { BehaviorSubject } from 'rxjs'
import { TestBed } from '@angular/core/testing'
import { SlotService } from '@onecx/angular-remote-components'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { DataViewStateService } from '../../services/data-view-state.service'
import { RowListGridData } from '../../model/row-list-grid-data.model'

/**
 * Characterization tests for the event forwarding performed by
 * `registerEventListenerForDataView()`. They complement the registration/subscription tests in
 * `interactive-data-view.component.spec.ts` by exercising the actual payload flow from the child
 * data view to the parent handlers, which the existing suite does not cover.
 *
 * They live in a separate file so the large component spec does not grow further.
 */
describe('InteractiveDataViewComponent event forwarding', () => {
  const setInputSignal = <T>(obj: any, prop: string, value: T) => {
    Object.defineProperty(obj, prop, {
      value: () => value,
      writable: true,
      configurable: true,
    })
  }

  const createComponent = () => {
    const slotService = {
      isSomeComponentDefinedForSlot: jest.fn(() => new BehaviorSubject<boolean>(true).asObservable()),
    } as unknown as SlotService

    TestBed.configureTestingModule({
      providers: [{ provide: SlotService, useValue: slotService }, DataViewStateService],
    })

    const component = TestBed.runInInjectionContext(() => new InteractiveDataViewComponent())
    return { component }
  }

  /** Unobserved per-output stubs for the child data view; override an output's `observed` for a specific case. */
  const mockDataView = () => ({
    deleteItem: { observed: () => false, subscribe: jest.fn() },
    viewItem: { observed: () => false, subscribe: jest.fn() },
    editItem: { observed: () => false, subscribe: jest.fn() },
    selectionChanged: { observed: () => false, subscribe: jest.fn() },
  })

  const registeredHandler = (subscribe: jest.Mock) => subscribe.mock.calls[0][0]

  it('given a parent deleteItem consumer and a not-yet-observed child, when the child emits, then the payload reaches the parent handler', () => {
    const { component } = createComponent()
    const parentListener = jest.fn()
    component.deleteItem.subscribe(parentListener)

    const dataView = mockDataView()
    setInputSignal(component, 'dataViewComponent', dataView)

    component.registerEventListenerForDataView()

    const payload: RowListGridData = { id: 1 }
    registeredHandler(dataView.deleteItem.subscribe)(payload)

    expect(parentListener).toHaveBeenCalledWith(payload)
  })

  it('given the parent has no consumer, when registering and the child emits, then the payload is not forwarded to the parent', () => {
    const { component } = createComponent()
    const parentListener = jest.fn()
    const forwarding = component.deleteItem.subscribe(parentListener)

    const dataView = mockDataView()
    setInputSignal(component, 'dataViewComponent', dataView)

    component.registerEventListenerForDataView()
    forwarding.unsubscribe()

    const payload: RowListGridData = { id: 1 }
    registeredHandler(dataView.deleteItem.subscribe)(payload)

    expect(parentListener).not.toHaveBeenCalled()
  })
})
