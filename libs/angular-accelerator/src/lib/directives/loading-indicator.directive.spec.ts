import { Component, DebugElement } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { LoadingIndicatorDirective } from './loading-indicator.directive'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'

@Component({
  selector: 'ocx-test-full-page',
  standalone: false,
  template: `
    <div 
      [ocxLoadingIndicator]="isLoading" 
      [overlayFullPage]="true">
      Content
    </div>
  `,
})
class TestFullPageComponent {
  isLoading = false
}

@Component({
  selector: 'ocx-test-element',
  standalone: false,
  template: `
    <div 
      [ocxLoadingIndicator]="isLoading" 
      [overlayFullPage]="false">
      Content
    </div>
  `,
})
class TestElementComponent {
  isLoading = false
}

@Component({
  selector: 'ocx-test-small-loader',
  standalone: false,
  template: `
    <div 
      [ocxLoadingIndicator]="isLoading" 
      [overlayFullPage]="false"
      [isLoaderSmall]="true">
      Content
    </div>
  `,
})
class TestSmallLoaderComponent {
  isLoading = false
}

@Component({
  selector: 'ocx-test-default',
  standalone: false,
  template: `
    <div [ocxLoadingIndicator]="isLoading">
      Content
    </div>
  `,
})
class TestDefaultComponent {
  isLoading = false
}

