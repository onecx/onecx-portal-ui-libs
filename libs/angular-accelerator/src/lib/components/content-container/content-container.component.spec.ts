import { OcxContentContainerHarness } from '../../../../testing/content-container.harness'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OcxContentContainerComponent } from './content-container.component'
import { OcxContentContainerDirective } from '../../directives/content-container.directive'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { By } from '@angular/platform-browser'

describe('OcxContentContainerComponent', () => {
  let component: OcxContentContainerComponent
  let fixture: ComponentFixture<OcxContentContainerComponent>
  let ocxContentContainerHarness: OcxContentContainerHarness
  let directive: OcxContentContainerDirective

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OcxContentContainerComponent, OcxContentContainerDirective],
    }).compileComponents()

    fixture = TestBed.createComponent(OcxContentContainerComponent)
    component = fixture.componentInstance
    ocxContentContainerHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxContentContainerHarness)
    const directiveElement = fixture.debugElement.query(By.directive(OcxContentContainerDirective))
    directive = directiveElement.injector.get(OcxContentContainerDirective)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render a horizontal layout container with md breakpoint by default', async () => {
    const expectedClasses = ['flex', 'gap-3', 'flex-column', 'md:flex-row']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedClasses)
    expect(await ocxContentContainerHarness.getLayout()).toEqual('horizontal')
    expect(await ocxContentContainerHarness.getBreakpoint()).toEqual('md')
  })

  it('should render a horizontal layout container while respecting a specified breakpoint', async () => {
    component.breakpoint = 'lg'

    const expectedClassesLG = ['flex', 'gap-3', 'flex-column', 'lg:flex-row']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedClassesLG)
    expect(await ocxContentContainerHarness.getLayout()).toEqual('horizontal')
    expect(await ocxContentContainerHarness.getBreakpoint()).toEqual('lg')
  })

  it('should render a vertical layout container if specified', async () => {
    component.layout = 'vertical'

    const expectedClasses = ['flex', 'gap-3', 'flex-column']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedClasses)
    expect(await ocxContentContainerHarness.getLayout()).toEqual('vertical')
    expect(await ocxContentContainerHarness.getBreakpoint()).toBeUndefined()
  })

  it('should render a container with specified style classes and remove conflicting classes', async () => {
    let expectedStyleClasses = ['flex', 'gap-3', 'flex-column', 'md:flex-row']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedStyleClasses)
    component.styleClass = 'py-4 flex-row gap-2'
    fixture.detectChanges()
    await fixture.whenStable()
    directive.ngOnChanges()
    expectedStyleClasses = ['flex', 'md:flex-row', 'py-4', 'flex-row', 'gap-2']
    expect((await ocxContentContainerHarness.getLayoutClasses()).sort()).toEqual(expectedStyleClasses.sort())
  })
})
