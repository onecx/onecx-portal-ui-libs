import { render, act } from '@testing-library/react'
import { type FC, useContext } from 'react'
import { PermissionContext, PermissionProvider } from './permissionContext'

jest.mock('@onecx/integration-interface', () => {
  const { Subject } = require('rxjs')
  const subject = new Subject()

  const topicInstance = {
    pipe: (...args: any[]) => subject.pipe(...args),
    subscribe: jest.fn((...args: any[]) => subject.subscribe(...args)),
    publish: jest.fn(({ appId, productName }: any) => {
      subject.next({ appId, productName, permissions: [`${appId}-perm`] })
    }),
  }

  return {
    PermissionsRpcTopic: jest.fn(() => topicInstance),
    __mockTopic: topicInstance,
    __subject: subject,
  }
})

function getMockTopic() {
  return (jest.requireMock('@onecx/integration-interface') as any).__mockTopic
}

function getSubject() {
  return (jest.requireMock('@onecx/integration-interface') as any).__subject
}

function renderAndCaptureContext() {
  let captured: any
  const TestComponent: FC = () => {
    captured = useContext(PermissionContext)
    return null
  }
  render(
    <PermissionProvider>
      <TestComponent />
    </PermissionProvider>
  )
  return { getContext: () => captured }
}

describe('PermissionContext', () => {
  it('should be defined', () => {
    expect(PermissionContext).toBeDefined()
  })

  it('should have undefined as default value outside provider', () => {
    let captured: any
    const TestComponent: FC = () => {
      captured = useContext(PermissionContext)
      return null
    }
    render(<TestComponent />)
    expect(captured).toBeUndefined()
  })
})

describe('PermissionProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be a function component', () => {
    expect(typeof PermissionProvider).toBe('function')
  })

  it('should render children', () => {
    const { getByTestId } = render(
      <PermissionProvider>
        <div data-testid="child">child content</div>
      </PermissionProvider>
    )
    expect(getByTestId('child')).toBeDefined()
  })

  it('should provide context with permissions array and getPermissions function', () => {
    const { getContext } = renderAndCaptureContext()
    const ctx = getContext()
    expect(ctx).toBeDefined()
    expect(Array.isArray(ctx.permissions)).toBe(true)
    expect(typeof ctx.getPermissions).toBe('function')
  })

  it('should subscribe to permissionsTopic on mount', () => {
    const topic = getMockTopic()
    renderAndCaptureContext()
    expect(topic.subscribe).toHaveBeenCalled()
  })

  it('should unsubscribe from permissionsTopic on unmount', () => {
    const topic = getMockTopic()
    const mockUnsubscribe = jest.fn()
    topic.subscribe.mockReturnValueOnce({ unsubscribe: mockUnsubscribe })

    const { unmount } = render(
      <PermissionProvider>
        <div />
      </PermissionProvider>
    )
    act(() => {
      unmount()
    })
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('should call publish when getPermissions is called', async () => {
    const topic = getMockTopic()
    const { getContext } = renderAndCaptureContext()
    const ctx = getContext()

    await act(async () => {
      await ctx.getPermissions('my-app', 'my-prod')
    })

    expect(topic.publish).toHaveBeenCalledWith({ appId: 'my-app', productName: 'my-prod' })
  })

  it('should resolve getPermissions with permissions from the topic', async () => {
    const { getContext } = renderAndCaptureContext()
    const ctx = getContext()

    let result: string[] = []
    await act(async () => {
      result = await ctx.getPermissions('app-x', 'prod-x')
    })

    expect(result).toEqual(['app-x-perm'])
  })

  it('should update permissions state when topic emits a message', async () => {
    const subject = getSubject()
    const { getContext } = renderAndCaptureContext()

    await act(async () => {
      subject.next({ appId: 'a', productName: 'b', permissions: ['read'] })
    })

    const ctx = getContext()
    expect(ctx.permissions.length).toBeGreaterThan(0)
  })
})
