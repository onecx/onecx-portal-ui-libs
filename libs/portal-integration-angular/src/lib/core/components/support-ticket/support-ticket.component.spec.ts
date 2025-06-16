import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DialogModule } from 'primeng/dialog'

import { SupportTicketComponent } from './support-ticket.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

describe('SupportTicketComponent', () => {
  let component: SupportTicketComponent
  let fixture: ComponentFixture<SupportTicketComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportTicketComponent],
      imports: [DialogModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(SupportTicketComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
