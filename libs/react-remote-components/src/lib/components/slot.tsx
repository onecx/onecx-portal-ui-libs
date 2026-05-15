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
  type ComponentPropsWithRef,
} from 'react'
import { BehaviorSubject, combineLatest } from 'rxjs'
import type { RemoteComponentInfo, SlotComponentConfiguration, RemoteComponentConfig } from '../models'
import { useSlot } from '../hooks/useSlot'

/**
 * Props for rendering a slot of remote components.
 */
type SlotProps = {
  name: string
  inputs?: Record<string, unknown>
  outputs?: Record<string, (payload: any) => void>
  skeleton?: ReactNode
}

/**
 * Parameters used to instantiate a remote component instance.
 */
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
 * @param name - slot name used to resolve remote components.
 * @param inputs - input props passed to loaded components.
 * @param outputs - output callbacks passed to loaded components.
 * @param skeleton - placeholder rendered while components load.
 * @returns Slot component element.
 */
export const SlotComponent: FC<SlotProps> = ({ name, inputs = {}, outputs = {}, skeleton }) => {
  const slotService = useSlot()
  const [components, setComponents] = useState<any[]>([])
  const viewContainersRef = useRef(new Set<HTMLDivElement>())
  const assignedElementsRef = useRef(new Set<HTMLElement>())

  const components$ = useMemo(() => slotService?.getComponentsForSlot(name), [slotService, name])

  const inputs$ = useRef(new BehaviorSubject(inputs))
  const outputs$ = useRef(new BehaviorSubject(outputs))

  /**
   * Register a view container element once per rendered slot placeholder.
   * @param element - Slot container element instance.
   */
  const setViewContainerRef = (element: HTMLDivElement | null) => {
    if (!element || viewContainersRef.current.has(element)) return
    viewContainersRef.current.add(element)
    if (!viewContainers$.value.includes(element)) {
      viewContainers$.next([...viewContainers$.value, element])
    }
  }
  /**
   * Apply props to a React element or custom element instance.
   * @param component - Target component element.
   * @param props - Props to apply.
   */
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
  /**
   * Update component inputs and outputs.
   * @param component - Component instance to update.
   * @param inputs - Input props to apply.
   * @param outputs - Output handlers to apply.
   */
  const updateComponentData = useCallback(
    (component: ReactElement | HTMLElement, inputs: Record<string, unknown>, outputs: Record<string, any>) => {
      setProps(component, inputs)
      setProps(component, outputs)
    },
    []
  )
  /**
   * Attach style scoping attributes to a component element.
   * @param element - Target element.
   * @param rcInfo - Remote component info for scoping.
   */
  const addDataStyleId = (element: HTMLElement, rcInfo: RemoteComponentInfo) => {
    element.dataset['styleId'] = `${rcInfo.productName}|${rcInfo.appId}`
  }

  /**
   * Attach style isolation attribute to a component element.
   * @param element - Target element.
   */
  const addDataStyleIsolation = (element: HTMLElement) => {
    element.dataset['styleIsolation'] = ''
  }
  /**
   * Create and mount a remote component element.
   * @param componentType - Loaded component type (module federation).
   * @param componentInfo - Slot configuration data.
   * @param permissions - Permissions resolved for the component.
   * @param viewContainer - Host container element.
   * @param index - Index of component in slot.
   * @returns Created element or null when not created.
   */
  const createComponent = ({
    componentType,
    componentInfo,
    viewContainer,
    permissions,
  }: CreateComponentProps): ReactElement | HTMLElement | null => {
    if (!viewContainer) return null

    const elementName = componentInfo.remoteComponent.elementName || ''
    const existingElement = elementName ? viewContainer.querySelector(elementName) : null
    if (existingElement) {
      return existingElement as HTMLElement
    }

    const rcConfig = {
      appId: componentInfo.remoteComponent.appId,
      productName: componentInfo.remoteComponent.productName,
      baseUrl: componentInfo.remoteComponent.baseUrl,
      permissions: permissions,
    } satisfies RemoteComponentConfig

    if (componentType) {
      const element = document.createElement(elementName)
      ;(element as any)['ocxRemoteComponentConfig'] = rcConfig

      addDataStyleId(element, componentInfo.remoteComponent)
      addDataStyleIsolation(element)

      viewContainer.appendChild(element)
      assignedElementsRef.current.add(element)

      return element
    }

    return null
  }
  useEffect(() => {
    return () => {
      if (viewContainersRef.current.size > 0) {
        viewContainers$.next(viewContainers$.value.filter((element) => !viewContainersRef.current.has(element)))
        viewContainersRef.current.clear()
      }
      if (assignedElementsRef.current.size > 0) {
        _assignedComponents$.next(
          _assignedComponents$.value.filter(
            (component) => !(component instanceof HTMLElement) || !assignedElementsRef.current.has(component)
          )
        )
        assignedElementsRef.current.clear()
      }
    }
  }, [])
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

              if (component && !_assignedComponents$.getValue().includes(component)) {
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
          <div key={'slot component: ' + index} id={`slot-${index}`} ref={(el) => setViewContainerRef(el)}>
            {skeleton}
          </div>
        )
      })}
    </div>
  )
}
