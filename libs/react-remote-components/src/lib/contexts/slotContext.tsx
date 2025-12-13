import {
  type FC,
  createContext,
  useContext,
  type PropsWithChildren,
} from 'react';
import { map, Observable, shareReplay } from 'rxjs';
import {
  type RemoteComponent,
  RemoteComponentsTopic,
  Technologies,
} from '@onecx/integration-interface';
import { usePermission } from './permissionContext';
import {
  loadRemote,
  registerRemotes,
} from '@module-federation/enhanced/runtime';

export type RemoteComponentInfo = {
  appId: string;
  productName: string;
  baseUrl: string;
  technology: Technologies;
  elementName?: string;
};

export type SlotComponentConfiguration = {
  componentType: Promise<unknown | undefined> | unknown | undefined;
  remoteComponent: RemoteComponentInfo;
  permissions: Promise<string[]> | string[];
};

export interface SlotServiceInterface {
  remoteComponents$: RemoteComponentsTopic;
  getComponentsForSlot(
    slotName: string,
  ): Observable<SlotComponentConfiguration[]>;
  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean>;
  loadComponent(component: RemoteComponent): Promise<unknown> | undefined;
}

const SlotContext = createContext<SlotServiceInterface | undefined>(undefined);
const remoteComponents$ = new RemoteComponentsTopic();

export const SlotProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const permissionsService = usePermission();

  const getComponentsForSlot: SlotServiceInterface['getComponentsForSlot'] = (
    slotName,
  ) => {
    return remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        (
          remoteComponentsInfo.slots?.find(
            (slotMapping) => slotMapping.name === slotName,
          )?.components ?? []
        )
          .map((remoteComponentName) =>
            remoteComponentsInfo.components.find(
              (rc) => rc.name === remoteComponentName,
            ),
          )
          .filter(
            (remoteComponent): remoteComponent is RemoteComponent =>
              !!remoteComponent,
          )
          .map((remoteComponent) => remoteComponent),
      ),
      map((infos) =>
        infos.map((remoteComponent) => {
          registerRemotes(
            [
              {
                name: remoteComponent.appId,
                entry: remoteComponent.remoteEntryUrl,
                type:
                  remoteComponent.technology === Technologies.Angular ||
                  remoteComponent.technology === Technologies.WebComponentModule
                    ? 'module'
                    : 'script',
              },
            ],
            { force: true },
          );

          return {
            componentType: loadComponent(remoteComponent),
            remoteComponent,
            permissions: permissionsService.getPermissions(
              remoteComponent.appId,
              remoteComponent.productName,
            ),
          };
        }),
      ),
      shareReplay(),
    );
  };

  const isSomeComponentDefinedForSlot: SlotServiceInterface['isSomeComponentDefinedForSlot'] =
    (slotName) => {
      return remoteComponents$.pipe(
        map((remoteComponentsInfo) =>
          remoteComponentsInfo.slots.some(
            (slotMapping) =>
              slotMapping.name === slotName &&
              slotMapping.components.length > 0,
          ),
        ),
      );
    };

  const loadComponent: SlotServiceInterface['loadComponent'] = async (
    component,
  ) => {
    try {
      const exposedModule = component.exposedModule.startsWith('./')
        ? component.exposedModule.slice(2)
        : component.exposedModule;

      const m = await loadRemote(`${component.appId}/${exposedModule}`, {
        from: 'runtime',
      });

      return m;
    } catch (e) {
      console.log(
        'Failed to load remote module ',
        component.exposedModule,
        component.remoteEntryUrl,
        e,
      );
      return undefined;
    }
  };

  return (
    <SlotContext.Provider
      value={{
        remoteComponents$,
        getComponentsForSlot,
        isSomeComponentDefinedForSlot,
        loadComponent,
      }}
    >
      {children}
    </SlotContext.Provider>
  );
};

export const useSlot = (): SlotServiceInterface => {
  const context = useContext(SlotContext);

  if (!context) {
    throw new Error('useSlot must be used within a SlotProvider');
  }
  return context;
};
