import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { provideTranslateTestingService } from '@onecx/angular-accelerator/testing'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideAngularUtils } from '../../providers/angular-utils.providers'
import { PortalPageComponent } from './portal-page.component'

describe('PortalPageComponent', () => {
  let component: PortalPageComponent
  let fixture: ComponentFixture<PortalPageComponent>

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
})
