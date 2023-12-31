import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { SupportTicket } from '../../../model/support-ticket'

@Component({
  selector: 'ocx-support-ticket',
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.scss'],
})
export class SupportTicketComponent implements OnInit {
  public formGroup!: FormGroup

  @Input() public displayDialog = true
  @Output() public displayDialogChange = new EventEmitter<boolean>()

  @Output()
  submitTicket: EventEmitter<SupportTicket> = new EventEmitter()

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    })
  }

  close(): void {
    this.displayDialogChange.emit(false)
  }

  submit(): void {
    this.submitTicket.emit(this.formGroup.value)
  }
}
