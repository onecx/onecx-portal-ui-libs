import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  Observable,
  Subscription,
} from 'rxjs';
import {
  PermissionsTopic,
  UserProfileTopic,
} from '@onecx/integration-interface';
import { DEFAULT_LANG } from '../api/constants';

interface UserContextValue {
  profile$: UserProfileTopic;
  lang$: BehaviorSubject<string>;
  getPermissions: () => Observable<string[]>;
  hasPermission: (
    permissionKey: string | string[] | undefined
  ) => Promise<boolean>;
  isInitialized: Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
  value?: Partial<UserContextValue>;
}

const UserContext = createContext<UserContextValue | null>(null);

/**
 * Hook to access user context
 * Must be used within UserProvider
 */
const useUserService = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserService must be used within a UserProvider');
  }
  return context;
};

const UserProvider: React.FC<UserProviderProps> = ({ children, value }) => {
  // Create stable instances using refs to prevent unnecessary re-renders
  const profile$ = useMemo(
    () => value?.profile$ ?? new UserProfileTopic(),
    [value?.profile$]
  );

  const [lang$] = useState(() => {
    const initialLang = determineLanguage() ?? DEFAULT_LANG;
    return value?.lang$ ?? new BehaviorSubject(initialLang);
  });

  const permissionsTopic$ = useMemo(() => new PermissionsTopic(), []);

  // Use ref to store subscriptions for cleanup
  const subscriptionsRef = useRef<Subscription[]>([]);

  // Subscribe to profile changes and update language
  useEffect(() => {
    const subscription = profile$
      .pipe(
        map(
          (profile) =>
            profile.accountSettings?.localeAndTimeSettings?.locale ??
            determineLanguage() ??
            DEFAULT_LANG
        )
      )
      .subscribe(lang$);

    subscriptionsRef.current.push(subscription);

    return () => {
      subscription.unsubscribe();
    };
  }, [profile$, lang$]);

  // Cleanup on unmount - destroy topics and unsubscribe
  useEffect(() => {
    return () => {
      // Unsubscribe all subscriptions
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current = [];

      // Destroy topics
      profile$.destroy();
    };
  }, [profile$]);

  // Memoize functions to prevent unnecessary re-renders
  const getPermissions = useCallback((): Observable<string[]> => {
    return permissionsTopic$.asObservable();
  }, [permissionsTopic$]);

  // Internal function to check single permission
  const checkSinglePermission = useCallback(
    async (permissionKey: string): Promise<boolean> => {
      return firstValueFrom(
        permissionsTopic$.pipe(
          map((permissions) => {
            const result = permissions.includes(permissionKey);
            if (!result) {
              console.log(`👮‍♀️ No permission for: ${permissionKey}`);
            }
            return !!result;
          })
        )
      );
    },
    [permissionsTopic$]
  );

  const hasPermission = useCallback(
    async (permissionKey: string | string[] | undefined): Promise<boolean> => {
      if (!permissionKey) return true;

      if (Array.isArray(permissionKey)) {
        const permissions = await Promise.all(
          permissionKey.map((key) => checkSinglePermission(key))
        );
        return permissions.every((hasPermission) => hasPermission);
      }

      return checkSinglePermission(permissionKey);
    },
    [checkSinglePermission]
  );

  // Memoize isInitialized promise
  const isInitialized = useMemo((): Promise<void> => {
    return Promise.all([
      permissionsTopic$.isInitialized,
      profile$.isInitialized,
    ]).then(() => {
      // Initialization complete
    });
  }, [permissionsTopic$, profile$]);

  const contextValue = useMemo(
    (): UserContextValue => ({
      profile$,
      lang$,
      getPermissions,
      hasPermission,
      isInitialized,
    }),
    [profile$, lang$, getPermissions, hasPermission, isInitialized]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

/**
 * Determine browser language
 */
function determineLanguage(): string | undefined {
  if (
    typeof window === 'undefined' ||
    typeof window.navigator === 'undefined'
  ) {
    return undefined;
  }

  let browserLang: any = window.navigator.languages
    ? window.navigator.languages[0]
    : null;
  browserLang = browserLang || window.navigator.language;

  if (typeof browserLang === 'undefined') {
    return undefined;
  }

  if (browserLang.indexOf('-') !== -1) {
    browserLang = browserLang.split('-')[0];
  }

  if (browserLang.indexOf('_') !== -1) {
    browserLang = browserLang.split('_')[0];
  }

  return browserLang;
}

export { UserProvider, useUserService, UserContext };
export type { UserContextValue, UserProviderProps };
