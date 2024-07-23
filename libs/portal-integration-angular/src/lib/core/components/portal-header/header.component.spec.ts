import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TooltipModule } from 'primeng/tooltip'
import { IfBreakpointDirective } from '@onecx/angular-accelerator'
import { ConfigurationService, AUTH_SERVICE } from '@onecx/angular-integration-interface'
import { HeaderComponent } from './header.component'
import { MockAuthService } from '../../../mock-auth/mock-auth.service'
import { UserAvatarComponent } from '../user-avatar/user-avatar.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [HeaderComponent, UserAvatarComponent, IfBreakpointDirective],
    imports: [RouterModule, TooltipModule, TranslateTestingModule.withTranslations({})],
    providers: [
        { provide: AUTH_SERVICE, useClass: MockAuthService },
        ConfigurationService,
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    paramMap: {
                        get: () => '1',
                    },
                },
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
