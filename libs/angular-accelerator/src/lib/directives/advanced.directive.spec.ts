import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HarnessLoader } from '@angular/cdk/testing'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AdvancedDirective } from './advanced.directive'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'
import { PageHeaderComponent } from '../components/page-header/page-header.component'
import { AngularAcceleratorModule } from '../angular-accelerator.module'
import { SearchHeaderHarness } from '../../../testing/search-header.harness'

@Component({
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  template: `
    <ocx-search-header>
      <ng-template ocxAdvanced>
        <div id="advanced-content">Advanced Content</div>
      </ng-template>
    </ocx-search-header>
  `,
})
class HostInsideSearchHeaderComponent {
  @ViewChild(SearchHeaderComponent)
  searchHeader!: SearchHeaderComponent

  @ViewChild(AdvancedDirective)
  directive!: AdvancedDirective
}

@Component({
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  template: `
    <ng-template ocxAdvanced>
      <div id="advanced-content">Advanced Content</div>
    </ng-template>
  `,
})
class HostOutsideSearchHeaderComponent {
  @ViewChild(AdvancedDirective)
  directive!: AdvancedDirective
}

describe('AdvancedDirective', () => {
  let loader: HarnessLoader

  describe('when used outside SearchHeaderComponent', () => {
    it('should throw an error during component creation', async () => {
      await TestBed.configureTestingModule({
        declarations: [HostOutsideSearchHeaderComponent, AdvancedDirective],
      }).compileComponents()

      expect(() => {
        const fixture = TestBed.createComponent(HostOutsideSearchHeaderComponent)
        fixture.detectChanges()
      }).toThrow('Advanced directive can only be used inside search header component')
    })
  })

  describe('when used inside SearchHeaderComponent', () => {
    let fixture: ComponentFixture<HostInsideSearchHeaderComponent>
    let component: HostInsideSearchHeaderComponent

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [HostInsideSearchHeaderComponent, SearchHeaderComponent, PageHeaderComponent, AdvancedDirective],
        imports: [AngularAcceleratorModule],
        providers: [
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideTranslateTestingService({}),
        ],
      }).compileComponents()

      fixture = TestBed.createComponent(HostInsideSearchHeaderComponent)
      component = fixture.componentInstance
      fixture.detectChanges()

      loader = TestbedHarnessEnvironment.loader(fixture)
    })

    it('should mark search header as having advanced fields', () => {
      expect(component.searchHeader.hasAdvanced()).toBe(true)
    })

    it('should not render advanced template when viewMode is basic', async () => {
      const searchHeaderHarness = await loader.getHarness(SearchHeaderHarness)
      await searchHeaderHarness.setViewMode('basic')
      fixture.detectChanges()

      const advancedEl = fixture.debugElement.query(By.css('#advanced-content'))
      expect(advancedEl).toBeNull()

      // Harness smoke: search header exists.
      expect(searchHeaderHarness).toBeTruthy()
    })

    it('should render advanced template when viewMode is advanced', () => {
      // uses component state for sync test setup
      component.searchHeader.effectiveViewMode.set('advanced')
      fixture.detectChanges()

      const advancedEl = fixture.debugElement.query(By.css('#advanced-content'))
      expect(advancedEl).not.toBeNull()
    })

    it('should clear advanced template when toggling from advanced to basic', () => {
      component.searchHeader.effectiveViewMode.set('advanced')
      fixture.detectChanges()
      expect(fixture.debugElement.query(By.css('#advanced-content'))).not.toBeNull()

      component.searchHeader.effectiveViewMode.set('basic')
      fixture.detectChanges()
      expect(fixture.debugElement.query(By.css('#advanced-content'))).toBeNull()
    })

    it('should not create a second embedded view when change detection runs again in advanced mode', () => {
      component.searchHeader.effectiveViewMode.set('advanced')
      fixture.detectChanges()

      expect(fixture.debugElement.queryAll(By.css('#advanced-content'))).toHaveLength(1)
    })
  })
})
