import { FC, useContext } from 'react'
import { render } from '@testing-library/react'
import { firstValueFrom } from 'rxjs'
import { getShellMfInstance as getShellMfInstanceOriginal } from '../utils/getShellMfInstance'
import { SlotProvider, SlotContext } from './slotContext'

jest.mock('@onecx/integration-interface', () => {
  const { BehaviorSubject } = require('rxjs')
  return {
    RemoteComponentsTopic: jest.fn().mockImplementation(
      () =>
        new BehaviorSubject({
          slots: [],
          components: [],
        })
    ),
    Technologies: {
      Angular: 'ANGULAR',
      React: 'REACT',
      WebComponentModule: 'WEB_COMPONENT_MODULE',
    },
  }
})

jest.mock('../utils/getShellMfInstance', () => ({
  getShellMfInstance: jest.fn(),
}))

jest.mock('../hooks/usePermission', () => ({
  usePermission: jest.fn(() => ({
    getPermissions: jest.fn(() => Promise.resolve(['perm1', 'perm2'])),
  })),
}))

jest.mock('../utils/logger.utils', () => ({
  createLogger: jest.fn(() => ({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  })),
}))

const getShellMfInstance = getShellMfInstanceOriginal as jest.Mock

describe('SlotContext', () => {
  it('should be defined', () => {
    expect(SlotContext).toBeDefined()
  })
})

describe('SlotProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be a function component', () => {
    expect(typeof SlotProvider).toBe('function')
  })

  it('should provide context with expected shape', () => {
    getShellMfInstance.mockReturnValue({
      name: 'onecx-shell-ui',
      registerRemotes: jest.fn(),
      loadRemote: jest.fn(),
    })

    let captured: any
    const TestComponent: FC = () => {
      captured = useContext(SlotContext)
      return null
    }

    render(
      <SlotProvider>
        <TestComponent />
      </SlotProvider>
    )
    expect(captured).toBeDefined()
    expect(typeof captured.getComponentsForSlot).toBe('function')
    expect(typeof captured.isSomeComponentDefinedForSlot).toBe('function')
    expect(typeof captured.loadComponent).toBe('function')
  })

  describe('getComponentsForSlot', () => {
    it('should return empty array when shellMfInstance is not available', async () => {
      getShellMfInstance.mockReturnValue(undefined)

      let captured: any
      const TestComponent: FC = () => {
        captured = useContext(SlotContext)
        return null
      }

      render(
        <SlotProvider>
          <TestComponent />
        </SlotProvider>
      )
      const result = await firstValueFrom(captured.getComponentsForSlot('test-slot'))
      expect(result).toEqual([])
    })

    it('should return components for a slot when shellMfInstance is available', async () => {
      getShellMfInstance.mockReturnValue({
        name: 'onecx-shell-ui',
        registerRemotes: jest.fn(),
        loadRemote: jest.fn(),
      })

      let captured: any
      const TestComponent: FC = () => {
        captured = useContext(SlotContext)
        return null
      }

      render(
        <SlotProvider>
          <TestComponent />
        </SlotProvider>
      )
      const result = await firstValueFrom(captured.getComponentsForSlot('test-slot'))
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('isSomeComponentDefinedForSlot', () => {
    it('should return observable of boolean', async () => {
      getShellMfInstance.mockReturnValue({
        name: 'onecx-shell-ui',
        registerRemotes: jest.fn(),
        loadRemote: jest.fn(),
      })

      let captured: any
      const TestComponent: FC = () => {
        captured = useContext(SlotContext)
        return null
      }

      render(
        <SlotProvider>
          <TestComponent />
        </SlotProvider>
      )
      const result = await firstValueFrom(captured.isSomeComponentDefinedForSlot('test-slot'))
      expect(typeof result).toBe('boolean')
    })
  })

  describe('loadComponent', () => {
    it('should load a remote component module', async () => {
      const mockModule = { default: () => null }
      const mockLoadRemote = jest.fn().mockResolvedValue(mockModule)
      getShellMfInstance.mockReturnValue({
        name: 'onecx-shell-ui',
        registerRemotes: jest.fn(),
        loadRemote: mockLoadRemote,
      })

      let captured: any
      const TestComponent: FC = () => {
        captured = useContext(SlotContext)
        return null
      }

      render(
        <SlotProvider>
          <TestComponent />
        </SlotProvider>
      )

      const component = {
        appId: 'test-app',
        productName: 'test-product',
        exposedModule: './TestComponent',
        remoteEntryUrl: 'http://localhost/test.js',
        technology: 'REACT',
        name: 'TestComponent',
        baseUrl: 'http://localhost',
      }

      const result = await captured.loadComponent(component)
      expect(result).toBe(mockModule)
      expect(mockLoadRemote).toHaveBeenCalledWith('test-app/TestComponent')
    })

    it('should handle exposedModule without ./ prefix', async () => {
      const mockModule = { default: () => null }
      const mockLoadRemote = jest.fn().mockResolvedValue(mockModule)
      getShellMfInstance.mockReturnValue({
        name: 'onecx-shell-ui',
        registerRemotes: jest.fn(),
        loadRemote: mockLoadRemote,
      })

      let captured: any
      const TestComponent: FC = () => {
        captured = useContext(SlotContext)
        return null
      }

      render(
        <SlotProvider>
          <TestComponent />
        </SlotProvider>
      )

      const component = {
        appId: 'test-app',
        productName: 'test-product',
        exposedModule: 'TestComponent',
        remoteEntryUrl: 'http://localhost/test.js',
        technology: 'REACT',
        name: 'TestComponent',
        baseUrl: 'http://localhost',
      }

      const result = await captured.loadComponent(component)
      expect(result).toBe(mockModule)
      expect(mockLoadRemote).toHaveBeenCalledWith('test-app/TestComponent')
    })

    it('should return undefined when loadRemote fails', async () => {
      const mockLoadRemote = jest.fn().mockRejectedValue(new Error('Load failed'))
      getShellMfInstance.mockReturnValue({
        name: 'onecx-shell-ui',
        registerRemotes: jest.fn(),
        loadRemote: mockLoadRemote,
      })

      let captured: any
      const TestComponent: FC = () => {
        captured = useContext(SlotContext)
        return null
      }

      render(
        <SlotProvider>
          <TestComponent />
        </SlotProvider>
      )

      const component = {
        appId: 'test-app',
        productName: 'test-product',
        exposedModule: './TestComponent',
        remoteEntryUrl: 'http://localhost/test.js',
        technology: 'REACT',
        name: 'TestComponent',
        baseUrl: 'http://localhost',
      }

      const result = await captured.loadComponent(component)
      expect(result).toBeUndefined()
    })
  })
})
