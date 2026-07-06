import { renderHook } from '@testing-library/react'
import { type FC, type PropsWithChildren } from 'react'
import { PermissionContext } from '../contexts/permissionContext'
import { usePermission } from './usePermission'

jest.mock('@onecx/react-integration-interface', () => ({
  useTopic: (_valueTopic: unknown, TopicClass: new () => unknown) => new TopicClass(),
}))

const mockPermissionService = {
  getPermissions: jest.fn(() => Promise.resolve(['perm1', 'perm2'])),
}

const PermissionProviderWrapper: FC<PropsWithChildren<{}>> = ({ children }) => (
  <PermissionContext.Provider value={mockPermissionService}>{children}</PermissionContext.Provider>
)

describe('usePermission', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw when used outside PermissionProvider', () => {
    expect(() => renderHook(() => usePermission())).toThrow('usePermission must be used within a PermissionProvider')
  })

  it('should return the permission context value', () => {
    const { result } = renderHook(() => usePermission(), { wrapper: PermissionProviderWrapper })
    expect(result.current).toBe(mockPermissionService)
  })

  it('should expose getPermissions function', () => {
    const { result } = renderHook(() => usePermission(), { wrapper: PermissionProviderWrapper })
    expect(typeof result.current.getPermissions).toBe('function')
  })

  it('should delegate getPermissions calls to the context', async () => {
    const { result } = renderHook(() => usePermission(), { wrapper: PermissionProviderWrapper })
    const perms = await result.current.getPermissions('app1', 'prod1')
    expect(perms).toEqual(['perm1', 'perm2'])
    expect(mockPermissionService.getPermissions).toHaveBeenCalledWith('app1', 'prod1')
  })
})
