import { LiveAnnouncer } from '@angular/cdk/a11y'
import { DestroyRef, Injectable, Signal, computed, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TranslateService } from '@ngx-translate/core'
import equal from 'fast-deep-equal'
import { Subject, asapScheduler, debounceTime, switchMap } from 'rxjs'
import { Filter } from '../model/filter.model'

/**
 * Decides which component announces search, filter and sort results, so that a page
 * announces nothing at load and exactly one status message per user action (WCAG 4.1.3).
 *
 * - A search header owns the announcement of search results while it is on the page.
 *   If it has no result count, it asks the data component to announce the next new data.
 * - Data components (data table, data list grid) announce the displayed result count
 *   after a filter or sort change, and new data only if no search header owns it.
 */
@Injectable({ providedIn: 'root' })
export class ResultsAnnouncementService {
  private readonly searchHeaders = signal(0)
  private searchResultsAnnouncementRequested = false

  /** True while at least one search header is on the page. */
  readonly searchHeaderPresent = computed(() => this.searchHeaders() > 0)

  /**
   * Registers a search header until the given DestroyRef is destroyed.
   * A pending search results announcement request is dropped with the search header,
   * so that it cannot be consumed by data on another page.
   */
  registerSearchHeader(destroyRef: DestroyRef): void {
    this.searchHeaders.update((count) => count + 1)
    destroyRef.onDestroy(() => {
      this.searchHeaders.update((count) => count - 1)
      this.clearSearchResultsAnnouncementRequest()
    })
  }

  /** Asks the next data component that receives new data to announce its result count. */
  requestSearchResultsAnnouncement(): void {
    this.searchResultsAnnouncementRequested = true
  }

  /** Returns whether a search results announcement was requested and clears the request. */
  consumeSearchResultsAnnouncementRequest(): boolean {
    const requested = this.searchResultsAnnouncementRequested
    this.searchResultsAnnouncementRequested = false
    return requested
  }

  /** Drops a pending search results announcement request. */
  clearSearchResultsAnnouncementRequest(): void {
    this.searchResultsAnnouncementRequested = false
  }
}

/**
 * Unfiltered input and view settings of a data component, compared between two renderings.
 * @internal
 */
export interface DisplayedResultsState {
  items: unknown[]
  filters: Filter[]
  sortColumn: string
  sortDirection: string
  clientSideFiltering: boolean
  clientSideSorting: boolean
}

/** @internal */
export interface DisplayedResultsTranslationKeys {
  results: string
  noResults: string
}

/**
 * Announces the displayed result count of a data component once per user action.
 * Must be created in an injection context.
 * @internal
 */
export class DisplayedResultsAnnouncer {
  private readonly ownership = inject(ResultsAnnouncementService)
  private readonly counts = new Subject<number>()
  private previous: DisplayedResultsState | undefined
  private awaitingNewData = false

  /**
   * @param announceResults whether new data is announced; `undefined` announces it
   * only when no search header is on the page
   * @param keys translation keys of the announcement, which receive the count as `results`
   */
  constructor(
    private readonly announceResults: Signal<boolean | undefined>,
    keys: DisplayedResultsTranslationKeys
  ) {
    const translateService = inject(TranslateService)
    const liveAnnouncer = inject(LiveAnnouncer)
    this.counts
      .pipe(
        // Several inputs can change in the same turn; announce only the final count.
        debounceTime(0, asapScheduler),
        switchMap((count) => translateService.get(count === 0 ? keys.noResults : keys.results, { results: count })),
        takeUntilDestroyed(inject(DestroyRef))
      )
      .subscribe((text: string) => liveAnnouncer.announce(text))
  }

  /** Records the rendered state and announces the displayed count if a user action caused it. */
  update(state: DisplayedResultsState, displayedCount: number): void {
    if (this.previous && this.isAnnouncementDue(this.previous, state)) {
      this.counts.next(displayedCount)
    }
    this.previous = state
  }

  private isAnnouncementDue(previous: DisplayedResultsState, current: DisplayedResultsState): boolean {
    let due = false
    if (current.items !== previous.items) {
      const searchRequested = this.ownership.consumeSearchResultsAnnouncementRequest()
      due = this.awaitingNewData || searchRequested || this.announcesNewData()
      this.awaitingNewData = false
    }
    if (!equal(current.filters, previous.filters)) {
      const filterDue = this.isViewChangeDue(current.clientSideFiltering)
      due = due || filterDue
    }
    if (current.sortColumn !== previous.sortColumn || current.sortDirection !== previous.sortDirection) {
      const sortDue = this.isViewChangeDue(current.clientSideSorting)
      due = due || sortDue
    }
    return due
  }

  /** A change applied on the client is announced now, otherwise when the server sends new data. */
  private isViewChangeDue(appliedOnClient: boolean): boolean {
    if (!appliedOnClient) {
      this.awaitingNewData = true
    }
    return appliedOnClient
  }

  private announcesNewData(): boolean {
    return this.announceResults() ?? !this.ownership.searchHeaderPresent()
  }
}
