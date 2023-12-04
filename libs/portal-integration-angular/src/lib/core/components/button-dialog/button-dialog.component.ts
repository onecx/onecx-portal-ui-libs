import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonDialogContent, ButtonDialogData, ButtonDialogDetails } from '../../../model/button-dialog-content'
import { ButtonDialogHostDirective } from '../../directives/button-dialog-host.directive'

@Component({
  template: `
    <div>
      <h2>{{ title }}</h2>
    </div>
  `,
})
export class DefaultButtonDialogHostComponent {
  @Input() title = 'Title'
}

@Component({
  selector: 'ocx-button-dialog',
  templateUrl: './button-dialog.component.html',
  styleUrls: ['./button-dialog.component.scss'],
})
export class ButtonDialogComponent implements OnInit {
  defaultMainButtonDetails: ButtonDialogDetails = {
    label: 'Confirm',
    icon: 'pi pi-check',
    closeDialog: true,
    valueToEmit: true,
  }

  defaultSideButtonDetails: ButtonDialogDetails = {
    label: 'Cancel',
    icon: 'pi pi-times',
    closeDialog: true,
    valueToEmit: false,
  }

  defaultDialogData: ButtonDialogData = {
    component: DefaultButtonDialogHostComponent,
    mainButtonDetails: this.defaultMainButtonDetails,
    sideButtonEnabled: true,
    sideButtonDetails: this.defaultSideButtonDetails,
    data: {},
  }

  @Input() dialogContent: ButtonDialogContent = this.defaultDialogData

  @ViewChild(ButtonDialogHostDirective, { static: true })
  dialogHost!: ButtonDialogHostDirective

  @Output() dialogResult = new EventEmitter<any>()

  dialogData: ButtonDialogData = this.defaultDialogData

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef) {}

  ngOnInit(): void {
    this.loadComponent()
  }

  mainButtonAction() {
    this.dialogResult.emit(this.dialogData.mainButtonDetails.valueToEmit)
    if (this.dialogData.mainButtonDetails.closeDialog) {
      this.ref.close()
    }
  }

  sideButtonAction() {
    this.dialogResult.emit(this.dialogData.sideButtonDetails.valueToEmit)
    if (this.dialogData.sideButtonDetails.closeDialog) {
      this.ref.close()
    }
  }

  loadComponent() {
    const viewContainerRef = this.dialogHost.viewContainerRef
    viewContainerRef.clear()

    if (this.config.data !== undefined) {
      this.dialogContent = this.config.data
    }

    this.setUpDialogData()

    if (this.dialogContent.resultEmitter !== undefined) {
      this.dialogResult = this.dialogContent.resultEmitter
    }

    const componentRef = viewContainerRef.createComponent<any>(this.dialogData.component)
    Object.keys(this.dialogData.data).forEach((k) => {
      componentRef.instance[k] = this.dialogData.data[k]
    })
  }

  setUpDialogData() {
    if (this.dialogContent.component !== undefined) {
      this.dialogData.component = this.dialogContent.component
    }
    if (this.dialogContent.mainButtonDetails !== undefined) {
      this.dialogData.mainButtonDetails = this.dialogContent.mainButtonDetails
    }
    if (this.dialogContent.sideButtonEnabled !== undefined) {
      this.dialogData.sideButtonEnabled = this.dialogContent.sideButtonEnabled
    }
    if (this.dialogContent.sideButtonDetails !== undefined) {
      this.dialogData.sideButtonDetails = this.dialogContent.sideButtonDetails
    }
    if (this.dialogContent.data !== undefined) {
      this.dialogData.data = this.dialogContent.data
    }
  }
}
