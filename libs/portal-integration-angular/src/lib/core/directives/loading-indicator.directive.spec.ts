import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LoadingIndicatorDirective } from './loading-indicator.directive'
import { By } from '@angular/platform-browser'

@Component({
  template: `<div ocxLoadingIndicator [ocxLoadingIndicator]="true" [overlayFullPage]="true">Loading FullPage</div>
    <div ocxLoadingIndicator [ocxLoadingIndicator]="true" [overlayFullPage]="false">Loading</div>
    <div ocxLoadingIndicator [ocxLoadingIndicator]="true" [overlayFullPage]="false" [isLoaderSmall]="true">
      Loading full page and small
    </div>
    <div ocxLoadingIndicator>Wrong setup</div>`,
  imports: [LoadingIndicatorDirective],
})
class TestComponent {}

describe('LoadingIndicatorDirective', () => {
  let fixture: ComponentFixture<TestComponent>
  let component: TestComponent

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, LoadingIndicatorDirective],
    }).compileComponents()

    fixture = TestBed.createComponent(TestComponent)
    fixture.detectChanges()

    component = fixture.componentInstance
  })

  it('should have three loaders', () => {
    expect(fixture.debugElement.queryAll(By.css('.loader')).length).toBe(3)
  })

  it('should be only one small loader', () => {
    expect(fixture.debugElement.queryAll(By.css('.loader-small')).length).toBe(1)
  })

  it('should be only one full-overlay loader', () => {
    expect(fixture.debugElement.queryAll(By.css('.full-overlay')).length).toBe(1)
  })

  it('should be two element-overlay loaders', () => {
    expect(fixture.debugElement.queryAll(By.css('.element-overlay')).length).toBe(2)
  })

  it('should create an instance', () => {
    expect(component).toBeTruthy()
  })
})
