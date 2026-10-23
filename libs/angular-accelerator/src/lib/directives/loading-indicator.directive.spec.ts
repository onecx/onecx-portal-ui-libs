/**
 * @jest-environment jsdom
 */
import { Component, DebugElement, ChangeDetectionStrategy } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { LoadingIndicatorDirective } from './loading-indicator.directive'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { TranslateService } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import axe from 'axe-core'

@Component({
  selector: 'ocx-test-full-page',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div [ocxLoadingIndicator]="isLoading">
      Content
    </div>
  `,
})
class TestDefaultComponent {
  isLoading = false
}

@Component({
  selector: 'ocx-test-a11y',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <main>
      <button id="outside">Outside</button>
      <div id="host" [ocxLoadingIndicator]="isLoading" [overlayFullPage]="fullPage">
        <button id="inside">Inside</button>
        @if (showInner) {
          <button id="removable">Removable</button>
        }
      </div>
    </main>
  `,
})
class TestA11yComponent {
  isLoading = false
  fullPage = false
  showInner = true
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
        TestA11yComponent,
      ],
      providers: [
        provideTranslateTestingService({
          en: { OCX_LOADING_INDICATOR: { LOADING_STARTED: 'Loading', LOADING_FINISHED: 'Loading finished' } },
        }),
      ],
    })
    TestBed.inject(TranslateService).use('en')
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

  describe('Accessibility', () => {
    let a11yFixture: ComponentFixture<TestA11yComponent>
    let announceSpy: jest.SpyInstance
    let host: HTMLElement

    const setLoading = async (isLoading: boolean) => {
      a11yFixture.componentInstance.isLoading = isLoading
      a11yFixture.detectChanges()
      await a11yFixture.whenStable()
    }

    const button = (id: string) => a11yFixture.nativeElement.querySelector(`#${id}`) as HTMLButtonElement

    beforeEach(() => {
      announceSpy = jest.spyOn(TestBed.inject(LiveAnnouncer), 'announce').mockResolvedValue()
      a11yFixture = TestBed.createComponent(TestA11yComponent)
      document.body.appendChild(a11yFixture.nativeElement)
      a11yFixture.detectChanges()
      host = a11yFixture.nativeElement.querySelector('#host')
    })

    afterEach(() => {
      a11yFixture.nativeElement.remove()
    })

    it('should not announce anything initially', async () => {
      await a11yFixture.whenStable()
      expect(announceSpy).not.toHaveBeenCalled()
    })

    it('should announce start and end of loading exactly once', async () => {
      await setLoading(true)
      expect(announceSpy).toHaveBeenCalledTimes(1)
      expect(announceSpy).toHaveBeenLastCalledWith('Loading', 'polite')

      a11yFixture.componentInstance.fullPage = true
      a11yFixture.detectChanges()
      await a11yFixture.whenStable()
      expect(announceSpy).toHaveBeenCalledTimes(1)

      await setLoading(false)
      expect(announceSpy).toHaveBeenCalledTimes(2)
      expect(announceSpy).toHaveBeenLastCalledWith('Loading finished', 'polite')

      await setLoading(false)
      expect(announceSpy).toHaveBeenCalledTimes(2)
    })

    it.each([false, true])('should mark the host busy and inert while loading (fullPage: %s)', async (fullPage) => {
      a11yFixture.componentInstance.fullPage = fullPage
      await setLoading(true)
      expect(host.getAttribute('aria-busy')).toBe('true')
      expect(host.hasAttribute('inert')).toBe(true)

      await setLoading(false)
      expect(host.hasAttribute('aria-busy')).toBe(false)
      expect(host.hasAttribute('inert')).toBe(false)
    })

    it('should hide the element loader from the accessibility tree', async () => {
      await setLoading(true)
      expect(host.querySelector('.loader')?.getAttribute('aria-hidden')).toBe('true')
    })

    it('should hide the full page loader from the accessibility tree', async () => {
      a11yFixture.componentInstance.fullPage = true
      await setLoading(true)
      const overlay = a11yFixture.nativeElement.querySelector('ocx-loading-indicator') as HTMLElement
      expect(overlay.getAttribute('aria-hidden')).toBe('true')
    })

    it.each([false, true])('should have no axe violations while loading (fullPage: %s)', async (fullPage) => {
      a11yFixture.componentInstance.fullPage = fullPage
      await setLoading(true)
      const results = await axe.run(a11yFixture.nativeElement, {
        rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
      })
      expect(results.violations).toEqual([])
    })

    it('should restore focus to the previously focused element after inert moved it to the body', async () => {
      button('inside').focus()
      await setLoading(true)
      // browsers blur focused descendants of an inert element
      button('inside').blur()
      expect(document.activeElement).toBe(document.body)
      await setLoading(false)
      expect(document.activeElement).toBe(button('inside'))
    })

    it('should restore focus when focus stayed inside the host', async () => {
      button('inside').focus()
      await setLoading(true)
      await setLoading(false)
      expect(document.activeElement).toBe(button('inside'))
    })

    it('should focus the host when the previously focused element was removed', async () => {
      button('removable').focus()
      await setLoading(true)
      a11yFixture.componentInstance.showInner = false
      a11yFixture.detectChanges()
      await setLoading(false)
      expect(host.getAttribute('tabindex')).toBe('-1')
      expect(document.activeElement).toBe(host)
    })

    it('should keep an existing tabindex when focusing the host', async () => {
      host.setAttribute('tabindex', '0')
      button('removable').focus()
      await setLoading(true)
      a11yFixture.componentInstance.showInner = false
      a11yFixture.detectChanges()
      await setLoading(false)
      expect(host.getAttribute('tabindex')).toBe('0')
      expect(document.activeElement).toBe(host)
    })

    it('should not move focus when it was outside the host', async () => {
      button('outside').focus()
      await setLoading(true)
      await setLoading(false)
      expect(document.activeElement).toBe(button('outside'))
    })

    it('should not steal focus when the user moved focus elsewhere during loading', async () => {
      button('inside').focus()
      await setLoading(true)
      button('outside').focus()
      await setLoading(false)
      expect(document.activeElement).toBe(button('outside'))
    })
  })

  describe('Mode switching', () => {
    let a11yFixture: ComponentFixture<TestA11yComponent>
    let host: HTMLElement

    const render = (isLoading: boolean, fullPage: boolean) => {
      a11yFixture.componentInstance.isLoading = isLoading
      a11yFixture.componentInstance.fullPage = fullPage
      a11yFixture.detectChanges()
    }

    beforeEach(() => {
      a11yFixture = TestBed.createComponent(TestA11yComponent)
      a11yFixture.detectChanges()
      host = a11yFixture.nativeElement.querySelector('#host')
    })

    it('should leave no residual element-overlay after switching from full page to element mode', () => {
      render(true, true)
      render(false, true)
      render(true, false)
      expect(host.classList.contains('element-overlay')).toBe(true)

      render(false, false)
      expect(host.classList.contains('element-overlay')).toBe(false)
      expect(host.querySelector('.loader')).toBeFalsy()
      expect(a11yFixture.debugElement.query(By.directive(LoadingIndicatorComponent))).toBeFalsy()
    })

    it('should swap overlays when the mode changes while loading', () => {
      render(true, true)
      render(true, false)
      expect(a11yFixture.debugElement.query(By.directive(LoadingIndicatorComponent))).toBeFalsy()
      expect(host.classList.contains('element-overlay')).toBe(true)

      render(true, true)
      expect(host.classList.contains('element-overlay')).toBe(false)
      expect(host.querySelector('.loader')).toBeFalsy()
      expect(a11yFixture.debugElement.queryAll(By.directive(LoadingIndicatorComponent)).length).toBe(1)

      render(false, true)
      expect(a11yFixture.debugElement.query(By.directive(LoadingIndicatorComponent))).toBeFalsy()
    })
  })
})
