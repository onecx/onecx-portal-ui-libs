import { Topic } from '@onecx/accelerator'
import { DocumentTitle } from './document-title.model'

/**
 * Topic on which microfrontends publish the title of their activated route, so that the shell can set `document.title`.
 */
export class DocumentTitleTopic extends Topic<DocumentTitle> {
  constructor() {
    super('documentTitle', 1)
  }
}
