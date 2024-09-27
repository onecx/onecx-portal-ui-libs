import { Component } from '@angular/core'

/**
 * Show this data not found page component if the main entity of a page could not be loaded.
 */
@Component({
  selector: 'ocx-data-loading-error',
  template: `<div class="p-4">
    <h1>{{ 'OCX_DATA_LOADING_ERROR.TITLE' | translate }}</h1>
    <div style="white-space: pre-line">
      {{ 'OCX_DATA_LOADING_ERROR.MESSAGE' | translate }}
    </div>
  </div> `,
})
export class DataLoadingErrorComponent {}
