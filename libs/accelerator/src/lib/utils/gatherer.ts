import { version } from 'os'
import { Topic } from '../topic/topic'

window['@onecx/accelerator'] ??= {}
window['@onecx/accelerator'].gatherer ??= {}
window['@onecx/accelerator'].gatherer.promises ??= {}

/**
 * Implementation of the Scatter-Gather pattern.
 */
export class Gatherer<Request, Response> {
  private static id = 0
  private readonly topic: Topic<{ id: number; request: Request }>
  private readonly ownIds = new Set<number>()

  constructor(name: string, version: number, callback: (request: Request) => Promise<Response>) {
    this.topic = new Topic<{ id: number; request: Request }>(name, version, false)
    // Perform a callback every time a request is received in the topic.
    this.topic.subscribe((m) => {
      if (!this.isOwnerOfRequest(m) && window['@onecx/accelerator']?.gatherer?.promises) {
        this.logReceivedIfDebug(name, version, m)
        if (!window['@onecx/accelerator'].gatherer.promises[m.id]) {
          console.warn('Expected an array of promises to gather for id ', m.id, ' but the id was not present')
          return
        }
        let resolve: (value: Response) => void
        window['@onecx/accelerator'].gatherer.promises[m.id].push(
          new Promise((r) => {
            resolve = r
          })
        )
        callback(m.request).then((response) => {
          resolve(response)
          this.logAnsweredIfDebug(name, version, m, response)
        })
      }
    })
  }

  destroy() {
    this.topic?.destroy()
    this.ownIds.forEach((id) => {
      if (window['@onecx/accelerator']?.gatherer?.promises?.[id]) {
        delete window['@onecx/accelerator'].gatherer.promises[id]
      }
    })
  }

  async gather(request: Request): Promise<Response[]> {
    if (!window['@onecx/accelerator']?.gatherer?.promises) {
      throw new Error('Gatherer is not initialized')
    }

    const id = Gatherer.id++
    // Save the id to ownIds to prevent processing own requests.
    this.ownIds.add(id)
    window['@onecx/accelerator'].gatherer.promises[id] = []
    // Publish the request to the topic.
    // This will trigger the callback for all instances of gatherer.
    // Await is crucial here to ensure that promises are created before awaiting them.
    const message = { id, request }
    await this.topic.publish(message)
    const promises = (window['@onecx/accelerator']?.gatherer?.promises?.[id] ?? []) as Promise<Response>[]
    delete window['@onecx/accelerator'].gatherer.promises[id]
    this.ownIds.delete(id)
    return Promise.all(promises).then((v) => {
      console.log('Finished gathering responses', v)
      return v
    })
  }

  private logReceivedIfDebug(name: string, version: number, m: { id: number; request: Request }) {
    if (window['@onecx/accelerator']?.gatherer?.debug?.includes(name)) {
      console.log('Gatherer', name, ':', version, 'received request', m.request)
    }
  }

  private logAnsweredIfDebug(name: string, version: number, m: { id: number; request: Request }, response: Response) {
    if (window['@onecx/accelerator']?.gatherer?.debug?.includes(name)) {
      console.log('Gatherer', name, ':', version, 'answered', m.request, 'with', response)
    }
  }

  private isOwnerOfRequest(m: { id: number; request: Request }): boolean {
    return this.ownIds.has(m.id)
  }
}
