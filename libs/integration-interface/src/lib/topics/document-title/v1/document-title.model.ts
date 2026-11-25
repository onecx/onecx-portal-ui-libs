/**
 * Document title of a microfrontend route, handed over to the shell via the {@link DocumentTitleTopic}.
 */
export interface DocumentTitle {
  /**
   * Title of the activated microfrontend route.
   * `undefined` means the microfrontend route has no title, so the shell uses its fallback title.
   */
  title?: string
  /**
   * Value of `document.location.pathname` the title belongs to.
   */
  path: string
}
