import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  type FC,
  type ReactElement,
  type ReactNode,
  type ComponentType,
  ComponentPropsWithRef,
} from 'react'
import { BehaviorSubject, combineLatest, Observable } from 'rxjs'
import { type RemoteComponentInfo, type SlotComponentConfiguration, useSlot } from '../contexts/slotContext'
import { RemoteComponentConfig } from '../models/remoteComponentConfig'

type SlotProps = {
  name: string
  inputs?: Record<string, unknown>
  outputs?: Record<string, (payload: any) => void>
  skeleton?: ReactNode
}

type CreateComponentProps = {
  componentType: ComponentType<any | undefined>
  componentInfo: SlotComponentConfiguration
  permissions: string[]
  viewContainer: HTMLDivElement | null
  index: number
}

type ViewContainersRef = HTMLDivElement

const viewContainers$ = new BehaviorSubject<ViewContainersRef[]>([])

const _assignedComponents$ = new BehaviorSubject<(ComponentPropsWithRef<any> | HTMLElement)[]>([])

/**
 * Renders remote components registered for a slot and manages their inputs/outputs.
 */
export const SlotComponent: FC<SlotProps> = ({ name, inputs = {}, outputs = {}, skeleton }) => {
  const slotService = useSlot()
  const [components, setComponents] = useState<any[]>([])

  const components$ = useMemo(() => slotService?.getComponentsForSlot(name), [slotService, name])

  const inputs$ = useRef(new BehaviorSubject(inputs))
  const outputs$ = useRef(new BehaviorSubject(outputs))

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
    if (!components$) {
      return
    }

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
                componentType: componentType as ComponentType<any>,
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
  }, [components$, name, slotService])

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
      ;(element as any)['ocxRemoteComponentConfig'] = rcConfig

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
  const setProps = (component: ReactElement | HTMLElement, props: Record<string, unknown>) => {
    if (!component) return

    Object.entries(props).forEach(([name, value]) => {
      if (component instanceof HTMLElement) {
        ;(component as any)[name] = value
      } else {
        component.props = {
          ...(component.props as object),
          [name]: value,
        }
      }
    })
  }
  const updateComponentData = useCallback(
    (component: ReactElement | HTMLElement, inputs: Record<string, unknown>, outputs: Record<string, any>) => {
      setProps(component, inputs)
      setProps(component, outputs)
    },
    []
  )

  useEffect(() => {
    if (!components$) {
      return
    }

    const subscription = components$.subscribe({
      next: (newComponents) => {
        setComponents(newComponents)
      },
      error: (err) => console.error('Error in slot components observable:', err),
    })

    return () => subscription?.unsubscribe()
  }, [components$])

  return (
    <div>
      {components.map((_component, index) => {
        return (
          <div key={'slot component: ' + index} id="slot" ref={(el) => setViewContainerRef(el)}>
            {skeleton}
          </div>
        )
      })}
    </div>
  )
}

export default SlotComponent
