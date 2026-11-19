import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  inject,
  signal,
  viewChild,
} from '@angular/core'
import { Observable, Subscription, from, isObservable, of, startWith } from 'rxjs'
import { DynamicDialogConfig, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog'
import { ButtonDialogData } from '../../../model/button-dialog'
import { DialogMessageContentComponent } from '../dialog-message-content/dialog-message-content.component'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  PortalDialogServiceData,
} from '../../../services/portal-dialog.service'

@Component({
  standalone: false,
  selector: 'ocx-dialog-content',
  templateUrl: './dialog-content.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./dialog-content.component.scss'],
})
export class DialogContentComponent implements OnInit, AfterViewInit, OnDestroy {
  dynamicDialogConfig = inject(DynamicDialogConfig)
  dynamicDialogRef = inject(DynamicDialogRef)

  defaultDialogData: ButtonDialogData = {
    component: DialogMessageContentComponent,
    config: {},
    componentData: {},
  }

  dialogHost = viewChild('container', { read: ViewContainerRef })
  scrollRegion = viewChild.required<ElementRef<HTMLElement>>('scrollRegion')
  scrollContent = viewChild.required<ElementRef<HTMLElement>>('scrollContent')

  /**
   * True while the content overflows the scroll region. The region is then made
   * keyboard focusable and exposed as a named region (WCAG 2.1.1, 1.4.10).
   */
  scrollable = signal(false)
  private resizeObserver?: ResizeObserver

  dialogData: ButtonDialogData = this.defaultDialogData
  componentRef!: ComponentRef<any>

  primaryButtonEnabledSub?: Subscription
  secondaryButtonEnabledSub?: Subscription
  customButtonEnabledSub?: Subscription
  buttonClickedSub?: Subscription

  ngOnInit(): void {
    this.loadComponent()
  }

  ngAfterViewInit(): void {
    // Safe here: scrollable is a signal read by the template, so setting it during the first
    // change detection pass just schedules a refresh instead of raising ExpressionChanged errors.
    this.updateScrollable()
    if (typeof ResizeObserver === 'undefined') {
      return
    }
    // The ResizeObserver callback runs outside NgZone; updating the signal still notifies Angular
    // to re-render the view, so no NgZone.run() is needed.
    this.resizeObserver = new ResizeObserver(() => this.updateScrollable())
    this.resizeObserver.observe(this.scrollRegion().nativeElement)
    this.resizeObserver.observe(this.scrollContent().nativeElement)
  }

  updateScrollable(): void {
    const region = this.scrollRegion().nativeElement
    this.scrollable.set(region.scrollHeight > region.clientHeight || region.scrollWidth > region.clientWidth)
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
    this.primaryButtonEnabledSub?.unsubscribe()
    this.secondaryButtonEnabledSub?.unsubscribe()
    this.customButtonEnabledSub?.unsubscribe()
    this.buttonClickedSub?.unsubscribe()
  }

  loadComponent() {
    if (this.dynamicDialogConfig.data) {
      this.setUpDialogDataForDynamicConfig()
    }
  }

  setUpDialogDataForDynamicConfig() {
    const dynamicConfigData: ButtonDialogData = this.dynamicDialogConfig.data
    const portalDialogServiceData: PortalDialogServiceData = this.dynamicDialogConfig.data.portalDialogServiceData
    if (dynamicConfigData.component) {
      this.dialogData.component = dynamicConfigData.component
    }
    if (dynamicConfigData.componentData) {
      this.dialogData.componentData = dynamicConfigData.componentData
    }

    const viewContainerRef = this.dialogHost()!
    viewContainerRef.clear()

    this.buttonClickedSub = portalDialogServiceData.buttonClicked$.subscribe((state) => {
      const component = this.componentRef.instance

      const hasDialogResult = this.isDialogResultImplemented(component)
      if (hasDialogResult) {
        state.result = component.dialogResult
      }
      const closeResult = state
      // check if component implements DialogButtonClicked
      if (this.isDialogButtonClickedImplemented(component)) {
        const buttonResult = component.ocxDialogButtonClicked(state)
        // If undefined or void is returned, close dialog and return result
        if (buttonResult === undefined) {
          if (hasDialogResult) {
            closeResult.result = component.dialogResult
          }
          return this.dynamicDialogRef.close(closeResult)
        }
        this.toObservable(buttonResult).subscribe((result: boolean) => {
          if (result === true) {
            if (hasDialogResult) {
              closeResult.result = component.dialogResult
            }
            this.dynamicDialogRef.close(closeResult)
          }
        })
      } else {
        return this.dynamicDialogRef.close(closeResult)
      }
    })

    if (this.dialogData.component) {
      const componentRef = viewContainerRef.createComponent<any>(this.dialogData.component)

      if (this.isDialogPrimaryButtonDisabledImplemented(componentRef.instance)) {
        this.primaryButtonEnabledSub = componentRef.instance.primaryButtonEnabled
          .pipe(startWith(false))
          .subscribe((isEnabled) => {
            portalDialogServiceData.primaryButtonEnabled$.next(isEnabled)
          })
      }
      if (this.isDialogSecondaryButtonDisabledImplemented(componentRef.instance)) {
        this.secondaryButtonEnabledSub = componentRef.instance.secondaryButtonEnabled
          .pipe(startWith(false))
          .subscribe((isEnabled) => {
            portalDialogServiceData.secondaryButtonEnabled$.next(isEnabled)
          })
      }
      if (this.isDialogCustomButtonDisabledImplemented(componentRef.instance)) {
        this.customButtonEnabledSub = componentRef.instance.customButtonEnabled.subscribe((buttonEnabled) => {
          portalDialogServiceData.customButtonEnabled$.next(buttonEnabled)
        })
      }

      //populate container
      Object.keys(this.dialogData.componentData).forEach((k) => {
        componentRef.setInput(k, this.dialogData.componentData[k])
      })
      this.componentRef = componentRef
    }
  }

  private toObservable(
    ocxDialogButtonClickedResult: boolean | Observable<boolean> | Promise<boolean> | undefined
  ): Observable<boolean> {
    if (ocxDialogButtonClickedResult === undefined) {
      return of(true)
    }
    if (isObservable(ocxDialogButtonClickedResult)) {
      return ocxDialogButtonClickedResult
    }
    return from(Promise.resolve(ocxDialogButtonClickedResult))
  }

  private isDialogResultImplemented(component: any): component is DialogResult<unknown> {
    return 'dialogResult' in component
  }

  private isDialogButtonClickedImplemented(component: any): component is DialogButtonClicked {
    return typeof component.ocxDialogButtonClicked === 'function'
  }

  private isDialogPrimaryButtonDisabledImplemented(component: any): component is DialogPrimaryButtonDisabled {
    return 'primaryButtonEnabled' in component
  }

  private isDialogSecondaryButtonDisabledImplemented(component: any): component is DialogSecondaryButtonDisabled {
    return 'secondaryButtonEnabled' in component
  }

  private isDialogCustomButtonDisabledImplemented(component: any): component is DialogCustomButtonsDisabled {
    return 'customButtonEnabled' in component
  }
}
