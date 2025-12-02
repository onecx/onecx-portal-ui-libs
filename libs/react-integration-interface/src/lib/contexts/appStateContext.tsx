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
  /**
   * This topic will only fire when pageInfo.path matches document.location.pathname,
   * if not it will fire undefined.
   */
  currentPage$: CurrentPageTopic;
  currentWorkspace$: CurrentWorkspaceTopic;
  /**
   * This Topic is initialized as soon as the authentication is done
   */
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
  // Track which topics are created internally for proper cleanup
  const internalTopics = {
    globalError$: !value?.globalError$,
    globalLoading$: !value?.globalLoading$,
    currentMfe$: !value?.currentMfe$,
    currentPage$: !value?.currentPage$,
    currentWorkspace$: !value?.currentWorkspace$,
    isAuthenticated$: !value?.isAuthenticated$,
  };

  const globalError$ = useMemo(
    () => value?.globalError$ ?? new GlobalErrorTopic(),
    [value?.globalError$]
  );
  const globalLoading$ = useMemo(
    () => value?.globalLoading$ ?? new GlobalLoadingTopic(),
    [value?.globalLoading$]
  );
  const currentMfe$ = useMemo(
    () => value?.currentMfe$ ?? new CurrentMfeTopic(),
    [value?.currentMfe$]
  );
  const currentPage$ = useMemo(
    () => value?.currentPage$ ?? new CurrentPageTopic(),
    [value?.currentPage$]
  );
  const currentWorkspace$ = useMemo(
    () => value?.currentWorkspace$ ?? new CurrentWorkspaceTopic(),
    [value?.currentWorkspace$]
  );
  const isAuthenticated$ = useMemo(
    () => value?.isAuthenticated$ ?? new IsAuthenticatedTopic(),
    [value?.isAuthenticated$]
  );

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      globalError$,
      globalLoading$,
      currentMfe$,
      currentPage$,
      currentWorkspace$,
      isAuthenticated$,
    }),
    [
      globalError$,
      globalLoading$,
      currentMfe$,
      currentPage$,
      currentWorkspace$,
      isAuthenticated$,
    ]
  );

  useEffect(() => {
    return () => {
      if (internalTopics.globalError$) globalError$.destroy();
      if (internalTopics.globalLoading$) globalLoading$.destroy();
      if (internalTopics.currentMfe$) currentMfe$.destroy();
      if (internalTopics.currentPage$) currentPage$.destroy();
      if (internalTopics.currentWorkspace$) currentWorkspace$.destroy();
      if (internalTopics.isAuthenticated$) isAuthenticated$.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globalError$,
    globalLoading$,
    currentMfe$,
    currentPage$,
    currentWorkspace$,
    isAuthenticated$,
  ]);

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
