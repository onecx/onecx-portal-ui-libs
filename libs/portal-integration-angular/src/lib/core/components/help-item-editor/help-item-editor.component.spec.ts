import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HelpItemEditorComponent } from './help-item-editor.component'
import { ConfigurationService } from '../../../services/configuration.service'
import { DialogModule } from 'primeng/dialog'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PortalMessageService } from '../../../services/portal-message.service'

describe('HelpItemEditorComponent', () => {
  let component: HelpItemEditorComponent
  let fixture: ComponentFixture<HelpItemEditorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpItemEditorComponent],
      providers: [ConfigurationService, PortalMessageService],
      imports: [DialogModule, FormsModule, ReactiveFormsModule, NoopAnimationsModule, TranslateTestingModule.withTranslations({}),],
    }).compileComponents()

    fixture = TestBed.createComponent(HelpItemEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
