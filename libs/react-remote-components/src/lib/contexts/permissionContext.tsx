import {
  type FC,
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { filter, firstValueFrom, map } from 'rxjs';
import {
  type PermissionsRpc,
  PermissionsRpcTopic,
} from '@onecx/integration-interface';

interface PermissionContextType {
  permissions: PermissionsRpc[];
  getPermissions: (appId: string, productName: string) => Promise<string[]>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined,
);

const permissionsTopic$ = new PermissionsRpcTopic();

export const PermissionProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [permissions, setPermissions] = useState<PermissionsRpc[]>([]);

  const getPermissions = async (
    appId: string,
    productName: string,
  ): Promise<string[]> => {
    const permissions = firstValueFrom(
      permissionsTopic$.pipe(
        filter(
          (message) =>
            message.appId === appId &&
            message.productName === productName &&
            Array.isArray(message.permissions),
        ),
        map((message) => message.permissions ?? []),
      ),
    );
    permissionsTopic$.publish({ appId: appId, productName: productName });
    return permissions;
  };

  useEffect(() => {
    return () => {
      permissionsTopic$
        .subscribe((message) => {
          setPermissions((prev) => [...prev, message]);
        })
        .unsubscribe();
    };
  }, []);

  return (
    <PermissionContext.Provider value={{ permissions, getPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};
