import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PortalMenuComponent } from './portal-menu.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ConfigurationService } from '../../../services/configuration.service'

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
