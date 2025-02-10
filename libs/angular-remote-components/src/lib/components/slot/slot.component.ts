import {
  Component,
  ComponentRef,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
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

  /**
   * Inputs to be passed to components inside a slot.
   *
   * @example
   *
   * ## Slot usage
   * ```
   * <ocx-slot name="my-slot-name" [inputs]="{ header: myHeaderValue }">
   * </ocx-slot>
   * ```
   *
   * ## Remote component definition
   * ```
   * export class MyRemoteComponent: {
   * ⁣@Input() header: string = ''
   * }
   * ```
   *
   * ## Remote component template
   * ```
   * <p>myInput = {{header}}</p>
   * ```
   */
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

  /**
   * Outputs to be passed to components inside a slot as EventEmitters. It is important that the output property is annotated with ⁣@Input().
   *
   * @example
   *
   * ## Component with slot in a template
   * ```
   * ⁣@Component({
   *  selector: 'my-component',
   *  templateUrl: './my-component.component.html',
   * })
   * export class MyComponent {
   *  buttonClickedEmitter = new EventEmitter<string>()
   *  constructor() {
   *    this.buttonClickedEmitter.subscribe((msg) => {
   *      console.log(msg)
   *    })
   *  }
   * }
   * ```
   *
   * ## Slot usage in my-component.component.html
   * ```
   * <ocx-slot name="my-slot-name" [outputs]="{ buttonClicked: buttonClickedEmitter }">
   * </ocx-slot>
   * ```
   *
   * ## Remote component definition
   * ```
   * export class MyRemoteComponent: {
   *  ⁣@Input() buttonClicked = EventEmitter<string>()
   *  onButtonClick() {
   *    buttonClicked.emit('payload')
   *  }
   * }
   * ```
   *
   * ## Remote component template
   * ```
   * <button (click)="onButtonClick()">Emit message</button>
   * ```
   */
  private _outputs$ = new BehaviorSubject<Record<string, EventEmitter<any>>>({})
  @Input()
  get outputs(): Record<string, EventEmitter<any>> {
    return this._outputs$.getValue()
  }
  set outputs(value: Record<string, EventEmitter<any>>) {
    this._outputs$.next({
      ...this._outputs$.getValue(),
      ...value,
    })
  }

  _viewContainers$ = new BehaviorSubject<QueryList<ViewContainerRef> | undefined>(undefined)
  @ViewChildren('slot', { read: ViewContainerRef })
  set viewContainers(value: QueryList<ViewContainerRef>) {
    this._viewContainers$.next(value)
  }

  @ContentChild('skeleton') skeleton: TemplateRef<any> | undefined

  subscription: Subscription | undefined
  components$: Observable<SlotComponentConfiguration[]> | undefined

  constructor(@Optional() @Inject(SLOT_SERVICE) private slotService?: SlotService) {}

  ngOnInit(): void {
    if (!this.slotService) {
      console.error(`SLOT_SERVICE token was not provided. ${this.name} slot will not be filled with data.`)
      return
    }
    this.components$ = this.slotService.getComponentsForSlot(this.name)
    combineLatest([this._assignedComponents$, this._inputs$, this._outputs$]).subscribe(
      ([components, inputs, outputs]) => {
        components.forEach((component) => {
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
      const componentHTML = componentRef?.location.nativeElement as HTMLElement
      this.addDataStyleId(componentHTML, componentInfo.remoteComponent)
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
        this.addDataStyleId(element, componentInfo.remoteComponent)
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

  private addDataStyleId(element: HTMLElement, rcInfo: RemoteComponentInfo) {
    element.dataset['styleId'] = `${rcInfo.productName}|${rcInfo.appId}`
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
  }
}
