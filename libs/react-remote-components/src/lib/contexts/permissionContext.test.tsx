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
    destroy: jest.fn(),
  }

  return {
    PermissionsRpcTopic: jest.fn(() => topicInstance),
    __mockTopic: topicInstance,
    __subject: subject,
  }
})

jest.mock('@onecx/react-integration-interface', () => ({
  useTopic: (_valueTopic: unknown, TopicClass: new () => unknown) => new TopicClass(),
}))

function getMockTopic() {
  return (jest.requireMock('@onecx/integration-interface') as any).__mockTopic
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

  it('should provide context with getPermissions function', () => {
    const { getContext } = renderAndCaptureContext()
    const ctx = getContext()
    expect(ctx).toBeDefined()
    expect(typeof ctx.getPermissions).toBe('function')
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

  it('should cache getPermissions results for same appId:productName', async () => {
    const topic = getMockTopic()
    const { getContext } = renderAndCaptureContext()
    const ctx = getContext()

    await act(async () => {
      await ctx.getPermissions('cached-app', 'cached-prod')
    })
    const initialPublishCount = topic.publish.mock.calls.length

    await act(async () => {
      await ctx.getPermissions('cached-app', 'cached-prod')
    })

    expect(topic.publish.mock.calls.length).toBe(initialPublishCount)
  })

  it('should not cache different appId:productName combinations', async () => {
    const topic = getMockTopic()
    const { getContext } = renderAndCaptureContext()
    const ctx = getContext()

    await act(async () => {
      await ctx.getPermissions('app-a', 'prod-a')
    })
    await act(async () => {
      await ctx.getPermissions('app-b', 'prod-b')
    })

    expect(topic.publish).toHaveBeenCalledTimes(2)
  })
})
