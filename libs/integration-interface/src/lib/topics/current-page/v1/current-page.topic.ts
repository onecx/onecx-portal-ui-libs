import { Topic } from '@onecx/accelerator'
import { combineLatest, distinctUntilChanged, map } from 'rxjs'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject'
import { PageInfo } from './page-info.model'
import { createLogger } from '../../../utils/logger.utils'

const logger = createLogger('CurrentPageTopic')

/**
 * This topic will only fire when pageInfo.path matches document.location.pathname,
 * if not it will fire undefined.
 */
export class CurrentPageTopic extends Topic<PageInfo | undefined> {
  private currentPath$ = new BehaviorSubject<string>(document.location.pathname)

  constructor() {
    super('currentPage', 1)
    this.watchForPathChanges()
  }

  public override asObservable() {
    return combineLatest([super.asObservable(), this.currentPath$.pipe(distinctUntilChanged())]).pipe(
      map(([v, path]) => ((<PageInfo>v).path === path ? v : undefined))
    )
  }

  private watchForPathChanges() {
    const body = document.querySelector('body')
    if (body === null) {
      logger.error('could not listen to location changes')
      throw new Error('could not listen to location changes')
    }
    const observer = new MutationObserver(() => {
      this.currentPath$.next(document.location.pathname)
    })
    observer.observe(body, { childList: true, subtree: true })
  }
}
