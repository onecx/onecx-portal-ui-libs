import { Topic } from '@onecx/accelerator'
import { DocumentTitle } from './document-title.model'

/**
 * Topic used by microfrontends to hand their document title over to the shell,
 * which stays the single writer of `document.title`.
 */
export class DocumentTitleTopic extends Topic<DocumentTitle> {
  constructor() {
    super('documentTitle', 1)
  }
}
