import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TimelineModule } from '@openng/optimus-ui/timeline'
import { LifecycleHarness, TestbedHarnessEnvironment } from '../../../../testing'
import { LifecycleComponent, LifecycleStep } from './lifecycle.component'

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
      imports: [TimelineModule, BrowserAnimationsModule],
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
    fixture.componentRef.setInput('steps', mockSteps)
    const steps = await lifecycle.getSteps()
    const highlightedSteps = await lifecycle.getHighlightedSteps()
    expect(steps.length).toBe(3)
    expect(highlightedSteps.length).toBe(0)
    mockSteps.forEach(async (step, index) => {
      expect(await steps[index].text()).toEqual(step.title + (step.details ?? ''))
    })
  })

  it('should highlight a given lifecycle step', async () => {
    fixture.componentRef.setInput('steps', mockSteps)
    fixture.componentRef.setInput('activeStepId', 'test2')
    const steps = await lifecycle.getSteps()
    const highlightedSteps = await lifecycle.getHighlightedSteps()
    mockSteps.forEach(async (step, index) => {
      if (step.id == component.activeStepId()) {
        expect(await steps[index].hasClass('bg-primary')).toEqual(true)
      }
    })
    expect(steps.length).toBe(3)
    expect(highlightedSteps.length).toBe(1)
  })

  it('should expose the steps as a list with one list item per step', () => {
    fixture.componentRef.setInput('steps', mockSteps)
    fixture.detectChanges()
    const list = fixture.nativeElement.querySelector('[role="list"]') as HTMLElement
    expect(list).toBeTruthy()
    expect(list.tagName.toLowerCase()).toBe('p-timeline')
    const items = Array.from(list.children).filter((child) => child.getAttribute('role') === 'listitem')
    expect(items.length).toBe(3)
    expect(list.children.length).toBe(3)
    expect(fixture.nativeElement.querySelectorAll('[role="listitem"]').length).toBe(3)
  })

  it('should mark only the active step as current step with a visible non-colour cue', () => {
    fixture.componentRef.setInput('steps', mockSteps)
    fixture.componentRef.setInput('activeStepId', 'test2')
    fixture.detectChanges()
    const items = Array.from(fixture.nativeElement.querySelectorAll('[role="listitem"]')) as HTMLElement[]
    const current = items.map((item) => item.querySelector('[aria-current]')?.getAttribute('aria-current') ?? null)
    expect(current).toEqual([null, 'step', null])

    const activeCard = items[1].querySelector('.card') as HTMLElement
    expect(activeCard.classList).toContain('ocx-lifecycle-step-active')
    const icons = fixture.nativeElement.querySelectorAll('.ocx-lifecycle-current-icon')
    expect(icons.length).toBe(1)
    expect(activeCard.querySelector('h2 .ocx-lifecycle-current-icon')?.getAttribute('aria-hidden')).toBe('true')
    expect(activeCard.querySelector('h2')?.textContent?.trim()).toBe('Test 2')
  })

  it('should not mark any step as current without an active step', () => {
    fixture.componentRef.setInput('steps', mockSteps)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelectorAll('[aria-current]').length).toBe(0)
    expect(fixture.nativeElement.querySelectorAll('.ocx-lifecycle-current-icon').length).toBe(0)
    expect(fixture.nativeElement.querySelectorAll('.ocx-lifecycle-step-active').length).toBe(0)
  })

  it('should hide the decorative timeline markers from assistive technology', () => {
    fixture.componentRef.setInput('steps', mockSteps)
    fixture.detectChanges()
    const markers = Array.from(fixture.nativeElement.querySelectorAll('.p-timeline-event-marker')) as HTMLElement[]
    expect(markers.length).toBe(3)
    markers.forEach((marker) => expect(marker.getAttribute('aria-hidden')).toBe('true'))
  })

  it('should expose step titles as level 2 headings by default and allow configuring the level', () => {
    fixture.componentRef.setInput('steps', mockSteps)
    fixture.detectChanges()
    const query = (selector: string) =>
      Array.from(fixture.nativeElement.querySelectorAll(selector)).map((h) => (h as HTMLElement).textContent?.trim())
    expect(query('h2')).toEqual(['Test 1', 'Test 2', 'Test 3'])

    fixture.componentRef.setInput('stepTitleHeadingLevel', 3)
    fixture.detectChanges()
    expect(query('h2')).toEqual([])
    expect(query('h3')).toEqual(['Test 1', 'Test 2', 'Test 3'])
  })
})
