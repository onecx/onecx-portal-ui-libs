import { readFileSync } from 'fs'
import { join } from 'path'
import * as sass from 'sass'
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

  describe('Reduced motion (WCAG 2.3.3 / 2.2.2) stylesheet coverage', () => {
    // The spinner animation and its reduced-motion override are pure CSS (no JS reads
    // `matchMedia` to toggle it), so they can only be covered by asserting on the stylesheet
    // rather than the rendered DOM. SCSS is compiled to real CSS and the
    // declarations that actually end up *inside* the reduced-motion `@media` block are inspected, so a
    // matching rule that accidentally leaked outside the block (or that a greedy source
    // regex would still match) cannot make the test pass.
    const source = readFileSync(join(__dirname, 'loading-indicator.directive.scss'), 'utf-8')
    const compiledCss = sass.compileString(source).css

    // Returns the declarations of every top-level `@media (prefers-reduced-motion: reduce)`
    // block, extracted from balanced braces so the media query's own closing brace is never
    // confused with an inner rule's closing brace.
    function reducedMotionDeclarations(css: string): string {
      const mediaPattern = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{/g
      let declarations = ''
      let match: RegExpExecArray | null
      while ((match = mediaPattern.exec(css)) !== null) {
        const bodyStart = match.index + match[0].length
        let depth = 1
        let cursor = bodyStart
        while (cursor < css.length && depth > 0) {
          const char = css[cursor]
          if (char === '{') {
            depth++
          } else if (char === '}') {
            depth--
          }
          cursor++
        }
        declarations += css.slice(bodyStart, cursor - 1)
      }
      return declarations
    }

    it('should spin the loader by default', () => {
      expect(compiledCss).toMatch(/animation:\s*rotation 1s linear infinite/)
    })

    it('should disable the loader animation when the user prefers reduced motion', () => {
      // The reduced-motion `@media` block must contain a `.loader` rule that sets
      // `animation: none` so a static ring is shown.
      const declarations = reducedMotionDeclarations(compiledCss)
      expect(declarations).not.toBe('')
      expect(declarations).toMatch(/\.loader\s*\{[^}]*animation:\s*none/)
    })
  })
})
