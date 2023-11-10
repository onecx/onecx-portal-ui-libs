import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HeaderComponent } from './header.component'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { MockAuthService } from '../../../mock-auth/mock-auth.service'
import { ConfigurationService } from '../../../services/configuration.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { UserAvatarComponent } from '../user-avatar/user-avatar.component'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { IfBreakpointDirective } from '../../directives/if-breakpoint.directive'
import { TooltipModule } from 'primeng/tooltip'
import { TranslateTestingModule } from 'ngx-translate-testing'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, UserAvatarComponent, IfBreakpointDirective],
      imports: [HttpClientTestingModule, RouterModule, TooltipModule, TranslateTestingModule.withTranslations({}),],
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
      ],
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
