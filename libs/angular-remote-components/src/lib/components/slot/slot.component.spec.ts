/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Component, EventEmitter, Input } from '@angular/core'
import { provideSlotServiceMock, SlotServiceMock } from '@onecx/angular-remote-components/mocks'
import { SlotHarness } from '@onecx/angular-remote-components/testing'
import { SlotComponent } from './slot.component'
import { SLOT_SERVICE } from '../../services/slot.service'
import { ocxRemoteComponent } from '../../model/remote-component'

// Rxjs operators mock
import * as rxjsOperators from 'rxjs/operators'
import { interval } from 'rxjs'

import { dataStyleIdAttribute, RemoteComponentConfig, dataStyleIsolationAttribute } from '@onecx/angular-utils'

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  const fakeTopic = jest.requireActual('@onecx/accelerator').FakeTopic
  return {
    ...actual,
    ResizedEventsTopic: fakeTopic,
  }
})

import { ResizedEventType, Technologies, TopicResizedEventType } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { removeAllRcUsagesFromStyles, updateStylesForRcCreation } from '@onecx/angular-utils/style'

jest.mock('@onecx/angular-utils/style', () => {
  const actual = jest.requireActual('@onecx/angular-utils/style')
  return {
    ...actual,
    removeAllRcUsagesFromStyles: jest.fn(),
    updateStylesForRcCreation: jest.fn(),
  }
})

// Mock ResizeObserver
class ResizeObserverMock {
  constructor(private readonly callback: ResizeObserverCallback) {}
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
    this.callback([entry], this as unknown as ResizeObserver)
  }
}

;(global as any).ResizeObserver = ResizeObserverMock

// Mock ResizeEventsPublisher
class ResizeEventsPublisherMock {
  publish = jest.fn()
}

// Test component
@Component({
  selector: 'ocx-mock-angular-component',
  template: `<div>Mock Angular Component</div>`,
  standalone: false,
})
class MockAngularComponent implements ocxRemoteComponent {
  ocxInitRemoteComponent(_config: RemoteComponentConfig): void {
    console.log('MockAngularComponent initialized')
  }

  @Input() set initialInput(value: string) {
    console.log('MockAngularComponent initialInput', value)
    this._initialInput = value
  }
  private _initialInput = ''
  @Input() set initialOutput(value: EventEmitter<any>) {
    console.log('MockAngularComponent initialOutput', value)
    this._initialOutput = value
  }
  private _initialOutput: EventEmitter<any> = new EventEmitter()
}

