import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import {
  DialogButtonClicked,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogState,
} from '../../../services/portal-dialog.service'
import { Observable, map } from 'rxjs'

export type CreateOrEditSearchDialogContent = {
  searchConfigName: string
  saveInputValues: boolean
  saveColumns: boolean
}
@Component({
  selector: 'ocx-create-or-edit-search-config-dialog',
  templateUrl: './create-or-edit-search-config-dialog.component.html',
  styleUrls: ['./create-or-edit-search-config-dialog.component.scss'],
})
export class CreateOrEditSearchConfigDialogComponent
  implements
    DialogPrimaryButtonDisabled,
    DialogResult<CreateOrEditSearchDialogContent>,
    DialogButtonClicked<CreateOrEditSearchConfigDialogComponent>
{
  @Input() searchConfigName: string = ''
  @Input() saveInputValues: boolean = false
  @Input() saveColumns: boolean = false
  @Input() placeHolderKey: string = 'OCX_SEARCH_CONFIG.PLACEHOLDER'
  @Output() primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  searchConfigFormGroup: FormGroup = new FormGroup({
    searchConfigName: new FormControl<string>(this.searchConfigName),
    saveInputValues: new FormControl<boolean>(this.saveInputValues),
    saveColumns: new FormControl<boolean>(this.saveColumns),
  })
  dialogResult: CreateOrEditSearchDialogContent = { searchConfigName: '', saveInputValues: false, saveColumns: false }
  constructor() {
    this.searchConfigFormGroup.valueChanges
      .pipe(
        map(
          (dialogFormValues: CreateOrEditSearchDialogContent) =>
            !!dialogFormValues.searchConfigName && (dialogFormValues.saveInputValues || dialogFormValues.saveColumns)
        )
      )
      .subscribe(this.primaryButtonEnabled)
  }

  ocxDialogButtonClicked(
    _state: DialogState<CreateOrEditSearchConfigDialogComponent>
  ): boolean | Observable<boolean> | Promise<boolean> | undefined {
    this.dialogResult = {
      searchConfigName: this.searchConfigFormGroup?.get('searchConfigName')?.value,
      saveInputValues: this.searchConfigFormGroup?.get('saveInputValues')?.value,
      saveColumns: this.searchConfigFormGroup?.get('saveColumns')?.value,
    }
    return true
  }
}
