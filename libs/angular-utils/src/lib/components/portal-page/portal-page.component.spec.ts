import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { PortalPageComponent } from './portal-page.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideAngularUtils } from '../../providers/angular-utils.providers'

describe('PortalPageComponent', () => {
  let component: PortalPageComponent
  let fixture: ComponentFixture<PortalPageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PortalPageComponent,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [
        provideAngularUtils(),
        provideHttpClient(withInterceptorsFromDi()),
        provideAppStateServiceMock(),
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
