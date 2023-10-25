import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { PortalFooterComponent } from './portal-footer.component'
import { ConfigurationService } from '../../../services/configuration.service'

describe('PortalFooterComponent', () => {
  let component: PortalFooterComponent
  let fixture: ComponentFixture<PortalFooterComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PortalFooterComponent],
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService],
    }).compileComponents()

    const configurationService = getTestBed().inject(ConfigurationService)
    configurationService.setPortal({ id: 'i-am-test-portal', portalName: 'test', baseUrl: '', microfrontends: [] })
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalFooterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
