import { Component } from '@angular/core'

@Component({
  template: `<div class="p-4">
    <h1>{{ 'OCX_PAGE_NOT_FOUND.TITLE' | translate }}</h1>
    {{ 'OCX_PAGE_NOT_FOUND.MESSAGE' | translate }}
  </div> `,
})
export class PageNotFoundComponent {}
