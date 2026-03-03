import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { DivHarness } from '@onecx/angular-testing'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'
import { LoadingIndicatorDirective } from './loading-indicator.directive'
import { ComponentHarness } from '@angular/cdk/testing'

@Component({
  standalone: false,
  template: `
    <div
      id="host"
      [ocxLoadingIndicator]="loading"
      [overlayFullPage]="overlayFullPage"
      [isLoaderSmall]="isLoaderSmall"
    ></div>
  `,
})
class HostComponent {
  loading = false
  overlayFullPage = false
  isLoaderSmall = false

  @ViewChild(LoadingIndicatorDirective)
  directive!: LoadingIndicatorDirective
}

class LoaderHarness extends ComponentHarness {
  static hostSelector = '.loader'
}

describe('LoadingIndicatorDirective', () => {
  let fixture: ComponentFixture<HostComponent>
  let component: HostComponent
  let divHarness: DivHarness

  // loader for the whole fixture DOM
  let rootLoader: ReturnType<typeof TestbedHarnessEnvironment.loader>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, LoadingIndicatorDirective, LoadingIndicatorComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    rootLoader = TestbedHarnessEnvironment.loader(fixture)
    divHarness = await rootLoader.getHarness(DivHarness.with({ id: 'host' }))
  })

  // Scopes a LoaderHarness lookup to the host <div id="host"> only.
  class HostHarness extends ComponentHarness {
    static hostSelector = '#host'
    getLoader = this.locatorForOptional(LoaderHarness)
  }

  const getHostHarness = () => rootLoader.getHarness(HostHarness)

  const expectHasLoader = async (cssClassSelector: string) => {
    const host = await getHostHarness()
    const loader = await host.getLoader()
    expect(loader).not.toBeNull()

    if (cssClassSelector && cssClassSelector !== '.loader') {
      // validate additional class selectors like ".loader-small"
      const classes = cssClassSelector
        .split('.')
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((s) => s !== 'loader')

      for (const clazz of classes) {
        expect(await (await loader!.host()).hasClass(clazz)).toBe(true)
      }
    }
  }

  const expectNoLoader = async () => {
    const host = await getHostHarness()
    const loader = await host.getLoader()
    expect(loader).toBeNull()
  }

  it('should not render loader and not create component initially', async () => {
    // Initial state should not have overlay/loader.
    expect(await divHarness.checkHasClass('element-overlay')).toBe(false)
    await expectNoLoader()

    const dir: any = component.directive
    expect(dir.componentRef).toBeUndefined()
  })

  describe('element overlay mode', () => {
    it('should add overlay class and append loader', async () => {
      component.loading = true
      component.overlayFullPage = false
      component.isLoaderSmall = false
      fixture.detectChanges()

      expect(await divHarness.checkHasClass('element-overlay')).toBe(true)

      await expectHasLoader('.loader')

      const dir: any = component.directive
      expect(dir.componentRef).toBeUndefined()
    })

    it('should append small loader when isLoaderSmall=true', async () => {
      component.loading = true
      component.overlayFullPage = false
      component.isLoaderSmall = true
      fixture.detectChanges()

      await expectHasLoader('.loader.loader-small')
    })

    it('should clear view container when loading=false (even in element overlay mode)', () => {
      component.loading = true
      fixture.detectChanges()

      const dir: any = component.directive
      const clearSpy = jest.spyOn(dir.viewContainerRef, 'clear')

      component.loading = false
      fixture.detectChanges()

      expect(clearSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('full page overlay mode', () => {
    it('should create component when loading=true and overlayFullPage=true', async () => {
      component.loading = true
      component.overlayFullPage = true
      fixture.detectChanges()

      const dir: any = component.directive
      expect(dir.componentRef).toBeDefined()

      // Ensure something was created in the view container.
      expect(dir.viewContainerRef.length).toBe(1)

      // No element overlay artifacts expected.
      await expectNoLoader()
    })

    it('should clear container and destroy componentRef when toggling loading from true to false', () => {
      component.loading = true
      component.overlayFullPage = true
      fixture.detectChanges()

      const dir: any = component.directive
      const destroySpy = jest.spyOn(dir.componentRef, 'destroy')
      const clearSpy = jest.spyOn(dir.viewContainerRef, 'clear')

      component.loading = false
      fixture.detectChanges()

      expect(clearSpy).toHaveBeenCalledTimes(1)
      expect(destroySpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('ngOnChanges triggers', () => {
    it('should not call toggleLoadingIndicator when unrelated input changes', () => {
      const dir: any = component.directive
      const toggleSpy = jest.spyOn(dir, 'toggleLoadingIndicator')

      component.isLoaderSmall = true
      fixture.detectChanges()

      expect(toggleSpy).not.toHaveBeenCalled()
    })

    it('should call toggleLoadingIndicator when overlayFullPage changes', () => {
      const dir: any = component.directive
      const toggleSpy = jest.spyOn(dir, 'toggleLoadingIndicator')
      component.loading = true
      fixture.detectChanges()
      toggleSpy.mockClear()

      component.overlayFullPage = true
      fixture.detectChanges()

      expect(toggleSpy).toHaveBeenCalledTimes(1)
    })

    it('should call toggleLoadingIndicator when ocxLoadingIndicator changes', () => {
      const dir: any = component.directive
      const toggleSpy = jest.spyOn(dir, 'toggleLoadingIndicator')

      component.loading = true
      fixture.detectChanges()

      expect(toggleSpy).toHaveBeenCalledTimes(1)
    })
  })
})
