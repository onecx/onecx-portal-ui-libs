import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { PortalMenuComponent } from './portal-menu.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PortalMenuComponent', () => {
  let component: PortalMenuComponent
  let fixture: ComponentFixture<PortalMenuComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [PortalMenuComponent],
    imports: [],
    providers: [ConfigurationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
