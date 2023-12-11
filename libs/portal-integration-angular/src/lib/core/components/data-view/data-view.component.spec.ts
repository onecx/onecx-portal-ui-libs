import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DataViewComponent } from './data-view.component'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataViewModule } from 'primeng/dataview'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DataTableComponent } from '../data-table/data-table.component'

describe('DataViewComponent', () => {
  let component: DataViewComponent
  let fixture: ComponentFixture<DataViewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataViewComponent, DataListGridComponent, DataTableComponent],
      imports: [DataViewModule, MockAuthModule, TranslateTestingModule.withTranslations({}), HttpClientTestingModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DataViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
