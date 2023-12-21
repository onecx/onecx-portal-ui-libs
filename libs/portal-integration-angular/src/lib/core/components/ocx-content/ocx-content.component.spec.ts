import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OcxContentComponent } from './ocx-content.component'
import { Component } from '@angular/core'
import { OcxContentDirective } from '../../directives/ocx-content.directive'
import { By } from '@angular/platform-browser'

// Mock host component that's used in all tests that require a dynamic ocxContent title change
// Using this mock host allows us to simulate Angular @Input mechanisms
@Component({
  template: ` <ocx-content [title]="title"></ocx-content> `,
})
class TestHostComponent {
  title = ''
}

describe('OcxContentComponent', () => {
  let component: TestHostComponent | OcxContentComponent
  let fixture: ComponentFixture<TestHostComponent | OcxContentComponent>
  const titleElemID = 'ocxContentTitleElement'
  const testComponentTitle = 'My cool title'

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OcxContentComponent, OcxContentDirective, TestHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(OcxContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render a ocxContent card with no title by default', () => {
    // Check that the title is falsy (in this case '') by default
    expect(component.title).toBeFalsy()
    fixture.detectChanges()

    // Check that classList of element contains all expected classes
    const expectedClasses = ['card']
    expect(Object.keys(fixture.debugElement.children[0].classes)).toEqual(expectedClasses)

    // Check that title element doesn't exist inside of ocxContent card
    expect(fixture.debugElement.query(By.css(`#${titleElemID}`))).toBeFalsy()
  })

  it('should render a ocxContent card with a title, when given a title via input', () => {
    // Replace default component with custom host component to simulate input behavior
    fixture = TestBed.createComponent(TestHostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    // Check that initial rendering without title still works as expected
    // Check that the title is falsy (in this case '') by default
    expect(component.title).toBeFalsy()
    fixture.detectChanges()

    // Check that classList of element contains all expected classes
    const expectedClasses = ['card']
    expect(Object.keys(fixture.debugElement.children[0].children[0].classes)).toEqual(expectedClasses)

    // Check that title element doesn't exist inside of ocxContent card
    expect(fixture.debugElement.query(By.css(`#${titleElemID}`))).toBeFalsy()

    // Set title to a specific value
    component.title = testComponentTitle
    fixture.detectChanges()

    // Check that title now matches the expected value
    expect(component.title).toEqual(testComponentTitle)

    // Check that title element has been rendered and contains the expected text content
    const titleElement = fixture.debugElement.query(By.css(`#${titleElemID}`))
    expect(titleElement).toBeTruthy()
    expect(titleElement.nativeElement.textContent).toEqual(testComponentTitle)
  })
})
