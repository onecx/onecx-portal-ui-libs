import {
  useEffect,
  useState,
  useRef,
  useCallback,
  FC,
  ReactElement,
  ReactNode,
  ComponentRef,
  ComponentType,
  ElementType,
} from 'react'

import { BehaviorSubject, combineLatest, Observable } from 'rxjs'
import { RemoteComponentInfo, SlotComponentConfiguration, useSlot } from '../contexts/slotContext'
import { RemoteComponentConfig } from '../model/remote-component-config.model'

type SlotProps = {
  name: string
  inputs?: Record<string, unknown>
  outputs?: Record<string, (payload: unknown) => void>
  skeleton?: ReactNode
}

type CreateComponentProps = {
  componentType: ComponentType<unknown | undefined>
  componentInfo: SlotComponentConfiguration
  permissions: string[]
  viewContainer: HTMLDivElement | null
  index: number
}

type ViewContainersRef = HTMLDivElement

const viewContainers$ = new BehaviorSubject<ViewContainersRef[]>([])

const _assignedComponents$ = new BehaviorSubject<(ComponentRef<ElementType> | HTMLElement)[]>([])

export const SlotComponent: FC<SlotProps> = ({ name, inputs = {}, outputs = {}, skeleton }) => {
  const slotService = useSlot()
  const [components, setComponents] = useState<SlotComponentConfiguration[]>([])

  let components$: Observable<SlotComponentConfiguration[]>

  const inputs$ = useRef(new BehaviorSubject(inputs))
  const outputs$ = useRef(new BehaviorSubject(outputs))

  const setComponentsObservable = () => {
    components$ = slotService.getComponentsForSlot(name)
  }

  const setViewContainerRef = (element: HTMLDivElement | null) => {
    if (element) {
      viewContainers$.next([...viewContainers$.value, element])
    }
  }

  useEffect(() => {
    if (!slotService) {
      console.error(`SLOT_SERVICE token was not provided. ${name} slot will not be filled with data.`)
      return
    }
    setComponentsObservable()

    const assignedCompsSub = combineLatest([_assignedComponents$, inputs$.current, outputs$.current]).subscribe(
      ([components, inputs, outputs]) => {
        components.forEach((component) => {
          updateComponentData(component as HTMLElement, inputs, outputs)
        })
      }
    )

    const subscription = combineLatest([viewContainers$, components$]).subscribe(([viewContainers, components]) => {
      if (viewContainers && viewContainers.length === components.length) {
        components.forEach((componentInfo, index) => {
          if (componentInfo.componentType) {
            Promise.all([
              Promise.resolve(componentInfo.componentType),
              Promise.resolve(componentInfo.permissions),
            ]).then(([componentType, permissions]) => {
              const component = createComponent({
                componentType: componentType as ComponentType<unknown>,
                componentInfo,
                permissions,
                viewContainer: viewContainers[index],
                index,
              })

              if (component) {
                _assignedComponents$.next([..._assignedComponents$.getValue(), component])
              }
            })
          }
        })
      }
    })

    return () => {
      subscription.unsubscribe()
      assignedCompsSub.unsubscribe()
    }
  }, [])

  const createComponent = ({
    componentType,
    componentInfo,
    viewContainer,
    permissions,
  }: CreateComponentProps): ReactElement | HTMLElement | null => {
    if (!viewContainer) return null

    const rcConfig = {
      appId: componentInfo.remoteComponent.appId,
      productName: componentInfo.remoteComponent.productName,
      baseUrl: componentInfo.remoteComponent.baseUrl,
      permissions: permissions,
    } satisfies RemoteComponentConfig

    if (componentType) {
      const element = document.createElement(componentInfo.remoteComponent.elementName || '')
      ;(element as HTMLElement&{'ocxRemoteComponentConfig':RemoteComponentConfig})['ocxRemoteComponentConfig'] = rcConfig

      addDataStyleId(element, componentInfo.remoteComponent)
      addDataStyleIsolation(element)

      viewContainer.appendChild(element)

      return element
    }

    return null
  }

  const addDataStyleId = (element: HTMLElement, rcInfo: RemoteComponentInfo) => {
    element.dataset['styleId'] = `${rcInfo.productName}|${rcInfo.appId}`
  }

  const addDataStyleIsolation = (element: HTMLElement) => {
    element.dataset['styleIsolation'] = ''
  }

  const updateComponentData = useCallback(
    (component: ReactElement | HTMLElement, inputs: Record<string, unknown>, outputs: Record<string, unknown>) => {
      setProps(component, inputs)
      setProps(component, outputs)
    },
    []
  )

  const setProps = (component: ReactElement | HTMLElement, props: Record<string, unknown>) => {
    if (!component) return

    Object.entries(props).forEach(([name, value]) => {
      if (component instanceof HTMLElement) {
        ;(component as HTMLElement&{[key:string]:unknown})[name] = value
      } else {
        component.props = {
          ...(component.props as object),
          [name]: value,
        }
      }
    })
  }

  useEffect(() => {
    const subscription = components$?.subscribe({
      next: (newComponents) => {
        setComponents(newComponents)
      },
      error: (err) => console.error('Error in slot components observable:', err),
    })

    return () => subscription?.unsubscribe()

    // @ts-expect-error Is used before
  }, [components$])

  return (
    <div>
      {components.map((_component, index) => {
        return (
          <div key={'slot component: ' + index} id="slot" ref={(el) => setViewContainerRef(el)}>
            {skeleton && skeleton}
          </div>
        )
      })}
    </div>
  )
}

export default SlotComponent
