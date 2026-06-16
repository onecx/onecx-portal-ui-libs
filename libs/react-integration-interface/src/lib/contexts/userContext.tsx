import { createContext, useContext, useMemo, useEffect, useState, type ReactNode, useCallback } from 'react'
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs'
import {
  PermissionsTopic,
  UserProfileTopic,
  determineBrowserLanguage,
  resolveProfileLanguage,
} from '@onecx/integration-interface'
import { DEFAULT_LANG } from '../api/constants'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { useTopic } from '../utils/use-topic.utils'

/**
 * User context value shape.
 */
interface UserContextValue {
  profile$: UserProfileTopic
  lang$: BehaviorSubject<string>
  permissionsTopic$?: PermissionsTopic
  /**
   * Stream of permissions for current user.
   * @returns Observable emitting permission keys.
   */
  getPermissions: () => Observable<string[]>
  /**
   * Check whether user has a permission (or list of permissions).
   * @param permissionKey - permission or list of permissions.
   * @returns true when all permissions are granted.
   */
  hasPermission: (permissionKey: string | string[] | undefined) => Promise<boolean>
  /** Promise resolving when topics are initialized. */
  isInitialized: Promise<void>
}

interface UserProviderProps {
  children: ReactNode
  value?: Partial<UserContextValue>
}

const UserContext = createContext<UserContextValue | null>(null)

/**
 * Hook to access user context.
 * Must be used within UserProvider.
 *
 * @returns User context utilities.
 * @throws Error when used outside UserProvider.
 */
const useUserService = (): UserContextValue => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserService must be used within a UserProvider')
  }
  return context
}

/**
 * Provides user profile, permissions, and language topics.
 *
 * @param children - React subtree consuming user context.
 * @param value - Optional overrides for user topics and helpers.
 * @returns Provider wrapping the given children.
 */
const UserProvider: React.FC<UserProviderProps> = ({ children, value }) => {
  const profile$ = useTopic(value?.profile$, UserProfileTopic)

  const lang$ = useMemo(() => {
    const initialLang = determineBrowserLanguage() ?? DEFAULT_LANG
    return value?.lang$ ?? new BehaviorSubject(initialLang)
  }, [value?.lang$])

  const permissionsTopic$ = useTopic(value?.permissionsTopic$, PermissionsTopic)

  // Subscribe to profile changes and update language
  useEffect(() => {
    const subscription = profile$
      .pipe(map((profile) => resolveProfileLanguage(profile, DEFAULT_LANG, getNormalizedBrowserLocales)))
      .subscribe(lang$)

    return () => {
      subscription.unsubscribe()
    }
  }, [profile$, lang$])

  // Memoize functions to prevent unnecessary re-renders
  const getPermissions = useCallback((): Observable<string[]> => {
    return permissionsTopic$.asObservable()
  }, [permissionsTopic$])

  // Internal function to check single permission
  const checkSinglePermission = useCallback(
    async (permissionKey: string): Promise<boolean> => {
      return firstValueFrom(
        permissionsTopic$.pipe(
          map((permissions) => {
            const result = permissions.includes(permissionKey)
            return !!result
          })
        )
      )
    },
    [permissionsTopic$]
  )

  const hasPermission = useCallback(
    async (permissionKey: string | string[] | undefined): Promise<boolean> => {
      if (!permissionKey) return true

      if (Array.isArray(permissionKey)) {
        const permissions = await Promise.all(permissionKey.map((key) => checkSinglePermission(key)))
        return permissions.every(Boolean)
      }

      return checkSinglePermission(permissionKey)
    },
    [checkSinglePermission]
  )

  // Memoize isInitialized promise
  const isInitialized = useMemo((): Promise<void> => {
    return Promise.all([permissionsTopic$.isInitialized, profile$.isInitialized]).then(() => {
      // Initialization complete
    })
  }, [permissionsTopic$, profile$])

  const contextValue = useMemo(
    (): UserContextValue => ({
      profile$,
      lang$,
      permissionsTopic$,
      getPermissions,
      hasPermission,
      isInitialized,
    }),
    [profile$, lang$, permissionsTopic$, getPermissions, hasPermission, isInitialized]
  )

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export { UserProvider, useUserService, UserContext }
export type { UserContextValue, UserProviderProps }
