import { OcxContentHarness } from './../../../../../testing/ocx-content.harness';
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OcxContentComponent } from './ocx-content.component'
import { OcxContentDirective } from '../../directives/ocx-content.directive'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('OcxContentComponent', () => {
  let component: OcxContentComponent
  let fixture: ComponentFixture<OcxContentComponent>
  let ocxContentHarness: OcxContentHarness
  const testComponentTitle = 'My cool title'

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OcxContentComponent, OcxContentDirective],
    }).compileComponents()

    fixture = TestBed.createComponent(OcxContentComponent)
    component = fixture.componentInstance
    ocxContentHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxContentHarness)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render a ocxContent card with no title by default', async () => {
    const expectedClasses = ['card']
    expect(await ocxContentHarness.getContentClasses()).toEqual(expectedClasses)
    expect(await ocxContentHarness.hasTitle()).toEqual(false)
  })

  it('should render a ocxContent card with a title, when given a title via input', async () => {
    const expectedClasses = ['card']
    expect(await ocxContentHarness.getContentClasses()).toEqual(expectedClasses)
    expect(await ocxContentHarness.hasTitle()).toEqual(false)

    component.title = testComponentTitle

    const expectedTitleClasses = ['font-medium', 'text-lg']
    expect(await ocxContentHarness.hasTitle()).toEqual(true)
    expect(await ocxContentHarness.getTitleContent()).toEqual(testComponentTitle)
    expect(await ocxContentHarness.getTitleClasses()).toEqual(expectedTitleClasses)
  })
})
