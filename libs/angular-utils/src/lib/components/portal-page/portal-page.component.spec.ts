import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideAngularUtils } from '../../providers/angular-utils.providers'
import { PortalPageComponent } from './portal-page.component'
import { AppStateService } from '@onecx/angular-integration-interface'
import { PermissionService } from '../../services/permission.service'
import { of } from 'rxjs'
import { By } from '@angular/platform-browser'

class PermissionServiceMock {
  hasPermission = jest.fn()
}

describe('PortalPageComponent', () => {
  let component: PortalPageComponent
  let fixture: ComponentFixture<PortalPageComponent>
  let appState: AppStateServiceMock
  let permissionService: PermissionServiceMock

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PortalPageComponent],
      providers: [
        provideAngularUtils(),
        provideHttpClient(withInterceptorsFromDi()),
        provideAppStateServiceMock(),
        provideTranslateTestingService({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
        { provide: PermissionService, useClass: PermissionServiceMock },
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    appState = TestBed.inject(AppStateService) as unknown as AppStateServiceMock
    permissionService = TestBed.inject(PermissionService) as unknown as PermissionServiceMock
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('publishes currentPage$ on init', () => {
    jest.spyOn(appState.currentPage$, 'publish')
    permissionService.hasPermission.mockReturnValue(of(true))

    component.ngOnInit()

    expect(appState.currentPage$.publish).toHaveBeenCalledTimes(1)
    expect(appState.currentPage$.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        path: document.location.pathname,
        helpArticleId: '',
        permission: '',
        pageName: '',
        applicationId: '',
      })
    )
  })

  it("warns if helpArticleId isn't truthy", () => {
    permissionService.hasPermission.mockReturnValue(of(true))
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    fixture.componentRef.setInput('helpArticleId', '') // not truthy
    fixture.detectChanges()

    component.ngOnInit()

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain(`does not have 'helpArticleId' set`)

    warnSpy.mockRestore()
  })

  it('displays unauthorized content if user has no access', async () => {
    fixture.componentRef.setInput('permission', 'SOME_PERMISSION')
    permissionService.hasPermission.mockReturnValue(of(false))

    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    // unauthorized template should be shown (we don't depend on translate outputs)
    const unauthorizedTitle = fixture.debugElement.query(By.css('h3'))
    const unauthorizedMsg = fixture.debugElement.query(By.css('p'))
    expect(unauthorizedTitle).toBeTruthy()
    expect(unauthorizedMsg).toBeTruthy()
  })

  it('uses trueObservable if permission is not truthy (does not call hasPermission and renders content)', async () => {
    permissionService.hasPermission.mockReturnValue(of(false)) // should not be used
    fixture.componentRef.setInput('permission', '') // not truthy => should fall back to trueObservable

    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    expect(permissionService.hasPermission).not.toHaveBeenCalled()
    expect(fixture.debugElement.query(By.css('h3'))).toBeNull()
  })
})
