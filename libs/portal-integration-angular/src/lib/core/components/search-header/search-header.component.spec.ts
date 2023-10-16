import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SearchHeaderComponent } from './search-header.component'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { RouterTestingModule } from '@angular/router/testing'
import { ConfigurationService } from '../../../services/configuration.service'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { MockAuthService } from '../../../mock-auth/mock-auth.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ButtonModule } from 'primeng/button'
import { BreadcrumbModule } from 'primeng/breadcrumb'

describe('SearchHeaderComponent', () => {
  let component: SearchHeaderComponent
  let fixture: ComponentFixture<SearchHeaderComponent>
  const mockService = new MockAuthService()

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchHeaderComponent, PageHeaderComponent],
      imports: [
        TranslateTestingModule.withTranslations({}),
        RouterTestingModule,
        HttpClientTestingModule,
        ButtonModule,
        BreadcrumbModule,
      ],
      providers: [ConfigurationService, { provide: AUTH_SERVICE, useValue: mockService }],
    }).compileComponents()

    TestBed.inject(ConfigurationService).setPortal({
      id: 'i-am-test-portal',
      portalName: 'test',
      baseUrl: '',
      microfrontends: [],
    })

    fixture = TestBed.createComponent(SearchHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
