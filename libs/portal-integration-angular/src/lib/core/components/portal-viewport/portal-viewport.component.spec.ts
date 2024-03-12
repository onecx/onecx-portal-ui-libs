/* tslint:disable:no-unused-variable */
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { AppStateService } from '@onecx/angular-integration-interface'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { DialogModule } from 'primeng/dialog'
import { TooltipModule } from 'primeng/tooltip'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ConfigurationService, AUTH_SERVICE } from '@onecx/angular-integration-interface'
import { PortalViewportComponent } from './portal-viewport.component'
import { SupportTicketComponent } from '../support-ticket/support-ticket.component'
import { HelpItemEditorComponent } from '../help-item-editor/help-item-editor.component'
import { HeaderComponent } from '../portal-header/header.component'
import { AnnouncementBannerComponent } from '../announcement-banner/announcement-banner.component'
import { PortalFooterComponent } from '../portal-footer/portal-footer.component'
import { UserAvatarComponent } from '../user-avatar/user-avatar.component'
import { PortalMenuComponent } from '../portal-menu/portal-menu.component'
import { AppInlineProfileComponent } from '../inline-profile/inline-profile.component'
import { IfBreakpointDirective } from '../../directives/if-breakpoint.directive'
import { MockAuthService } from '../../../mock-auth/mock-auth.service'
import { PortalCoreModule } from '../../portal-core.module'

describe('PortalViewportComponent', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

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
      ],
    }).compileComponents()
  })

  beforeEach(async () => {
    const appStateService = getTestBed().inject(AppStateService)
    await appStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
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
