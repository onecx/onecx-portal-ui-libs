import { createContext, useEffect, RefObject, useRef, ReactNode } from 'react';
import { attachPrimeReactScoper } from '../../scopingFunctionality';
import { useAppGlobals } from '../../../utils/withAppGlobals';

interface PrimeReactStyleProviderProps {
  children: ReactNode;
}

const PrimeReactStyleContext = createContext<
  { rootRef: RefObject<HTMLDivElement> } | undefined
>(undefined);

export const PrimeReactStyleProvider = ({
  children,
}: PrimeReactStyleProviderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { PRODUCT_NAME } = useAppGlobals();
  const appId = `${PRODUCT_NAME}|main`;

  useEffect(() => {
    const detach = attachPrimeReactScoper({
      id: appId,
      productName: PRODUCT_NAME,
      scopeRootSelector: `[data-style-id="${appId}"]`,
      bootstrapExisting: true,
      blockFurtherUpdatesForCapturedIds: false,
    });

    return () => detach();
  }, [appId]);

  return (
    <PrimeReactStyleContext.Provider value={{ rootRef }}>
      <div
        ref={rootRef}
        data-style-id={appId}
        data-style-isolation
        data-no-portal-layout-styles
        style={{ display: 'contents' }}
      >
        {children}
      </div>
    </PrimeReactStyleContext.Provider>
  );
};