describe('LoadingIndicatorDirective', () => {
  let fixture: ComponentFixture<any>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoadingIndicatorDirective,
        LoadingIndicatorComponent,
        TestFullPageComponent,
        TestElementComponent,
        TestSmallLoaderComponent,
        TestDefaultComponent,
      ],
    })
  })

  describe('Full page overlay', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestFullPageComponent)
    })

    it('should create', () => {
      fixture.detectChanges()
      const directive = fixture.debugElement.query(By.directive(LoadingIndicatorDirective))
      expect(directive).toBeTruthy()
    })

    it('should not display loading indicator initially when isLoading is false', () => {
      fixture.componentInstance.isLoading = false
      fixture.detectChanges()

      const loadingComponent = fixture.debugElement.query(By.directive(LoadingIndicatorComponent))
      expect(loadingComponent).toBeFalsy()
    })

    it('should create LoadingIndicatorComponent when isLoading is true with full page overlay', () => {
      fixture.componentInstance.isLoading = true
      fixture.detectChanges()

      const loadingComponent = fixture.debugElement.query(By.directive(LoadingIndicatorComponent))
      expect(loadingComponent).toBeTruthy()
    })

    it('should destroy LoadingIndicatorComponent when isLoading changes from true to false', () => {
      fixture.componentInstance.isLoading = true
      fixture.detectChanges()

      let loadingComponent = fixture.debugElement.query(By.directive(LoadingIndicatorComponent))
      expect(loadingComponent).toBeTruthy()

      fixture.componentInstance.isLoading = false
      fixture.detectChanges()

      loadingComponent = fixture.debugElement.query(By.directive(LoadingIndicatorComponent))
      expect(loadingComponent).toBeFalsy()
    })
  })

  describe('Element overlay', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestElementComponent)
    })

    it('should add element-overlay class and loader div when isLoading is true', () => {
      fixture.componentInstance.isLoading = true
      fixture.detectChanges()

      const directiveElement: DebugElement = fixture.debugElement.query(By.directive(LoadingIndicatorDirective))
      const nativeElement: HTMLElement = directiveElement.nativeElement

      expect(nativeElement.classList.contains('element-overlay')).toBe(true)
      
      const loaderElement = nativeElement.querySelector('.loader')
      expect(loaderElement).toBeTruthy()
    })

    it('should remove element-overlay class and loader div when isLoading changes to false', () => {
      fixture.componentInstance.isLoading = true
      fixture.detectChanges()

      const directiveElement: DebugElement = fixture.debugElement.query(By.directive(LoadingIndicatorDirective))
      const nativeElement: HTMLElement = directiveElement.nativeElement

      expect(nativeElement.classList.contains('element-overlay')).toBe(true)
      expect(nativeElement.querySelector('.loader')).toBeTruthy()

      fixture.componentInstance.isLoading = false
      fixture.detectChanges()

      expect(nativeElement.classList.contains('element-overlay')).toBe(false)
      expect(nativeElement.querySelector('.loader')).toBeFalsy()
    })

    it('should not create LoadingIndicatorComponent when overlayFullPage is false', () => {
      fixture.componentInstance.isLoading = true
      fixture.detectChanges()

      const loadingComponent = fixture.debugElement.query(By.directive(LoadingIndicatorComponent))
      expect(loadingComponent).toBeFalsy()
    })
  })

  describe('Small loader', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestSmallLoaderComponent)
    })

    it('should add loader-small class when isLoaderSmall is true', () => {
      fixture.componentInstance.isLoading = true
      fixture.detectChanges()

      const directiveElement: DebugElement = fixture.debugElement.query(By.directive(LoadingIndicatorDirective))
      const nativeElement: HTMLElement = directiveElement.nativeElement
      const loaderElement = nativeElement.querySelector('.loader')

      expect(loaderElement).toBeTruthy()
      expect(loaderElement?.classList.contains('loader-small')).toBe(true)
    })

    it('should not have loader-small class when isLoaderSmall is false', () => {
      fixture = TestBed.createComponent(TestElementComponent)
      fixture.componentInstance.isLoading = true
      fixture.detectChanges()

      const directiveElement: DebugElement = fixture.debugElement.query(By.directive(LoadingIndicatorDirective))
      const nativeElement: HTMLElement = directiveElement.nativeElement
      const loaderElement = nativeElement.querySelector('.loader')

      expect(loaderElement).toBeTruthy()
      expect(loaderElement?.classList.contains('loader-small')).toBe(false)
    })
  })

  describe('Default behavior', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestDefaultComponent)
    })

    it('should use element overlay by default (overlayFullPage defaults to false)', () => {
      fixture.componentInstance.isLoading = true
      fixture.detectChanges()

      const directiveElement: DebugElement = fixture.debugElement.query(By.directive(LoadingIndicatorDirective))
      const nativeElement: HTMLElement = directiveElement.nativeElement

      expect(nativeElement.classList.contains('element-overlay')).toBe(true)
      expect(nativeElement.querySelector('.loader')).toBeTruthy()

      const loadingComponent = fixture.debugElement.query(By.directive(LoadingIndicatorComponent))
      expect(loadingComponent).toBeFalsy()
    })

    it('should not show any loading indicator when isLoading defaults to false', () => {
      fixture.detectChanges()

      const directiveElement: DebugElement = fixture.debugElement.query(By.directive(LoadingIndicatorDirective))
      const nativeElement: HTMLElement = directiveElement.nativeElement

      expect(nativeElement.classList.contains('element-overlay')).toBe(false)
      expect(nativeElement.querySelector('.loader')).toBeFalsy()

      const loadingComponent = fixture.debugElement.query(By.directive(LoadingIndicatorComponent))
      expect(loadingComponent).toBeFalsy()
    })
  })

  describe('Toggle scenarios', () => {
    it('should handle multiple toggles correctly with full page overlay', () => {
      fixture = TestBed.createComponent(TestFullPageComponent)
      fixture.detectChanges()

      fixture.componentInstance.isLoading = true
      fixture.detectChanges()
      expect(fixture.debugElement.query(By.directive(LoadingIndicatorComponent))).toBeTruthy()

      fixture.componentInstance.isLoading = false
      fixture.detectChanges()
      expect(fixture.debugElement.query(By.directive(LoadingIndicatorComponent))).toBeFalsy()

      fixture.componentInstance.isLoading = true
      fixture.detectChanges()
      expect(fixture.debugElement.query(By.directive(LoadingIndicatorComponent))).toBeTruthy()
    })

    it('should handle multiple toggles correctly with element overlay', () => {
      fixture = TestBed.createComponent(TestElementComponent)
      fixture.detectChanges()

      const directiveElement: DebugElement = fixture.debugElement.query(By.directive(LoadingIndicatorDirective))
      const nativeElement: HTMLElement = directiveElement.nativeElement

      fixture.componentInstance.isLoading = true
      fixture.detectChanges()
      expect(nativeElement.classList.contains('element-overlay')).toBe(true)
      expect(nativeElement.querySelector('.loader')).toBeTruthy()

      fixture.componentInstance.isLoading = false
      fixture.detectChanges()
      expect(nativeElement.classList.contains('element-overlay')).toBe(false)
      expect(nativeElement.querySelector('.loader')).toBeFalsy()

      fixture.componentInstance.isLoading = true
      fixture.detectChanges()
      expect(nativeElement.classList.contains('element-overlay')).toBe(true)
      expect(nativeElement.querySelector('.loader')).toBeTruthy()
    })
  })
})
