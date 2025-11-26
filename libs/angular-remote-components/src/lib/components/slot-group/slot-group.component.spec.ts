import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { SlotGroupComponent } from './slot-group.component'
import { ComponentRef, ElementRef, EventEmitter } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { SlotGroupHarness } from '../../../../testing/slot-group.harness'
import { SLOT_SERVICE, SlotService } from '../../services/slot.service'
import { SlotServiceMock } from '@onecx/angular-remote-components/mocks'
import { SlotComponent } from '../slot/slot.component'
import { By } from '@angular/platform-browser'
import { EventsPublisher, EventType, SlotGroupResizedEvent } from '@onecx/integration-interface'
import { DivHarness } from '@onecx/angular-testing'

class MockResizeObserver {
  constructor(private readonly cb: ResizeObserverCallback) {}
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
  trigger(width: number, height: number) {
    const entry = {
      contentRect: { width, height } as DOMRectReadOnly,
      target: {} as Element,
      borderBoxSize: [] as any,
      contentBoxSize: [] as any,
      devicePixelContentBoxSize: [] as any,
    } as ResizeObserverEntry
    this.cb([entry], this as unknown as ResizeObserver)
  }
}
globalThis.ResizeObserver = MockResizeObserver

class EventsPublisherMock {
  publish = jest.fn()
}

