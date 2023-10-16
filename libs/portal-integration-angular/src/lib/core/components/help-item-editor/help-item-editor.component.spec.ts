import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HelpItemEditorComponent } from './help-item-editor.component'
import { ConfigurationService } from '../../../services/configuration.service'
import { MessageService } from 'primeng/api'
import { DialogModule } from 'primeng/dialog'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

describe('HelpItemEditorComponent', () => {
  let component: HelpItemEditorComponent
  let fixture: ComponentFixture<HelpItemEditorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpItemEditorComponent],
      providers: [ConfigurationService, MessageService],
      imports: [DialogModule, FormsModule, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(HelpItemEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
