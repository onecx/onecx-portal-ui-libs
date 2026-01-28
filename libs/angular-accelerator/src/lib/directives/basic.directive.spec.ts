import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ComponentHarness, HarnessLoader } from '@angular/cdk/testing'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { BasicDirective } from './basic.directive'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'
import { PageHeaderComponent } from '../components/page-header/page-header.component'
import { AngularAcceleratorModule } from '../angular-accelerator.module'
import { SearchHeaderHarness } from '../../../testing/search-header.harness'
import { AdvancedDirective } from './advanced.directive'
import { provideRouter } from '@angular/router'

class BasicContentHarness extends ComponentHarness {
  static readonly hostSelector = '#basic-content'

  async text(): Promise<string> {
    return (await this.host()).text()
  }

  async id(): Promise<string | null> {
    return (await this.host()).getAttribute('id')
  }
}

class HostInsideSearchHeaderHarness extends ComponentHarness {
  static readonly hostSelector = 'ocx-search-header'

  private readonly basicContentLocator = this.locatorForOptional(BasicContentHarness)
  private readonly allBasicContentLocator = this.locatorForAll(BasicContentHarness)

  async getBasicContent(): Promise<BasicContentHarness | null> {
    return this.basicContentLocator()
  }

  async getBasicContentCount(): Promise<number> {
    return (await this.allBasicContentLocator()).length
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  template: `
    <ocx-search-header>
      <ng-template ocxBasic>
        <div id="basic-content">Basic Content</div>
      </ng-template>

      <ng-template ocxAdvanced>
        <div id="advanced-content">Advanced Content</div>
      </ng-template>
    </ocx-search-header>
  `,
})
class HostInsideSearchHeaderComponent {
  @ViewChild(SearchHeaderComponent)
  searchHeader!: SearchHeaderComponent

  @ViewChild(BasicDirective)
  directive!: BasicDirective
}

@Component({
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  template: `
    <ng-template ocxBasic>
      <div id="basic-content">Basic Content</div>
    </ng-template>
  `,
})
class HostOutsideSearchHeaderComponent {
  @ViewChild(BasicDirective)
  directive!: BasicDirective
}

describe('BasicDirective', () => {
  let loader: HarnessLoader

  describe('when used outside SearchHeaderComponent', () => {
    it('should throw an error during component creation', async () => {
      await TestBed.configureTestingModule({
        declarations: [HostOutsideSearchHeaderComponent, BasicDirective],
      }).compileComponents()

      expect(() => {
        const fixture = TestBed.createComponent(HostOutsideSearchHeaderComponent)
        fixture.detectChanges()
      }).toThrow('Basic directive can only be used inside search header component')
    })
  })

  describe('when used inside SearchHeaderComponent', () => {
    let fixture: ComponentFixture<HostInsideSearchHeaderComponent>

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [
          HostInsideSearchHeaderComponent,
          SearchHeaderComponent,
          PageHeaderComponent,
          BasicDirective,
          AdvancedDirective,
        ],
        imports: [AngularAcceleratorModule],
        providers: [
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideTranslateTestingService({}),
          provideRouter([]),
        ],
      }).compileComponents()

      fixture = TestBed.createComponent(HostInsideSearchHeaderComponent)
      fixture.detectChanges()

      loader = TestbedHarnessEnvironment.loader(fixture)
    })

    it('should render basic template when viewMode is basic', async () => {
      const searchHeaderHarness = await loader.getHarness(SearchHeaderHarness)
      fixture.componentInstance.searchHeader.effectiveViewMode.set('basic')
      fixture.detectChanges()

      const hostHarness = await loader.getHarness(HostInsideSearchHeaderHarness)
      const contentHarness = await hostHarness.getBasicContent()
      expect(contentHarness).not.toBeNull()
      expect(await contentHarness!.id()).toBe('basic-content')
      expect(await contentHarness!.text()).toContain('Basic Content')

      // Harness smoke: search header exists.
      expect(searchHeaderHarness).toBeTruthy()
    })

    it('should not render basic template when effectiveViewMode is advanced', async () => {
      fixture.componentInstance.searchHeader.effectiveViewMode.set('advanced')
      fixture.detectChanges()

      const hostHarness = await loader.getHarness(HostInsideSearchHeaderHarness)
      expect(await hostHarness.getBasicContentCount()).toBe(0)
    })

    it('should clear basic template when toggling from basic to advanced', async () => {
      fixture.componentInstance.searchHeader.effectiveViewMode.set('basic')
      fixture.detectChanges()
      const hostHarness = await loader.getHarness(HostInsideSearchHeaderHarness)
      expect(await hostHarness.getBasicContentCount()).toBe(1)

      fixture.componentInstance.searchHeader.effectiveViewMode.set('advanced')
      fixture.detectChanges()
      expect(await hostHarness.getBasicContentCount()).toBe(0)
    })

    it('should not create a second embedded view when change detection runs again in basic mode', async () => {
      fixture.componentInstance.searchHeader.effectiveViewMode.set('basic')
      fixture.detectChanges()

      const hostHarness = await loader.getHarness(HostInsideSearchHeaderHarness)
      expect(await hostHarness.getBasicContentCount()).toBe(1)
    })
  })
})
