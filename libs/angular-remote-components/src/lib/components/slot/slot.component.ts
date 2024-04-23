import {
  Component,
  ContentChild,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  Type,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core'
import { BehaviorSubject, Subscription, Observable, combineLatest } from 'rxjs'
import { RemoteComponentInfo, SLOT_SERVICE, SlotComponentConfiguration, SlotService } from '../../services/slot.service'
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

  @ContentChild('skeleton') skeleton: TemplateRef<any> | undefined

  subscription: Subscription | undefined
  components$: Observable<SlotComponentConfiguration[]> | undefined

  constructor(@Inject(SLOT_SERVICE) private slotService: SlotService) {}

  ngOnInit(): void {
    this.components$ = this.slotService.getComponentsForSlot(this.name)
    this.subscription = combineLatest([this._viewContainers$, this.components$]).subscribe(
      ([viewContainers, components]) => {
        if (viewContainers && viewContainers.length === components.length) {
          components.forEach((componentInfo, i) => {
            if (componentInfo.componentType) {
              Promise.all([Promise.resolve(componentInfo.componentType), Promise.resolve(componentInfo.permissions)]).then(([componentType, permissions]) => {
                this.createComponent(componentType, componentInfo, permissions, viewContainers, i)
              })
            }
          })
        }
      }
    )
  }

  private createComponent(
    componentType: Type<unknown> | undefined,
    componentInfo: { remoteComponent: RemoteComponentInfo; },
    permissions: string[],
    viewContainers: QueryList<ViewContainerRef>,
    i: number
  ) {
    const viewContainer = viewContainers.get(i);
    viewContainer?.clear()
    viewContainer?.element.nativeElement.replaceChildren()
    if (componentType) {
      const componentRef = viewContainer?.createComponent<any>(componentType)
      if (componentRef && 'ocxInitRemoteComponent' in componentRef.instance) {
        ;(componentRef.instance as ocxRemoteComponent).ocxInitRemoteComponent({
          appId: componentInfo.remoteComponent.appId,
          productName: componentInfo.remoteComponent.productName,
          baseUrl: componentInfo.remoteComponent.baseUrl,
          permissions: permissions,
        })
      }
      componentRef?.changeDetectorRef.detectChanges()
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
