import { createElement } from 'react'
import { render, act } from '@testing-library/react'
import { BehaviorSubject, of } from 'rxjs'
import { useSlot as useSlotOriginal } from '../hooks/useSlot'
import { SlotComponent } from './slot'

jest.mock('../hooks/useSlot', () => ({
  useSlot: jest.fn(),
}))

const useSlot = useSlotOriginal as jest.Mock

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

function setupSlotService(overrides: Record<string, any> = {}) {
  return {
    getComponentsForSlot: jest.fn(() => of([])),
    isSomeComponentDefinedForSlot: jest.fn(() => of(false)),
    ...overrides,
  }
}

function renderSlot(props: Record<string, any> = {}) {
  return render(createElement(SlotComponent, { name: 'test-slot', ...props }))
}

describe('SlotComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be a function component', () => {
    expect(typeof SlotComponent).toBe('function')
  })

  it('should render without crashing', () => {
    useSlot.mockReturnValue(setupSlotService())
    const { container } = renderSlot()
    expect(container.innerHTML).toBeDefined()
  })

  it('should render skeleton text when components are present', () => {
    const components$ = new BehaviorSubject([{ componentType: undefined, remoteComponent: {}, permissions: [] }])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    const { container } = renderSlot({ skeleton: 'Loading...' })
    expect(container.textContent).toContain('Loading...')
  })

  it('should render placeholder div for each component', () => {
    const components$ = new BehaviorSubject([
      { componentType: undefined, remoteComponent: {}, permissions: [] },
      { componentType: undefined, remoteComponent: {}, permissions: [] },
    ])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    const { container } = renderSlot()
    expect(container.querySelectorAll('div[id^="slot-"]').length).toBe(2)
  })

  it('should update DOM when observable emits new components', async () => {
    const components$ = new BehaviorSubject<any[]>([])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    const { container } = renderSlot()
    expect(container.querySelectorAll('div[id^="slot-"]').length).toBe(0)

    await act(async () => {
      components$.next([{ componentType: undefined, remoteComponent: {}, permissions: [] }])
      await flushPromises()
    })
    expect(container.querySelectorAll('div[id^="slot-"]').length).toBe(1)
  })

  it('should log error when slotService is not provided', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    useSlot.mockReturnValue(undefined)
    renderSlot()
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('SLOT_SERVICE token'))
    consoleSpy.mockRestore()
  })

  it('should not crash when components$ is undefined', () => {
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => undefined }))
    const { container } = renderSlot()
    expect(container.querySelectorAll('div[id^="slot-"]').length).toBe(0)
  })

  it('should clean up view containers on unmount', async () => {
    const components$ = new BehaviorSubject([{ componentType: undefined, remoteComponent: {}, permissions: [] }])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    const { container, unmount } = renderSlot()
    expect(container.querySelectorAll('div[id^="slot-"]').length).toBe(1)

    await act(async () => {
      unmount()
      await flushPromises()
    })
    expect(container.innerHTML).toBe('')
  })

  it('should not create element when componentType is falsy', async () => {
    const createSpy = jest.spyOn(document, 'createElement')
    const components$ = new BehaviorSubject([
      {
        componentType: undefined,
        remoteComponent: { appId: 'a', productName: 'p', baseUrl: '/', elementName: 'test-el' },
        permissions: Promise.resolve([]),
      },
    ])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    renderSlot()

    await act(async () => {
      await flushPromises()
      await flushPromises()
    })
    expect(createSpy).not.toHaveBeenCalledWith('test-el')
    createSpy.mockRestore()
  })
})
