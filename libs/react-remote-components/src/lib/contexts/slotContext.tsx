import { type FC, createContext, useMemo, type PropsWithChildren } from 'react'
import { map, of, shareReplay } from 'rxjs'
import { type RemoteComponent, RemoteComponentsTopic, Technologies } from '@onecx/integration-interface'
import { usePermission } from '../hooks/usePermission'
import { createLogger } from '../utils/logger.utils'
import type { SlotServiceInterface } from '../models/slot-types'
import { getShellMfInstance } from '../utils/getShellMfInstance'

/** Slot context for remote component services. */
export const SlotContext = createContext<SlotServiceInterface | undefined>(undefined)
const remoteComponents$ = new RemoteComponentsTopic()
const logger = createLogger('SlotProvider')

/**
 * Provides slot services for loading and resolving remote components.
 * @param children - nested content rendered with slot context.
 * @returns Slot context provider component.
 */
export const SlotProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const permissionsService = usePermission()
  const shellMfInstance = getShellMfInstance()

  /**
   * Resolve remote components for a given slot.
   * @param slotName - slot identifier.
   * @returns observable of resolved components.
   */
  const getComponentsForSlot: SlotServiceInterface['getComponentsForSlot'] = (slotName) => {
    if (!shellMfInstance) {
      logger.error('Failed to find shell module federation instance')
      return of([])
    }

    return remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        (remoteComponentsInfo.slots?.find((slotMapping) => slotMapping.name === slotName)?.components ?? [])
          .map((remoteComponentName) => remoteComponentsInfo.components.find((rc) => rc.name === remoteComponentName))
          .filter((remoteComponent): remoteComponent is RemoteComponent => !!remoteComponent)
      ),
      map((infos) =>
        infos.map((remoteComponent) => {
          if (remoteComponent.technology === Technologies.Angular) {
            throw new Error(`Remote component "${remoteComponent.name}" cannot be loaded in React.`)
          }

          shellMfInstance.registerRemotes(
            [
              {
                name: remoteComponent.appId,
                entry: remoteComponent.remoteEntryUrl,
                type: remoteComponent.technology === Technologies.WebComponentModule ? 'module' : 'script',
              },
            ],
            { force: true }
          )

          return {
            componentType: loadComponent(remoteComponent),
            remoteComponent,
            permissions: permissionsService.getPermissions(remoteComponent.appId, remoteComponent.productName),
          }
        })
      ),
      shareReplay()
    )
  }

  /**
   * Check whether any components are registered for a slot.
   * @param slotName - slot identifier.
   * @returns observable emitting true when components exist.
   */
  const isSomeComponentDefinedForSlot: SlotServiceInterface['isSomeComponentDefinedForSlot'] = (slotName) => {
    return remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        remoteComponentsInfo.slots.some(
          (slotMapping) => slotMapping.name === slotName && slotMapping.components.length > 0
        )
      )
    )
  }

  /**
   * Load a remote component module using module federation.
   * @param component - remote component descriptor.
   * @returns loaded module or undefined when load fails.
   */
  const loadComponent: SlotServiceInterface['loadComponent'] = async (component) => {
    try {
      const exposedModule = component.exposedModule.startsWith('./')
        ? component.exposedModule.slice(2)
        : component.exposedModule

      const m = await shellMfInstance!.loadRemote(`${component.appId}/${exposedModule}`)

      return m
    } catch (e) {
      logger.error('Failed to load remote module', component.exposedModule, component.remoteEntryUrl, e)
      return undefined
    }
  }

  const contextValue = useMemo(
    () => ({
      remoteComponents$,
      getComponentsForSlot,
      isSomeComponentDefinedForSlot,
      loadComponent,
    }),
    [remoteComponents$, getComponentsForSlot, isSomeComponentDefinedForSlot, loadComponent]
  )

  return <SlotContext.Provider value={contextValue}>{children}</SlotContext.Provider>
}
