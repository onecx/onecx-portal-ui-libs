import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import {
  GlobalErrorTopic,
  GlobalLoadingTopic,
  CurrentMfeTopic,
  CurrentPageTopic,
  CurrentWorkspaceTopic,
  IsAuthenticatedTopic,
} from '@onecx/integration-interface';

interface AppStateContextProps {
  globalError$: GlobalErrorTopic;
  globalLoading$: GlobalLoadingTopic;
  currentMfe$: CurrentMfeTopic;
  currentPage$: CurrentPageTopic;
  currentWorkspace$: CurrentWorkspaceTopic;
  currentPortal$: CurrentWorkspaceTopic;
  isAuthenticated$: IsAuthenticatedTopic;
}

const AppStateContext = createContext<AppStateContextProps>({} as any);

const AppStateProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value?: Partial<AppStateContextProps>;
}) => {
  const globalError$ = useMemo(
    () => value?.globalError$ ?? new GlobalErrorTopic(),
    [value]
  );
  const globalLoading$ = useMemo(
    () => value?.globalLoading$ ?? new GlobalLoadingTopic(),
    [value]
  );
  const currentMfe$ = useMemo(
    () => value?.currentMfe$ ?? new CurrentMfeTopic(),
    [value]
  );
  const currentPage$ = useMemo(
    () => value?.currentPage$ ?? new CurrentPageTopic(),
    [value]
  );
  const currentWorkspace$ = useMemo(
    () => value?.currentWorkspace$ ?? new CurrentWorkspaceTopic(),
    [value]
  );
  const isAuthenticated$ = useMemo(
    () => value?.isAuthenticated$ ?? new IsAuthenticatedTopic(),
    [value]
  );

  const currentPortal$ = currentWorkspace$;

  useEffect(() => {
    return () => {
      globalError$.destroy();
      globalLoading$.destroy();
      currentMfe$.destroy();
      currentPage$.destroy();
      currentWorkspace$.destroy();
      isAuthenticated$.destroy();
    };
  }, [
    globalError$,
    globalLoading$,
    currentMfe$,
    currentPage$,
    currentWorkspace$,
    isAuthenticated$,
  ]);

  const contextValue = useMemo(
    () => ({
      globalError$,
      globalLoading$,
      currentMfe$,
      currentPage$,
      currentWorkspace$,
      currentPortal$,
      isAuthenticated$,
    }),
    [
      globalError$,
      globalLoading$,
      currentMfe$,
      currentPage$,
      currentWorkspace$,
      currentPortal$,
      isAuthenticated$,
    ]
  );

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

/**
 * Needs to be used within AppStateContext
 */
const useAppState = (): AppStateContextProps => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export { AppStateProvider, useAppState, AppStateContext };
