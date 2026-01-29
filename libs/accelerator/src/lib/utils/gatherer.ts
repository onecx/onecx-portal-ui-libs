import { Subscription } from 'rxjs'
import { Topic } from '../topic/topic'

import { createLogger } from './logger.utils'

import '../declarations'

/**
 * Implementation of the Scatter-Gather pattern.
 */
export class Gatherer<Request, Response> {
  private readonly logger: ReturnType<typeof createLogger>
  private static id = 0
  private readonly topic: Topic<{ id: number; request: Request }>
  private readonly ownIds = new Set<number>()
  private readonly topicSub: Subscription | null = null
  private readonly topicName: string

  constructor(name: string, version: number, callback: (request: Request) => Promise<Response>) {
    this.topicName = name
    this.logger = createLogger(`Gatherer:${name}`)
    this.logger.debug(`Gatherer ${name}: ${version} created`)

    this.topic = new Topic<{ id: number; request: Request }>(name, version, false)
    // Perform a callback every time a request is received in the topic.
    this.topicSub = this.topic.subscribe((m) => {
      if (!this.isOwnerOfRequest(m) && window['@onecx/accelerator']?.gatherer?.promises) {
        this.logReceivedIfDebug(name, version, m)
        if (!window['@onecx/accelerator'].gatherer.promises[m.id]) {
          this.logger.warn('Expected an array of promises to gather for id ', m.id, ' but the id was not present')
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
    this.logger.debug(`Gatherer ${this.topic.name}: ${this.topic.version} destroyed`)

    this.topicSub?.unsubscribe()
    this.topic.destroy()
    for (const id of this.ownIds) {
      if (window['@onecx/accelerator']?.gatherer?.promises?.[id]) {
        delete window['@onecx/accelerator'].gatherer.promises[id]
      }
    }
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
    // See Why Awaiting the Promise Works in dev-docs/topics/scheduling.adoc.
    const message = { id, request }
    await this.topic.publish(message)
    const promises = window['@onecx/accelerator'].gatherer.promises[id] as Promise<Response>[]
    delete window['@onecx/accelerator'].gatherer.promises[id]
    this.ownIds.delete(id)
    return Promise.all(promises).then((v) => {
      this.logger.debug('Finished gathering responses', v)
      return v
    })
  }

  private logReceivedIfDebug(name: string, version: number, m: { id: number; request: Request }) {
    this.logger.debug('Gatherer ' + name + ': ' + version + ' received request ' + m.request)
  }

  private logAnsweredIfDebug(name: string, version: number, m: { id: number; request: Request }, response: Response) {
    this.logger.debug(
      'Gatherer ' + name + ': ' + version + ' answered request ' + m.request + ' with response',
      response
    )
  }

  private isOwnerOfRequest(m: { id: number; request: Request }): boolean {
    return this.ownIds.has(m.id)
  }
}
