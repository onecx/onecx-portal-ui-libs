import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { provideAppStateServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideAngularUtils } from '../../providers/angular-utils.providers'
import { PortalPageComponent } from './portal-page.component'
import { PermissionService } from '../../services/permission.service'
import { of } from 'rxjs'
import { Component } from '@angular/core'

describe('PortalPageComponent', () => {
  let component: PortalPageComponent
  let fixture: ComponentFixture<PortalPageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PortalPageComponent],
      providers: [
        provideAngularUtils(),
        { provide: PermissionService, useValue: { hasPermission: jest.fn() } },
        provideHttpClient(withInterceptorsFromDi()),
        provideUserServiceMock(),
        provideAppStateServiceMock(),
        provideTranslateTestingService({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should show unauthorized message when access is denied', fakeAsync(() => {
    const permissionService = TestBed.inject(PermissionService) as unknown as { hasPermission: jest.Mock }
    permissionService.hasPermission.mockReturnValue(of(false))

    component.permission = 'TEST_PERMISSION'
    fixture.detectChanges()

    tick(10000)
    fixture.detectChanges()

    const h3 = fixture.nativeElement.querySelector('h3') as HTMLElement | null
    expect(h3).not.toBeNull()

    const span = fixture.nativeElement.querySelector('span') as HTMLElement | null
    expect(span).not.toBeNull()
  }))

  it('should not show unauthorized message when access is granted (immediate)', () => {
    component.permission = ''
    fixture.detectChanges()
    const unauthorizedHeader = fixture.nativeElement.querySelector('h3') as HTMLElement | null
    expect(unauthorizedHeader).toBeNull()
  })
})

describe('PortalPageComponent host projection', () => {
  @Component({
    standalone: true,
    imports: [PortalPageComponent],
    template: `
      <ocx-portal-page [permission]="permission">
        <div class="inner-content">Hello Content</div>
      </ocx-portal-page>
    `,
  })
  class HostComponent {
    permission = 'TEST_PERMISSION'
  }

  let hostFixture: ComponentFixture<HostComponent>
  let permissionService: { hasPermission: jest.Mock }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalPageComponent, HostComponent],
      providers: [
        provideAngularUtils(),
        provideHttpClient(withInterceptorsFromDi()),
        provideUserServiceMock(),
        provideAppStateServiceMock(),
        { provide: PermissionService, useValue: { hasPermission: jest.fn() } },
        provideTranslateTestingService({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    permissionService = TestBed.inject(PermissionService) as unknown as { hasPermission: jest.Mock }
    hostFixture = TestBed.createComponent(HostComponent)
  })

  it('should render nothing until access is resolved (before debounce)', fakeAsync(() => {
    permissionService.hasPermission.mockReturnValue(of(true))
    hostFixture.detectChanges()

    const portalEl = hostFixture.nativeElement.querySelector('ocx-portal-page') as HTMLElement
    const wrappers = portalEl.querySelectorAll('.content-wrapper')
    const delayedWrapper = wrappers.item(1) as HTMLElement | null
    const unauthorizedHeaderBefore = delayedWrapper?.querySelector('h3') || null
    expect(unauthorizedHeaderBefore).toBeNull()

    tick(10000)
    hostFixture.detectChanges()
    const innerAfter = portalEl.querySelector('.inner-content') as HTMLElement | null
    expect(innerAfter).not.toBeNull()
  }))

  it('should render projected content when access is granted (after debounce)', fakeAsync(() => {
    permissionService.hasPermission.mockReturnValue(of(true))
    hostFixture.detectChanges()

    tick(10000)
    hostFixture.detectChanges()

    const portalEl = hostFixture.nativeElement.querySelector('ocx-portal-page') as HTMLElement
    const inner = portalEl.querySelector('.inner-content') as HTMLElement | null
    expect(inner).not.toBeNull()
    expect(inner?.textContent).toContain('Hello Content')
    const unauthorizedHeader = portalEl.querySelector('h3') as HTMLElement | null
    expect(unauthorizedHeader).toBeNull()
  }))

  it('should show unauthorized when access is denied (after debounce)', fakeAsync(() => {
    permissionService.hasPermission.mockReturnValue(of(false))
    hostFixture.detectChanges()

    tick(10000)
    hostFixture.detectChanges()

    const portalEl = hostFixture.nativeElement.querySelector('ocx-portal-page') as HTMLElement
    const unauthorizedHeader = portalEl.querySelector('h3') as HTMLElement | null
    expect(unauthorizedHeader).not.toBeNull()
    const inner = portalEl.querySelector('.inner-content') as HTMLElement | null
    expect(inner).toBeNull()
  }))
})
