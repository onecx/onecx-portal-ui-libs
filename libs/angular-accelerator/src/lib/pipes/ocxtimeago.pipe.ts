import { Pipe } from '@angular/core'
import { TimeagoPipe } from 'ngx-timeago'

@Pipe({
  name: 'timeago',
})
// eslint-disable-next-line @angular-eslint/use-pipe-transform-interface
export class OcxTimeAgoPipe extends TimeagoPipe {}
