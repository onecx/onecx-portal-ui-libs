import { BehaviorSubject } from 'rxjs'
import { TestBed } from '@angular/core/testing'
import { SlotService } from '@onecx/angular-remote-components'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { DataViewStateService } from '../../services/data-view-state.service'
import { RowListGridData } from '../../model/row-list-grid-data.model'
import { Row } from '../data-table/data-table.component'

/**
 * Characterization tests for the event forwarding performed by
 * `registerEventListenerForDataView()`. They complement the registration/subscription tests in
 * `interactive-data-view.component.spec.ts` by exercising the actual payload flow from the child
 * data view to the parent handlers, which the existing suite does not cover.
 *
 * They live in a separate file so the large component spec does not grow further.
 */

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

/** Unobserved per-output stubs for the child data view. */
const mockDataView = () => ({
  deleteItem: { observed: () => false, subscribe: jest.fn() },
  viewItem: { observed: () => false, subscribe: jest.fn() },
  editItem: { observed: () => false, subscribe: jest.fn() },
  selectionChanged: { observed: () => false, subscribe: jest.fn() },
})

const registeredHandler = (subscribe: jest.Mock) => subscribe.mock.calls[0][0]

/**
 * Registers the child data view on one output and asserts that a payload emitted by the child
 * reaches the subscribed parent handler — the forwarding behavior shared by deleteItem, viewItem,
 * editItem and selectionChanged.
 */
const forwardPayload = (output: keyof ReturnType<typeof mockDataView>, payload: unknown) => {
  const { component } = createComponent()
  const parentListener = jest.fn()
  component[output].subscribe(parentListener)

  const dataView = mockDataView()
  setInputSignal(component, 'dataViewComponent', dataView)

  component.registerEventListenerForDataView()

  registeredHandler(dataView[output].subscribe)(payload)

  expect(parentListener).toHaveBeenCalledWith(payload)
}

describe('InteractiveDataViewComponent event forwarding', () => {
  describe('forwards a child payload to the parent handler when the child is not yet observed', () => {
    it('given a parent deleteItem consumer, when the child emits, then the payload reaches the parent handler', () => {
      forwardPayload('deleteItem', { id: 1 } satisfies RowListGridData)
    })

    it('given a parent viewItem consumer, when the child emits, then the payload reaches the parent handler', () => {
      forwardPayload('viewItem', { id: 2 } satisfies RowListGridData)
    })

    it('given a parent editItem consumer, when the child emits, then the payload reaches the parent handler', () => {
      forwardPayload('editItem', { id: 3 } satisfies RowListGridData)
    })

    it('given a parent selectionChanged consumer, when the child emits, then the payload reaches the parent handler', () => {
      forwardPayload('selectionChanged', [{ id: 'row-1' }] satisfies Row[])
    })
  })

  it('given the parent has no consumer, when registering and the child emits, then the payload is not forwarded to the parent', () => {
    const { component } = createComponent()
    const parentListener = jest.fn()
    const forwarding = component.deleteItem.subscribe(parentListener)

    const dataView = mockDataView()
    setInputSignal(component, 'dataViewComponent', dataView)

    component.registerEventListenerForDataView()
    forwarding.unsubscribe()

    registeredHandler(dataView.deleteItem.subscribe)({ id: 1 } satisfies RowListGridData)

    expect(parentListener).not.toHaveBeenCalled()
  })
})