describe('SlotGroupComponent', () => {
  let component: SlotGroupComponent
  let fixture: ComponentFixture<SlotGroupComponent>
  let componentRef: ComponentRef<SlotGroupComponent>
  let slotGroupHarness: SlotGroupHarness
  let slotServiceMock: SlotServiceMock

  let eventsPublisher: EventsPublisherMock
  let roInstance: MockResizeObserver

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotGroupComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: SlotService,
          useClass: SlotServiceMock,
        },
        { provide: EventsPublisher, useClass: EventsPublisherMock },
      ],
    }).compileComponents()
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(SlotGroupComponent)
    component = fixture.componentInstance
    componentRef = fixture.componentRef
    componentRef.setInput('name', 'test-slot')

    fixture.detectChanges()

    eventsPublisher = TestBed.inject(EventsPublisher) as unknown as EventsPublisherMock

    roInstance = (component as any).resizeObserver as MockResizeObserver

    slotServiceMock = TestBed.inject(SLOT_SERVICE) as unknown as SlotServiceMock

    slotServiceMock.assignComponentToSlot('test-component', 'test-slot-start')
    slotServiceMock.assignComponentToSlot('test-component', 'test-slot-center')
    slotServiceMock.assignComponentToSlot('test-component', 'test-slot-end')

    slotGroupHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotGroupHarness)
  })

  it('should observe the native element on init', () => {
    expect(roInstance.observe).toHaveBeenCalledTimes(1)

    const elRef = (component as any).elementRef as ElementRef<HTMLElement>

    expect(roInstance.observe).toHaveBeenCalledWith(elRef.nativeElement)
  })

  it('should debounce resize events and publish SLOT_GROUP_RESIZED once', fakeAsync(() => {
    // Simulate multiple rapid size changes
    roInstance.trigger(100, 50)
    roInstance.trigger(120, 60)
    roInstance.trigger(140, 70)

    // Nothing yet because of debounce (100ms in component)
    expect(eventsPublisher.publish).not.toHaveBeenCalled()

    // Advance time by slightly more than debounce
    tick(110)

    expect(eventsPublisher.publish).toHaveBeenCalledTimes(1)

    const arg = eventsPublisher.publish.mock.calls[0][0] as SlotGroupResizedEvent

    expect(arg.type).toBe(EventType.SLOT_GROUP_RESIZED)
    expect(arg.payload.slotGroupName).toBe('test-slot')
    expect(arg.payload.slotGroupDetails).toEqual({ width: 140, height: 70 })
  }))

  it('should disconnect ResizeObserver and complete subject on destroy', () => {
    const disconnectSpy = jest.spyOn(roInstance, 'disconnect')

    fixture.destroy()

    expect(disconnectSpy).toHaveBeenCalled()
  })

  it('does not throw if resizeObserver is undefined on destroy (covers optional chain false branch)', () => {
    ;(component as any).resizeObserver = undefined
    expect(() => fixture.destroy()).not.toThrow()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have created slot div containers for each child slot', async () => {
    const slots = await slotGroupHarness.getAllSlots()

    expect(slots).toHaveLength(3)

    for (const slot of slots) {
      const slotDiv = await slot.getSlotDivContainer()

      expect(slotDiv).toBeTruthy()
    }
  })

  describe('Input Signals', () => {
    describe('name input signal', () => {
      it('should get name of the slot group component with name', async () => {
        const slotGroupName = await slotGroupHarness.getName()

        expect(slotGroupName).toBe('test-slot')
      })

      it('should pass name to child slots with correct suffixes', async () => {
        componentRef.setInput('name', 'new-test-slot')

        const startSlot = await slotGroupHarness.getStartSlot()
        const centerSlot = await slotGroupHarness.getCenterSlot()
        const endSlot = await slotGroupHarness.getEndSlot()

        expect(await startSlot?.getName()).toBe('new-test-slot-start')
        expect(await centerSlot?.getName()).toBe('new-test-slot-center')
        expect(await endSlot?.getName()).toBe('new-test-slot-end')
      })
    })

    describe('direction input signal', () => {
      it('should have default direction value as row', () => {
        expect(component.direction()).toBe('row')
      })
    })

    describe('slotStyles input signal', () => {
      it('should have default empty object for slotStyles', () => {
        expect(component.slotStyles()).toEqual({})
      })

      it('should pass slotStyles to all child slots', async () => {
        const styles = { padding: '10px', margin: '5px' }
        componentRef.setInput('slotStyles', styles)

        const startSlotStyles = await slotGroupHarness.getStartSlotStyles(['padding', 'margin'])
        const centerSlotStyles = await slotGroupHarness.getCenterSlotStyles(['padding', 'margin'])
        const endSlotStyles = await slotGroupHarness.getEndSlotStyles(['padding', 'margin'])

        expect(startSlotStyles[0]).toEqual(styles)
        expect(centerSlotStyles[0]).toEqual(styles)
        expect(endSlotStyles[0]).toEqual(styles)
      })

      it('should dynamically update slot styles for all child slots when slotStyles input changes', async () => {
        const initialStyles = { color: 'red' }
        componentRef.setInput('slotStyles', initialStyles)

        const updatedStyles = { color: 'green', 'font-weight': 'bold' }
        componentRef.setInput('slotStyles', updatedStyles)

        const startSlotStyles = await slotGroupHarness.getStartSlotStyles(['color', 'font-weight'])
        const centerSlotStyles = await slotGroupHarness.getCenterSlotStyles(['color', 'font-weight'])
        const endSlotStyles = await slotGroupHarness.getEndSlotStyles(['color', 'font-weight'])

        expect(startSlotStyles[0]).toEqual(updatedStyles)
        expect(centerSlotStyles[0]).toEqual(updatedStyles)
        expect(endSlotStyles[0]).toEqual(updatedStyles)
      })
    })

    describe('slotClasses input signal', () => {
      let startSlotDivs: DivHarness[]
      let centerSlotDivs: DivHarness[]
      let endSlotDivs: DivHarness[]

      beforeEach(async () => {
        const startSlot = await slotGroupHarness.getStartSlot()
        const centerSlot = await slotGroupHarness.getCenterSlot()
        const endSlot = await slotGroupHarness.getEndSlot()

        if (!startSlot || !centerSlot || !endSlot) {
          console.warn('One or more slots are not available')
          return
        }

        startSlotDivs = await startSlot.getSlotDivContainers()
        centerSlotDivs = await centerSlot.getSlotDivContainers()
        endSlotDivs = await endSlot.getSlotDivContainers()
      })

      it('should have default empty string for slotClasses', () => {
        expect(component.slotClasses()).toBe('')
      })

      it('should apply slotClasses of type string to all child slot divs', async () => {
        const classesString = 'string-class1 string-class2'
        const expectedClasses = ['string-class1', 'string-class2']

        componentRef.setInput('slotClasses', classesString)

        const startSlotClasses = await slotGroupHarness.getStartSlotClasses()

        for (let index = 0; index < startSlotDivs.length; index++) {
          expect(startSlotClasses[index]).toEqual(expectedClasses)
        }

        const centerSlotClasses = await slotGroupHarness.getCenterSlotClasses()

        for (let index = 0; index < centerSlotDivs.length; index++) {
          expect(centerSlotClasses[index]).toEqual(expectedClasses)
        }

        const endSlotClasses = await slotGroupHarness.getEndSlotClasses()

        for (let index = 0; index < endSlotDivs.length; index++) {
          expect(endSlotClasses[index]).toEqual(expectedClasses)
        }
      })

      it('should apply slotClasses of type string array to all child slot divs', async () => {
        const classesArray = ['array-class1', 'array-class2']

        componentRef.setInput('slotClasses', classesArray)

        const startSlotClasses = await slotGroupHarness.getStartSlotClasses()

        for (let index = 0; index < startSlotDivs.length; index++) {
          expect(startSlotClasses[index]).toEqual(classesArray)
        }

        const centerSlotClasses = await slotGroupHarness.getCenterSlotClasses()

        for (let index = 0; index < centerSlotDivs.length; index++) {
          expect(centerSlotClasses[index]).toEqual(classesArray)
        }

        const endSlotClasses = await slotGroupHarness.getEndSlotClasses()

        for (let index = 0; index < endSlotDivs.length; index++) {
          expect(endSlotClasses[index]).toEqual(classesArray)
        }
      })

      it('should apply slotClasses of type string Set to all child slot divs', async () => {
        const classesSet = new Set(['set-class1', 'set-class2'])
        const expectedClasses = ['set-class1', 'set-class2']

        componentRef.setInput('slotClasses', classesSet)

        const startSlotClasses = await slotGroupHarness.getStartSlotClasses()

        for (let index = 0; index < startSlotDivs.length; index++) {
          expect(startSlotClasses[index]).toEqual(expectedClasses)
        }

        const centerSlotClasses = await slotGroupHarness.getCenterSlotClasses()

        for (let index = 0; index < centerSlotDivs.length; index++) {
          expect(centerSlotClasses[index]).toEqual(expectedClasses)
        }

        const endSlotClasses = await slotGroupHarness.getEndSlotClasses()

        for (let index = 0; index < endSlotDivs.length; index++) {
          expect(endSlotClasses[index]).toEqual(expectedClasses)
        }
      })

      it('should apply slotClasses of type object to all child slot divs', async () => {
        const classesObject = { 'object-class1': true, 'object-class2': false, 'object-class3': true }
        const expectedClasses = ['object-class1', 'object-class3']

        componentRef.setInput('slotClasses', classesObject)

        const startSlotClasses = await slotGroupHarness.getStartSlotClasses()

        for (let index = 0; index < startSlotDivs.length; index++) {
          expect(startSlotClasses[index]).toEqual(expectedClasses)
        }

        const centerSlotClasses = await slotGroupHarness.getCenterSlotClasses()

        for (let index = 0; index < centerSlotDivs.length; index++) {
          expect(centerSlotClasses[index]).toEqual(expectedClasses)
        }

        const endSlotClasses = await slotGroupHarness.getEndSlotClasses()

        for (let index = 0; index < endSlotDivs.length; index++) {
          expect(endSlotClasses[index]).toEqual(expectedClasses)
        }
      })
    })

    describe('slotInputs input signal', () => {
      it('should have default empty object for slotInputs', () => {
        expect(component.slotInputs()).toEqual({})
      })

      it('should pass computed inputs to respective child slots', async () => {
        const inputs = { data: 'test' }
        componentRef.setInput('slotInputs', inputs)

        const slots = await slotGroupHarness.getAllSlots()

        // Use By.directive to get SlotComponent instances
        const slotDebugElements = fixture.debugElement.queryAll(By.directive(SlotComponent))

        expect(slotDebugElements).toHaveLength(slots.length)

        for (let index = 0; index < slots.length; index++) {
          const slotComponentInstance = slotDebugElements[index].componentInstance as SlotComponent
          expect(slotComponentInstance.inputs).toEqual(inputs)
        }
      })
    })

    describe('slotOutputs input signal', () => {
      it('should have default empty object for slotOutputs', () => {
        expect(component.slotOutputs()).toEqual({})
      })

      it('should pass slotOutputs to all child slots', async () => {
        const outputs = {
          event: new EventEmitter<void>(),
        }

        componentRef.setInput('slotOutputs', outputs)

        const slots = await slotGroupHarness.getAllSlots()

        // Use By.directive to get SlotComponent instances
        const slotDebugElements = fixture.debugElement.queryAll(By.directive(SlotComponent))

        expect(slotDebugElements).toHaveLength(slots.length)

        for (let index = 0; index < slots.length; index++) {
          const slotComponentInstance = slotDebugElements[index].componentInstance as SlotComponent

          expect(slotComponentInstance.outputs).toEqual(outputs)
        }
      })
    })

    describe('groupStyles input signal', () => {
      it('should have default empty object for groupStyles', () => {
        expect(component.groupStyles()).toEqual({})
      })

      it('should update groupStyles signal value', () => {
        const styles = { backgroundColor: 'green', padding: '10px' }
        componentRef.setInput('groupStyles', styles)

        expect(component.groupStyles()).toEqual(styles)
      })

      it('should apply groupStyles of type object to container div', async () => {
        const groupStylesObject = { color: 'blue', padding: '15px' }
        const expectedStyles = { color: 'blue', padding: '15px' }

        componentRef.setInput('groupStyles', groupStylesObject)

        const containerSlotStyles = await slotGroupHarness.getContainerStyles(['color', 'padding'])

        expect(containerSlotStyles).toEqual(expectedStyles)
      })
    })

    describe('groupClasses input signal', () => {
      it('should have default empty string for groupClasses', () => {
        expect(component.groupClasses()).toBe('')
      })

      it('should apply groupClasses of type string to container div', async () => {
        const groupClassesString = 'test-group-class another-class'
        const expectedClasses = ['test-group-class', 'another-class']

        componentRef.setInput('groupClasses', groupClassesString)

        const containerSlotClasses = await slotGroupHarness.getContainerGroupClasses()

        expect(containerSlotClasses).toEqual(expectedClasses)
      })

      it('should apply groupClasses of type string array to container div', async () => {
        const groupClassesArray = ['test-group-class', 'another-class']

        componentRef.setInput('groupClasses', groupClassesArray)

        const containerSlotClasses = await slotGroupHarness.getContainerGroupClasses()

        expect(containerSlotClasses).toEqual(groupClassesArray)
      })

      it('should apply groupClasses of type string to container div', async () => {
        const groupClassesSet = new Set(['test-group-class', 'another-class'])
        const expectedClasses = ['test-group-class', 'another-class']

        componentRef.setInput('groupClasses', groupClassesSet)

        const containerSlotClasses = await slotGroupHarness.getContainerGroupClasses()

        expect(containerSlotClasses).toEqual(expectedClasses)
      })

      it('should apply groupClasses of type string to container div', async () => {
        const groupClassesObject = { 'test-group-class': true, 'another-class': false, 'third-class': true }
        const expectedClasses = ['test-group-class', 'third-class']

        componentRef.setInput('groupClasses', groupClassesObject)

        const containerSlotClasses = await slotGroupHarness.getContainerGroupClasses()

        expect(containerSlotClasses).toEqual(expectedClasses)
      })
    })

    describe('containerStyles computed signal', () => {
      it('should compute containerStyles with default direction', () => {
        const containerStyles = component.containerStyles()
        const expectedDefaultStyles = {
          'flex-direction': 'row',
        }

        expect(containerStyles).toEqual(expectedDefaultStyles)
      })

      it('should update when direction changes', async () => {
        componentRef.setInput('direction', 'column')

        const expectedContainerStyles = {
          'flex-direction': 'column',
        }

        const containerStyles = await slotGroupHarness.getContainerStyles(['flex-direction'])

        expect(containerStyles).toEqual(expectedContainerStyles)
      })

      it('should update when groupStyles changes', async () => {
        componentRef.setInput('groupStyles', { padding: '10px' })

        const expectedContainerStyles = {
          'flex-direction': 'row',
          padding: '10px',
        }

        const containerStyles = await slotGroupHarness.getContainerStyles(['flex-direction', 'padding'])

        expect(containerStyles).toEqual(expectedContainerStyles)

        componentRef.setInput('groupStyles', { padding: '20px', margin: '5px' })

        const expectedUpdatedContainerStyles = {
          'flex-direction': 'row',
          padding: '20px',
          margin: '5px',
        }

        const updatedContainerStyles = await slotGroupHarness.getContainerStyles([
          'flex-direction',
          'padding',
          'margin',
        ])

        expect(updatedContainerStyles).toEqual(expectedUpdatedContainerStyles)
      })
    })

    describe('slotStyles and slotClasses with multiple components in a slot', () => {
      it('should apply slotStyles and slotClasses to every start slot div when multiple components are assigned to start slot', async () => {
        slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot-start')

        const styles = { padding: '10px', color: 'blue' }
        const expectedStyles = { padding: '10px', color: 'blue' }

        const classes = 'multi-class another-class'
        const expectedClasses = ['multi-class', 'another-class']

        componentRef.setInput('slotStyles', styles)
        componentRef.setInput('slotClasses', classes)

        const startSlotDivs = await slotGroupHarness.getStartSlotDivContainers()

        expect(startSlotDivs?.length).toBe(2)

        const startSlotStyles = await slotGroupHarness.getStartSlotStyles(['padding', 'color'])

        for (let index = 0; index < startSlotDivs.length; index++) {
          expect(startSlotStyles[index]).toEqual(expectedStyles)
        }

        const startSlotClasses = await slotGroupHarness.getStartSlotClasses()

        for (let index = 0; index < startSlotDivs.length; index++) {
          expect(startSlotClasses[index]).toEqual(expectedClasses)
        }
      })

      it('should apply slotStyles and slotClasses to every center slot div when multiple components are assigned to center slot', async () => {
        slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot-center')

        const styles = { padding: '10px', color: 'blue' }
        const expectedStyles = { padding: '10px', color: 'blue' }

        const classes = 'multi-class another-class'
        const expectedClasses = ['multi-class', 'another-class']

        componentRef.setInput('slotStyles', styles)
        componentRef.setInput('slotClasses', classes)

        const centerSlotDivs = await slotGroupHarness.getCenterSlotDivContainers()

        expect(centerSlotDivs.length).toBe(2)

        const centerSlotStyles = await slotGroupHarness.getCenterSlotStyles(['padding', 'color'])

        for (let index = 0; index < centerSlotDivs.length; index++) {
          expect(centerSlotStyles[index]).toEqual(expectedStyles)
        }

        const centerSlotClasses = await slotGroupHarness.getCenterSlotClasses()

        for (let index = 0; index < centerSlotDivs.length; index++) {
          expect(centerSlotClasses[index]).toEqual(expectedClasses)
        }
      })

      it('should apply slotStyles and slotClasses to every end slot div when multiple components are assigned to end slot', async () => {
        slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot-end')

        const styles = { padding: '10px', color: 'blue' }
        const expectedStyles = { padding: '10px', color: 'blue' }

        const classes = 'multi-class another-class'
        const expectedClasses = ['multi-class', 'another-class']

        componentRef.setInput('slotStyles', styles)
        componentRef.setInput('slotClasses', classes)

        const endSlotDivs = await slotGroupHarness.getEndSlotDivContainers()

        expect(endSlotDivs.length).toBe(2)

        const endSlotStyles = await slotGroupHarness.getEndSlotStyles(['padding', 'color'])

        for (let index = 0; index < endSlotDivs.length; index++) {
          expect(endSlotStyles[index]).toEqual(expectedStyles)
        }

        const endSlotClasses = await slotGroupHarness.getEndSlotClasses()

        for (let index = 0; index < endSlotDivs.length; index++) {
          expect(endSlotClasses[index]).toEqual(expectedClasses)
        }
      })

      it('should apply slotStyles and slotClasses to every slot div in all slots when multiple components are assigned to all slots', async () => {
        slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot-start')
        slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot-center')
        slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot-end')

        const styles = { padding: '10px', color: 'blue' }
        const expectedStyles = { padding: '10px', color: 'blue' }

        const classes = 'multi-class another-class'
        const expectedClasses = ['multi-class', 'another-class']

        componentRef.setInput('slotStyles', styles)
        componentRef.setInput('slotClasses', classes)

        const allSlotDivs = await slotGroupHarness.getAllSlotDivContainers()
        const allSlots = await slotGroupHarness.getAllSlots()

        expect(allSlotDivs.length).toBe(6)

        for (const slot of allSlots) {
          const slotStyles = await slot.getAllSlotStylesForProperties(['padding', 'color'])

          for (const slotStyle of slotStyles) {
            expect(slotStyle).toEqual(expectedStyles)
          }

          const slotClasses = await slot.getAllSlotClasses()
          for (const slotClass of slotClasses) {
            expect(slotClass).toEqual(expectedClasses)
          }
        }
      })
    })
  })
})
