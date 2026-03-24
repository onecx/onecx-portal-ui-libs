/* tslint:disable:no-unused-variable */
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { DialogModule } from 'primeng/dialog'
import { TooltipModule } from 'primeng/tooltip'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ConfigurationService, AUTH_SERVICE, AppStateService } from '@onecx/angular-integration-interface'
import { PortalViewportComponent } from './portal-viewport.component'
import { SupportTicketComponent } from '../support-ticket/support-ticket.component'
import { HelpItemEditorComponent } from '../help-item-editor/help-item-editor.component'
import { HeaderComponent } from '../portal-header/header.component'
import { AnnouncementBannerComponent } from '../announcement-banner/announcement-banner.component'
import { PortalFooterComponent } from '../portal-footer/portal-footer.component'
import { UserAvatarComponent } from '../user-avatar/user-avatar.component'
import { PortalMenuComponent } from '../portal-menu/portal-menu.component'
import { AppInlineProfileComponent } from '../inline-profile/inline-profile.component'
import { IfBreakpointDirective } from '@onecx/angular-accelerator'
import { MockAuthService } from '../../../mock-auth/mock-auth.service'
import { PortalCoreModule } from '../../portal-core.module'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('PortalViewportComponent', () => {
  let component: PortalViewportComponent
  let fixture: ComponentFixture<PortalViewportComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PortalViewportComponent,
        SupportTicketComponent,
        HelpItemEditorComponent,
        HeaderComponent,
        AnnouncementBannerComponent,
        PortalFooterComponent,
        UserAvatarComponent,
        PortalMenuComponent,
        AppInlineProfileComponent,
        IfBreakpointDirective,
      ],
      imports: [
        ToastModule,
        DialogModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TooltipModule,
        TranslateTestingModule.withTranslations({}),
        PortalCoreModule,
      ],
      providers: [
        ConfigurationService,
        MessageService,
        { provide: AUTH_SERVICE, useClass: MockAuthService },
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
      ],
    }).compileComponents()
  })

  beforeEach(async () => {
    const appStateService = getTestBed().inject(AppStateService)
    await appStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      workspaceName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })

    fixture = TestBed.createComponent(PortalViewportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
