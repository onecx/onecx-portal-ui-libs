import {
  Component,
  ComponentRef,
  ContentChild,
  EventEmitter,
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
import { Technologies } from '@onecx/integration-interface'
import { RemoteComponentConfig } from '../../model/remote-component-config.model'

@Component({
  selector: 'ocx-slot[name]',
  templateUrl: './slot.component.html',
})
export class SlotComponent implements OnInit, OnDestroy {
  @Input()
  name!: string

  private _assignedComponents$ = new BehaviorSubject<(ComponentRef<any> | HTMLElement)[]>([])

  private _inputs$ = new BehaviorSubject<Record<string, unknown>>({})
  @Input()
  get inputs(): Record<string, unknown> {
    return this._inputs$.getValue()
  }
  set inputs(value: Record<string, unknown>) {
    this._inputs$.next({
      ...this._inputs$.getValue(),
      ...value,
    })
  }

  private _outputs$ = new BehaviorSubject<Record<string, any>>({})
  @Input()
  get outputs(): Record<string, any> {
    return this._outputs$.getValue()
  }
  set outputs(value: Record<string, any>) {
    this._outputs$.next({
      ...this._outputs$.getValue(),
      ...value,
    })
  }

  updateDataSub: Subscription | undefined

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
    this.updateDataSub = combineLatest([this._assignedComponents$, this._inputs$, this._outputs$]).subscribe(
      ([components, inputs, outputs]) => {
        components.map((component) => {
          this.updateComponentData(component, inputs, outputs)
        })
      }
    )
    this.subscription = combineLatest([this._viewContainers$, this.components$]).subscribe(
      ([viewContainers, components]) => {
        if (viewContainers && viewContainers.length === components.length) {
          components.forEach((componentInfo, i) => {
            if (componentInfo.componentType) {
              Promise.all([
                Promise.resolve(componentInfo.componentType),
                Promise.resolve(componentInfo.permissions),
              ]).then(([componentType, permissions]) => {
                const component = this.createComponent(componentType, componentInfo, permissions, viewContainers, i)
                if (component) this._assignedComponents$.next([...this._assignedComponents$.getValue(), component])
              })
            }
          })
        }
      }
    )
  }

  private createComponent(
    componentType: Type<unknown> | undefined,
    componentInfo: { remoteComponent: RemoteComponentInfo },
    permissions: string[],
    viewContainers: QueryList<ViewContainerRef>,
    i: number
  ): ComponentRef<any> | HTMLElement | undefined {
    const viewContainer = viewContainers.get(i)
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
      return componentRef
    } else if (
      componentInfo.remoteComponent.technology === Technologies.WebComponentModule ||
      componentInfo.remoteComponent.technology === Technologies.WebComponentScript
    ) {
      if (componentInfo.remoteComponent.elementName) {
        const element = document.createElement(componentInfo.remoteComponent.elementName)
        ;(element as any)['ocxRemoteComponentConfig'] = {
          appId: componentInfo.remoteComponent.appId,
          productName: componentInfo.remoteComponent.productName,
          baseUrl: componentInfo.remoteComponent.baseUrl,
          permissions: permissions,
        } satisfies RemoteComponentConfig
        viewContainer?.element.nativeElement.appendChild(element)
        return element
      }
    }

    return
  }

  private updateComponentData(
    component: ComponentRef<any> | HTMLElement | undefined,
    inputs: Record<string, unknown>,
    outputs: Record<string, EventEmitter<unknown>>
  ) {
    this.setProps(component, inputs)
    this.setProps(component, outputs)
  }

  private setProps(component: ComponentRef<any> | HTMLElement | undefined, props: Record<string, unknown>) {
    if (!component) return

    Object.entries(props).map(([name, value]) => {
      if (component instanceof HTMLElement) {
        ;(component as any)[name] = value
      } else {
        component.setInput(name, value)
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
    this.updateDataSub?.unsubscribe()
  }
}
