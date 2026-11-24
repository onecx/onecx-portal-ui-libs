import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BehaviorSubject, of } from 'rxjs'
import { SlotService, SlotComponent, SlotComponentConfiguration } from '@onecx/angular-remote-components'
import { ColumnType } from '../../model/column-type.model'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { ColumnGroupSelectionComponent } from '../column-group-selection/column-group-selection.component'
import { provideAppStateServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideRouter } from '@angular/router'
import { provideTranslateTestingService } from '@onecx/angular-testing'

// happy-dom does not ship a ResizeObserver implementation; the ocx-slot injects one during init.
class ResizeObserverMock {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

;(global as any).ResizeObserver = ResizeObserverMock

const columns = [{ id: 'c1', nameKey: 'g2', columnType: ColumnType.STRING }]

type SlotServiceStub = Pick<SlotService, 'isSomeComponentDefinedForSlot' | 'getComponentsForSlot'>

const configureTestingModule = (slotService: SlotServiceStub) =>
  TestBed.configureTestingModule({
    imports: [AngularAcceleratorModule],
    providers: [
      provideTranslateTestingService({ en: {} }),
      provideUserServiceMock(),
      provideAppStateServiceMock(),
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: SlotService, useValue: slotService },
    ],
  })

const withSlotComponentDefined = () =>
  configureTestingModule({
    isSomeComponentDefinedForSlot: () => new BehaviorSubject(true).asObservable(),
    getComponentsForSlot: () => of([] as SlotComponentConfiguration[]),
  })

const withNoSlotComponent = () =>
  configureTestingModule({
    isSomeComponentDefinedForSlot: () => new BehaviorSubject(false).asObservable(),
    getComponentsForSlot: () => of([] as SlotComponentConfiguration[]),
  })

describe('InteractiveDataViewComponent (group key slot input)', () => {
  it('given a group selection slot component and selectedGroupKey g2, when rendered, then the slot input is g2', async () => {
    await withSlotComponentDefined().compileComponents()

    const fixture: ComponentFixture<InteractiveDataViewComponent> =
      TestBed.createComponent(InteractiveDataViewComponent)
    fixture.componentRef.setInput('layout', 'table')
    fixture.componentRef.setInput('searchConfigPermission', 'mocked-permission')
    fixture.componentRef.setInput('columns', columns)
    fixture.detectChanges()
    fixture.componentRef.setInput('selectedGroupKey', 'g2')
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    const slot = fixture.debugElement.query(By.css('ocx-slot'))
    expect(slot).toBeTruthy()
    expect((slot.componentInstance as SlotComponent).inputs().selectedGroupKey).toBe('g2')
  })

  it('given no slot component and an active group of g2, when the default selector renders, then the group keys contain g2', async () => {
    await withNoSlotComponent().compileComponents()

    const fixture: ComponentFixture<InteractiveDataViewComponent> =
      TestBed.createComponent(InteractiveDataViewComponent)
    fixture.componentRef.setInput('layout', 'table')
    fixture.componentRef.setInput('columns', columns)
    fixture.detectChanges()
    fixture.componentRef.setInput('selectedGroupKey', 'g2')
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    const groupSelection = fixture.debugElement.query(By.css('ocx-column-group-selection'))
    expect(groupSelection).toBeTruthy()
    expect((groupSelection.componentInstance as ColumnGroupSelectionComponent).allGroupKeys()).toContain('g2')
  })
})
