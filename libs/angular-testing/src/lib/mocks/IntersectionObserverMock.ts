export class IntersectionObserverMock {
  private callback: any
  private entries: any[]
  root: any
  rootMargin: any
  thresholds: any
  constructor(callback: any, _options: any) {
    this.callback = callback
    this.entries = []
  }

  observe(target: Element) {
    const entry = {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: 1,
      isIntersecting: true,
      target: target,
    }
    this.entries.push(entry)
    setTimeout(() => {
      this.callback(this.entries, this)
    })
  }

  takeRecords() {
    return this.entries
  }

  unobserve(target: any) {
    this.entries = this.entries.filter((entry) => entry.target !== target)
  }

  disconnect() {
    this.entries = []
  }
}

export function ensureIntersectionObserverMockExists() {
  if (!global.IntersectionObserver || global.IntersectionObserver !== IntersectionObserverMock) {
    global.IntersectionObserver = IntersectionObserverMock
  }
}
