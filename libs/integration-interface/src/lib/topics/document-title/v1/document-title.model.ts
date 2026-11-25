/**
 * Document title of a microfrontend route, handed over to the shell via the {@link DocumentTitleTopic}.
 *
 * The shell stays the single writer of `document.title`. It keeps the latest title per `path` and, on every
 * navigation, uses the title of the most specific entry whose `path` matches `document.location.pathname`.
 */
export interface DocumentTitle {
  /**
   * Title for the pages matched by `path`.
   * `undefined` or an empty string removes the entry registered for exactly this `path`,
   * so the shell falls back to a less specific entry or to its own route title.
   */
  title?: string
  /**
   * Exact path (`document.location.pathname`) or path pattern the title belongs to.
   *
   * Wildcards are only recognized as whole path segments:
   * - `*` matches exactly one segment, e.g. `/admin/users/*` matches `/admin/users/42`.
   * - a trailing `**` matches zero or more remaining segments, e.g. `/admin/**` matches `/admin` and `/admin/users/42`.
   *
   * A segment mixing text and wildcards (e.g. `user*`) is literal, a non-trailing `**` behaves like `*`,
   * and a trailing `/` is ignored. If several entries match, the one with the most literal characters wins,
   * then the one with fewer wildcard segments, then the most recently published one. An exact path therefore
   * always wins over a pattern covering it.
   */
  path: string
}
