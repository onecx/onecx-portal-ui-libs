import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SlotGroupComponent } from './slot-group.component'
import { ComponentRef, EventEmitter } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { SlotGroupHarness } from '../../../../testing/slot-group.harness'
import { SLOT_SERVICE, SlotService } from '../../services/slot.service'
import { SlotServiceMock } from '@onecx/angular-remote-components/mocks'
import { SlotComponent } from '../slot/slot.component'
import { By } from '@angular/platform-browser'

// Mock ResizeObserver
class MockResizeObserver {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
}

globalThis.ResizeObserver = MockResizeObserver

describe('SlotGroupComponent', () => {
  let component: SlotGroupComponent
  let fixture: ComponentFixture<SlotGroupComponent>
  let componentRef: ComponentRef<SlotGroupComponent>
  let slotGroupHarness: SlotGroupHarness
  let slotServiceMock: SlotServiceMock

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
      ],
    }).compileComponents()
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(SlotGroupComponent)
    component = fixture.componentInstance
    componentRef = fixture.componentRef
    componentRef.setInput('name', 'test-slot')

    slotServiceMock = TestBed.inject(SLOT_SERVICE) as unknown as SlotServiceMock

    slotServiceMock.assignComponentToSlot('test-component', 'test-slot-start')
    slotServiceMock.assignComponentToSlot('test-component', 'test-slot-center')
    slotServiceMock.assignComponentToSlot('test-component', 'test-slot-end')

    slotGroupHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotGroupHarness)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('Input Signals', () => {
    describe('name input signal', () => {
      it('should have required name signal', () => {
        expect(component.name()).toBe('test-slot')
      })

      it('should update name signal value', () => {
        componentRef.setInput('name', 'new-test-slot')

        expect(component.name()).toBe('new-test-slot')
      })

      it('should pass name to child slots with correct suffixes', async () => {
        componentRef.setInput('name', 'test-slot')

        const startSlot = await slotGroupHarness.getStartSlot()
        const centerSlot = await slotGroupHarness.getCenterSlot()
        const endSlot = await slotGroupHarness.getEndSlot()

        expect(await startSlot?.getName()).toBe('test-slot-start')
        expect(await centerSlot?.getName()).toBe('test-slot-center')
        expect(await endSlot?.getName()).toBe('test-slot-end')
      })

      it('should have created slot div containers for each child slot', async () => {
        const slots = await slotGroupHarness.getAllSlots()

        expect(slots).toHaveLength(3)

        for (const slot of slots) {
          const slotDiv = await slot.getSlotDivContainer()

          expect(slotDiv).toBeTruthy()
        }
      })
    })

    describe('direction input signal', () => {
      it('should have default direction value as row', () => {
        expect(component.direction()).toBe('row')
      })

      it('should update direction signal value to column', () => {
        componentRef.setInput('direction', 'column')

        expect(component.direction()).toBe('column')
      })

      it('should compute containerStyles when direction changes', async () => {
        componentRef.setInput('direction', 'row-reverse')
        const expectedContainerStyles = {
          'flex-direction': 'row-reverse',
        }

        expect(await slotGroupHarness.verifyContainerStylesApplied(expectedContainerStyles)).toBe(true)
      })
    })

    describe('slotStyles input signal', () => {
      it('should have default empty object for slotStyles', () => {
        expect(component.slotStyles()).toEqual({})
      })

      it('should update slotStyles signal value', () => {
        const styles = { padding: '10px', margin: '5px' }
        componentRef.setInput('slotStyles', styles)

        expect(component.slotStyles()).toEqual(styles)
      })

      it('should pass slotStyles to all child slots', async () => {
        const styles = { padding: '10px', margin: '5px' }
        componentRef.setInput('slotStyles', styles)
        const slots = await slotGroupHarness.getAllSlots()

        for (const slot of slots) {
          expect(await slot.verifySlotStylesApplied(styles)).toBe(true)
        }
      })

      it('should dynamically update slot styles for all child slots when slotStyles input changes', async () => {
        const initialStyles = { color: 'red' }
        componentRef.setInput('slotStyles', initialStyles)
        const slots = await slotGroupHarness.getAllSlots()
        const updatedStyles = { color: 'green', 'font-weight': 'bold' }
        componentRef.setInput('slotStyles', updatedStyles)

        for (const slot of slots) {
          expect(await slot.verifySlotStylesApplied(updatedStyles)).toBe(true)
        }
      })
    })

    describe('slotClasses input signal', () => {
      it('should have default empty string for slotClasses', () => {
        expect(component.slotClasses()).toBe('')
      })

      it('should update slotClasses signal with string value', () => {
        const classesString = 'test-class another-class'
        componentRef.setInput('slotClasses', classesString)

        expect(component.slotClasses()).toBe(classesString)
      })

      it('should update slotClasses signal with array value', () => {
        const classesArray = ['class1', 'class2']
        componentRef.setInput('slotClasses', classesArray)

        expect(component.slotClasses()).toEqual(classesArray)
      })

      it('should update slotClasses signal with Set value', async () => {
        const classesSet = new Set(['set-class1', 'set-class2'])
        componentRef.setInput('slotClasses', classesSet)

        expect(component.slotClasses()).toEqual(classesSet)
      })

      it('should update slotClasses signal with object value', () => {
        const classesObject = { active: true, disabled: false }
        componentRef.setInput('slotClasses', classesObject)

        expect(component.slotClasses()).toEqual(classesObject)
      })

      it('should apply slotClasses as a string to all child slot divs', async () => {
        const classesString = 'string-class1 string-class2'
        componentRef.setInput('slotClasses', classesString)

        const startSlot = await slotGroupHarness.getStartSlot()
        const centerSlot = await slotGroupHarness.getCenterSlot()
        const endSlot = await slotGroupHarness.getEndSlot()

        expect(await startSlot?.verifyAllSlotDivsHaveClasses(classesString)).toBe(true)
        expect(await centerSlot?.verifyAllSlotDivsHaveClasses(classesString)).toBe(true)
        expect(await endSlot?.verifyAllSlotDivsHaveClasses(classesString)).toBe(true)
      })

      it('should apply slotClasses as an array to all child slot divs', async () => {
        const classesArray = ['array-class1', 'array-class2']
        componentRef.setInput('slotClasses', classesArray)

        const startSlot = await slotGroupHarness.getStartSlot()
        const centerSlot = await slotGroupHarness.getCenterSlot()
        const endSlot = await slotGroupHarness.getEndSlot()

        expect(await startSlot?.verifyAllSlotDivsHaveClasses(classesArray)).toBe(true)
        expect(await centerSlot?.verifyAllSlotDivsHaveClasses(classesArray)).toBe(true)
        expect(await endSlot?.verifyAllSlotDivsHaveClasses(classesArray)).toBe(true)
      })

      it('should apply slotClasses as a Set to all child slot divs', async () => {
        const classesSet = new Set(['set-class1', 'set-class2'])
        componentRef.setInput('slotClasses', classesSet)

        const startSlot = await slotGroupHarness.getStartSlot()
        const centerSlot = await slotGroupHarness.getCenterSlot()
        const endSlot = await slotGroupHarness.getEndSlot()

        expect(await startSlot?.verifyAllSlotDivsHaveClasses(classesSet)).toBe(true)
        expect(await centerSlot?.verifyAllSlotDivsHaveClasses(classesSet)).toBe(true)
        expect(await endSlot?.verifyAllSlotDivsHaveClasses(classesSet)).toBe(true)
      })

      it('should apply slotClasses as an object to all child slot divs', async () => {
        const classesObject = { 'object-class1': true, 'object-class2': false, 'object-class3': true }
        componentRef.setInput('slotClasses', classesObject)
        const expectedClasses = ['object-class1', 'object-class3']

        const startSlot = await slotGroupHarness.getStartSlot()
        const centerSlot = await slotGroupHarness.getCenterSlot()
        const endSlot = await slotGroupHarness.getEndSlot()

        expect(await startSlot?.verifyAllSlotDivsHaveClasses(expectedClasses)).toBe(true)
        expect(await centerSlot?.verifyAllSlotDivsHaveClasses(expectedClasses)).toBe(true)
        expect(await endSlot?.verifyAllSlotDivsHaveClasses(expectedClasses)).toBe(true)
      })
    })
    describe('slotInputs input signal', () => {
      it('should have default empty object for slotInputs', () => {
        expect(component.slotInputs()).toEqual({})
      })

      it('should update slotInputs signal value', () => {
        const inputs = { data: 'test', active: true }
        componentRef.setInput('slotInputs', inputs)

        expect(component.slotInputs()).toEqual(inputs)
      })

      it('should compute slotInputsStart, slotInputsCenter and slotInputsEnd correctly when slotInputs is set', () => {
        const inputs = { data: 'Computed' }

        componentRef.setInput('slotInputs', inputs)

        expect(component.slotInputsStart()).toEqual(inputs)
        expect(component.slotInputsCenter()).toEqual(inputs)
        expect(component.slotInputsEnd()).toEqual(inputs)
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

      it('should update slotOutputs signal value', () => {
        const outputs = {
          event: new EventEmitter<void>(),
        }
        componentRef.setInput('slotOutputs', outputs)

        expect(component.slotOutputs()).toEqual(outputs)
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
    })

    describe('groupClasses input signal', () => {
      it('should have default empty string for groupClasses', () => {
        expect(component.groupClasses()).toBe('')
      })

      it('should update groupClasses signal with string value', () => {
        componentRef.setInput('groupClasses', 'group-container main-layout')

        expect(component.groupClasses()).toBe('group-container main-layout')
      })

      it('should update groupClasses signal with array value', () => {
        const classes = ['flex-container', 'responsive']
        componentRef.setInput('groupClasses', classes)

        expect(component.groupClasses()).toEqual(classes)
      })

      it('should update groupClasses signal with object value', () => {
        const classes = { 'object-class1': true, 'object-class2': false, 'object-class3': true }
        componentRef.setInput('groupClasses', classes)

        expect(component.groupClasses()).toEqual(classes)
      })

      it('should apply groupClasses to container div', async () => {
        componentRef.setInput('groupClasses', 'test-group-class')
        const expectedClasses = ['test-group-class']

        expect(await slotGroupHarness.verifyContainerClasses(expectedClasses)).toBe(true)
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

      it('should compute containerStyles with custom direction and groupStyles', () => {
        componentRef.setInput('direction', 'column')
        componentRef.setInput('groupStyles', { gap: '15px', alignItems: 'center' })
        const expectedContainerStyles = {
          'flex-direction': 'column',
          gap: '15px',
          alignItems: 'center',
        }

        const containerStyles = component.containerStyles()

        expect(containerStyles).toEqual(expectedContainerStyles)
      })

      it('should update when groupStyles changes', async () => {
        componentRef.setInput('groupStyles', { padding: '10px' })
        const expectedContainerStyles = {
          'flex-direction': 'row',
          padding: '10px',
        }

        expect(await slotGroupHarness.verifyContainerStylesApplied(expectedContainerStyles)).toBe(true)

        componentRef.setInput('groupStyles', { padding: '20px', margin: '5px' })
        const updatedContainerStyles = {
          'flex-direction': 'row',
          padding: '20px',
          margin: '5px',
        }

        expect(await slotGroupHarness.verifyContainerStylesApplied(updatedContainerStyles)).toBe(true)
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

        const startSlot = await slotGroupHarness.getStartSlot()

        expect(await startSlot?.verifyAllSlotDivsHaveClasses(expectedClasses)).toBe(true)
        expect(await startSlot?.verifyAllSlotDivsHaveSameStyles(expectedStyles)).toBe(true)
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

        const centerSlot = await slotGroupHarness.getCenterSlot()

        expect(await centerSlot?.verifyAllSlotDivsHaveClasses(expectedClasses)).toBe(true)
        expect(await centerSlot?.verifyAllSlotDivsHaveSameStyles(expectedStyles)).toBe(true)
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

        const endSlot = await slotGroupHarness.getEndSlot()

        expect(await endSlot?.verifyAllSlotDivsHaveClasses(expectedClasses)).toBe(true)
        expect(await endSlot?.verifyAllSlotDivsHaveSameStyles(expectedStyles)).toBe(true)
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
        
        expect(allSlotDivs.length).toBe(6)

        expect(await slotGroupHarness.verifyStartSlotClassesForAllDivs(expectedClasses)).toBe(true)
        expect(await slotGroupHarness.verifyCenterSlotClassesForAllDivs(expectedClasses)).toBe(true)
        expect(await slotGroupHarness.verifyEndSlotClassesForAllDivs(expectedClasses)).toBe(true)

        const startSlot = await slotGroupHarness.getStartSlot()
        const centerSlot = await slotGroupHarness.getCenterSlot()
        const endSlot = await slotGroupHarness.getEndSlot()

        expect(await startSlot?.verifyAllSlotDivsHaveSameStyles(expectedStyles)).toBe(true)
        expect(await centerSlot?.verifyAllSlotDivsHaveSameStyles(expectedStyles)).toBe(true)
        expect(await endSlot?.verifyAllSlotDivsHaveSameStyles(expectedStyles)).toBe(true)
      })
    })
  })
})
