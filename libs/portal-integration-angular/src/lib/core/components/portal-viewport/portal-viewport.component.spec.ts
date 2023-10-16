/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PortalViewportComponent } from './portal-viewport.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ConfigurationService } from '../../../services/configuration.service'
import { MessageService } from 'primeng/api'
import { AUTH_SERVICE, MFE_INFO } from '../../../api/injection-tokens'
import { MockAuthService } from '../../../mock-auth/mock-auth.service'
import { SupportTicketComponent } from '../support-ticket/support-ticket.component'
import { HelpItemEditorComponent } from '../help-item-editor/help-item-editor.component'
import { HeaderComponent } from '../portal-header/header.component'
import { ToastModule } from 'primeng/toast'
import { AnnouncementBannerComponent } from '../announcement-banner/announcement-banner.component'
import { DialogModule } from 'primeng/dialog'
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router'
import { PortalFooterComponent } from '../portal-footer/portal-footer.component'
import { UserAvatarComponent } from '../user-avatar/user-avatar.component'
import { PortalMenuComponent } from '../portal-menu/portal-menu.component'
import { AppInlineProfileComponent } from '../inline-profile/inline-profile.component'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { IfBreakpointDirective } from '../../directives/if-breakpoint.directive'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TooltipModule } from 'primeng/tooltip'

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
        HttpClientTestingModule,
        ToastModule,
        DialogModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TooltipModule,
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
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    TestBed.inject(ConfigurationService).setPortal({
      id: 'i-am-test-portal',
      portalName: 'test',
      baseUrl: '',
      microfrontends: [],
    })

    fixture = TestBed.createComponent(PortalViewportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
