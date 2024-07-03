import { ComponentFixture, TestBed } from '@angular/core/testing'

import { provideHttpClientTesting } from '@angular/common/http/testing'
import { MenubarModule } from 'primeng/menubar'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { PortalMenuHorizontalComponent } from './portal-menu-horizontal.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PortalMenuHorizontalComponent', () => {
  let component: PortalMenuHorizontalComponent
  let fixture: ComponentFixture<PortalMenuHorizontalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [PortalMenuHorizontalComponent],
    imports: [MenubarModule],
    providers: [ConfigurationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents()

    fixture = TestBed.createComponent(PortalMenuHorizontalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
