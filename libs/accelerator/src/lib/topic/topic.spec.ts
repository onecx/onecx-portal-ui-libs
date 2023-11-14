import { map } from 'rxjs'
import { Topic } from './topic'

describe('Topic', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any, ) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let values1: any[]
  let values2: any[]

  let testTopic1: Topic<string>
  let testTopic2: Topic<string>

  beforeEach(() => {
    listeners = []

    values1 = []
    values2 = []

    testTopic1 = new Topic<string>('test', 1)
    testTopic2 = new Topic<string>('test', 1)

    testTopic1.subscribe((v) => values1.push(v))
    testTopic2.subscribe((v) => values2.push(v))

  })

  it('should have correct value for 2 topics after first topic publishes', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])
  })

  it('should have correct value for 2 topics after second topic publishes', () => {
    testTopic2.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])
  })

  it('should have same value for a new initialized topic like the already existing topics', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: any[] = []
    const testTopic3 = new Topic<string>('test', 1)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual(['value1'])
  })

  it('should have same values for both topics after one topic publishes 2 values', () => {
    testTopic1.publish('value1')
    testTopic2.publish('value2')

    expect(values1).toEqual(['value1', 'value2'])
    expect(values2).toEqual(['value1', 'value2'])
  })

  it('should has no value if message name is different', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: any[] = []
    const testTopic3 = new Topic<string>('test123', 1)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual([])
  })

  it('should has no value if message version is different', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])

    const values3: any[] = []
    const testTopic3 = new Topic<string>('test', 2)
    testTopic3.subscribe((v) => values3.push(v))

    expect(values3).toEqual([])
  })

  it('should has no value if message is undefined', () => {
    testTopic1.publish('value1')

    expect(values1).toEqual(['value1'])
    expect(values2).toEqual(['value1'])
    
    const values3: any[] = []
    const testTopic3 = new Topic<undefined>('', 0)
    testTopic3.subscribe((v) => values3.push(v))
    testTopic3.publish(undefined)

    expect(values3).toEqual([])
  })

  it('should get correct value', () => {
    expect(testTopic1.getValue()).toEqual(undefined)
    
    testTopic1.publish('value1')

    expect(testTopic1.getValue()).toEqual('value1')
    expect(testTopic2.getValue()).toEqual('value1')
  })

  it('should remove event listener', () => {
    testTopic1.destroy()
    testTopic2.publish('value1')
    console.log('after destroy ', testTopic1.getValue())
    
    expect(values1).toEqual([])
    expect(values2).toEqual(['value1'])
  })

  it('should pipe', () => {
    let v = 0
    testTopic1.pipe(map((v) => v.length)).subscribe((s) => v = s)
    testTopic1.publish('value1')
    
    expect(v).toEqual(6)
    expect(values1).toEqual(['value1'])
  })
})
