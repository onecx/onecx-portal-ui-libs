import { Component } from '@angular/core'

@Component({
  template: `<div class="p-4">
    <h1>{{ 'OCX_PAGE_NOT_FOUND' | translate }}</h1>
    {{ 'OCX_PAGE_NOT_FOUND_MESSAGE' | translate }}
  </div> `,
})
export class PageNotFoundComponent {}
