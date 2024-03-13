import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { PortalMessageService } from '@onecx/angular-integration-interface'
import { HelpData } from '../../../model/help-data'

@Component({
  selector: 'ocx-help-item-editor',
  templateUrl: './help-item-editor.component.html',
  styleUrls: ['./help-item-editor.component.scss'],
})
export class HelpItemEditorComponent implements OnChanges {
  @Input() public displayDialog = true
  @Output() public displayDialogChange = new EventEmitter<boolean>()

  @Input() helpItem!: HelpData | undefined
  @Output() saveHelpItem = new EventEmitter<HelpData>()

  public formGroup!: FormGroup
  constructor(private fb: FormBuilder, private portalMessageService: PortalMessageService) {
    this.formGroup = this.fb.group({
      appId: new FormControl({ value: null, disabled: true }, [Validators.required]),
      helpItemId: new FormControl({ value: null, disabled: true }, [Validators.required]),
      resourceUrl: new FormControl(null, Validators.required),
    })
  }
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['helpItem'] && this.helpItem) {
      this.formGroup.patchValue({ ...this.helpItem })
    }
  }

  public save() {
    if (this.formGroup.valid && this.helpItem) {
      this.helpItem.resourceUrl = this.formGroup.value['resourceUrl']
      this.saveHelpItem.emit(this.helpItem)
    } else {
      this.portalMessageService.error({
        summaryKey: 'OCX_HELP_ITEM_EDITOR.SAVE_ERROR',
      })
    }
  }

  public close(): void {
    this.displayDialogChange.emit(false)
  }
}
