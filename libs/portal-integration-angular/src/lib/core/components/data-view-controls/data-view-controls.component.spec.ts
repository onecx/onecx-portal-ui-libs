import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DataViewControlsComponent } from './data-view-controls.component'
import { TranslateModule } from '@ngx-translate/core'

describe('DataViewControlsComponent', () => {
  let component: DataViewControlsComponent
  let fixture: ComponentFixture<DataViewControlsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataViewControlsComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(DataViewControlsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
