import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LifecycleComponent, LifecycleStep } from './lifecycle.component'
import { TimelineModule } from 'primeng/timeline'
import { LifecycleHarness, TestbedHarnessEnvironment } from '../../../../testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'

const mockSteps: LifecycleStep[] = [
  {
    id: 'test1',
    title: 'Test 1',
  },
  {
    id: 'test2',
    title: 'Test 2',
    details: 'Test 2 description',
  },
  {
    id: 'test3',
    title: 'Test 3',
  },
]

describe('LifecycleComponent', () => {
  let component: LifecycleComponent
  let fixture: ComponentFixture<LifecycleComponent>
  let lifecycle: LifecycleHarness

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LifecycleComponent],
      imports: [
        TimelineModule,
        AngularAcceleratorModule,
        BrowserAnimationsModule,
        TranslateTestingModule.withTranslations('en', {}),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(LifecycleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    lifecycle = await TestbedHarnessEnvironment.harnessForFixture(fixture, LifecycleHarness)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(lifecycle).toBeTruthy()
  })

  it('should not render any initial lifecycle steps', async () => {
    const steps = await lifecycle.getSteps()
    expect(steps.length).toBe(0)
  })

  it('should render given lifecycle steps', async () => {
    component.steps = mockSteps
    const steps = await lifecycle.getSteps()
    const highlightedSteps = await lifecycle.getHighlightedSteps()
    expect(steps.length).toBe(3)
    expect(highlightedSteps.length).toBe(0)
    mockSteps.forEach(async (step, index) => {
      expect(await steps[index].text()).toEqual(step.title + (step.details ?? ''))
    })
  })

  it('should highlight a given lifecycle step', async () => {
    component.steps = mockSteps
    component.activeStepId = 'test2'
    const steps = await lifecycle.getSteps()
    const highlightedSteps = await lifecycle.getHighlightedSteps()
    mockSteps.forEach(async (step, index) => {
      if (step.id == component.activeStepId) {
        expect(await steps[index].hasClass('bg-primary')).toEqual(true)
      }
    })
    expect(steps.length).toBe(3)
    expect(highlightedSteps.length).toBe(1)
  })
})
