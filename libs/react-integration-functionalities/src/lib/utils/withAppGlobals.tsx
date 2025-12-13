import { ComponentType, createContext, ReactNode, useContext } from 'react';

interface AppGlobals {
  PRODUCT_NAME: string;
  [key: string]: string | number | boolean;
}

const AppGlobalsContext = createContext<AppGlobals | null>(null);

const AppGlobalsProvider = ({
  children,
  globals,
}: {
  children: ReactNode;
  globals: AppGlobals;
}) => (
  <AppGlobalsContext.Provider value={globals}>
    {children}
  </AppGlobalsContext.Provider>
);

export const withAppGlobals = <P extends object>(
  Component: ComponentType<P>,
  appGlobals: AppGlobals,
) => {
  const WrappedComponent = (props: P) => (
    <AppGlobalsProvider globals={appGlobals}>
      <Component {...props} />
    </AppGlobalsProvider>
  );

  return WrappedComponent;
};

export const useAppGlobals = () => {
  const context = useContext(AppGlobalsContext);
  if (context === null) {
    throw new Error('useAppGlobals must be used within an AppGlobalsProvider');
  }
  return context;
};
