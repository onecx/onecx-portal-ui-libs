import { createElement, StrictMode, type FC, type PropsWithChildren } from 'react'
import { renderHook } from '@testing-library/react'
import { useTopic } from './use-topic.utils'

interface MockTopic {
  destroy: jest.Mock
  id: number
}

let topicCounter = 0

class MockTopicClass {
  id: number
  destroy: jest.Mock

  constructor() {
    this.id = ++topicCounter
    this.destroy = jest.fn()
  }
}

const Wrapper: FC<PropsWithChildren<{}>> = ({ children }) => createElement('div', null, children)

const StrictModeWrapper: FC<PropsWithChildren<{}>> = ({ children }) => createElement(StrictMode, null, children)

describe('useTopic', () => {
  beforeEach(() => {
    topicCounter = 0
  })

  it('should create a topic when no external value is provided', () => {
    const { result } = renderHook(() => useTopic<MockTopic>(undefined, MockTopicClass as any), {
      wrapper: Wrapper,
    })
    expect(result.current).toBeInstanceOf(MockTopicClass)
  })

  it('should use the external topic when provided', () => {
    const externalTopic = new MockTopicClass() as any
    const { result } = renderHook(() => useTopic<MockTopic>(externalTopic, MockTopicClass as any), {
      wrapper: Wrapper,
    })
    expect(result.current).toBe(externalTopic)
  })

  it('should return the same topic instance across re-renders', () => {
    const { result, rerender } = renderHook(() => useTopic<MockTopic>(undefined, MockTopicClass as any), {
      wrapper: Wrapper,
    })
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })

  it('should not destroy external topic on unmount', () => {
    const externalTopic = new MockTopicClass() as any
    const { unmount } = renderHook(() => useTopic<MockTopic>(externalTopic, MockTopicClass as any), {
      wrapper: Wrapper,
    })
    unmount()
    expect(externalTopic.destroy).not.toHaveBeenCalled()
  })

  it('should destroy internal topic on real unmount (after setTimeout)', async () => {
    const { result, unmount } = renderHook(() => useTopic<MockTopic>(undefined, MockTopicClass as any), {
      wrapper: Wrapper,
    })
    const topic = result.current
    unmount()

    expect(topic.destroy).not.toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(topic.destroy).toHaveBeenCalled()
  })

  it('should not destroy topic on StrictMode remount (setTimeout cancelled by re-mount)', async () => {
    const { result, unmount } = renderHook(() => useTopic<MockTopic>(undefined, MockTopicClass as any), {
      wrapper: StrictModeWrapper,
    })
    const topic = result.current

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(topic.destroy).not.toHaveBeenCalled()

    unmount()

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(topic.destroy).toHaveBeenCalled()
  })

  it('should create a new topic when a fresh component is mounted after previous unmount', async () => {
    const first = renderHook(() => useTopic<MockTopic>(undefined, MockTopicClass as any), {
      wrapper: Wrapper,
    })
    const firstTopic = first.result.current
    first.unmount()

    await new Promise((resolve) => setTimeout(resolve, 10))

    const second = renderHook(() => useTopic<MockTopic>(undefined, MockTopicClass as any), {
      wrapper: Wrapper,
    })
    const secondTopic = second.result.current

    expect(secondTopic).not.toBe(firstTopic)
    expect(secondTopic).toBeInstanceOf(MockTopicClass)
    second.unmount()
  })
})
