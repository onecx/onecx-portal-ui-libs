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
  return render(<SlotComponent name="test-slot" {...props} />)
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

  it('should create custom element when componentType resolves to truthy value', async () => {
    const createSpy = jest.spyOn(document, 'createElement')
    const components$ = new BehaviorSubject([
      {
        componentType: Promise.resolve({}),
        remoteComponent: { appId: 'app1', productName: 'prod1', baseUrl: '/', elementName: 'my-element' },
        permissions: Promise.resolve([]),
      },
    ])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    await act(async () => {
      renderSlot()
      await flushPromises()
      await flushPromises()
    })
    expect(createSpy).toHaveBeenCalledWith('my-element')
    createSpy.mockRestore()
  })

  it('should set data-style-id and data-style-isolation on created element', async () => {
    const components$ = new BehaviorSubject([
      {
        componentType: Promise.resolve({}),
        remoteComponent: { appId: 'my-app', productName: 'my-prod', baseUrl: '/', elementName: 'styled-el' },
        permissions: Promise.resolve([]),
      },
    ])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    const { container } = renderSlot()

    await act(async () => {
      await flushPromises()
      await flushPromises()
    })

    const el = container.querySelector('styled-el') as HTMLElement | null
    expect(el).not.toBeNull()
    expect(el?.dataset['styleId']).toBe('my-prod|my-app')
    expect(el?.hasAttribute('data-style-isolation')).toBe(true)
  })

  it('should set ocxRemoteComponentConfig on created element', async () => {
    const components$ = new BehaviorSubject([
      {
        componentType: Promise.resolve({}),
        remoteComponent: { appId: 'cfg-app', productName: 'cfg-prod', baseUrl: '/base', elementName: 'cfg-el' },
        permissions: Promise.resolve(['read', 'write']),
      },
    ])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    const { container } = renderSlot()

    await act(async () => {
      await flushPromises()
      await flushPromises()
    })

    const el = container.querySelector('cfg-el') as any
    expect(el).not.toBeNull()
    expect(el['ocxRemoteComponentConfig']).toEqual({
      appId: 'cfg-app',
      productName: 'cfg-prod',
      baseUrl: '/base',
      permissions: ['read', 'write'],
    })
  })

  it('should apply inputs to created HTML element via setProps', async () => {
    const components$ = new BehaviorSubject([
      {
        componentType: Promise.resolve({}),
        remoteComponent: { appId: 'a', productName: 'p', baseUrl: '/', elementName: 'input-el' },
        permissions: Promise.resolve([]),
      },
    ])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    const { container } = renderSlot({ inputs: { myInput: 'hello' } })

    await act(async () => {
      await flushPromises()
      await flushPromises()
    })

    const el = container.querySelector('input-el') as any
    expect(el).not.toBeNull()
    expect(el['myInput']).toBe('hello')
  })

  it('should not create element when componentType Promise resolves to falsy', async () => {
    const createSpy = jest.spyOn(document, 'createElement')
    const components$ = new BehaviorSubject([
      {
        componentType: Promise.resolve(undefined),
        remoteComponent: { appId: 'a', productName: 'p', baseUrl: '/', elementName: 'null-resolved-el' },
        permissions: Promise.resolve([]),
      },
    ])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    renderSlot()

    await act(async () => {
      await flushPromises()
      await flushPromises()
    })
    expect(createSpy).not.toHaveBeenCalledWith('null-resolved-el')
    createSpy.mockRestore()
  })

  it('should reuse existing element when already present in view container', async () => {
    const createSpy = jest.spyOn(document, 'createElement')
    const components$ = new BehaviorSubject([
      {
        componentType: Promise.resolve({}),
        remoteComponent: { appId: 'a', productName: 'p', baseUrl: '/', elementName: 'reuse-el' },
        permissions: Promise.resolve([]),
      },
    ])
    useSlot.mockReturnValue(setupSlotService({ getComponentsForSlot: () => components$ }))
    renderSlot()

    await act(async () => {
      await flushPromises()
      await flushPromises()
    })

    const firstCount = createSpy.mock.calls.filter((args) => args[0] === 'reuse-el').length

    await act(async () => {
      components$.next([...components$.getValue()])
      await flushPromises()
      await flushPromises()
    })

    const secondCount = createSpy.mock.calls.filter((args) => args[0] === 'reuse-el').length
    expect(secondCount).toBe(firstCount)
    createSpy.mockRestore()
  })
})
