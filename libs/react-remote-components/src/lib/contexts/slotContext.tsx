import { type FC, createContext, useMemo, type PropsWithChildren } from 'react'
import { map, shareReplay } from 'rxjs'
import { type RemoteComponent, RemoteComponentsTopic, Technologies } from '@onecx/integration-interface'
import { usePermission } from '../hooks/usePermission'
import { loadRemote, registerRemotes } from '@module-federation/enhanced/runtime'
import { createLogger } from '../utils/logger.utils'
import type { SlotServiceInterface } from '../models/slot-types'

export const SlotContext = createContext<SlotServiceInterface | undefined>(undefined)
const remoteComponents$ = new RemoteComponentsTopic()
const logger = createLogger('SlotProvider')

/**
 * Provides slot services for loading and resolving remote components.
 */
export const SlotProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const permissionsService = usePermission()

  const getComponentsForSlot: SlotServiceInterface['getComponentsForSlot'] = (slotName) => {
    return remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        (remoteComponentsInfo.slots?.find((slotMapping) => slotMapping.name === slotName)?.components ?? [])
          .map((remoteComponentName) => remoteComponentsInfo.components.find((rc) => rc.name === remoteComponentName))
          .filter((remoteComponent): remoteComponent is RemoteComponent => !!remoteComponent)
          .map((remoteComponent) => remoteComponent)
      ),
      map((infos) =>
        infos.map((remoteComponent) => {
          if (remoteComponent.technology === Technologies.Angular) {
            throw new Error(`Remote component "${remoteComponent.name}" cannot be loaded in React.`)
          }

          registerRemotes(
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

  const isSomeComponentDefinedForSlot: SlotServiceInterface['isSomeComponentDefinedForSlot'] = (slotName) => {
    return remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        remoteComponentsInfo.slots.some(
          (slotMapping) => slotMapping.name === slotName && slotMapping.components.length > 0
        )
      )
    )
  }

  const loadComponent: SlotServiceInterface['loadComponent'] = async (component) => {
    try {
      const exposedModule = component.exposedModule.startsWith('./')
        ? component.exposedModule.slice(2)
        : component.exposedModule

      const m = await loadRemote(`${component.appId}/${exposedModule}`, {
        from: 'runtime',
      })

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
