import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { DataLayoutSelectionComponent } from '../data-layout-selection/data-layout-selection.component'
import { DataViewComponent } from '../data-view/data-view.component'
import { ColumnGroupSelectionComponent } from '../column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from '../custom-group-column-selector/custom-group-column-selector.component'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { PickListModule } from 'primeng/picklist'
import { TranslateModule, TranslateService } from '@ngx-translate/core'

describe('InteractiveDataViewComponent', () => {
  let component: InteractiveDataViewComponent
  let fixture: ComponentFixture<InteractiveDataViewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InteractiveDataViewComponent,
        DataLayoutSelectionComponent,
        DataViewComponent,
        ColumnGroupSelectionComponent,
        CustomGroupColumnSelectorComponent,
      ],
      imports: [TranslateModule.forRoot(), ButtonModule, DialogModule, PickListModule, MockAuthModule],
    }).compileComponents()
    TestBed.inject(TranslateService).use('en')

    fixture = TestBed.createComponent(InteractiveDataViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
