/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { UserProvider, useUserService } from './userContext'
import { FakeTopic } from '@onecx/accelerator'
import type { UserProfileTopic, PermissionsTopic } from '@onecx/integration-interface'
import { BehaviorSubject } from 'rxjs'
import type { ReactNode } from 'react'

describe('UserProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => <UserProvider>{children}</UserProvider>

  it('provides user context with default topics', () => {
    const { result } = renderHook(() => useUserService(), { wrapper })

    expect(result.current.profile$).toBeTruthy()
    expect(result.current.lang$).toBeTruthy()
    expect(result.current.permissionsTopic$).toBeTruthy()
    expect(result.current.getPermissions).toBeInstanceOf(Function)
    expect(result.current.hasPermission).toBeInstanceOf(Function)
    expect(result.current.isInitialized).toBeInstanceOf(Promise)
  })

  it('allows overriding profile$ via value prop', () => {
    const customProfile$ = FakeTopic.create() as unknown as UserProfileTopic

    const { result } = renderHook(() => useUserService(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <UserProvider value={{ profile$: customProfile$ }}>{children}</UserProvider>
      ),
    })

    expect(result.current.profile$).toBe(customProfile$)
  })

  it('allows overriding permissionsTopic$ via value prop', () => {
    const customPermissions$ = FakeTopic.create(['perm1', 'perm2']) as unknown as PermissionsTopic

    const { result } = renderHook(() => useUserService(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <UserProvider value={{ permissionsTopic$: customPermissions$ }}>{children}</UserProvider>
      ),
    })

    expect(result.current.permissionsTopic$).toBe(customPermissions$)
  })

  it('allows overriding lang$ via value prop', () => {
    const customLang$ = new BehaviorSubject('de')

    const { result } = renderHook(() => useUserService(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <UserProvider value={{ lang$: customLang$ }}>{children}</UserProvider>
      ),
    })

    expect(result.current.lang$).toBe(customLang$)
    expect(result.current.lang$.getValue()).toBe('de')
  })

  it('getPermissions returns observable from permissions topic', async () => {
    const { result } = renderHook(() => useUserService(), { wrapper })

    const permissions = result.current.getPermissions()
    expect(permissions).toBeDefined()
  })

  it('hasPermission returns true for empty permission key', async () => {
    const { result } = renderHook(() => useUserService(), { wrapper })

    const hasPerm = await result.current.hasPermission('')
    expect(hasPerm).toBe(true)
  })

  it('hasPermission returns true for undefined permission key', async () => {
    const { result } = renderHook(() => useUserService(), { wrapper })

    const hasPerm = await result.current.hasPermission(undefined)
    expect(hasPerm).toBe(true)
  })
})
