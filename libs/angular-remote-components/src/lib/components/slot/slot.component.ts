import {
  Component,
  ComponentRef,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  Type,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core'

import {
  ResizedEventsPublisher,
  ResizedEventsTopic,
  Technologies,
  SlotResizedEvent,
  ResizedEventType,
  RequestedEventsChangedEvent,
} from '@onecx/integration-interface'
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs'
import { ocxRemoteComponent } from '../../model/remote-component'
import { RemoteComponentInfo, SLOT_SERVICE, SlotComponentConfiguration, SlotService } from '../../services/slot.service'
import { updateStylesForRcCreation, updateStylesForRcRemoval, RemoteComponentConfig } from '@onecx/angular-utils'
import { HttpClient } from '@angular/common/http'
import { debounceTime, filter } from 'rxjs/operators'

interface AssignedComponent {
  refOrElement: ComponentRef<any> | HTMLElement
  remoteInfo: RemoteComponentInfo
}

@Component({
  standalone: false,
  selector: 'ocx-slot[name]',
  templateUrl: './slot.component.html',
})
export class SlotComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient)
  private elementRef = inject(ElementRef)

  @Input()
  name!: string

  @Input()
  slotStyles: { [key: string]: any } = {}

  @Input()
  slotClasses: string | string[] | Set<string> | { [key: string]: any } = ''

  private slotService = inject<SlotService>(SLOT_SERVICE, { optional: true })
  private _assignedComponents$ = new BehaviorSubject<AssignedComponent[]>([])

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
   *  standalone: false, * selector: 'my-component',
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

  subscriptions: Subscription[] = []
  components$: Observable<SlotComponentConfiguration[]> | undefined

  private resizeObserver: ResizeObserver | undefined
  private componentSize$ = new BehaviorSubject<{ width: number; height: number }>({ width: -1, height: -1 })
  private resizeDebounceTimeMs = 100

  private resizedEventsPublisher = new ResizedEventsPublisher()
  private resizedEventsTopic = new ResizedEventsTopic()
  private requestedEventsChanged$ = this.resizedEventsTopic.pipe(
    filter((event): event is RequestedEventsChangedEvent => event.type === ResizedEventType.REQUESTED_EVENTS_CHANGED)
  )

  ngOnInit(): void {
    if (!this.slotService) {
      console.error(`SLOT_SERVICE token was not provided. ${this.name} slot will not be filled with data.`)
      return
    }
    this.components$ = this.slotService.getComponentsForSlot(this.name)
    combineLatest([this._assignedComponents$, this._inputs$, this._outputs$]).subscribe(
      ([components, inputs, outputs]) => {
        components.forEach((component) => {
          this.updateComponentData(component.refOrElement, inputs, outputs)
        })
      }
    )
    // Components can be created only when component information is available and view containers are created for all remote components
    const sub = combineLatest([this._viewContainers$, this.components$]).subscribe(([viewContainers, components]) => {
      if (viewContainers && viewContainers.length === components.length) {
        components.forEach((componentInfo, i) => {
          if (componentInfo.componentType) {
            Promise.all([
              Promise.resolve(componentInfo.componentType),
              Promise.resolve(componentInfo.permissions),
            ]).then(([componentType, permissions]) => {
              const component = this.createComponent(componentType, componentInfo, permissions, viewContainers, i)
              if (component)
                this._assignedComponents$.next([
                  ...this._assignedComponents$.getValue(),
                  { refOrElement: component, remoteInfo: componentInfo.remoteComponent },
                ])
            })
          }
        })
      }
    })
    this.subscriptions.push(sub)

    this.observeSlotSizeChanges()
  }

  private observeSlotSizeChanges() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const width = entry.contentRect.width
        const height = entry.contentRect.height
        this.componentSize$.next({ width, height })
      }
    })

    this.componentSize$.pipe(debounceTime(this.resizeDebounceTimeMs)).subscribe(({ width, height }) => {
      const slotResizedEvent: SlotResizedEvent = {
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: this.name,
          slotDetails: { width, height },
        },
      }
      this.resizedEventsPublisher.publish(slotResizedEvent)
    })

    this.resizeObserver.observe(this.elementRef.nativeElement)

    const requestedEventsChangedSub = this.requestedEventsChanged$.subscribe((event) => {
      if (event.payload.type === ResizedEventType.SLOT_RESIZED && event.payload.name === this.name) {
        const { width, height } = this.componentSize$.getValue()
        const slotResizedEvent: SlotResizedEvent = {
          type: ResizedEventType.SLOT_RESIZED,
          payload: {
            slotName: this.name,
            slotDetails: { width, height },
          },
        }
        this.resizedEventsPublisher.publish(slotResizedEvent)
      }
    })
    this.subscriptions.push(requestedEventsChangedSub)
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
      this.updateComponentStyles(componentInfo)
      this.addDataStyleId(componentHTML, componentInfo.remoteComponent)
      this.addDataStyleIsolation(componentHTML)
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
        this.updateComponentStyles(componentInfo)
        this.addDataStyleId(element, componentInfo.remoteComponent)
        this.addDataStyleIsolation(element)
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

  private addDataStyleIsolation(element: HTMLElement) {
    element.dataset['styleIsolation'] = ''
  }

  // Load styles exposed by the application the remote component belongs to if its not done already
  private updateComponentStyles(componentInfo: { remoteComponent: RemoteComponentInfo }) {
    updateStylesForRcCreation(
      componentInfo.remoteComponent.productName,
      componentInfo.remoteComponent.appId,
      this.http,
      componentInfo.remoteComponent.baseUrl,
      this.name
    )
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
    this.subscriptions.forEach((sub) => sub.unsubscribe())
    this.resizeObserver?.disconnect()
    this.componentSize$.complete() // Complete the subject to avoid memory leaks
    // Removes RC styles on unmount to avoid ghost styles
    this._assignedComponents$.getValue().forEach((component) => {
      updateStylesForRcRemoval(component.remoteInfo.productName, component.remoteInfo.appId, this.name)
    })
  }
}
