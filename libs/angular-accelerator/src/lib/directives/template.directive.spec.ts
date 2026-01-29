import {
  AfterViewInit,
  Component,
  EmbeddedViewRef,
  QueryList,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TemplateDirective } from './template.directive'

@Component({
  standalone: false,
  selector: 'ocx-test-component',
  template: `<ng-template ocxTemplate="header"><p>header</p></ng-template>
    <ng-template ocxTemplate="content"><p>content</p></ng-template>
    <ng-template #footer><p>footer</p></ng-template>`,
})
class TestForTemplateDirectiveComponent implements AfterViewInit {
  viewContainerRef = inject(ViewContainerRef)

  @ViewChildren(TemplateDirective) templates!: QueryList<TemplateDirective>
  views: EmbeddedViewRef<any>[] = []

  ngAfterViewInit() {
    this.templates.forEach((template, _) => {
      const view = this.viewContainerRef.createEmbeddedView(template.template)
      this.views.push(view)
    })
  }
}

describe('TemplateDirective', () => {
  let component: TestForTemplateDirectiveComponent
  let fixture: ComponentFixture<TestForTemplateDirectiveComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestForTemplateDirectiveComponent, TemplateDirective],
    }).compileComponents()
    fixture = TestBed.createComponent(TestForTemplateDirectiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should have 2 ocx templates', async () => {
    expect(component.templates.length).toBe(2)
  })

  it('should take the correct data and type', () => {
    expect(component.templates.get(0)?.name()).toBe('header')
    expect(component.templates.get(0)?.getType()).toBe('header')
    expect(component.templates.get(1)?.name()).toBe('content')
    expect(component.templates.get(1)?.getType()).toBe('content')
  })

  it('should have a template reference', () => {
    expect(component.views[0].rootNodes[0].textContent).toBe('header')
    expect(component.views[1].rootNodes[0].textContent).toBe('content')
  })
})
