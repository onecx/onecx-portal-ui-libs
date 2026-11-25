/**
 * Document title of the currently active microfrontend route, handed over to the shell.
 */
export interface DocumentTitle {
  /**
   * Title resolved by the microfrontend router for its active route.
   * `undefined` means the microfrontend route has no title and the shell uses its fallback title.
   */
  title?: string
  /**
   * `document.location.pathname` the title belongs to.
   * Consumers ignore messages whose path does not match the current location.
   */
  path: string
}
