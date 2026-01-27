import {
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
  inject,
} from '@angular/core'

import {
  ResizedEventsTopic,
  Technologies,
  SlotResizedEvent,
  ResizedEventType,
  RequestedEventsChangedEvent,
} from '@onecx/integration-interface'
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs'
import { ocxRemoteComponent } from '../../model/remote-component'
import { RemoteComponentInfo, SLOT_SERVICE, SlotComponentConfiguration, SlotService } from '../../services/slot.service'
import { RemoteComponentConfig, scopeIdFromProductNameAndAppId } from '@onecx/angular-utils'
import { HttpClient } from '@angular/common/http'
import { debounceTime, filter, take } from 'rxjs/operators'
import { updateStylesForRcCreation, removeAllRcUsagesFromStyles } from '@onecx/angular-utils/style'
import { createLogger } from '../../utils/logger.utils'

interface AssignedComponent {
  refOrElement: ComponentRef<any> | HTMLElement
  remoteInfo: RemoteComponentInfo
}

@Component({
  standalone: false,
  selector: 'ocx-slot[name]',
  template: ``,
  host: {
    '[attr.name]': 'name',
  },
})
export class SlotComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient)
  private elementRef = inject(ElementRef)
  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly logger = createLogger('SlotComponent')

  @Input()
  name!: string

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

  subscriptions: Subscription[] = []
  components$: Observable<SlotComponentConfiguration[]> | undefined

  private resizeObserver: ResizeObserver | undefined
  private readonly componentSize$ = new BehaviorSubject<{ width: number; height: number }>({ width: -1, height: -1 })
  private resizeDebounceTimeMs = 100

  private _resizedEventsTopic: ResizedEventsTopic | undefined
  get resizedEventsTopic() {
    this._resizedEventsTopic ??= new ResizedEventsTopic()
    return this._resizedEventsTopic
  }
  set resizedEventsTopic(source: ResizedEventsTopic) {
    this._resizedEventsTopic = source
  }
  private readonly requestedEventsChanged$ = this.resizedEventsTopic.pipe(
    filter((event): event is RequestedEventsChangedEvent => event.type === ResizedEventType.REQUESTED_EVENTS_CHANGED)
  )

  ngOnDestroy(): void {
    this._resizedEventsTopic?.destroy()
    this.subscriptions.forEach((sub) => sub.unsubscribe())
    this.resizeObserver?.disconnect()
    this.componentSize$.complete() // Complete the subject to avoid memory leaks
    // Removes RC styles on unmount to avoid ghost styles
    this._assignedComponents$.getValue().forEach((component) => {
      const scopeId = scopeIdFromProductNameAndAppId(component.remoteInfo.productName, component.remoteInfo.appId)
      removeAllRcUsagesFromStyles(scopeId, this.name)
    })
    this.viewContainerRef.clear()
  }

  ngOnInit(): void {
    if (!this.slotService) {
      this.logger.error(`SLOT_SERVICE token was not provided. ${this.name} slot will not be filled with data.`)
      return
    }
    this.components$ = this.slotService.getComponentsForSlot(this.name)
    const updateSub = combineLatest([this._assignedComponents$, this._inputs$, this._outputs$]).subscribe(
      ([components, inputs, outputs]) => {
        components.forEach((component) => {
          this.updateComponentData(component.refOrElement, inputs, outputs)
        })
      }
    )
    this.subscriptions.push(updateSub)

    const createSub = this.components$.pipe(take(1)).subscribe((components) => {
      this.createSpansForComponents(components)
      this.createComponents(components)
    })
    this.subscriptions.push(createSub)

    this.observeSlotSizeChanges()
  }

  private createSpansForComponents(components: SlotComponentConfiguration[]) {
    for (let i = 0; i < components.length; i++) {
      const span = document.createElement('span')
      span.dataset['index'] = i.toString()
      this.viewContainerRef.element.nativeElement.appendChild(span)
    }
  }

  private createComponents(components: SlotComponentConfiguration[]) {
    components.forEach((componentInfo, index) => {
      if (componentInfo.componentType) {
        Promise.all([Promise.resolve(componentInfo.componentType), Promise.resolve(componentInfo.permissions)]).then(
          ([componentType, permissions]) => {
            const component = this.createComponent(componentType, componentInfo, permissions, index)
            if (component) {
              this._assignedComponents$.next([
                ...this._assignedComponents$.getValue(),
                { refOrElement: component, remoteInfo: componentInfo.remoteComponent },
              ])
            }
          }
        )
      }
    })
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
      this.resizedEventsTopic.publish(slotResizedEvent)
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
        this.resizedEventsTopic.publish(slotResizedEvent)
      }
    })
    this.subscriptions.push(requestedEventsChangedSub)
  }

  private createComponent(
    componentType: Type<unknown> | undefined,
    componentInfo: { remoteComponent: RemoteComponentInfo },
    permissions: string[],
    index: number
  ): ComponentRef<any> | HTMLElement | undefined {
    if (componentType) {
      return this.createAngularComponent(componentType, componentInfo, permissions, index)
    }

    if (
      (componentInfo.remoteComponent.technology === Technologies.WebComponentModule ||
        componentInfo.remoteComponent.technology === Technologies.WebComponentScript) &&
      componentInfo.remoteComponent.elementName !== undefined
    ) {
      return this.createWebComponent(
        componentInfo as { remoteComponent: RemoteComponentInfo & { elementName: string } },
        permissions,
        index
      )
    }

    return
  }

  private createAngularComponent(
    componentType: Type<unknown>,
    componentInfo: { remoteComponent: RemoteComponentInfo },
    permissions: string[],
    index: number
  ): ComponentRef<any> {
    const componentRef = this.viewContainerRef.createComponent<any>(componentType, { index: index })
    const componentHTML = componentRef.location.nativeElement as HTMLElement
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

    const span: HTMLSpanElement | undefined = this.viewContainerRef.element.nativeElement.querySelector(
      `span[data-index="${index}"]`
    ) as HTMLSpanElement
    if (span) {
      span.remove()
    } else {
      this.logger.error(
        'Component span was not found for slot component creation. The order of the components may be incorrect.'
      )
    }

    componentRef.changeDetectorRef.detectChanges()
    return componentRef
  }

  private createWebComponent(
    componentInfo: { remoteComponent: RemoteComponentInfo & { elementName: string } },
    permissions: string[],
    index: number
  ): HTMLElement {
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

    const span: HTMLSpanElement | undefined = this.viewContainerRef.element.nativeElement.querySelector(
      `span[data-index="${index}"]`
    ) as HTMLSpanElement
    if (span) {
      this.viewContainerRef.element.nativeElement.insertBefore(element, span)
      span.remove()
    } else {
      this.logger.error(
        'Component span was not found for slot component creation. The order of the components may be incorrect.'
      )
      this.viewContainerRef.element.nativeElement.appendChild(element)
    }
    return element
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
    component: ComponentRef<any> | HTMLElement,
    inputs: Record<string, unknown>,
    outputs: Record<string, EventEmitter<unknown>>
  ) {
    this.setProps(component, inputs)
    this.setProps(component, outputs)
  }

  // split props setting for HTMLElement and ComponentRef
  private setProps(component: ComponentRef<any> | HTMLElement, props: Record<string, unknown>) {
    Object.entries(props).map(([name, value]) => {
      if (component instanceof HTMLElement) {
        ;(component as any)[name] = value
      } else {
        component.setInput(name, value)
      }
    })
  }
}
