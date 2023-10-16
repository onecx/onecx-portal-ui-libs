import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing'

import { NoHelpItemComponent } from './no-help-item.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

describe('NoHelpItemComponent', () => {
  let component: NoHelpItemComponent
  let fixture: ComponentFixture<NoHelpItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoHelpItemComponent],
      providers: [DynamicDialogConfig, DynamicDialogRef],
    }).compileComponents()

    getTestBed().inject(DynamicDialogConfig).data = { helpArticleId: 'help-article-id' }

    fixture = TestBed.createComponent(NoHelpItemComponent)
    component = fixture.componentInstance

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
