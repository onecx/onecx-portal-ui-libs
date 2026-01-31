import { ComponentType, FC } from 'react';
import { SlotProvider } from '../contexts/slotContext';
import { PermissionProvider } from '../contexts/permissionContext';

export const withSlot = <P extends object>(
  WrappedComponent: ComponentType<P>
): FC<P> => {
  const hocComponent = (props: P) => (
    <PermissionProvider>
      <SlotProvider>
        <WrappedComponent {...props} />
      </SlotProvider>
    </PermissionProvider>
  );

  return hocComponent;
};
