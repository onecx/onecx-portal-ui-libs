import { OcxContentHarness } from '../../../../testing/content.harness'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OcxContentComponent } from './content.component'
import { OcxContentDirective } from '../../directives/content.directive'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Component } from '@angular/core'
import { By } from '@angular/platform-browser'

@Component({
  standalone: false,
  template: `
    <ocx-content title="Test 1">
      <p>Content inside of ocx-content with title</p>
    </ocx-content>
    <ocx-content title="Test 2">
      <p>Content inside of ocx-content with title</p>
    </ocx-content>
    <ocx-content title="Test 3">
      <p>Content inside of ocx-content with title</p>
    </ocx-content>
  `,
})
class MockComponent {}

describe('OcxContentComponent', () => {
  describe('1 component per page', () => {
    let component: OcxContentComponent
    let fixture: ComponentFixture<OcxContentComponent>
    let ocxContentHarness: OcxContentHarness
    const testComponentTitle = 'My cool title'
    const titleBaseId = 'ocx_content_title_element'
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
      expect(await ocxContentHarness.hasTitle(titleBaseId)).toEqual(false)
    })

    it('should render a ocxContent card with a title, when given a title via input', async () => {
      const expectedClasses = ['card']
      expect(await ocxContentHarness.getContentClasses()).toEqual(expectedClasses)
      expect(await ocxContentHarness.hasTitle(titleBaseId)).toEqual(false)

      fixture.componentRef.setInput('title', testComponentTitle)
      fixture.detectChanges()

      const expectedTitleClasses = ['font-medium', 'text-lg']
      expect(await ocxContentHarness.hasTitle(titleBaseId)).toEqual(true)
      expect(await ocxContentHarness.hasTitle(titleBaseId + '0')).toEqual(false)
      expect(await ocxContentHarness.getTitle(titleBaseId)).toEqual(testComponentTitle)
      expect(await ocxContentHarness.getTitleClasses(titleBaseId)).toEqual(expectedTitleClasses)
    })
    it('should apply classes specified via input', async () => {
      fixture.componentRef.setInput('styleClass', 'py-4 mt-2')
      fixture.detectChanges()
      const expectedStyleClasses = ['card', 'py-4', 'mt-2']
      expect(await ocxContentHarness.getContentClasses()).toEqual(expectedStyleClasses)
    })
  })

  describe('Multiple components per page', () => {
    let component: MockComponent
    let fixture: ComponentFixture<MockComponent>
    const titleBaseId = 'ocx_content_title_element'
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [MockComponent, OcxContentComponent, OcxContentDirective],
      }).compileComponents()

      fixture = TestBed.createComponent(MockComponent)
      component = fixture.componentInstance
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should render 3 ocxContent cards with different title IDs', async () => {
      fixture.detectChanges()

      const ocxContents = fixture.debugElement.queryAll(By.directive(OcxContentDirective))
      expect(ocxContents.length).toEqual(3)

      ocxContents.forEach((_content, index) => {
        const idSuffix = index > 0 ? `${index - 1}` : ''
        expect(fixture.debugElement.queryAll(By.css(`#${titleBaseId + idSuffix}`)).length).toBe(1)
      })
    })
  })
})
