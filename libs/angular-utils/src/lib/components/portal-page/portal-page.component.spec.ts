import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { PortalPageComponent } from './portal-page.component'
import { provideAngularUtils } from '../../providers/angular-utils.providers'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('PortalPageComponent', () => {
  let component: PortalPageComponent
  let fixture: ComponentFixture<PortalPageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [PortalPageComponent],
    providers: [provideAngularUtils(), provideHttpClient(withInterceptorsFromDi())]
}).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
