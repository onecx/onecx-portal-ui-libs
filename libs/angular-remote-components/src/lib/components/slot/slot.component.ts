import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Type,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core'
import { BehaviorSubject, Subscription, Observable, combineLatest } from 'rxjs'
import { RemoteComponentInfo, SLOT_SERVICE, SlotService } from '../../services/slot.service'
import { ocxRemoteComponent } from '../../model/remote-component'

@Component({
  selector: 'ocx-slot[name]',
  templateUrl: './slot.component.html',
})
export class SlotComponent implements OnInit, OnDestroy {
  @Input()
  name!: string

  _viewContainers$ = new BehaviorSubject<QueryList<ViewContainerRef> | undefined>(undefined)
  @ViewChildren('slot', { read: ViewContainerRef })
  set viewContainers(value: QueryList<ViewContainerRef>) {
    this._viewContainers$.next(value)
  }

  subscription: Subscription | undefined
  components$:
    | Observable<{ componentType: Type<unknown>; remoteComponent: RemoteComponentInfo; permissions: string[] }[]>
    | undefined

  constructor(@Inject(SLOT_SERVICE) private slotService: SlotService) {}

  ngOnInit(): void {
    this.components$ = this.slotService.getComponentsForSlot(this.name)
    this.subscription = combineLatest([this._viewContainers$, this.components$]).subscribe(
      ([viewContainers, components]) => {
        if (viewContainers && viewContainers.length === components.length) {
          components.forEach((componentInfo, i) => {
            const componentRef = viewContainers.get(i)?.createComponent<any>(componentInfo.componentType)
            if (componentRef && 'ocxInitRemoteComponent' in componentRef.instance) {
              ;(componentRef.instance as ocxRemoteComponent).ocxInitRemoteComponent({
                appId: componentInfo.remoteComponent.appId,
                productName: componentInfo.remoteComponent.productName,
                baseUrl: componentInfo.remoteComponent.baseUrl,
                permissions: componentInfo.permissions,
              })
            }
            componentRef?.changeDetectorRef.detectChanges()
          })
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
