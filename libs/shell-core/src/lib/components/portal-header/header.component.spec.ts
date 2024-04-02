import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HeaderComponent } from './header.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { TooltipModule } from 'primeng/tooltip'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { IfBreakpointDirective } from '@onecx/angular-accelerator'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { UserAvatarComponent, PortalCoreModule } from '@onecx/portal-integration-angular'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, UserAvatarComponent, IfBreakpointDirective],
      imports: [
        HttpClientTestingModule,
        RouterModule,
        TooltipModule,
        TranslateTestingModule.withTranslations({}),
        PortalCoreModule,
      ],
      providers: [
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