describe('SlotComponent', () => {
  let component: SlotComponent
  let fixture: ComponentFixture<SlotComponent>
  let slotServiceMock: SlotServiceMock

  let resizeObserverMock: ResizeObserverMock
  let resizedEventsPublisherMock: ResizeEventsPublisherMock
  let resizedEventsTopic: FakeTopic<TopicResizedEventType>

  beforeEach(async () => {
    // Without this debounceTime is not working in tests with fakeAsync/tick
    jest
      .spyOn(rxjsOperators, 'debounceTime')
      .mockImplementation((timeout) => rxjsOperators.debounce(() => interval(timeout)))
    await TestBed.configureTestingModule({
      declarations: [SlotComponent, MockAngularComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideSlotServiceMock()],
    }).compileComponents()

    fixture = TestBed.createComponent(SlotComponent)
    component = fixture.componentInstance
    // These must be set before detectChanges which triggers ngOnInit
    fixture.componentRef.setInput('name', 'test-slot')
    resizedEventsPublisherMock = new ResizeEventsPublisherMock()
    ;(component as any)['resizedEventsPublisher'] = resizedEventsPublisherMock
    fixture.detectChanges()

    slotServiceMock = TestBed.inject(SLOT_SERVICE) as unknown as SlotServiceMock
    resizeObserverMock = (component as any).resizeObserver as ResizeObserverMock
    resizedEventsTopic = component['resizedEventsTopic'] as any as FakeTopic<TopicResizedEventType>
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should log error if slot service is not defined', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    component['slotService'] = undefined as any
    component.ngOnInit()
    expect(consoleSpy).toHaveBeenCalledWith(
      'SLOT_SERVICE token was not provided. test-slot slot will not be filled with data.'
    )
    consoleSpy.mockRestore()
  })

  describe('on destroy', () => {
    it('should destroy resizedEventsTopic', () => {
      const spy = jest.spyOn(component['resizedEventsTopic'], 'destroy')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should clear all subscriptions', () => {
      component['subscriptions'].push({ unsubscribe: jest.fn() } as any)
      fixture.detectChanges()

      const spy = jest.spyOn(component['subscriptions'][0], 'unsubscribe')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should disconnect resizeObserver', () => {
      const spy = jest.spyOn(component['resizeObserver']!, 'disconnect')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should not disconnect resizeObserver if not defined', () => {
      component['resizeObserver'] = undefined
      component.ngOnDestroy()
      expect(resizeObserverMock.disconnect).not.toHaveBeenCalled()
    })

    it('should cleanup all components', fakeAsync(() => {
      const spy = removeAllRcUsagesFromStyles as jest.Mock
      slotServiceMock.assignComponents({
        'test-slot': [
          {
            componentType: Promise.resolve(MockAngularComponent),
            permissions: [],
            remoteComponent: {
              appId: 'app-id',
              productName: 'product-name',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
        ],
      })
      tick(100)
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalledTimes(1)
    }))

    it('should clear view container', () => {
      const spy = jest.spyOn(component['viewContainerRef'], 'clear')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('component creation', () => {
    describe('angular component', () => {
      it('should create', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
        slotServiceMock.assignComponents({
          'test-slot': [
            {
              componentType: MockAngularComponent,
              permissions: ['mock-permission'],
              remoteComponent: {
                appId: 'app-angular',
                productName: 'angular-product',
                baseUrl: 'https://base.url',
                technology: Technologies.Angular,
              },
            },
          ],
        })
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('ocx-mock-angular-component')
        expect(element).not.toBeNull()

        expect(updateStylesForRcCreation).toHaveBeenCalled()
        expect(await element?.getAttribute(dataStyleIdAttribute)).toEqual('angular-product|app-angular')
        expect(await element?.getAttribute(dataStyleIsolationAttribute)).toEqual('')

        expect(consoleSpy).toHaveBeenCalledWith('MockAngularComponent initialized')

        consoleSpy.mockRestore()
      })

      it('should create if span was not found', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        jest.spyOn(component['viewContainerRef'].element.nativeElement, 'querySelector').mockReturnValue(null)
        slotServiceMock.assignComponents({
          'test-slot': [
            {
              componentType: MockAngularComponent,
              permissions: ['mock-permission'],
              remoteComponent: {
                appId: 'app-angular-no-span',
                productName: 'angular-product-no-span',
                baseUrl: 'https://base.url',
                technology: Technologies.Angular,
              },
            },
          ],
        })
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('ocx-mock-angular-component')
        expect(element).not.toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith(
          'Component span was not found for slot component creation. The order of the components may be incorrect.'
        )
      })
    })

    describe('webcomponent', () => {
      it('should create webcomponent module component', async () => {
        slotServiceMock.assignComponents({
          'test-slot': [
            {
              componentType: Promise.resolve(undefined),
              permissions: ['mock-permission'],
              remoteComponent: {
                appId: 'app-webcomponent-module',
                productName: 'webcomponent-module-product',
                baseUrl: 'https://base.url',
                technology: Technologies.WebComponentModule,
                elementName: 'mock-webcomponent-module',
              },
            },
          ],
        })
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('mock-webcomponent-module')
        expect(element).not.toBeNull()

        expect(updateStylesForRcCreation).toHaveBeenCalled()
        expect(await element?.getAttribute(dataStyleIdAttribute)).toEqual(
          'webcomponent-module-product|app-webcomponent-module'
        )
        expect(await element?.getAttribute(dataStyleIsolationAttribute)).toEqual('')
        expect(await element?.getProperty('ocxRemoteComponentConfig')).toEqual({
          appId: 'app-webcomponent-module',
          productName: 'webcomponent-module-product',
          baseUrl: 'https://base.url',
          permissions: ['mock-permission'],
        })
      })

      it('should create webcomponent script component', async () => {
        slotServiceMock.assignComponents({
          'test-slot': [
            {
              componentType: Promise.resolve(undefined),
              permissions: ['mock-permission'],
              remoteComponent: {
                appId: 'app-webcomponent-script',
                productName: 'webcomponent-script-product',
                baseUrl: 'https://base.url',
                technology: Technologies.WebComponentScript,
                elementName: 'mock-webcomponent-script',
              },
            },
          ],
        })
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('mock-webcomponent-script')
        expect(element).not.toBeNull()

        expect(updateStylesForRcCreation).toHaveBeenCalled()
        expect(await element?.getAttribute(dataStyleIdAttribute)).toEqual(
          'webcomponent-script-product|app-webcomponent-script'
        )
        expect(await element?.getAttribute(dataStyleIsolationAttribute)).toEqual('')
        expect(await element?.getProperty('ocxRemoteComponentConfig')).toEqual({
          appId: 'app-webcomponent-script',
          productName: 'webcomponent-script-product',
          baseUrl: 'https://base.url',
          permissions: ['mock-permission'],
        })
      })

      it('should create webcomponent if span was not found', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        jest.spyOn(component['viewContainerRef'].element.nativeElement, 'querySelector').mockReturnValue(null)
        slotServiceMock.assignComponents({
          'test-slot': [
            {
              componentType: Promise.resolve(undefined),
              permissions: ['mock-permission'],
              remoteComponent: {
                appId: 'app-webcomponent-no-span',
                productName: 'webcomponent-no-span-product',
                baseUrl: 'https://base.url',
                technology: Technologies.WebComponentModule,
                elementName: 'mock-webcomponent-no-span',
              },
            },
          ],
        })
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('mock-webcomponent-no-span')
        expect(element).not.toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith(
          'Component span was not found for slot component creation. The order of the components may be incorrect.'
        )
      })
    })

    it('should create multiple components', async () => {
      slotServiceMock.assignComponents({
        'test-slot': [
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-multiple-1',
              productName: 'multiple-product',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-multiple-2',
              productName: 'multiple-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-multiple',
            },
          },
        ],
      })
      fixture.detectChanges()

      const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

      const angularElement = await slotHarness.getElement('ocx-mock-angular-component')
      expect(angularElement).not.toBeNull()

      const webcomponentElement = await slotHarness.getElement('mock-webcomponent-multiple')
      expect(webcomponentElement).not.toBeNull()
    })

    it('should not create components if none assigned', async () => {
      const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

      const element = await slotHarness.getElement('non-existent-element')
      expect(element).toBeNull()
    })

    it('should not create component if type is undefined', async () => {
      const spy = jest.spyOn(component['viewContainerRef'], 'createComponent')
      slotServiceMock.assignComponents({
        'test-slot': [
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-undefined',
              productName: 'undefined-product',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
        ],
      })
      fixture.detectChanges()

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('component update', () => {
    it('should update components after creation', async () => {
      const spy = jest.spyOn(console, 'log').mockImplementation()
      fixture.componentRef.setInput('inputs', { initialInput: 'initialValue' })
      const eventEmitter = new EventEmitter()
      fixture.componentRef.setInput('outputs', {
        initialOutput: eventEmitter,
      })
      slotServiceMock.assignComponents({
        'test-slot': [
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-update',
              productName: 'update-product',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-update-webcomponent',
              productName: 'update-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-update',
            },
          },
        ],
      })
      fixture.detectChanges()

      const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

      expect(component.inputs()).toEqual({ initialInput: 'initialValue' })
      expect(component.outputs()).toEqual({ initialOutput: eventEmitter })
      const angularElement = await slotHarness.getElement('ocx-mock-angular-component')
      expect(angularElement).not.toBeNull()
      expect(spy).toHaveBeenCalledWith('MockAngularComponent initialInput', 'initialValue')
      expect(spy).toHaveBeenCalledWith('MockAngularComponent initialOutput', eventEmitter)

      const webcomponentElement = await slotHarness.getElement('mock-webcomponent-update')
      expect(webcomponentElement).not.toBeNull()
      expect(await webcomponentElement?.getProperty('initialInput')).toEqual('initialValue')
      expect(await webcomponentElement?.getProperty('initialOutput')).toBe(eventEmitter)
    })
  })

  describe('size changes', () => {
    it('should publish initial size', fakeAsync(() => {
      resizedEventsPublisherMock.publish.mockClear()
      resizeObserverMock.trigger(200, 100)

      tick(200) // debounceTime

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 200, height: 100 },
        },
      })
    }))
    it('should debounce size changes', fakeAsync(() => {
      resizedEventsPublisherMock.publish.mockClear()
      resizeObserverMock.trigger(200, 100)
      resizeObserverMock.trigger(300, 400)

      tick(120)

      resizeObserverMock.trigger(400, 700)

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 300, height: 400 },
        },
      })

      tick(100)

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 400, height: 700 },
        },
      })
    }))

    it('should publish when requestedEventsChanged emits for this slot', fakeAsync(() => {
      resizeObserverMock.trigger(200, 100)

      tick(200) // debounceTime

      resizedEventsPublisherMock.publish.mockClear()

      resizedEventsTopic.publish({
        type: ResizedEventType.REQUESTED_EVENTS_CHANGED,
        payload: {
          type: ResizedEventType.SLOT_RESIZED,
          name: 'test-slot',
        },
      })

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 200, height: 100 },
        },
      })
    }))
  })
})
