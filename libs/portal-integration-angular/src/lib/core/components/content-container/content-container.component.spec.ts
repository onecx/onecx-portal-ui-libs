import { OcxContentContainerHarness } from '../../../../../testing/content-container.harness'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OcxContentContainerComponent } from './content-container.component'
import { OcxContentContainerDirective } from '../../directives/content-container.directive'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'

describe('OcxContentContainerComponent', () => {
  let component: OcxContentContainerComponent
  let fixture: ComponentFixture<OcxContentContainerComponent>
  let ocxContentContainerHarness: OcxContentContainerHarness

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OcxContentContainerComponent, OcxContentContainerDirective],
    }).compileComponents()

    fixture = TestBed.createComponent(OcxContentContainerComponent)
    component = fixture.componentInstance
    ocxContentContainerHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxContentContainerHarness)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render a horizontal layout container with md breakpoint by default', async () => {
    const expectedClasses = ['flex', 'mt-4', 'gap-3', 'flex-column', 'md:flex-row']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedClasses)
    expect(await ocxContentContainerHarness.getLayout()).toEqual('horizontal')
    expect(await ocxContentContainerHarness.getBreakpoint()).toEqual('md')
  })

  it('should render a horizontal layout container while respecting a specified breakpoint', async () => {
    component.breakpoint = 'lg'

    const expectedClassesLG = ['flex', 'mt-4', 'gap-3', 'flex-column', 'lg:flex-row']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedClassesLG)
    expect(await ocxContentContainerHarness.getLayout()).toEqual('horizontal')
    expect(await ocxContentContainerHarness.getBreakpoint()).toEqual('lg')
  })

  it('should render a vertical layout container if specified', async () => {
    component.layout = 'vertical'

    const expectedClasses = ['flex', 'mt-4', 'gap-3', 'flex-column']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedClasses)
    expect(await ocxContentContainerHarness.getLayout()).toEqual('vertical')
    expect(await ocxContentContainerHarness.getBreakpoint()).toBeUndefined()
  })
})
