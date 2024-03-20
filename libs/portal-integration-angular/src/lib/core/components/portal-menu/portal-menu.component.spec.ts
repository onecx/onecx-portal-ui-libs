import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { PortalMenuComponent } from './portal-menu.component'

describe('PortalMenuComponent', () => {
  let component: PortalMenuComponent
  let fixture: ComponentFixture<PortalMenuComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortalMenuComponent],
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService],
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
