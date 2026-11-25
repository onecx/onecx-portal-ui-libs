/**
 * Document title a microfrontend hands over to the shell.
 *
 * The shell stays the single writer of `document.title` and uses this message
 * instead of its own route title, if the message belongs to the current page.
 */
export interface DocumentTitle {
  /**
   * Title of the activated microfrontend route.
   * `undefined` means the microfrontend route has no title and the shell uses its fallback.
   */
  title?: string
  /**
   * `document.location.pathname` the title belongs to.
   */
  path: string
}
